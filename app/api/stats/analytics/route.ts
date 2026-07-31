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

  // Agrupa e calcula as médias por mês/ano
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
        _count: { gte: 1 }, // mínimo 1 avaliação para aparecer no gráfico
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
    name: playerMap.get(r.ratedId) || "Desconhecido",
    Nota: Number((r._avg.stars ?? 0).toFixed(2)),
  }));

  return NextResponse.json({
    evolution: evolutionData,
    positionDistribution: positionData,
    leaderboard: leaderboardData,
  });
});
