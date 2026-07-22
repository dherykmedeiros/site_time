import { RSVPStatus } from "@prisma/client";

export interface ScoreState {
  homeScore: number;
  awayScore: number;
}

/**
 * Calcula o novo placar com base no gol marcado.
 * @param current Placar atual (homeScore, awayScore)
 * @param isHome Se o nosso time é o mandante na partida
 * @param teamIsScorer Se o gol foi do nosso time (true) ou do adversário (false)
 * @returns Novo estado do placar
 */
export function calculateNewScore(
  current: ScoreState,
  isHome: boolean,
  teamIsScorer: boolean
): ScoreState {
  const isOurGoal = teamIsScorer;
  const isHomeGoal = (isHome && isOurGoal) || (!isHome && !isOurGoal);

  return {
    homeScore: isHomeGoal ? current.homeScore + 1 : current.homeScore,
    awayScore: !isHomeGoal ? current.awayScore + 1 : current.awayScore,
  };
}

/**
 * Valida e determina o novo status de RSVP com log de alteração.
 */
export function processRsvpChange(
  oldStatus: RSVPStatus | null,
  newStatus: RSVPStatus
): { status: RSVPStatus; changed: boolean } {
  if (oldStatus === newStatus) {
    return { status: newStatus, changed: false };
  }
  return { status: newStatus, changed: true };
}
