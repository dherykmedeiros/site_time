import { prisma } from "@/lib/prisma";

export async function buildPlayerMatchRecap(playerId: string, matchId: string) {
  const [player, stats, attendance] = await Promise.all([
    prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        name: true,
        position: true,
        photoUrl: true,
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
      },
    }),
    prisma.matchStats.findUnique({
      where: { playerId_matchId: { playerId, matchId } },
      select: {
        goals: true,
        assists: true,
        yellowCards: true,
        redCards: true,
        match: {
          select: {
            id: true,
            date: true,
            opponent: true,
            status: true,
            homeScore: true,
            awayScore: true,
            isHome: true,
          },
        },
      },
    }),
    prisma.matchAttendance.findUnique({
      where: { matchId_playerId: { matchId, playerId } },
      select: { present: true },
    }),
  ]);

  if (!player || !stats || stats.match.status !== "COMPLETED") return null;

  return {
    player: { id: player.id, name: player.name, position: player.position, photoUrl: player.photoUrl },
    team: player.team,
    match: {
      id: stats.match.id,
      date: stats.match.date,
      opponent: stats.match.opponent,
      homeScore: stats.match.homeScore,
      awayScore: stats.match.awayScore,
      isHome: stats.match.isHome,
    },
    stats: {
      goals: stats.goals,
      assists: stats.assists,
      yellowCards: stats.yellowCards,
      redCards: stats.redCards,
    },
    present: attendance?.present ?? null,
  };
}

export async function buildPlayerRecap(playerId: string) {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    select: {
      id: true,
      name: true,
      position: true,
      photoUrl: true,
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
    },
  });

  if (!player) {
    return null;
  }

  const [career, lastFiveMatches, recentAchievements, attendancePresent, attendanceTotal] = await Promise.all([
    prisma.matchStats.aggregate({
      where: {
        playerId,
        match: {
          status: "COMPLETED",
        },
      },
      _sum: {
        goals: true,
        assists: true,
        yellowCards: true,
        redCards: true,
      },
      _count: {
        id: true,
      },
    }),
    prisma.matchStats.findMany({
      where: {
        playerId,
        match: {
          status: "COMPLETED",
        },
      },
      orderBy: {
        match: {
          date: "desc",
        },
      },
      take: 5,
      select: {
        goals: true,
        assists: true,
        yellowCards: true,
        redCards: true,
        match: {
          select: {
            date: true,
          },
        },
      },
    }),
    prisma.achievement.findMany({
      where: {
        playerId,
      },
      orderBy: {
        awardedAt: "desc",
      },
      take: 5,
      select: {
        type: true,
      },
    }),
    prisma.matchAttendance.aggregate({
      where: { playerId, present: true },
      _count: { id: true },
    }),
    prisma.matchAttendance.count({
      where: { playerId },
    }),
  ]);

  const lastFive = {
    matches: lastFiveMatches.length,
    goals: lastFiveMatches.reduce((sum, item) => sum + item.goals, 0),
    assists: lastFiveMatches.reduce((sum, item) => sum + item.assists, 0),
    yellowCards: lastFiveMatches.reduce((sum, item) => sum + item.yellowCards, 0),
    redCards: lastFiveMatches.reduce((sum, item) => sum + item.redCards, 0),
  };

  return {
    player: {
      id: player.id,
      name: player.name,
      position: player.position,
      photoUrl: player.photoUrl,
    },
    team: player.team,
    career: {
      matches: career._count.id,
      goals: career._sum.goals ?? 0,
      assists: career._sum.assists ?? 0,
      yellowCards: career._sum.yellowCards ?? 0,
      redCards: career._sum.redCards ?? 0,
    },
    attendance: {
      present: attendancePresent._count.id,
      total: attendanceTotal,
      rate: attendanceTotal > 0 ? Math.round((attendancePresent._count.id / attendanceTotal) * 100) : null,
    },
    lastFive,
    achievements: recentAchievements.map((item) => item.type),
  };
}
