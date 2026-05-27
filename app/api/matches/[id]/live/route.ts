import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { liveActionSchema } from "@/lib/validations/match";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { awardAchievements } from "@/lib/achievements";
import { notifyMatchResultPosted } from "@/lib/push";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/matches/:id/live — Fetch live match state and timeline (PUBLIC)
export async function GET(request: Request, { params }: RouteParams) {
  const { id: matchId } = await params;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      team: {
        select: {
          name: true,
          badgeUrl: true,
          slug: true,
        },
      },
      matchLive: {
        include: {
          events: {
            orderBy: [
              { half: "asc" },
              { minute: "asc" },
              { createdAt: "asc" },
            ],
            include: {
              player: {
                select: {
                  id: true,
                  name: true,
                  position: true,
                  shirtNumber: true,
                },
              },
              guestPlayer: {
                select: {
                  id: true,
                  name: true,
                  position: true,
                  shirtNumber: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
      { status: 404 }
    );
  }

  // If no live match is initialized, return default NOT_STARTED state
  const liveData = match.matchLive ?? {
    id: null,
    matchId: match.id,
    liveStatus: "NOT_STARTED",
    homeScore: 0,
    awayScore: 0,
    firstHalfStart: null,
    firstHalfEnd: null,
    secondHalfStart: null,
    secondHalfEnd: null,
    events: [],
    createdAt: null,
    updatedAt: null,
  };

  return NextResponse.json({
    match: {
      id: match.id,
      date: match.date.toISOString(),
      venue: match.venue,
      opponent: match.opponent,
      opponentBadgeUrl: match.opponentBadgeUrl,
      isHome: match.isHome,
      status: match.status,
      team: match.team,
    },
    live: liveData,
  });
}

// POST /api/matches/:id/live — Control live match status (ADMIN only)
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
    include: { matchLive: true },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
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

  const parsed = liveActionSchema.safeParse(body);
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

  const { action } = parsed.data;
  const now = new Date();

  let live = match.matchLive;

  // Initialize live match if not exists
  if (!live) {
    live = await prisma.matchLive.create({
      data: {
        matchId,
        liveStatus: "NOT_STARTED",
        homeScore: 0,
        awayScore: 0,
      },
    });
  }

  // Validate state transitions
  if (action === "start_first_half" && live.liveStatus !== "NOT_STARTED") {
    return NextResponse.json({ error: "O primeiro tempo já foi iniciado." }, { status: 400 });
  }
  if (action === "end_first_half" && live.liveStatus !== "FIRST_HALF") {
    return NextResponse.json({ error: "O primeiro tempo não está rolando." }, { status: 400 });
  }
  if (action === "start_second_half" && live.liveStatus !== "HALF_TIME") {
    return NextResponse.json({ error: "A partida não está no intervalo." }, { status: 400 });
  }
  if (action === "end_second_half" && live.liveStatus !== "SECOND_HALF") {
    return NextResponse.json({ error: "O segundo tempo não está rolando." }, { status: 400 });
  }

  // Update timestamps and states
  const updateData: any = {};
  if (action === "start_first_half") {
    updateData.liveStatus = "FIRST_HALF";
    updateData.firstHalfStart = now;
  } else if (action === "end_first_half") {
    updateData.liveStatus = "HALF_TIME";
    updateData.firstHalfEnd = now;
  } else if (action === "start_second_half") {
    updateData.liveStatus = "SECOND_HALF";
    updateData.secondHalfStart = now;
  } else if (action === "end_second_half") {
    updateData.liveStatus = "FINISHED";
    updateData.secondHalfEnd = now;
  } else if (action === "increment_home") {
    updateData.homeScore = live.homeScore + 1;
  } else if (action === "decrement_home") {
    updateData.homeScore = Math.max(0, live.homeScore - 1);
  } else if (action === "increment_away") {
    updateData.awayScore = live.awayScore + 1;
  } else if (action === "decrement_away") {
    updateData.awayScore = Math.max(0, live.awayScore - 1);
  }

  const updatedLive = await prisma.matchLive.update({
    where: { id: live.id },
    data: updateData,
  });

  // If match has ended, compile live events into MatchStats and complete the Match
  if (action === "end_second_half") {
    // 1. Get all events for compilation
    const events = await prisma.matchLiveEvent.findMany({
      where: { matchLiveId: live.id },
    });

    // Aggregate stats per player (playerId or guestPlayerId)
    interface PlayerStatsAgg {
      playerId: string | null;
      guestPlayerId: string | null;
      goals: number;
      assists: number;
      yellowCards: number;
      redCards: number;
    }

    const aggregated: Record<string, PlayerStatsAgg> = {};

    const getKey = (playerId: string | null, guestPlayerId: string | null) => {
      if (playerId) return `p_${playerId}`;
      if (guestPlayerId) return `g_${guestPlayerId}`;
      return "";
    };

    for (const event of events) {
      const key = getKey(event.playerId, event.guestPlayerId);
      if (!key) continue;

      if (!aggregated[key]) {
        aggregated[key] = {
          playerId: event.playerId,
          guestPlayerId: event.guestPlayerId,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        };
      }

      if (event.type === "GOAL") {
        aggregated[key].goals += 1;
      } else if (event.type === "ASSIST") {
        aggregated[key].assists += 1;
      } else if (event.type === "YELLOW_CARD") {
        aggregated[key].yellowCards += 1;
      } else if (event.type === "RED_CARD") {
        aggregated[key].redCards += 1;
      }
    }

    // 2. Perform database updates in a transaction
    await prisma.$transaction(async (tx) => {
      // Complete main Match
      await tx.match.update({
        where: { id: matchId },
        data: {
          status: "COMPLETED",
          homeScore: updatedLive.homeScore,
          awayScore: updatedLive.awayScore,
        },
      });

      // Clear any existing stats (to avoid duplicates if already created somehow)
      await tx.matchStats.deleteMany({
        where: { matchId },
      });

      // Create new match stats
      const statsToCreate = Object.values(aggregated);
      if (statsToCreate.length > 0) {
        await tx.matchStats.createMany({
          data: statsToCreate.map((s) => ({
            matchId,
            playerId: s.playerId,
            guestPlayerId: s.guestPlayerId,
            goals: s.goals,
            assists: s.assists,
            yellowCards: s.yellowCards,
            redCards: s.redCards,
          })),
        });

        // Also mark attendance as present for regular players who participated
        for (const s of statsToCreate) {
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
                checkedInAt: now,
              },
              update: {
                present: true,
              },
            });
          }
        }
      }
    });

    // Award achievements and send result notifications (async/non-blocking)
    awardAchievements(matchId).catch(() => {});
    notifyMatchResultPosted(matchId).catch(() => {});
  }

  return NextResponse.json({
    message: `Ação ${action} processada com sucesso`,
    live: updatedLive,
  });
}
