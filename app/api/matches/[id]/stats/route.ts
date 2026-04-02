import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { createMatchStatsSchema } from "@/lib/validations/match";
import { awardAchievements } from "@/lib/achievements";
import { notifyMatchResultPosted } from "@/lib/push";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/matches/:id/stats — Get stats for a match
export async function GET(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
      { status: 404 }
    );
  }

  const stats = await prisma.matchStats.findMany({
    where: { matchId },
    include: {
      player: {
        select: { name: true, position: true },
      },
    },
  });

  return NextResponse.json({
    matchId,
    stats: stats.map((stat) => ({
      id: stat.id,
      playerId: stat.playerId,
      playerName: stat.player.name,
      playerPosition: stat.player.position,
      goals: stat.goals,
      assists: stat.assists,
      yellowCards: stat.yellowCards,
      redCards: stat.redCards,
    })),
  });
}

// POST /api/matches/:id/stats — Batch create stats (ADMIN only)
export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Match must be COMPLETED
  if (match.status !== "COMPLETED") {
    return NextResponse.json(
      {
        error: "Partida ainda não foi marcada como completada",
        code: "MATCH_NOT_COMPLETED",
      },
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

  const parsed = createMatchStatsSchema.safeParse(body);
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

  const { stats } = parsed.data;

  // Validate all playerIds belong to the team
  const playerIds = stats.map((s) => s.playerId);
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds }, teamId: session.user.teamId },
    select: { id: true },
  });

  const validPlayerIds = new Set(players.map((p) => p.id));
  const invalidPlayerIds = playerIds.filter((id) => !validPlayerIds.has(id));

  if (invalidPlayerIds.length > 0) {
    return NextResponse.json(
      {
        error: "Jogadores não encontrados no time",
        code: "PLAYER_NOT_FOUND",
        invalidPlayerIds,
      },
      { status: 404 }
    );
  }

  // Check for existing stats for these players in this match
  const existingStats = await prisma.matchStats.findMany({
    where: {
      matchId,
      playerId: { in: playerIds },
    },
    select: { playerId: true },
  });

  if (existingStats.length > 0) {
    return NextResponse.json(
      {
        error: "Stats já registrados para jogadores nesta partida",
        code: "STATS_ALREADY_EXIST",
        duplicatePlayerIds: existingStats.map((s) => s.playerId),
      },
      { status: 400 }
    );
  }

  // Batch create stats
  await prisma.matchStats.createMany({
    data: stats.map((s) => ({
      playerId: s.playerId,
      matchId,
      goals: s.goals,
      assists: s.assists,
      yellowCards: s.yellowCards,
      redCards: s.redCards,
    })),
  });

  // Fetch created stats to return
  const createdStats = await prisma.matchStats.findMany({
    where: { matchId, playerId: { in: playerIds } },
  });

  // F-004: award badges asynchronously (non-blocking)
  awardAchievements(matchId).catch(() => {/* silent — badges are bonus, not critical */});

  try {
    await notifyMatchResultPosted(matchId);
  } catch (err) {
    console.error("Failed to notify match result", err);
  }

  return NextResponse.json(
    {
      matchId,
      created: createdStats.length,
      stats: createdStats.map((s) => ({
        id: s.id,
        playerId: s.playerId,
        goals: s.goals,
        assists: s.assists,
        yellowCards: s.yellowCards,
        redCards: s.redCards,
      })),
    },
    { status: 201 }
  );
}

// PUT /api/matches/:id/stats — Replace stats for a completed match (ADMIN only)
export async function PUT(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
      { status: 404 }
    );
  }

  if (match.status !== "COMPLETED") {
    return NextResponse.json(
      {
        error: "Somente partidas finalizadas podem ter estatísticas editadas",
        code: "MATCH_NOT_COMPLETED",
      },
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

  const parsed = createMatchStatsSchema.safeParse(body);
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

  const { stats } = parsed.data;
  const playerIds = stats.map((s) => s.playerId);
  const uniquePlayerIds = Array.from(new Set(playerIds));

  if (uniquePlayerIds.length !== playerIds.length) {
    return NextResponse.json(
      {
        error: "Jogadores duplicados na lista de estatísticas",
        code: "DUPLICATE_PLAYER_STATS",
      },
      { status: 400 }
    );
  }

  const players = await prisma.player.findMany({
    where: { id: { in: uniquePlayerIds }, teamId: session.user.teamId },
    select: { id: true },
  });

  const validPlayerIds = new Set(players.map((p) => p.id));
  const invalidPlayerIds = uniquePlayerIds.filter((id) => !validPlayerIds.has(id));

  if (invalidPlayerIds.length > 0) {
    return NextResponse.json(
      {
        error: "Jogadores não encontrados no time",
        code: "PLAYER_NOT_FOUND",
        invalidPlayerIds,
      },
      { status: 404 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.matchStats.deleteMany({ where: { matchId } });

    await tx.matchStats.createMany({
      data: stats.map((s) => ({
        playerId: s.playerId,
        matchId,
        goals: s.goals,
        assists: s.assists,
        yellowCards: s.yellowCards,
        redCards: s.redCards,
      })),
    });
  });

  const updatedStats = await prisma.matchStats.findMany({
    where: { matchId },
  });

  return NextResponse.json({
    matchId,
    updated: updatedStats.length,
    stats: updatedStats.map((s) => ({
      id: s.id,
      playerId: s.playerId,
      goals: s.goals,
      assists: s.assists,
      yellowCards: s.yellowCards,
      redCards: s.redCards,
    })),
  });
}
