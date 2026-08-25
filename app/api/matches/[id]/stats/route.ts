import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { createMatchStatsSchema } from "@/lib/validations/match";
import { awardAchievements } from "@/lib/achievements";
import { notifyMatchResultPosted } from "@/lib/push";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

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
      { status: 403 }
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
      guestPlayer: {
        select: { name: true, position: true },
      },
    },
  });

  return NextResponse.json({
    matchId,
    stats: stats.map((stat) => ({
      id: stat.id,
      playerId: stat.playerId,
      guestPlayerId: stat.guestPlayerId,
      playerName: stat.player?.name ?? stat.guestPlayer?.name ?? "Convidado",
      playerPosition: stat.player?.position ?? stat.guestPlayer?.position ?? null,
      goals: stat.goals,
      assists: stat.assists,
      yellowCards: stat.yellowCards,
      redCards: stat.redCards,
    })),
  });
}

// Helper to validate and extract player and guest IDs
async function validateStatsPlayers(
  stats: { playerId?: string | null; guestPlayerId?: string | null }[],
  teamId: string,
  matchId: string
) {
  const playerIds = stats.map((s) => s.playerId).filter(Boolean) as string[];
  const guestPlayerIds = stats.map((s) => s.guestPlayerId).filter(Boolean) as string[];

  // Verify unique regular players in payload
  const uniquePlayerIds = Array.from(new Set(playerIds));
  if (uniquePlayerIds.length !== playerIds.length) {
    return { error: "Jogadores duplicados na lista de estatísticas", status: 400 };
  }

  // Verify unique guest players in payload
  const uniqueGuestIds = Array.from(new Set(guestPlayerIds));
  if (uniqueGuestIds.length !== guestPlayerIds.length) {
    return { error: "Jogadores convidados duplicados na lista de estatísticas", status: 400 };
  }

  // Validate regular players exist on the team
  if (playerIds.length > 0) {
    const players = await prisma.player.findMany({
      where: { id: { in: playerIds }, teamId },
      select: { id: true },
    });
    const validPlayerIds = new Set(players.map((p) => p.id));
    const invalidPlayerIds = playerIds.filter((id) => !validPlayerIds.has(id));
    if (invalidPlayerIds.length > 0) {
      return {
        error: "Jogadores não encontrados no time",
        invalidPlayerIds,
        status: 404,
      };
    }
  }

  // Validate guest players belong to this match and team
  if (guestPlayerIds.length > 0) {
    const guests = await prisma.guestPlayer.findMany({
      where: { id: { in: guestPlayerIds }, matchId, teamId },
      select: { id: true },
    });
    const validGuestIds = new Set(guests.map((g) => g.id));
    const invalidGuestIds = guestPlayerIds.filter((id) => !validGuestIds.has(id));
    if (invalidGuestIds.length > 0) {
      return {
        error: "Jogadores convidados não encontrados nesta partida",
        invalidGuestIds,
        status: 404,
      };
    }
  }

  return { success: true };
}

// POST /api/matches/:id/stats — Batch create stats (ADMIN only)
export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const ip = extractClientIp(request);
  const rl = await rateLimitMutation(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${rl.retryAfterMinutes} min.`, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
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

  // Validate players
  const validationResult = await validateStatsPlayers(stats, session.user.teamId, matchId);
  if ("error" in validationResult) {
    return NextResponse.json(
      { error: validationResult.error, invalidIds: (validationResult as any).invalidPlayerIds || (validationResult as any).invalidGuestIds },
      { status: validationResult.status }
    );
  }

  // Batch create/replace stats and ensure match attendance is marked as present
  await prisma.$transaction(async (tx) => {
    await tx.matchStats.deleteMany({ where: { matchId } });

    await tx.matchStats.createMany({
      data: stats.map((s) => ({
        playerId: s.playerId || null,
        guestPlayerId: s.guestPlayerId || null,
        matchId,
        goals: s.goals,
        assists: s.assists,
        yellowCards: s.yellowCards,
        redCards: s.redCards,
      })),
    });

    // For TRAINING matches, the score (Time A vs Time B) is already set correctly
    // in Step 1 of PostGameForm — do NOT overwrite it by summing all goals.
    if (match.type !== "TRAINING") {
      const teamGoals = stats.reduce((sum, s) => sum + (s.goals || 0), 0);
      const currentOurScore = match.isHome ? match.homeScore : match.awayScore;

      if (currentOurScore === null || currentOurScore === undefined || teamGoals > currentOurScore) {
        const scoreUpdate = match.isHome ? { homeScore: teamGoals } : { awayScore: teamGoals };
        await tx.match.update({
          where: { id: matchId },
          data: scoreUpdate,
        });
      }
    }

    for (const s of stats) {
      if (s.playerId) {
        await tx.matchAttendance.upsert({
          where: {
            matchId_playerId: {
              matchId,
              playerId: s.playerId,
            },
          },
          create: {
            matchId,
            playerId: s.playerId,
            present: true,
            checkedInAt: new Date(),
          },
          update: {
            present: true,
          },
        });
      }
    }
  });

  // Fetch created stats to return
  const createdStats = await prisma.matchStats.findMany({
    where: { matchId },
  });

  // award badges asynchronously
  awardAchievements(matchId).catch(() => {});
  notifyMatchResultPosted(matchId).catch(() => {});

  return NextResponse.json(
    {
      matchId,
      created: createdStats.length,
      stats: createdStats.map((s) => ({
        id: s.id,
        playerId: s.playerId,
        guestPlayerId: s.guestPlayerId,
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
      { status: 403 }
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

  // Validate players
  const validationResult = await validateStatsPlayers(stats, session.user.teamId, matchId);
  if ("error" in validationResult) {
    return NextResponse.json(
      { error: validationResult.error, invalidIds: (validationResult as any).invalidPlayerIds || (validationResult as any).invalidGuestIds },
      { status: validationResult.status }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.matchStats.deleteMany({ where: { matchId } });

    await tx.matchStats.createMany({
      data: stats.map((s) => ({
        playerId: s.playerId || null,
        guestPlayerId: s.guestPlayerId || null,
        matchId,
        goals: s.goals,
        assists: s.assists,
        yellowCards: s.yellowCards,
        redCards: s.redCards,
      })),
    });

    // For TRAINING matches, the score (Time A vs Time B) is already set correctly — do NOT overwrite.
    if (match.type !== "TRAINING") {
      const teamGoals = stats.reduce((sum, s) => sum + (s.goals || 0), 0);
      const currentOurScore = match.isHome ? match.homeScore : match.awayScore;

      if (currentOurScore === null || currentOurScore === undefined || teamGoals > currentOurScore) {
        const scoreUpdate = match.isHome ? { homeScore: teamGoals } : { awayScore: teamGoals };
        await tx.match.update({
          where: { id: matchId },
          data: scoreUpdate,
        });
      }
    }

    // Ensure attendance is marked as present for all these players
    for (const s of stats) {
      if (s.playerId) {
        await tx.matchAttendance.upsert({
          where: {
            matchId_playerId: {
              matchId,
              playerId: s.playerId,
            },
          },
          create: {
            matchId,
            playerId: s.playerId,
            present: true,
            checkedInAt: new Date(),
          },
          update: {
            present: true,
          },
        });
      }
    }
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
      guestPlayerId: s.guestPlayerId,
      goals: s.goals,
      assists: s.assists,
      yellowCards: s.yellowCards,
      redCards: s.redCards,
    })),
  });
}
