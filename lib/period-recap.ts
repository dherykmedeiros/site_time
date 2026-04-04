import { prisma } from "@/lib/prisma";

export async function buildPeriodRecap(teamId: string, days: 7 | 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      name: true,
      shortName: true,
      primaryColor: true,
      secondaryColor: true,
      badgeUrl: true,
    },
  });

  if (!team) return null;

  const matches = await prisma.match.findMany({
    where: {
      teamId,
      status: "COMPLETED",
      date: { gte: since },
      homeScore: { not: null },
      awayScore: { not: null },
    },
    include: {
      matchStats: {
        select: {
          goals: true,
          assists: true,
          player: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { date: "desc" },
  });

  if (matches.length === 0) return null;

  let wins = 0,
    draws = 0,
    losses = 0,
    goalsFor = 0,
    goalsAgainst = 0;
  const playerGoals: Record<string, { name: string; goals: number; assists: number }> = {};

  for (const match of matches) {
    const gf = match.isHome ? (match.homeScore ?? 0) : (match.awayScore ?? 0);
    const ga = match.isHome ? (match.awayScore ?? 0) : (match.homeScore ?? 0);
    goalsFor += gf;
    goalsAgainst += ga;
    if (gf > ga) wins++;
    else if (gf < ga) losses++;
    else draws++;

    for (const stat of match.matchStats) {
      const key = stat.player.id;
      if (!playerGoals[key]) playerGoals[key] = { name: stat.player.name, goals: 0, assists: 0 };
      playerGoals[key].goals += stat.goals;
      playerGoals[key].assists += stat.assists;
    }
  }

  const players = Object.values(playerGoals);
  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0] ?? null;

  return {
    team,
    period: { days, label: days === 7 ? "Semanal" : "Mensal", since, until: new Date() },
    matches: matches.length,
    record: { wins, draws, losses },
    goals: { scored: goalsFor, conceded: goalsAgainst },
    leaders: {
      topScorer: topScorer && topScorer.goals > 0 ? { name: topScorer.name, goals: topScorer.goals } : null,
    },
  };
}
