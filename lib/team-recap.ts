import { prisma } from "@/lib/prisma";

export async function buildTeamRecap(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      date: true,
      opponent: true,
      isHome: true,
      opponentBadgeUrl: true,
      status: true,
      homeScore: true,
      awayScore: true,
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
      matchStats: {
        select: {
          goals: true,
          assists: true,
          yellowCards: true,
          redCards: true,
          player: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!match || match.status !== "COMPLETED" || match.homeScore == null || match.awayScore == null) {
    return null;
  }

  const topScorer = [...match.matchStats]
    .sort((left, right) => right.goals - left.goals)
    .find((item) => item.goals > 0);

  const topAssistant = [...match.matchStats]
    .sort((left, right) => right.assists - left.assists)
    .find((item) => item.assists > 0);

  const totalGoals = match.matchStats.reduce((sum, item) => sum + item.goals, 0);
  const totalAssists = match.matchStats.reduce((sum, item) => sum + item.assists, 0);
  const totalYellowCards = match.matchStats.reduce((sum, item) => sum + item.yellowCards, 0);
  const totalRedCards = match.matchStats.reduce((sum, item) => sum + item.redCards, 0);

  const recentMatches = await prisma.match.findMany({
    where: {
      teamId: match.team.id,
      status: "COMPLETED",
      homeScore: { not: null },
      awayScore: { not: null },
      date: { lte: match.date },
    },
    select: {
      isHome: true,
      homeScore: true,
      awayScore: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  });

  const recentForm = recentMatches.reduce(
    (acc, item) => {
      const goalsFor = item.isHome ? item.homeScore ?? 0 : item.awayScore ?? 0;
      const goalsAgainst = item.isHome ? item.awayScore ?? 0 : item.homeScore ?? 0;

      if (goalsFor > goalsAgainst) acc.wins += 1;
      else if (goalsFor < goalsAgainst) acc.losses += 1;
      else acc.draws += 1;

      acc.goalsFor += goalsFor;
      acc.goalsAgainst += goalsAgainst;
      acc.matches += 1;
      return acc;
    },
    {
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      matches: 0,
    }
  );

  return {
    match: {
      id: match.id,
      date: match.date,
      opponent: match.opponent,
      isHome: match.isHome,
      opponentBadgeUrl: match.opponentBadgeUrl,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    },
    team: match.team,
    totals: {
      goals: totalGoals,
      assists: totalAssists,
      yellowCards: totalYellowCards,
      redCards: totalRedCards,
      playersWithStats: match.matchStats.length,
    },
    recentForm,
    leaders: {
      topScorer: topScorer
        ? {
            playerId: topScorer.player.id,
            playerName: topScorer.player.name,
            goals: topScorer.goals,
          }
        : null,
      topAssistant: topAssistant
        ? {
            playerId: topAssistant.player.id,
            playerName: topAssistant.player.name,
            assists: topAssistant.assists,
          }
        : null,
    },
  };
}
