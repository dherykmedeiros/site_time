import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { updateMatchSchema } from "@/lib/validations/match";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";
import { resolveGoogleMapsUrl, extractCoordsFromGoogleMaps } from "@/lib/utils";


interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/matches/:id - Match detail with RSVPs, stats, canSubmitPostGame
export const GET = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuario nao possui time vinculado" },
      { status: 404 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id, teamId: session.user.teamId },
    include: {
      rsvps: {
        where: {
          player: {
            status: "ACTIVE"
          }
        },
        include: {
          player: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      matchStats: {
        include: {
          player: { select: { name: true } },
          guestPlayer: { select: { name: true } },
        },
      },
      positionLimits: {
        select: { position: true, maxPlayers: true },
      },
      team: { select: { slug: true } },
      season: { select: { id: true, name: true, type: true, status: true } },
      guestPlayers: true,
    },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida nao encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  let finalMatch = match;

  if (match.status === "COMPLETED") {
    // 1. Fetch lineup selections and confirmed RSVPs
    const [lineupSelections, confirmedRsvps] = await Promise.all([
      prisma.matchLineupSelection.findMany({
        where: { matchId: id },
      }),
      prisma.rSVP.findMany({
        where: { matchId: id, status: "CONFIRMED" },
      }),
    ]);

    // 2. Identify missing players in matchStats
    const existingPlayerIds = new Set(match.matchStats.map((s) => s.playerId).filter(Boolean));
    const existingGuestPlayerIds = new Set(match.matchStats.map((s) => s.guestPlayerId).filter(Boolean));

    const toCreate: Array<{ playerId: string | null; guestPlayerId: string | null }> = [];

    for (const sel of lineupSelections) {
      if (sel.playerId && !existingPlayerIds.has(sel.playerId)) {
        toCreate.push({ playerId: sel.playerId, guestPlayerId: null });
        existingPlayerIds.add(sel.playerId);
      } else if (sel.guestPlayerId && !existingGuestPlayerIds.has(sel.guestPlayerId)) {
        toCreate.push({ playerId: null, guestPlayerId: sel.guestPlayerId });
        existingGuestPlayerIds.add(sel.guestPlayerId);
      }
    }

    for (const rsvp of confirmedRsvps) {
      if (!existingPlayerIds.has(rsvp.playerId)) {
        toCreate.push({ playerId: rsvp.playerId, guestPlayerId: null });
        existingPlayerIds.add(rsvp.playerId);
      }
    }

    // 3. Perform database backfill if there are missing players
    if (toCreate.length > 0) {
      await prisma.$transaction(async (tx) => {
        await tx.matchStats.createMany({
          data: toCreate.map((c) => ({
            matchId: id,
            playerId: c.playerId,
            guestPlayerId: c.guestPlayerId,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
          })),
        });

        // Ensure attendance is marked as present for regular players backfilled
        for (const c of toCreate) {
          if (c.playerId) {
            await tx.matchAttendance.upsert({
              where: {
                matchId_playerId: {
                  matchId: id,
                  playerId: c.playerId,
                },
              },
              create: {
                matchId: id,
                playerId: c.playerId,
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

      // Refetch match to have updated stats in the response
      const updatedMatch = await prisma.match.findFirst({
        where: { id, teamId: session.user.teamId },
        include: {
          rsvps: {
            where: {
              player: {
                status: "ACTIVE"
              }
            },
            include: {
              player: { select: { name: true } },
            },
            orderBy: { createdAt: "asc" },
          },
          matchStats: {
            include: {
              player: { select: { name: true } },
              guestPlayer: { select: { name: true } },
            },
          },
          positionLimits: {
            select: { position: true, maxPlayers: true },
          },
          team: { select: { slug: true } },
          season: { select: { id: true, name: true, type: true, status: true } },
          guestPlayers: true,
        },
      });

      if (updatedMatch) {
        finalMatch = updatedMatch;
      }
    }
  }

  let userAttendance = null;
  if (session?.user?.playerId) {
    const att = await prisma.matchAttendance.findUnique({
      where: {
        matchId_playerId: {
          matchId: id,
          playerId: session.user.playerId,
        },
      },
      select: { present: true, checkedInAt: true },
    });
    if (att) {
      userAttendance = {
        present: att.present,
        checkedInAt: att.checkedInAt?.toISOString() ?? null,
      };
    }
  }

  return await buildMatchDetailResponse(finalMatch, userAttendance, session.user.playerId);
});

// PATCH /api/matches/:id - Update match (ADMIN only)
export const PATCH = withErrorHandler(async (request: Request, { params }: RouteParams) => {
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

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuario nao possui time vinculado" },
      { status: 404 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida nao encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = updateMatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos invalidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (match.status === "CANCELLED") {
    return NextResponse.json(
      {
        error: "Partidas canceladas nao podem ser editadas",
        code: "MATCH_CANCELLED_LOCKED",
      },
      { status: 400 }
    );
  }



  if (data.positionLimits) {
    const uniquePositions = new Set(data.positionLimits.map((l) => l.position));
    if (uniquePositions.size !== data.positionLimits.length) {
      return NextResponse.json(
        {
          error: "Posicoes duplicadas nos limites",
          code: "DUPLICATE_POSITION_LIMIT",
        },
        { status: 400 }
      );
    }
  }

  if (data.seasonId !== undefined && data.seasonId !== null) {
    const season = await prisma.season.findFirst({
      where: { id: data.seasonId, teamId: session.user.teamId },
      select: { id: true },
    });

    if (!season) {
      return NextResponse.json(
        { error: "Temporada nao encontrada", code: "SEASON_NOT_FOUND" },
        { status: 404 }
      );
    }
  }

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
          where: {
            player: {
              status: "ACTIVE"
            }
          },
          include: { player: { select: { name: true } } },
        },
        matchStats: {
          include: {
            player: { select: { name: true } },
            guestPlayer: { select: { name: true } },
          },
        },
        positionLimits: {
          select: { position: true, maxPlayers: true },
        },
        team: { select: { slug: true } },
        season: { select: { id: true, name: true, type: true, status: true } },
        guestPlayers: true,
      },
    });

    return await buildMatchDetailResponse(updated, null, session.user.playerId);
  }

  // Handle score submission (triggers COMPLETED)
  if (
    match.status !== "COMPLETED" &&
    data.homeScore !== undefined &&
    data.homeScore !== null &&
    data.awayScore !== undefined &&
    data.awayScore !== null
  ) {
    if (match.date >= new Date()) {
      return NextResponse.json(
        {
          error: "Nao e possivel registrar pos-jogo antes da data da partida",
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
          where: {
            player: {
              status: "ACTIVE"
            }
          },
          include: { player: { select: { name: true } } },
        },
        matchStats: {
          include: {
            player: { select: { name: true } },
            guestPlayer: { select: { name: true } },
          },
        },
        positionLimits: {
          select: { position: true, maxPlayers: true },
        },
        team: { select: { slug: true } },
        season: { select: { id: true, name: true, type: true, status: true } },
        guestPlayers: true,
      },
    });

    return await buildMatchDetailResponse(updated, null, session.user.playerId);
  }

  // Basic field updates
  const updateData: Record<string, unknown> = {};
  if (data.date) updateData.date = new Date(data.date);
  if (data.venue) updateData.venue = data.venue;
  if (data.opponent) updateData.opponent = data.opponent;
  if (data.isHome !== undefined) updateData.isHome = data.isHome;
  if (data.opponentBadgeUrl !== undefined) updateData.opponentBadgeUrl = data.opponentBadgeUrl;
  if (data.type) updateData.type = data.type;
  if (data.seasonId !== undefined) updateData.seasonId = data.seasonId;
  if (data.homeScore !== undefined) updateData.homeScore = data.homeScore;
  if (data.awayScore !== undefined) updateData.awayScore = data.awayScore;
  if (data.status) updateData.status = data.status;
  if (data.pixKey !== undefined) updateData.pixKey = data.pixKey;
  
  if (data.mapsUrl !== undefined) {
    if (data.mapsUrl === null || data.mapsUrl === "") {
      updateData.latitude = null;
      updateData.longitude = null;
    } else {
      const resolvedUrl = await resolveGoogleMapsUrl(data.mapsUrl);
      const coords = extractCoordsFromGoogleMaps(resolvedUrl);
      if (coords) {
        updateData.latitude = coords.latitude;
        updateData.longitude = coords.longitude;
      }
    }
  } else {
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
  }

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (data.positionLimits) {
      await tx.matchPositionLimit.deleteMany({ where: { matchId: id } });
      if (data.positionLimits.length > 0) {
        await tx.matchPositionLimit.createMany({
          data: data.positionLimits.map((limit) => ({
            matchId: id,
            position: limit.position,
            maxPlayers: limit.maxPlayers,
          })),
        });
      }
    }

    return tx.match.update({
      where: { id },
      data: updateData,
      include: {
        rsvps: {
          where: {
            player: {
              status: "ACTIVE"
            }
          },
          include: { player: { select: { name: true } } },
        },
        matchStats: {
          include: {
            player: { select: { name: true } },
            guestPlayer: { select: { name: true } },
          },
        },
        positionLimits: {
          select: { position: true, maxPlayers: true },
        },
        team: { select: { slug: true } },
        season: { select: { id: true, name: true, type: true, status: true } },
        guestPlayers: true,
      },
    });
  });

  return await buildMatchDetailResponse(updated, null, session.user.playerId);
});

