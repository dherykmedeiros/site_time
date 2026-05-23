import { z } from "zod";

export const punishmentTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome do tipo deve ter no mínimo 2 caracteres")
    .max(50, "O nome do tipo deve ter no máximo 50 caracteres"),
  description: z.string().trim().max(200, "A descrição deve ter no máximo 200 caracteres").optional().nullable(),
  severity: z.enum(["WARNING", "SUSPENSION"], {
    message: "Gravidade inválida. Escolha Advertência ou Suspensão.",
  }),
});

export const punishmentAccumulationRuleSchema = z.object({
  sourceTypeId: z.string().min(1, "Selecione o tipo de punição de origem"),
  accumulateCount: z.coerce
    .number()
    .int("Deve ser um número inteiro")
    .min(1, "A contagem deve ser de no mínimo 1"),
  targetTypeId: z.string().min(1, "Selecione o tipo de punição de destino"),
  targetMatches: z.coerce
    .number()
    .int("Deve ser um número inteiro")
    .min(1, "Os jogos de suspensão devem ser no mínimo 1")
    .optional()
    .nullable(),
  expiryDays: z.coerce
    .number()
    .int("Deve ser um número inteiro")
    .min(1, "A janela de expiração deve ser de no mínimo 1 dia")
    .optional()
    .nullable(),
});

export type PunishmentTypeInput = z.infer<typeof punishmentTypeSchema>;
export type PunishmentAccumulationRuleInput = z.infer<typeof punishmentAccumulationRuleSchema>;
