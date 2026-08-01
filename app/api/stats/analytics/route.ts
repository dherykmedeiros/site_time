import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Time não encontrado" }, { status: 400 });
  }

  // 1. Evolução Técnica & Física Geral do Time (agrupada por Mês)
  const evaluations = await prisma.playerEvaluation.findMany({
    where: { teamId },
    select: {
      technical: true,
      tactical: true,
      physical: true,
      discipline: true,
      date: true,
    },
    orderBy: { date: "asc" },
  });

  const monthlyGroups: Record<string, { technical: number; tactical: number; physical: number; discipline: number; count: number }> = {};
  
  evaluations.forEach((evalItem) => {
    const d = new Date(evalItem.date);
    const monthYear = `${monthNames[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`;
    
    if (!monthlyGroups[monthYear]) {
      monthlyGroups[monthYear] = { technical: 0, tactical: 0, physical: 0, discipline: 0, count: 0 };
    }
    
    monthlyGroups[monthYear].technical += evalItem.technical;
    monthlyGroups[monthYear].tactical += evalItem.tactical;
    monthlyGroups[monthYear].physical += evalItem.physical;
    monthlyGroups[monthYear].discipline += evalItem.discipline;
    monthlyGroups[monthYear].count += 1;
  });

  const evolutionData = Object.entries(monthlyGroups).map(([month, data]) => ({
    name: month,
    Técnico: Number((data.technical / data.count).toFixed(2)),
    Tático: Number((data.tactical / data.count).toFixed(2)),
    Físico: Number((data.physical / data.count).toFixed(2)),
    Disciplina: Number((data.discipline / data.count).toFixed(2)),
  }));

  // 2. Distribuição de Jogadores por Posição
  const positionCounts = await prisma.player.groupBy({
    by: ["position"],
    where: { teamId, status: "ACTIVE" },
    _count: { id: true },
  });

  const positionLabels: Record<string, string> = {
    GOALKEEPER: "Goleiro",
    DEFENDER: "Zagueiro",
    LEFT_BACK: "Lateral Esq.",
    RIGHT_BACK: "Lateral Dir.",
    LEFT_WINGBACK: "Ala Esq.",
    RIGHT_WINGBACK: "Ala Dir.",
    MIDFIELDER: "Meio-camp.",
    DEFENSIVE_MIDFIELDER: "Volante",
    FORWARD: "Atacante",
    LEFT_WINGER: "Ponta Esq.",
    RIGHT_WINGER: "Ponta Dir.",
  };

  const positionData = positionCounts.map((p) => ({
    name: positionLabels[p.position] || p.position,
    value: p._count.id,
  }));

  // 3. Top 5 Líderes em Avaliação Média (Nota dos Companheiros)
  const ratingsAgg = await prisma.matchPlayerRating.groupBy({
    by: ["ratedId"],
    where: { match: { teamId } },
    _avg: { stars: true },
    _count: { stars: true },
    having: {
      stars: {
        _count: { gte: 1 },
      },
    },
    orderBy: {
      _avg: { stars: "desc" },
    },
    take: 5,
  });

  const playerIds = ratingsAgg.map((r) => r.ratedId).filter(Boolean) as string[];
  const players = await prisma.player.findMany({
    where: { id: { in: playerIds } },
    select: { id: true, name: true },
  });
  const playerMap = new Map(players.map((p) => [p.id, p.name]));

  const leaderboardData = ratingsAgg.map((r) => ({
    name: (r.ratedId ? playerMap.get(r.ratedId) : undefined) || "Desconhecido",
    Nota: Number((r._avg.stars ?? 0).toFixed(2)),
  }));

  // 4. Sequência Recente & Aproveitamento Mandante/Visitante
  const completedMatches = await prisma.match.findMany({
    where: { teamId, status: "COMPLETED" },
    select: {
      id: true,
      opponent: true,
      homeScore: true,
      awayScore: true,
      isHome: true,
      date: true,
    },
    orderBy: { date: "desc" },
  });

  const formGuide = completedMatches.slice(0, 5).map((m) => {
    const st = m.isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
    const so = m.isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
    let result: "WIN" | "DRAW" | "LOSS" = "DRAW";
    if (st > so) result = "WIN";
    else if (st < so) result = "LOSS";
    return {
      id: m.id,
      opponent: m.opponent,
      scoreTeam: st,
      scoreOpponent: so,
      isHome: m.isHome,
      date: m.date,
      result,
    };
  }).reverse();

  let homeWins = 0, homeDraws = 0, homeLosses = 0, homeGF = 0, homeGA = 0;
  let awayWins = 0, awayDraws = 0, awayLosses = 0, awayGF = 0, awayGA = 0;

  completedMatches.forEach((m) => {
    const st = m.isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
    const so = m.isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
    if (m.isHome) {
      homeGF += st;
      homeGA += so;
      if (st > so) homeWins++;
      else if (st === so) homeDraws++;
      else homeLosses++;
    } else {
      awayGF += st;
      awayGA += so;
      if (st > so) awayWins++;
      else if (st === so) awayDraws++;
      else awayLosses++;
    }
  });

  const homeTotal = homeWins + homeDraws + homeLosses;
  const awayTotal = awayWins + awayDraws + awayLosses;

  return NextResponse.json({
    evolution: evolutionData,
    positionDistribution: positionData,
    leaderboard: leaderboardData,
    formGuide,
    homeAway: {
      home: { matches: homeTotal, wins: homeWins, draws: homeDraws, losses: homeLosses, gf: homeGF, ga: homeGA, winRate: homeTotal > 0 ? Number(((homeWins / homeTotal) * 100).toFixed(0)) : 0 },
      away: { matches: awayTotal, wins: awayWins, draws: awayDraws, losses: awayLosses, gf: awayGF, ga: awayGA, winRate: awayTotal > 0 ? Number(((awayWins / awayTotal) * 100).toFixed(0)) : 0 },
    },
  });
});