// DELETE /api/matches/:id - Delete match (ADMIN only)
export const DELETE = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuario nao possui time vinculado" },
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
      { error: "Partida nao encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const confirm = searchParams.get("confirm");

  if (match._count.matchStats > 0 && confirm !== "true") {
    return NextResponse.json(
      {
        error:
          "Partida possui estatisticas registradas. Envie ?confirm=true para confirmar.",
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
});

// Helper to build match detail response
async function buildMatchDetailResponse(
  match: {
    id: string;
    date: Date;
    venue: string;
    opponent: string;
    isHome: boolean;
    opponentBadgeUrl: string | null;
    type: string;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
    season: { id: string; name: string; type: string; status: string } | null;
    positionLimits: Array<{ position: string; maxPlayers: number }>;
    shareToken: string;
    hasCharge: boolean;
    chargeAmount: Prisma.Decimal | null | number;
    pixKey: string | null;
    latitude: number | null;
    longitude: number | null;
    createdAt: Date;
    updatedAt: Date;
    team: { slug: string };
    guestPlayers?: Array<{
      id: string;
      name: string;
      createdAt: Date;
    }>;
    rsvps: Array<{
      playerId: string;
      player: { name: string };
      status: string;
      respondedAt: Date | null;
      summoned: boolean;
    }>;
    matchStats: Array<{
      playerId: string | null;
      guestPlayerId: string | null;
      player: { name: string } | null;
      guestPlayer: { name: string } | null;
      goals: number;
      assists: number;
      yellowCards: number;
      redCards: number;
    }>;
  },
  userAttendance?: { present: boolean; checkedInAt: string | null } | null,
  playerId?: string | null
) {
  const canSubmitPostGame =
    match.date < new Date() && match.status === "SCHEDULED";
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/matches/${match.id}?t=${match.shareToken}`;

  // Fetch suspensions for this match
  const matchSuspensions = await prisma.fine.findMany({
    where: {
      suspendedMatchId: match.id,
      severity: "SUSPENSION",
      status: "ACTIVE",
    },
    select: {
      playerId: true,
      description: true,
    },
  });

  const suspendedPlayerIds = new Set(matchSuspensions.map((s) => s.playerId));
  const playerSuspension = playerId
    ? matchSuspensions.find((s) => s.playerId === playerId)
    : null;

  return NextResponse.json({
    id: match.id,
    date: match.date.toISOString(),
    venue: match.venue,
    opponent: match.opponent,
    isHome: match.isHome,
    opponentBadgeUrl: match.opponentBadgeUrl,
    type: match.type,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status: match.status,
    season: match.season,
    positionLimits: match.positionLimits,
    shareToken: match.shareToken,
    shareUrl,
    isPlayerSuspended: !!playerSuspension,
    suspensionReason: playerSuspension?.description || null,
    rsvps: [
      ...match.rsvps.map((rsvp) => ({
        playerId: rsvp.playerId,
        playerName: rsvp.player.name,
        status: rsvp.status,
        respondedAt: rsvp.respondedAt?.toISOString() ?? null,
        summoned: rsvp.summoned,
        isSuspended: suspendedPlayerIds.has(rsvp.playerId),
      })),
      ...(match.guestPlayers || []).map((guest) => ({
        playerId: guest.id,
        playerName: `${guest.name} (Convidado)`,
        status: "CONFIRMED",
        respondedAt: guest.createdAt.toISOString(),
        summoned: true,
        isGuest: true,
        guestPlayerId: guest.id,
        isSuspended: false,
      })),
    ],
    stats: match.matchStats.map((stat) => ({
      playerId: stat.playerId || stat.guestPlayerId,
      guestPlayerId: stat.guestPlayerId,
      playerName: stat.player?.name ?? stat.guestPlayer?.name ?? "Convidado",
      goals: stat.goals,
      assists: stat.assists,
      yellowCards: stat.yellowCards,
      redCards: stat.redCards,
    })),
    canSubmitPostGame,
    latitude: match.latitude,
    longitude: match.longitude,
    userAttendance: userAttendance ?? null,
    createdAt: match.createdAt.toISOString(),
    updatedAt: match.updatedAt.toISOString(),
  });
}
