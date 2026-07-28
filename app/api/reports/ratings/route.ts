import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const teamId = session.user.teamId;
  if (!teamId) return NextResponse.json({ error: "Sem time vinculado" }, { status: 403 });
  
  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("seasonId") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const matchFilter: any = { teamId, status: "COMPLETED" };
  if (seasonId) matchFilter.seasonId = seasonId;
  if (from || to) {
    matchFilter.date = {};
    if (from) matchFilter.date.gte = new Date(from);
    if (to) matchFilter.date.lte = new Date(to);
  }

  const matches = await prisma.match.findMany({
    where: matchFilter,
    include: {
      matchPlayerRatings: {
        include: { player: true }
      },
      matchVotes: true
    }
  });

  const evaluations = await prisma.playerEvaluation.findMany({
    where: {
      player: { teamId }
    }
  });

  let totalRatingsSum = 0;
  let totalRatingsCount = 0;
  let totalMvpVotes = 0;
  
  const playerStats = new Map<string, any>();
  const monthlyStats = new Map<string, { sum: number, count: number }>();

  matches.forEach(match => {
    const monthKey = format(new Date(match.date), "MMM/yy", { locale: ptBR });
    const m = monthlyStats.get(monthKey) || { sum: 0, count: 0 };

    match.matchPlayerRatings.forEach(rating => {
      totalRatingsSum += rating.rating;
      totalRatingsCount++;
      m.sum += rating.rating;
      m.count++;

      if (rating.playerId && rating.player) {
        const p = playerStats.get(rating.playerId) || {
          playerId: rating.playerId,
          playerName: rating.player.name,
          position: rating.player.position,
          shirtNumber: rating.player.shirtNumber,
          sum: 0,
          count: 0,
          mvpVotes: 0
        };
        p.sum += rating.rating;
        p.count++;
        playerStats.set(rating.playerId, p);
      }
    });

    match.matchVotes.forEach(vote => {
      totalMvpVotes++;
      if (vote.playerId) {
        const p = playerStats.get(vote.playerId) || {
           playerId: vote.playerId,
           playerName: "Desconhecido",
           position: null,
           shirtNumber: null,
           sum: 0,
           count: 0,
           mvpVotes: 0
        };
        p.mvpVotes++;
        playerStats.set(vote.playerId, p);
      }
    });

    monthlyStats.set(monthKey, m);
  });

  const playersArray = Array.from(playerStats.values()).map(p => ({
    playerId: p.playerId,
    playerName: p.playerName,
    position: p.position,
    shirtNumber: p.shirtNumber,
    avgRating: p.count > 0 ? p.sum / p.count : 0,
    totalRatings: p.count,
    mvpVotes: p.mvpVotes
  })).sort((a, b) => b.avgRating - a.avgRating);

  const monthlyAvg = Array.from(monthlyStats.entries()).map(([month, stats]) => ({
    month,
    avgRating: stats.count > 0 ? stats.sum / stats.count : 0,
    totalRatings: stats.count
  }));

  let techSum = 0, tacSum = 0, physSum = 0, discSum = 0;
  evaluations.forEach(e => {
    techSum += e.technical || 0;
    tacSum += e.tactical || 0;
    physSum += e.physical || 0;
    discSum += e.discipline || 0;
  });
  
  const evalCount = evaluations.length;
  const skillRadar = {
    technical: evalCount ? techSum / evalCount : 0,
    tactical: evalCount ? tacSum / evalCount : 0,
    physical: evalCount ? physSum / evalCount : 0,
    discipline: evalCount ? discSum / evalCount : 0
  };

  return NextResponse.json({
    overview: {
      totalRatings: totalRatingsCount,
      avgTeamRating: totalRatingsCount > 0 ? totalRatingsSum / totalRatingsCount : 0,
      totalEvaluations: evalCount,
      totalMvpVotes
    },
    playerRatings: playersArray,
    monthlyAvg,
    skillRadar
  });
}
