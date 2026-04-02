import { prisma } from "@/lib/prisma";

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

  const [career, lastFiveMatches, recentAchievements] = await Promise.all([
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
  ]);

  const lastFive = {
    matches: lastFiveMatches.length,
    goals: lastFiveMatches.reduce((sum, item) => sum + item.goals, 0),
    assists: lastFiveMatches.reduce((sum, item) => sum + item.assists, 0),
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
    },
    lastFive,
    achievements: recentAchievements.map((item) => item.type),
  };
}
