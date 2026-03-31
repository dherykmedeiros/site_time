import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { rsvpResponseSchema } from "@/lib/validations/match";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/matches/:id/rsvp — Confirm or decline RSVP
export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  // Find the player linked to this user
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { playerId: true },
  });

  if (!user?.playerId) {
    return NextResponse.json(
      { error: "Usuário não tem jogador vinculado", code: "NO_PLAYER_LINKED" },
      { status: 403 }
    );
  }

  // Check player is active
  const player = await prisma.player.findUnique({
    where: { id: user.playerId },
    select: { id: true, status: true, teamId: true, position: true },
  });

  if (!player || player.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Jogador está inativo", code: "PLAYER_INACTIVE" },
      { status: 400 }
    );
  }

  if (player.teamId !== session.user.teamId) {
    return NextResponse.json(
      {
        error: "Jogador não pertence ao mesmo time da sessão",
        code: "FORBIDDEN",
      },
      { status: 403 }
    );
  }

  // Find the match
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
    include: {
      positionLimits: {
        select: { position: true, maxPlayers: true },
      },
    },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  // Check match hasn't passed (FR-013)
  if (match.date <= new Date()) {
    return NextResponse.json(
      { error: "Partida já ocorreu", code: "MATCH_ALREADY_PAST" },
      { status: 400 }
    );
  }

  // Check match is SCHEDULED
  if (match.status !== "SCHEDULED") {
    return NextResponse.json(
      { error: "Partida não está agendada", code: "MATCH_ALREADY_PAST" },
      { status: 400 }
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

  const parsed = rsvpResponseSchema.safeParse(body);
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

  const { status } = parsed.data;

  if (status === "CONFIRMED") {
    const positionLimit = match.positionLimits.find((l) => l.position === player.position);

    if (positionLimit) {
      const currentRsvp = await prisma.rSVP.findUnique({
        where: {
          playerId_matchId: {
            playerId: player.id,
            matchId,
          },
        },
        select: { status: true },
      });

      const confirmedCount = await prisma.rSVP.count({
        where: {
          matchId,
          status: "CONFIRMED",
          player: { position: player.position },
          ...(currentRsvp?.status === "CONFIRMED" ? { playerId: { not: player.id } } : {}),
        },
      });

      if (confirmedCount >= positionLimit.maxPlayers) {
        return NextResponse.json(
          {
            error: `Limite atingido para a posição ${player.position}`,
            code: "POSITION_LIMIT_REACHED",
            position: player.position,
            maxPlayers: positionLimit.maxPlayers,
          },
          { status: 409 }
        );
      }
    }
  }

  // Upsert the RSVP for this player+match
  const rsvp = await prisma.rSVP.upsert({
    where: {
      playerId_matchId: {
        playerId: player.id,
        matchId,
      },
    },
    update: {
      status,
      respondedAt: new Date(),
    },
    create: {
      playerId: player.id,
      matchId,
      status,
      respondedAt: new Date(),
    },
  });

  return NextResponse.json({
    playerId: rsvp.playerId,
    matchId: rsvp.matchId,
    status: rsvp.status,
    respondedAt: rsvp.respondedAt?.toISOString() ?? null,
  });
}
