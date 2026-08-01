import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const teamId = session.user.teamId;
  const { searchParams } = new URL(request.url);
  const player1Id = searchParams.get("player1Id");
  const player2Id = searchParams.get("player2Id");

  if (!player1Id || !player2Id) {
    return NextResponse.json({ error: "Parâmetros player1Id e player2Id são obrigatórios" }, { status: 400 });
  }

  const [p1, p2] = await Promise.all([
    prisma.player.findFirst({
      where: { id: player1Id, teamId },
      select: { id: true, name: true, photoUrl: true, shirtNumber: true, position: true, status: true, createdAt: true },
    }),
    prisma.player.findFirst({
      where: { id: player2Id, teamId },
      select: { id: true, name: true, photoUrl: true, shirtNumber: true, position: true, status: true, createdAt: true },
    }),
  ]);

  if (!p1 || !p2) {
    return NextResponse.json({ error: "Um ou ambos os jogadores não foram encontrados no seu time" }, { status: 404 });
  }

  async function getPlayerStats(playerId: string) {
    const [statsAgg, evalAgg, ratingsAgg, startersCount] = await Promise.all([
      prisma.matchStats.aggregate({
        where: { playerId, match: { teamId } },
        _sum: { goals: true, assists: true, yellowCards: true, redCards: true },
        _count: { matchId: true },
      }),
      prisma.playerEvaluation.aggregate({
        where: { playerId, teamId },
        _avg: { technical: true, tactical: true, physical: true, discipline: true },
        _count: { id: true },
      }),
      prisma.matchPlayerRating.aggregate({
        where: { ratedId: playerId, match: { teamId } },
        _avg: { stars: true },
        _count: { id: true },
      }),
      prisma.matchLineupSelection.count({
        where: { playerId, role: "STARTER", match: { teamId } },
      }),
    ]);

    return {
      goals: statsAgg._sum.goals ?? 0,
      assists: statsAgg._sum.assists ?? 0,
      yellowCards: statsAgg._sum.yellowCards ?? 0,
      redCards: statsAgg._sum.redCards ?? 0,
      matches: statsAgg._count.matchId,
      starters: startersCount,
      technical: Number((evalAgg._avg.technical ?? 0).toFixed(1)),
      tactical: Number((evalAgg._avg.tactical ?? 0).toFixed(1)),
      physical: Number((evalAgg._avg.physical ?? 0).toFixed(1)),
      discipline: Number((evalAgg._avg.discipline ?? 0).toFixed(1)),
      evaluationsCount: evalAgg._count.id,
      averageStars: Number((ratingsAgg._avg.stars ?? 0).toFixed(1)),
      ratingsCount: ratingsAgg._count.id,
    };
  }

  const [stats1, stats2] = await Promise.all([getPlayerStats(player1Id), getPlayerStats(player2Id)]);

  return NextResponse.json({
    player1: { ...p1, stats: stats1 },
    player2: { ...p2, stats: stats2 },
  });
}
