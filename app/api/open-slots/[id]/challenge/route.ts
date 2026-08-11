import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandler } from "@/lib/api-handler";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const challengeSchema = z.object({
  requesterTeamName: z.string().trim().min(2, "Nome do time deve ter no mínimo 2 caracteres").max(100),
  contactEmail: z.string().trim().email("E-mail de contato inválido"),
  contactPhone: z.string().trim().max(30).optional().nullable(),
  proposedFee: z.number().min(0).optional().nullable(),
  message: z.string().trim().max(500).optional().nullable(),
  requesterTeamId: z.string().optional().nullable(),
});

// POST /api/open-slots/:id/challenge — Enviar proposta de desafio para uma vaga aberta
export const POST = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { id } = await params;

  const slot = await prisma.openMatchSlot.findFirst({
    where: { id, status: "OPEN" },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          users: {
            where: { role: "ADMIN" },
            select: { email: true },
          },
        },
      },
    },
  });

  if (!slot) {
    return NextResponse.json({ error: "Vaga não encontrada ou não disponível", code: "NOT_FOUND" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido", code: "VALIDATION_ERROR" }, { status: 400 });
  }

  const parsed = challengeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { requesterTeamName, contactEmail, contactPhone, proposedFee, message, requesterTeamId } = parsed.data;

  // Build suggested dates label from slot date and time
  const dateFormatted = slot.date.toISOString().slice(0, 10);
  const suggestedDates = slot.timeLabel ? `${dateFormatted} às ${slot.timeLabel}` : dateFormatted;
  const suggestedVenue = slot.venueLabel || "A combinar";

  let resolvedRequesterTeamId = requesterTeamId || null;
  if (!resolvedRequesterTeamId && requesterTeamName) {
    const matchedTeam = await prisma.team.findFirst({
      where: {
        name: { equals: requesterTeamName, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (matchedTeam) {
      resolvedRequesterTeamId = matchedTeam.id;
    }
  }

  // Create friendly request for host team
  const friendlyRequest = await prisma.friendlyRequest.create({
    data: {
      teamId: slot.teamId,
      requesterTeamName,
      contactEmail,
      contactPhone: contactPhone || null,
      suggestedDates,
      suggestedVenue,
      proposedFee: proposedFee ? proposedFee : null,
      status: "PENDING",
      requesterTeamId: resolvedRequesterTeamId,
    },
  });

  // Notify host team admins via email
  const adminEmails = slot.team.users.map((u) => u.email).filter(Boolean);
  if (adminEmails.length > 0) {
    try {
      await sendEmail({
        to: adminEmails,
        subject: `⚽ Desafio Recebido: ${requesterTeamName} quer jogar contra o ${slot.team.name}!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #10b981;">Novo Desafio de Amistoso Recebido!</h2>
            <p>O time <strong>${requesterTeamName}</strong> respondeu à sua vaga aberta e enviou um desafio de partida.</p>
            <ul>
              <li><strong>Data / Horário:</strong> ${suggestedDates}</li>
              <li><strong>Local:</strong> ${suggestedVenue}</li>
              <li><strong>Contato:</strong> ${contactEmail} ${contactPhone ? `(${contactPhone})` : ""}</li>
              ${message ? `<li><strong>Mensagem:</strong> ${message}</li>` : ""}
            </ul>
            <p>Acesse o painel do seu clube para aprovar ou rejeitar a solicitação.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Erro ao enviar e-mail de desafio:", err);
    }
  }

  return NextResponse.json(
    {
      message: "Desafio enviado com sucesso! A diretoria do time anfitrião foi notificada.",
      requestId: friendlyRequest.id,
    },
    { status: 201 }
  );
});
