import { prisma } from "@/lib/prisma";

export async function buildTeamRecap(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      date: true,
      opponent: true,
      status: true,
      homeScore: true,
      awayScore: true,
      team: {
        select: {
          id: true,
          name: true,
          primaryColor: true,
          secondaryColor: true,
          badgeUrl: true,
        },
      },
      matchStats: {
        select: {
          goals: true,
          assists: true,
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

  return {
    match: {
      id: match.id,
      date: match.date,
      opponent: match.opponent,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    },
    team: match.team,
    totals: {
      goals: totalGoals,
      assists: totalAssists,
      playersWithStats: match.matchStats.length,
    },
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
