import { z } from "zod";

export const createMatchSchema = z.object({
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Data inválida")
    .refine((val) => new Date(val) > new Date(), "Data deve ser no futuro"),
  venue: z
    .string()
    .min(2, "Local deve ter no mínimo 2 caracteres")
    .max(200, "Local deve ter no máximo 200 caracteres"),
  opponent: z
    .string()
    .min(2, "Adversário deve ter no mínimo 2 caracteres")
    .max(100, "Adversário deve ter no máximo 100 caracteres"),
  type: z.enum(["FRIENDLY", "CHAMPIONSHIP"], {
    message: "Tipo inválido",
  }),
});

export const updateMatchSchema = z.object({
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Data inválida")
    .optional(),
  venue: z
    .string()
    .min(2, "Local deve ter no mínimo 2 caracteres")
    .max(200, "Local deve ter no máximo 200 caracteres")
    .optional(),
  opponent: z
    .string()
    .min(2, "Adversário deve ter no mínimo 2 caracteres")
    .max(100, "Adversário deve ter no máximo 100 caracteres")
    .optional(),
  type: z
    .enum(["FRIENDLY", "CHAMPIONSHIP"], {
      message: "Tipo inválido",
    })
    .optional(),
  status: z
    .enum(["CANCELLED"], {
      message: "Apenas CANCELLED é aceito",
    })
    .optional(),
  homeScore: z
    .number()
    .int("Placar deve ser inteiro")
    .min(0, "Placar deve ser >= 0")
    .optional(),
  awayScore: z
    .number()
    .int("Placar deve ser inteiro")
    .min(0, "Placar deve ser >= 0")
    .optional(),
});

export const rsvpResponseSchema = z.object({
  status: z.enum(["CONFIRMED", "DECLINED"], {
    message: "Status deve ser CONFIRMED ou DECLINED",
  }),
});

export const createMatchStatsSchema = z.object({
  stats: z
    .array(
      z.object({
        playerId: z.string().min(1, "ID do jogador obrigatório"),
        goals: z.number().int().min(0, "Gols deve ser >= 0"),
        assists: z.number().int().min(0, "Assistências deve ser >= 0"),
        yellowCards: z
          .number()
          .int()
          .min(0, "Cartões amarelos deve ser >= 0")
          .max(2, "Máximo 2 cartões amarelos"),
        redCards: z
          .number()
          .int()
          .min(0, "Cartões vermelhos deve ser >= 0")
          .max(1, "Máximo 1 cartão vermelho"),
      })
    )
    .min(1, "Pelo menos 1 jogador é necessário"),
});

export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;
export type RsvpResponseInput = z.infer<typeof rsvpResponseSchema>;
export type CreateMatchStatsInput = z.infer<typeof createMatchStatsSchema>;
