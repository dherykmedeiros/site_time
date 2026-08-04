import { prisma } from "@/lib/prisma";

/**
 * Garante que todos os jogadores ativos do time possuam registros de RSVP (PENDING)
 * para todas as partidas agendadas (SCHEDULED) do time.
 */
export async function syncMissingRSVPsForTeam(teamId: string): Promise<number> {
  if (!teamId) return 0;

  const [activePlayers, scheduledMatches] = await Promise.all([
    prisma.player.findMany({
      where: { teamId, status: "ACTIVE" },
      select: { id: true },
    }),
    prisma.match.findMany({
      where: { teamId, status: "SCHEDULED" },
      select: { id: true, type: true },
    }),
  ]);

  if (activePlayers.length === 0 || scheduledMatches.length === 0) {
    return 0;
  }

  const existingRsvps = await prisma.rSVP.findMany({
    where: {
      matchId: { in: scheduledMatches.map((m) => m.id) },
      playerId: { in: activePlayers.map((p) => p.id) },
    },
    select: { matchId: true, playerId: true },
  });

  const existingSet = new Set(
    existingRsvps.map((r) => `${r.matchId}_${r.playerId}`)
  );

  const rsvpsToCreate: Array<{
    matchId: string;
    playerId: string;
    status: "PENDING";
    summoned: boolean;
  }> = [];

  for (const match of scheduledMatches) {
    for (const player of activePlayers) {
      if (!existingSet.has(`${match.id}_${player.id}`)) {
        rsvpsToCreate.push({
          matchId: match.id,
          playerId: player.id,
          status: "PENDING",
          summoned: match.type === "FRIENDLY",
        });
      }
    }
  }

  if (rsvpsToCreate.length > 0) {
    const result = await prisma.rSVP.createMany({
      data: rsvpsToCreate,
      skipDuplicates: true,
    });
    return result.count;
  }

  return 0;
}
