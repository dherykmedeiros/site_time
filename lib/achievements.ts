import { prisma } from "@/lib/prisma";

/**
 * Award achievements for all players who participated in a match.
 * Called after match stats are saved (POST /api/matches/:id/stats).
 * De-duplicates: never creates the same achievement type twice for the same match+player.
 */
export async function awardAchievements(matchId: string): Promise<void> {
  const stats = await prisma.matchStats.findMany({
    where: { matchId },
    include: { player: { select: { id: true } } },
  });

  if (stats.length === 0) return;

  const toCreate: Array<{
    playerId: string;
    type: "HAT_TRICK" | "TOP_SCORER_ROUND" | "VETERAN" | "ASSIST_MASTER" | "FULL_ATTENDANCE_MONTH";
    matchId: string;
  }> = [];

  // Determine TOP_SCORER_ROUND: highest goals in this match (only if > 0)
  const maxGoals = Math.max(...stats.map((s) => s.goals));
  const topScorers = maxGoals > 0 ? stats.filter((s) => s.goals === maxGoals) : [];

  for (const stat of stats) {
    // HAT_TRICK: 3+ goals in a single match
    if (stat.goals >= 3) {
      toCreate.push({ playerId: stat.playerId, type: "HAT_TRICK", matchId });
    }

    // TOP_SCORER_ROUND: most goals in this match
    if (topScorers.some((s) => s.playerId === stat.playerId)) {
      toCreate.push({ playerId: stat.playerId, type: "TOP_SCORER_ROUND", matchId });
    }

    // ASSIST_MASTER: 3+ assists in a single match
    if (stat.assists >= 3) {
      toCreate.push({ playerId: stat.playerId, type: "ASSIST_MASTER", matchId });
    }
  }

  // VETERAN: players reaching 50 total match appearances (career milestone — fire once)
  const playerIds = stats.map((s) => s.playerId);
  const careerCounts = await prisma.matchStats.groupBy({
    by: ["playerId"],
    where: { playerId: { in: playerIds } },
    _count: { id: true },
  });

  for (const entry of careerCounts) {
    if ((entry._count.id) >= 50) {
      // Only award once — check existing
      const existing = await prisma.achievement.findFirst({
        where: { playerId: entry.playerId, type: "VETERAN" },
      });
      if (!existing) {
        toCreate.push({ playerId: entry.playerId, type: "VETERAN", matchId });
      }
    }
  }

  if (toCreate.length === 0) return;

  // Avoid duplicate match+player+type
  const existingMatchAchievements = await prisma.achievement.findMany({
    where: {
      matchId,
      playerId: { in: playerIds },
    },
    select: { playerId: true, type: true },
  });

  const existingKeys = new Set(
    existingMatchAchievements.map((a) => `${a.playerId}:${a.type}`)
  );

  const newAchievements = toCreate.filter(
    (a) => !existingKeys.has(`${a.playerId}:${a.type}`)
  );

  if (newAchievements.length > 0) {
    await prisma.achievement.createMany({ data: newAchievements });
  }
}
