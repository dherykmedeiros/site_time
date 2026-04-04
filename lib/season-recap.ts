import { prisma } from "@/lib/prisma";

export async function buildSeasonRecap(seasonId: string) {
  const season = await prisma.season.findUnique({
    where: { id: seasonId },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          shortName: true,
          primaryColor: true,
          secondaryColor: true,
          badgeUrl: true,
        },
      },
      matches: {
        where: { status: "COMPLETED", homeScore: { not: null }, awayScore: { not: null } },
        include: {
          matchStats: {
            select: {
              goals: true,
              assists: true,
              yellowCards: true,
              redCards: true,
              player: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!season || season.matches.length === 0) return null;

  let wins = 0,
    draws = 0,
    losses = 0,
    goalsFor = 0,
    goalsAgainst = 0;
  const playerGoals: Record<string, { name: string; goals: number; assists: number }> = {};

  let totalYellow = 0,
    totalRed = 0;

  for (const match of season.matches) {
    const gf = match.isHome ? (match.homeScore ?? 0) : (match.awayScore ?? 0);
    const ga = match.isHome ? (match.awayScore ?? 0) : (match.homeScore ?? 0);
    goalsFor += gf;
    goalsAgainst += ga;
    if (gf > ga) wins++;
    else if (gf < ga) losses++;
    else draws++;

    for (const stat of match.matchStats) {
      totalYellow += stat.yellowCards;
      totalRed += stat.redCards;
      const key = stat.player.id;
      if (!playerGoals[key]) {
        playerGoals[key] = { name: stat.player.name, goals: 0, assists: 0 };
      }
      playerGoals[key].goals += stat.goals;
      playerGoals[key].assists += stat.assists;
    }
  }

  const players = Object.values(playerGoals);
  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0] ?? null;
  const topAssistant = [...players].sort((a, b) => b.assists - a.assists)[0] ?? null;

  return {
    season: { id: season.id, name: season.name, type: season.type },
    team: season.team,
    matches: season.matches.length,
    record: { wins, draws, losses },
    goals: { scored: goalsFor, conceded: goalsAgainst, difference: goalsFor - goalsAgainst },
    discipline: { yellowCards: totalYellow, redCards: totalRed },
    leaders: {
      topScorer: topScorer && topScorer.goals > 0 ? { name: topScorer.name, goals: topScorer.goals } : null,
      topAssistant:
        topAssistant && topAssistant.assists > 0 ? { name: topAssistant.name, assists: topAssistant.assists } : null,
    },
  };
}
