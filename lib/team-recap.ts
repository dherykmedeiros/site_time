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
          guestPlayer: {
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
            playerId: topScorer.player?.id ?? topScorer.guestPlayer?.id ?? "guest",
            playerName: topScorer.player?.name ?? topScorer.guestPlayer?.name ?? "Convidado",
            goals: topScorer.goals,
          }
        : null,
      topAssistant: topAssistant
        ? {
            playerId: topAssistant.player?.id ?? topAssistant.guestPlayer?.id ?? "guest",
            playerName: topAssistant.player?.name ?? topAssistant.guestPlayer?.name ?? "Convidado",
            assists: topAssistant.assists,
          }
        : null,
    },
  };
}

export async function buildTeamPregameRecap(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      date: true,
      opponent: true,
      isHome: true,
      venue: true,
      opponentBadgeUrl: true,
      status: true,
      type: true,
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
      rsvps: {
        select: {
          status: true,
          player: {
            select: {
              name: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!match || match.status !== "SCHEDULED") {
    return null;
  }

  const confirmedPlayers = match.rsvps
    .filter((r) => r.status === "CONFIRMED")
    .map((r) => ({
      name: r.player?.name || "Jogador",
      position: r.player?.position || "N/A",
    }));

  const pendingPlayersCount = match.rsvps.filter((r) => r.status === "PENDING").length;
  const declinedPlayersCount = match.rsvps.filter((r) => r.status === "DECLINED").length;

  // Recent form of the team (last 5 matches before this one)
  const recentMatches = await prisma.match.findMany({
    where: {
      teamId: match.team.id,
      status: "COMPLETED",
      homeScore: { not: null },
      awayScore: { not: null },
      date: { lt: match.date },
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

  // Top scorer of the team overall to display as featured
  const statsGroup = await prisma.matchStats.groupBy({
    by: ["playerId"],
    where: {
      player: { teamId: match.team.id },
      playerId: { not: null },
    },
    _sum: {
      goals: true,
    },
    orderBy: {
      _sum: {
        goals: "desc",
      },
    },
    take: 1,
  });

  let topScorer = null;
  if (statsGroup.length > 0 && statsGroup[0].playerId) {
    const player = await prisma.player.findUnique({
      where: { id: statsGroup[0].playerId },
      select: { name: true },
    });
    if (player) {
      topScorer = {
        name: player.name,
        goals: statsGroup[0]._sum.goals ?? 0,
      };
    }
  }

  return {
    match: {
      id: match.id,
      date: match.date,
      opponent: match.opponent,
      isHome: match.isHome,
      venue: match.venue,
      opponentBadgeUrl: match.opponentBadgeUrl,
      type: match.type,
    },
    team: match.team,
    attendance: {
      confirmed: confirmedPlayers,
      confirmedCount: confirmedPlayers.length,
      pendingCount: pendingPlayersCount,
      declinedCount: declinedPlayersCount,
    },
    recentForm,
    topScorer,
  };
}
