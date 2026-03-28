import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/stats/rankings — Aggregated team rankings
export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const teamId = session.user.teamId;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10) || 10, 100);

  // Top scorers
  const topScorers = await prisma.matchStats.groupBy({
    by: ["playerId"],
    where: { match: { teamId } },
    _sum: { goals: true },
    orderBy: { _sum: { goals: "desc" } },
    take: limit,
  });

  const scorerPlayerIds = topScorers.map((s) => s.playerId);
  const scorerPlayers = await prisma.player.findMany({
    where: { id: { in: scorerPlayerIds } },
    select: { id: true, name: true },
  });
  const scorerMap = new Map(scorerPlayers.map((p) => [p.id, p.name]));

  // Top assisters
  const topAssisters = await prisma.matchStats.groupBy({
    by: ["playerId"],
    where: { match: { teamId } },
    _sum: { assists: true },
    orderBy: { _sum: { assists: "desc" } },
    take: limit,
  });

  const assisterPlayerIds = topAssisters.map((s) => s.playerId);
  const assisterPlayers = await prisma.player.findMany({
    where: { id: { in: assisterPlayerIds } },
    select: { id: true, name: true },
  });
  const assisterMap = new Map(assisterPlayers.map((p) => [p.id, p.name]));

  // Most cards
  const mostCards = await prisma.matchStats.groupBy({
    by: ["playerId"],
    where: { match: { teamId } },
    _sum: { yellowCards: true, redCards: true },
    orderBy: [{ _sum: { redCards: "desc" } }, { _sum: { yellowCards: "desc" } }],
    take: limit,
  });

  const cardPlayerIds = mostCards.map((s) => s.playerId);
  const cardPlayers = await prisma.player.findMany({
    where: { id: { in: cardPlayerIds } },
    select: { id: true, name: true },
  });
  const cardMap = new Map(cardPlayers.map((p) => [p.id, p.name]));

  // Team record: only COMPLETED matches
  const completedMatches = await prisma.match.findMany({
    where: { teamId, status: "COMPLETED" },
    select: { homeScore: true, awayScore: true },
  });

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;

  for (const m of completedMatches) {
    const home = m.homeScore ?? 0;
    const away = m.awayScore ?? 0;
    goalsScored += home;
    goalsConceded += away;
    if (home > away) wins++;
    else if (home < away) losses++;
    else draws++;
  }

  const totalMatches = completedMatches.length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  // Filter by type if specified
  const rankings: Record<string, unknown> = {};

  if (!type || type === "goals") {
    rankings.topScorers = topScorers
      .filter((s) => (s._sum.goals ?? 0) > 0)
      .map((s) => ({
        playerId: s.playerId,
        playerName: scorerMap.get(s.playerId) || "Desconhecido",
        total: s._sum.goals ?? 0,
      }));
  }

  if (!type || type === "assists") {
    rankings.topAssisters = topAssisters
      .filter((s) => (s._sum.assists ?? 0) > 0)
      .map((s) => ({
        playerId: s.playerId,
        playerName: assisterMap.get(s.playerId) || "Desconhecido",
        total: s._sum.assists ?? 0,
      }));
  }

  if (!type || type === "yellow_cards" || type === "red_cards") {
    rankings.mostCards = mostCards
      .filter(
        (s) => (s._sum.yellowCards ?? 0) > 0 || (s._sum.redCards ?? 0) > 0
      )
      .map((s) => ({
        playerId: s.playerId,
        playerName: cardMap.get(s.playerId) || "Desconhecido",
        yellowCards: s._sum.yellowCards ?? 0,
        redCards: s._sum.redCards ?? 0,
      }));
  }

  return NextResponse.json({
    teamId,
    rankings,
    teamRecord: {
      totalMatches,
      wins,
      draws,
      losses,
      winRate,
      goalsScored,
      goalsConceded,
    },
  });
}
