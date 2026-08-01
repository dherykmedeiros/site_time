import { z } from "zod";

export const matchTypeEnum = z.enum(["FRIENDLY", "CHAMPIONSHIP"]);
export const rsvpStatusEnum = z.enum(["PENDING", "CONFIRMED", "DECLINED"]);
export const liveEventTypeEnum = z.enum([
  "GOAL",
  "ASSIST",
  "YELLOW_CARD",
  "RED_CARD",
  "SUBSTITUTION",
]);

export const createMatchSchema = z.object({
  teamId: z.string().min(1, "ID do time é obrigatório"),
  opponent: z.string().min(1, "Nome do adversário é obrigatório"),
  opponentBadgeUrl: z.string().optional().nullable(),
  venue: z.string().min(1, "Local do jogo é obrigatório"),
  date: z.string().or(z.date()).transform((val) => new Date(val)),
  type: matchTypeEnum.default("FRIENDLY"),
  isHome: z.boolean().default(true),
  hasCharge: z.boolean().default(false),
  chargeAmount: z.number().nonnegative().optional().nullable(),
  pixKey: z.string().optional().nullable(),
  seasonId: z.string().optional().nullable(),
});

export type CreateMatchInput = z.infer<typeof createMatchSchema>;

export const updateRsvpSchema = z.object({
  matchId: z.string().min(1, "ID da partida é obrigatório"),
  playerId: z.string().min(1, "ID do jogador é obrigatório"),
  status: rsvpStatusEnum,
});

export type UpdateRsvpInput = z.infer<typeof updateRsvpSchema>;

export const createMatchLiveEventSchema = z.object({
  matchId: z.string().min(1, "ID da partida é obrigatório"),
  matchLiveId: z.string().min(1, "ID do placar ao vivo é obrigatório"),
  type: liveEventTypeEnum,
  minute: z.number().int().min(0, "Minuto deve ser maior ou igual a 0"),
  half: z.number().int().min(1).max(2, "Tempo deve ser 1 ou 2"),
  playerId: z.string().optional().nullable(),
  guestPlayerId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  teamIsScorer: z.boolean().default(true), // Indica se o gol/evento foi do time da casa (nosso time) ou do adversário
});

export type CreateMatchLiveEventInput = z.infer<typeof createMatchLiveEventSchema>;
