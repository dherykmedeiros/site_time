import { prisma } from "@/lib/prisma";

export interface PlayerProfileData {
  player: any;
  allMatchStats: any[];
  confirmedRSVPs: any[];
  membershipPayments: any[];
  matchPayments: any[];
}

/**
 * Busca todos os dados necessários para renderizar o perfil completo de um jogador,
 * incluindo agregados, estatísticas, histórico de jogos, faltas e financeiro.
 * 
 * @param playerId ID do jogador
 * @param teamId ID do time
 */
export async function getPlayerProfileData(playerId: string, teamId: string): Promise<PlayerProfileData | null> {
  const player = await prisma.player.findFirst({
    where: { id: playerId, teamId },
    include: {
      user: { select: { id: true, email: true, role: true } },
      matchStats: {
        include: {
          match: {
            select: { id: true, date: true, opponent: true, homeScore: true, awayScore: true, isHome: true, status: true },
          },
        },
        orderBy: { match: { date: "desc" } },
        take: 10,
      },
      achievements: {
        orderBy: { awardedAt: "desc" },
      },
      fines: {
        where: { status: "ACTIVE" },
        orderBy: { date: "desc" },
      },
      evaluations: {
        orderBy: { date: "desc" },
        take: 1,
      },
      attendances: {
        select: { present: true },
      },
    },
  });

  if (!player) return null;

  // Agrega as estatísticas do jogador de todos os jogos
  const allMatchStats = await prisma.matchStats.findMany({
    where: { playerId, match: { teamId } },
    include: {
      match: { select: { id: true, type: true } },
    },
  });

  // Busca ausências (partidas onde confirmou presença no RSVP mas faltou)
  const confirmedRSVPs = await prisma.rSVP.findMany({
    where: {
      playerId,
      status: "CONFIRMED",
      match: {
        teamId,
        status: "COMPLETED",
      },
    },
    include: {
      match: {
        select: {
          id: true,
          date: true,
          venue: true,
          opponent: true,
          isHome: true,
          homeScore: true,
          awayScore: true,
          type: true,
          attendances: {
            where: { playerId },
            select: { present: true },
          },
        },
      },
    },
    orderBy: {
      match: { date: "desc" },
    },
  });

  // Busca pagamentos de mensalidade (mensalidades)
  const membershipPayments = await prisma.membershipPayment.findMany({
    where: { playerId, teamId },
    orderBy: [
      { year: "desc" },
      { month: "desc" },
    ],
  });

  // Busca pagamentos de taxa de jogos individuais
  const matchPayments = await prisma.matchPayment.findMany({
    where: { playerId, teamId },
    include: {
      match: { select: { date: true, opponent: true } },
    },
    orderBy: { paidAt: "desc" },
  });

  return {
    player,
    allMatchStats,
    confirmedRSVPs,
    membershipPayments,
    matchPayments,
  };
}
