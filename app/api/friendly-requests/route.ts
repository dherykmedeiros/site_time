import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { createFriendlyRequestSchema } from "@/lib/validations/friendly-request";
import { extractClientIp } from "@/lib/request-ip";

// GET /api/friendly-requests — List friendly requests (ADMIN)
export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: { teamId: string; status?: "PENDING" | "APPROVED" | "REJECTED" } = {
    teamId: session.user.teamId,
  };

  if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    where.status = status as "PENDING" | "APPROVED" | "REJECTED";
  }

  const requests = await prisma.friendlyRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    requests: requests.map((r) => ({
      id: r.id,
      requesterTeamName: r.requesterTeamName,
      contactEmail: r.contactEmail,
      contactPhone: r.contactPhone,
      suggestedDates: r.suggestedDates,
      suggestedVenue: r.suggestedVenue,
      proposedFee: r.proposedFee ? Number(r.proposedFee) : null,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

// POST /api/friendly-requests — Create friendly request (PUBLIC, rate-limited)
export async function POST(request: Request) {
  const ip = extractClientIp(request);
  const { allowed, retryAfterMinutes } = await rateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: `Muitas solicitações. Tente novamente em ${retryAfterMinutes} minutos.`,
        code: "RATE_LIMITED",
      },
      { status: 429 }
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

  const parsed = createFriendlyRequestSchema.safeParse(body);
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

  const { teamSlug, ...data } = parsed.data;

  // Find team by slug
  const team = await prisma.team.findUnique({
    where: { slug: teamSlug },
  });

  if (!team) {
    return NextResponse.json(
      { error: "Time não encontrado", code: "TEAM_NOT_FOUND" },
      { status: 404 }
    );
  }

  const friendlyRequest = await prisma.friendlyRequest.create({
    data: {
      requesterTeamName: data.requesterTeamName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || null,
      suggestedDates: data.suggestedDates,
      suggestedVenue: data.suggestedVenue || null,
      proposedFee: data.proposedFee ?? null,
      teamId: team.id,
    },
  });

  return NextResponse.json(
    {
      id: friendlyRequest.id,
      status: "PENDING",
      message: "Solicitação enviada com sucesso. Você receberá uma resposta por e-mail.",
    },
    { status: 201 }
  );
}
