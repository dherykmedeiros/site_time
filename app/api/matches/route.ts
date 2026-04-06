import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { generateUUID } from "@/lib/utils";
import { createMatchSchema, matchListQuerySchema } from "@/lib/validations/match";
import { notifyScheduledMatch } from "@/lib/push";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/matches — List matches for the team
export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const parsedQuery = matchListQuerySchema.safeParse({
    status: searchParams.get("status") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        error: "Parâmetros de busca inválidos",
        code: "VALIDATION_ERROR",
        details: parsedQuery.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { status, type, from, to } = parsedQuery.data;

  const where: Prisma.MatchWhereInput = {
    teamId: session.user.teamId,
  };

  if (status) {
    where.status = status as "SCHEDULED" | "COMPLETED" | "CANCELLED";
  }
  if (type) {
    where.type = type as "FRIENDLY" | "CHAMPIONSHIP";
  }
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const matches = await prisma.match.findMany({
    where,
    include: {
      rsvps: {
        select: { status: true },
      },
      positionLimits: {
        select: { position: true, maxPlayers: true },
      },
    },
    orderBy: { date: "asc" },
    take: 500,
  });

  const result = matches.map((match) => {
    const confirmed = match.rsvps.filter((r) => r.status === "CONFIRMED").length;
    const declined = match.rsvps.filter((r) => r.status === "DECLINED").length;
    const pending = match.rsvps.filter((r) => r.status === "PENDING").length;

    return {
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
      shareToken: match.shareToken,
      positionLimits: match.positionLimits,
      rsvpSummary: { confirmed, declined, pending },
      createdAt: match.createdAt.toISOString(),
    };
  });

  return NextResponse.json({ matches: result });
});

// POST /api/matches — Create a new match (ADMIN only)
export const POST = withErrorHandler(async (request: Request) => {
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

  const parsed = createMatchSchema.safeParse(body);
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

  const { date, venue, opponent, isHome, opponentBadgeUrl, type, seasonId, positionLimits = [] } = parsed.data;
  const matchDate = new Date(date);

  const uniquePositions = new Set(positionLimits.map((l) => l.position));
  if (uniquePositions.size !== positionLimits.length) {
    return NextResponse.json(
      {
        error: "Posições duplicadas nos limites",
        code: "DUPLICATE_POSITION_LIMIT",
      },
      { status: 400 }
    );
  }

  if (matchDate <= new Date()) {
    return NextResponse.json(
      { error: "Data deve ser no futuro", code: "DATE_IN_PAST" },
      { status: 400 }
    );
  }

  // If seasonId provided, verify it belongs to the team
  if (seasonId) {
    const season = await prisma.season.findFirst({
      where: { id: seasonId, teamId: session.user.teamId },
    });
    if (!season) {
      return NextResponse.json(
        { error: "Temporada não encontrada", code: "SEASON_NOT_FOUND" },
        { status: 404 }
      );
    }
  }

  const shareToken = generateUUID();
  const teamId = session.user.teamId;

  // Get team to build shareUrl
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { slug: true },
  });

  // Create match and auto-create PENDING RSVPs for all ACTIVE players
  const match = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const newMatch = await tx.match.create({
      data: {
        date: matchDate,
        venue,
        opponent,
        isHome: isHome ?? true,
        opponentBadgeUrl: opponentBadgeUrl ?? null,
        type,
        shareToken,
        teamId,
        ...(seasonId && { seasonId }),
      },
    });

    // Get all active players for this team
    const activePlayers = await tx.player.findMany({
      where: { teamId, status: "ACTIVE" },
      select: { id: true },
    });

    // Auto-create PENDING RSVPs
    if (activePlayers.length > 0) {
      await tx.rSVP.createMany({
        data: activePlayers.map((player) => ({
          playerId: player.id,
          matchId: newMatch.id,
          status: "PENDING" as const,
        })),
      });
    }

    if (positionLimits.length > 0) {
      await tx.matchPositionLimit.createMany({
        data: positionLimits.map((limit) => ({
          matchId: newMatch.id,
          position: limit.position,
          maxPlayers: limit.maxPlayers,
        })),
      });
    }

    return newMatch;
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/vitrine/${team?.slug}/matches/${match.id}?t=${match.shareToken}`;

  try {
    await notifyScheduledMatch(match.id);
  } catch (err) {
    console.error("Failed to notify scheduled match", err);
  }

  return NextResponse.json(
    {
      id: match.id,
      date: match.date.toISOString(),
      venue: match.venue,
      opponent: match.opponent,
      isHome: match.isHome,
      opponentBadgeUrl: match.opponentBadgeUrl,
      type: match.type,
      status: match.status,
      shareToken: match.shareToken,
      shareUrl,
      createdAt: match.createdAt.toISOString(),
    },
    { status: 201 }
  );
});
