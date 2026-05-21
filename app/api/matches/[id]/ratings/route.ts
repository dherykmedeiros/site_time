import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/matches/[id]/ratings — Fetch existing ratings for a match
export const GET = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 400 }
    );
  }

  // Fetch all ratings for this match
  const ratings = await prisma.matchPlayerRating.findMany({
    where: { matchId: id },
  });

  // Calculate averages per rated player
  const ratedIds = Array.from(new Set(ratings.map((r: { ratedId: string }) => r.ratedId)));
  const averages = ratedIds.map((ratedId) => {
    const playerRatings = ratings.filter((r: { ratedId: string }) => r.ratedId === ratedId);
    const sum = playerRatings.reduce((acc: number, curr: { stars: number }) => acc + curr.stars, 0);
    const avg = playerRatings.length > 0 ? Number((sum / playerRatings.length).toFixed(1)) : 0;
    return {
      playerId: ratedId,
      averageStars: avg,
      totalRatings: playerRatings.length,
    };
  });

  // Filter ratings given by the current logged-in user to pre-fill the UI
  const userRatings = ratings
    .filter((r: { raterId: string }) => r.raterId === session.user.id)
    .map((r: { ratedId: string; stars: number }) => ({
      playerId: r.ratedId,
      stars: r.stars,
    }));

  // Business Logic: Check if the current user can rate (Admin, Coach or present Player)
  let canRate = false;
  if (session.user.role === "ADMIN" || session.user.role === "COACH") {
    canRate = true;
  } else if (session.user.playerId) {
    const attendance = await prisma.matchAttendance.findUnique({
      where: {
        matchId_playerId: {
          matchId: id,
          playerId: session.user.playerId,
        },
      },
    });
    const isPresent = attendance?.present === true;

    const stats = await prisma.matchStats.findUnique({
      where: {
        playerId_matchId: {
          playerId: session.user.playerId,
          matchId: id,
        },
      },
    });
    const hasStats = stats !== null;

    canRate = isPresent || hasStats;
  }

  return NextResponse.json({
    userRatings,
    averages,
    canRate,
  });
});

// POST /api/matches/[id]/ratings — Submit or update a teammate rating
export const POST = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { ratedId, stars } = body;

  // Validation: stars must be an integer between 1 and 5
  if (typeof stars !== "number" || stars < 1 || stars > 5 || !Number.isInteger(stars)) {
    return NextResponse.json(
      { error: "A nota deve ser um número inteiro de 1 a 5 estrelas." },
      { status: 400 }
    );
  }

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 400 }
    );
  }

  // Fetch the match to verify it is COMPLETED
  const match = await prisma.match.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada." },
      { status: 404 }
    );
  }

  if (match.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Só é possível avaliar jogadores em partidas finalizadas." },
      { status: 400 }
    );
  }

  // Rule: A player cannot rate themselves
  if (session.user.playerId && session.user.playerId === ratedId) {
    return NextResponse.json(
      { error: "Você não pode avaliar a si mesmo." },
      { status: 400 }
    );
  }

  // Rule: Only Admin, Coach, or players who participated (went to the game) can rate
  let isAllowed = false;
  if (session.user.role === "ADMIN" || session.user.role === "COACH") {
    isAllowed = true;
  } else if (session.user.playerId) {
    const attendance = await prisma.matchAttendance.findUnique({
      where: {
        matchId_playerId: {
          matchId: id,
          playerId: session.user.playerId,
        },
      },
    });
    const isPresent = attendance?.present === true;

    const stats = await prisma.matchStats.findUnique({
      where: {
        playerId_matchId: {
          playerId: session.user.playerId,
          matchId: id,
        },
      },
    });
    const hasStats = stats !== null;

    isAllowed = isPresent || hasStats;
  }

  if (!isAllowed) {
    return NextResponse.json(
      { error: "Apenas administradores, comissão técnica ou atletas que participaram da partida podem avaliar." },
      { status: 403 }
    );
  }

  // Upsert the rating in the database
  const rating = await prisma.matchPlayerRating.upsert({
    where: {
      matchId_raterId_ratedId: {
        matchId: id,
        raterId: session.user.id,
        ratedId,
      },
    },
    update: { stars },
    create: {
      matchId: id,
      raterId: session.user.id,
      ratedId,
      stars,
    },
  });

  // Recalculate average and total count for this specific player to return immediately
  const playerStats = await prisma.matchPlayerRating.aggregate({
    where: { matchId: id, ratedId },
    _avg: { stars: true },
    _count: { stars: true },
  });

  return NextResponse.json({
    success: true,
    rating,
    averageStars: playerStats._avg.stars ? Number(playerStats._avg.stars.toFixed(1)) : 0,
    totalRatings: playerStats._count.stars || 0,
  });
});
