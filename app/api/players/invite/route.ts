import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { invitePlayerSchema } from "@/lib/validations/player";
import { sendInviteEmail } from "@/lib/email";
import { rateLimitInvite } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

// POST /api/players/invite — Generate invite token and send email
export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const ip = extractClientIp(request);
  const { allowed, retryAfterMinutes } = await rateLimitInvite(ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: `Muitas tentativas de convite. Tente novamente em ${retryAfterMinutes} minutos.`,
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );
  }

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = invitePlayerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos inválidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { playerId, email } = parsed.data;

  // Verify player exists and belongs to the team
  const player = await prisma.player.findFirst({
    where: { id: playerId, teamId: session.user.teamId },
    include: { user: { select: { id: true } } },
  });

  if (!player) {
    return NextResponse.json(
      { error: "Jogador não encontrado", code: "PLAYER_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Check if player already has an account
  if (player.user) {
    return NextResponse.json(
      { error: "Jogador já tem conta vinculada", code: "ALREADY_HAS_ACCOUNT" },
      { status: 400 }
    );
  }

  // Create invite token (expires in 7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const inviteToken = await prisma.inviteToken.create({
    data: {
      teamId: session.user.teamId,
      playerId,
      expiresAt,
    },
  });

  // Get team name for the email
  const team = await prisma.team.findUnique({
    where: { id: session.user.teamId },
    select: { name: true },
  });

  // Send invite email
  const requestOrigin = new URL(request.url).origin;
  const baseUrl = (process.env.NEXTAUTH_URL || requestOrigin).replace(/\/$/, "");
  const inviteUrl = `${baseUrl}/invite/${inviteToken.token}`;

  try {
    await sendInviteEmail({
      to: email,
      playerName: player.name,
      teamName: team?.name ?? "Time",
      inviteUrl,
    });
  } catch (emailError) {
    console.error("[/api/players/invite] Email send failed:", emailError);
    await prisma.inviteToken.delete({ where: { id: inviteToken.id } });

    return NextResponse.json(
      {
        error: "Falha ao enviar convite por e-mail. Tente novamente.",
        code: "EMAIL_SEND_FAILED",
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      inviteId: inviteToken.id,
      playerId,
      email,
      expiresAt: inviteToken.expiresAt.toISOString(),
    },
    { status: 201 }
  );
}
