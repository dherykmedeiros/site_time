import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { updateMatchSchema } from "@/lib/validations/match";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/matches/:id — Match detail with RSVPs, stats, canSubmitPostGame
export async function GET(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id, teamId: session.user.teamId },
    include: {
      rsvps: {
        include: {
          player: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      matchStats: {
        include: {
          player: { select: { name: true } },
        },
      },
      team: { select: { slug: true } },
    },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  const canSubmitPostGame =
    match.date < new Date() && match.status === "SCHEDULED";

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/vitrine/${match.team.slug}/matches/${match.id}?t=${match.shareToken}`;

  return NextResponse.json({
    id: match.id,
    date: match.date.toISOString(),
    venue: match.venue,
    opponent: match.opponent,
    type: match.type,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status: match.status,
    shareToken: match.shareToken,
    shareUrl,
    rsvps: match.rsvps.map((rsvp) => ({
      playerId: rsvp.playerId,
      playerName: rsvp.player.name,
      status: rsvp.status,
      respondedAt: rsvp.respondedAt?.toISOString() ?? null,
    })),
    stats: match.matchStats.map((stat) => ({
      playerId: stat.playerId,
      playerName: stat.player.name,
      goals: stat.goals,
      assists: stat.assists,
      yellowCards: stat.yellowCards,
      redCards: stat.redCards,
    })),
    canSubmitPostGame,
    createdAt: match.createdAt.toISOString(),
    updatedAt: match.updatedAt.toISOString(),
  });
}

// PATCH /api/matches/:id — Update match (ADMIN only)
export async function PATCH(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
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

  const parsed = updateMatchSchema.safeParse(body);
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

  const data = parsed.data;

  // Handle CANCELLED transition
  if (data.status === "CANCELLED") {
    if (match.status !== "SCHEDULED") {
      return NextResponse.json(
        {
          error: "Apenas partidas agendadas podem ser canceladas",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.match.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: {
        rsvps: {
          include: { player: { select: { name: true } } },
        },
        matchStats: {
          include: { player: { select: { name: true } } },
        },
        team: { select: { slug: true } },
      },
    });

    return buildMatchDetailResponse(updated);
  }

  // Handle score submission (triggers COMPLETED)
  if (data.homeScore !== undefined && data.awayScore !== undefined) {
    if (match.date >= new Date()) {
      return NextResponse.json(
        {
          error: "Não é possível registrar pós-jogo antes da data da partida",
          code: "MATCH_NOT_PAST",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.match.update({
      where: { id },
      data: {
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        status: "COMPLETED",
      },
      include: {
        rsvps: {
          include: { player: { select: { name: true } } },
        },
        matchStats: {
          include: { player: { select: { name: true } } },
        },
        team: { select: { slug: true } },
      },
    });

    return buildMatchDetailResponse(updated);
  }

  // Basic field updates
  const updateData: Record<string, unknown> = {};
  if (data.date) updateData.date = new Date(data.date);
  if (data.venue) updateData.venue = data.venue;
  if (data.opponent) updateData.opponent = data.opponent;
  if (data.type) updateData.type = data.type;

  const updated = await prisma.match.update({
    where: { id },
    data: updateData,
    include: {
      rsvps: {
        include: { player: { select: { name: true } } },
      },
      matchStats: {
        include: { player: { select: { name: true } } },
      },
      team: { select: { slug: true } },
    },
  });

  return buildMatchDetailResponse(updated);
}

// DELETE /api/matches/:id — Delete match (ADMIN only)
export async function DELETE(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id, teamId: session.user.teamId },
    include: {
      _count: { select: { matchStats: true } },
    },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const confirm = searchParams.get("confirm");

  if (match._count.matchStats > 0 && confirm !== "true") {
    return NextResponse.json(
      {
        error:
          "Partida possui estatísticas registradas. Envie ?confirm=true para confirmar.",
        code: "HAS_STATS_NEEDS_CONFIRM",
      },
      { status: 400 }
    );
  }

  // Cascade delete: stats, rsvps, then match
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.matchStats.deleteMany({ where: { matchId: id } });
    await tx.rSVP.deleteMany({ where: { matchId: id } });
    await tx.match.delete({ where: { id } });
  });

  return NextResponse.json({ message: "Match deleted" });
}

// Helper to build match detail response
function buildMatchDetailResponse(
  match: {
    id: string;
    date: Date;
    venue: string;
    opponent: string;
    type: string;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
    shareToken: string;
    createdAt: Date;
    updatedAt: Date;
    team: { slug: string };
    rsvps: Array<{
      playerId: string;
      player: { name: string };
      status: string;
      respondedAt: Date | null;
    }>;
    matchStats: Array<{
      playerId: string;
      player: { name: string };
      goals: number;
      assists: number;
      yellowCards: number;
      redCards: number;
    }>;
  }
) {
  const canSubmitPostGame =
    match.date < new Date() && match.status === "SCHEDULED";
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/vitrine/${match.team.slug}/matches/${match.id}?t=${match.shareToken}`;

  return NextResponse.json({
    id: match.id,
    date: match.date.toISOString(),
    venue: match.venue,
    opponent: match.opponent,
    type: match.type,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status: match.status,
    shareToken: match.shareToken,
    shareUrl,
    rsvps: match.rsvps.map((rsvp) => ({
      playerId: rsvp.playerId,
      playerName: rsvp.player.name,
      status: rsvp.status,
      respondedAt: rsvp.respondedAt?.toISOString() ?? null,
    })),
    stats: match.matchStats.map((stat) => ({
      playerId: stat.playerId,
      playerName: stat.player.name,
      goals: stat.goals,
      assists: stat.assists,
      yellowCards: stat.yellowCards,
      redCards: stat.redCards,
    })),
    canSubmitPostGame,
    createdAt: match.createdAt.toISOString(),
    updatedAt: match.updatedAt.toISOString(),
  });
}
