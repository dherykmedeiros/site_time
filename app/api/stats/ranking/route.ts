import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/stats/ranking — Full ranking table for the team's players
export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const teamId = session.user.teamId;
  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("seasonId") || undefined;
  const matchType = searchParams.get("matchType") || searchParams.get("type") || undefined;

  // Build the match filter
  const matchWhere: Record<string, unknown> = { teamId };
  if (seasonId) matchWhere.seasonId = seasonId;
  if (matchType && (matchType === "FRIENDLY" || matchType === "CHAMPIONSHIP")) {
    matchWhere.type = matchType;
  }

  // Aggregate MatchStats per player
  const stats = await prisma.matchStats.groupBy({
    by: ["playerId"],
    where: { match: matchWhere, playerId: { not: null } },
    _sum: {
      goals: true,
      assists: true,
      yellowCards: true,
      redCards: true,
    },
    _count: {
      matchId: true,
    },
    orderBy: [
      { _sum: { goals: "desc" } },
      { _sum: { assists: "desc" } },
    ],
  });

  // Fetch player details
  const playerIds = stats.map((s) => s.playerId).filter(Boolean) as string[];
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      shirtNumber: true,
      position: true,
    },
  });
  const playerMap = new Map(players.map((p) => [p.id, p]));

  // Aggregate ratings per player for the same team/season filter
  const ratingsAgg = await prisma.matchPlayerRating.groupBy({
    by: ["ratedId"],
    where: { match: matchWhere },
    _avg: { stars: true },
    _count: { stars: true },
  });
  const ratingsMap = new Map(
    ratingsAgg.map((r) => [r.ratedId, { avg: r._avg.stars ?? 0, count: r._count.stars }])
  );

  const ranking = stats.map((s, idx) => {
    const pId = s.playerId as string;
    const player = playerMap.get(pId);
    const ratingInfo = ratingsMap.get(pId);
    return {
      rank: idx + 1,
      playerId: pId,
      playerName: player?.name ?? "Desconhecido",
      photoUrl: player?.photoUrl ?? null,
      shirtNumber: player?.shirtNumber ?? 0,
      position: player?.position ?? "FORWARD",
      goals: s._sum.goals ?? 0,
      assists: s._sum.assists ?? 0,
      yellowCards: s._sum.yellowCards ?? 0,
      redCards: s._sum.redCards ?? 0,
      matches: s._count.matchId,
      averageStars: ratingInfo ? Number(ratingInfo.avg.toFixed(1)) : null,
      totalRatings: ratingInfo?.count ?? 0,
      seasonId: seasonId ?? null,
    };
  });

  // Fetch season info if filtered
  let season: { id: string; name: string } | null = null;
  if (seasonId) {
    const seasonRecord = await prisma.season.findUnique({
      where: { id: seasonId },
      select: { id: true, name: true },
    });
    season = seasonRecord;
  }

  // Fetch all seasons for the team (for the filter select)
  const seasons = await prisma.season.findMany({
    where: { teamId },
    select: { id: true, name: true, status: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ranking, season, seasons });
}
