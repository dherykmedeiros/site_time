import { z } from "zod";
import { playerPositions } from "@/lib/player-positions";

const optionalIsoDate = z
  .string()
  .refine((val: string) => !isNaN(Date.parse(val)), "Data inválida")
  .optional();

const positionLimitSchema = z.object({
  position: z.enum(playerPositions, { message: "Posição inválida" }),
  maxPlayers: z
    .number()
    .int("Limite deve ser inteiro")
    .min(0, "Limite deve ser >= 0")
    .max(30, "Limite máximo permitido é 30"),
});

export const createMatchSchema = z.object({
  date: z
    .string()
    .refine((val: string) => !isNaN(Date.parse(val)), "Data inválida")
    .refine((val: string) => new Date(val) > new Date(), "Data deve ser no futuro"),
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
  seasonId: z.string().min(1, "Temporada inválida").optional().nullable(),
  positionLimits: z.array(positionLimitSchema).max(20).optional(),
});

export const updateMatchSchema = z.object({
  date: z
    .string()
    .refine((val: string) => !isNaN(Date.parse(val)), "Data inválida")
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
  seasonId: z.string().min(1, "Temporada inválida").optional().nullable(),
  positionLimits: z.array(positionLimitSchema).max(20).optional(),
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

export const lineupConfidenceSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const lineupSourceSchema = z.enum(["SUGGESTED", "SAVED"]);

export const suggestedLineupEntrySchema = z.object({
  playerId: z.string().min(1, "ID do jogador obrigatório"),
  playerName: z.string().min(1, "Nome do jogador obrigatório"),
  position: z.enum(playerPositions, { message: "Posição inválida" }),
  reason: z.string().min(1, "Motivo obrigatório").max(160, "Motivo muito longo"),
  fieldX: z.number().int().min(8).max(92).nullable().optional(),
  fieldY: z.number().int().min(10).max(88).nullable().optional(),
});

export const suggestedLineupResponseSchema = z.object({
  starters: z.array(suggestedLineupEntrySchema),
  bench: z.array(suggestedLineupEntrySchema),
  alerts: z.array(z.string().min(1).max(160)),
  meta: z.object({
    confirmedPlayers: z.number().int().min(0),
    startersCount: z.number().int().min(0),
    benchCount: z.number().int().min(0),
    usesPositionLimits: z.boolean(),
    confidence: lineupConfidenceSchema,
    source: lineupSourceSchema,
  }),
});

const lineupStarterPlacementSchema = z.object({
  playerId: z.string().cuid("Jogador inválido"),
  fieldX: z.number().int().min(8).max(92).nullable().optional(),
  fieldY: z.number().int().min(10).max(88).nullable().optional(),
});

export const patchMatchLineupSchema = z
  .object({
    starters: z.array(lineupStarterPlacementSchema).max(30),
    bench: z.array(z.string().cuid("Jogador inválido")).max(30),
  })
  .strict()
  .refine((data: { starters: Array<{ playerId: string }>; bench: string[] }) => new Set([...data.starters.map((entry) => entry.playerId), ...data.bench]).size === data.starters.length + data.bench.length, {
    message: "Jogadores duplicados na escalação",
    path: ["starters"],
  });

export const bordereauChecklistItemSchema = z.object({
  label: z.string().trim().min(2, "Checklist inválido").max(80, "Checklist inválido"),
  isChecked: z.boolean(),
  sortOrder: z.number().int().min(0).max(20),
});

export const bordereauAttendanceItemSchema = z.object({
  playerId: z.string().cuid("Jogador inválido"),
  present: z.boolean(),
});

export const patchMatchBordereauSchema = z
  .object({
    checklist: z.array(bordereauChecklistItemSchema).max(12).optional(),
    attendance: z.array(bordereauAttendanceItemSchema).max(50).optional(),
  })
  .strict();

export const bordereauExpenseSchema = z.object({
  id: z.string().min(1),
  amount: z.number().nonnegative(),
  category: z.enum(["FRIENDLY_FEE", "VENUE_RENTAL", "REFEREE", "EQUIPMENT", "OTHER"]),
  description: z.string().min(2).max(200),
  date: z.string().refine((value: string) => !Number.isNaN(Date.parse(value)), "Data inválida"),
  matchId: z.string().cuid().nullable().optional(),
});

export const bordereauResponseSchema = z.object({
  matchId: z.string().min(1),
  checklist: z.array(
    bordereauChecklistItemSchema.extend({
      id: z.string().min(1),
    })
  ),
  attendance: z.array(
    z.object({
      playerId: z.string().min(1),
      playerName: z.string().min(1),
      rsvpStatus: z.enum(["PENDING", "CONFIRMED", "DECLINED"]),
      present: z.boolean(),
      checkedInAt: z.string().nullable(),
    })
  ),
  expenses: z.array(bordereauExpenseSchema),
  costSummary: z.object({
    totalExpense: z.number().nonnegative(),
    presentCount: z.number().int().min(0),
    suggestedSharePerPresent: z.number().nonnegative().nullable(),
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

export const matchListQuerySchema = z
  .object({
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
    type: z.enum(["FRIENDLY", "CHAMPIONSHIP"]).optional(),
    from: optionalIsoDate,
    to: optionalIsoDate,
  })
  .refine(
    (data: { from?: string; to?: string }) => {
      if (!data.from || !data.to) return true;
      return new Date(data.from) <= new Date(data.to);
    },
    {
      message: "Parâmetro 'from' deve ser menor ou igual a 'to'",
      path: ["from"],
    }
  );

export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;
export type RsvpResponseInput = z.infer<typeof rsvpResponseSchema>;
export type CreateMatchStatsInput = z.infer<typeof createMatchStatsSchema>;
export type MatchListQueryInput = z.infer<typeof matchListQuerySchema>;
export type SuggestedLineupEntry = z.infer<typeof suggestedLineupEntrySchema>;
export type SuggestedLineupResponse = z.infer<typeof suggestedLineupResponseSchema>;
export type LineupConfidence = z.infer<typeof lineupConfidenceSchema>;
export type LineupSource = z.infer<typeof lineupSourceSchema>;
export type BordereauResponse = z.infer<typeof bordereauResponseSchema>;
export type PatchMatchBordereauInput = z.infer<typeof patchMatchBordereauSchema>;
export type PatchMatchLineupInput = z.infer<typeof patchMatchLineupSchema>;
