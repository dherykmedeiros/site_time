import { z } from "zod";

export const ruleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "O título deve ter no mínimo 2 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .trim()
    .min(2, "A descrição deve ter no mínimo 2 caracteres")
    .max(500, "A descrição deve ter no máximo 500 caracteres"),
  severity: z.enum(["WARNING", "SUSPENSION"], {
    message: "Gravidade inválida. Escolha Advertência ou Suspensão.",
  }),
  defaultMatches: z.coerce
    .number()
    .int("Deve ser um número inteiro")
    .min(1, "A suspensão deve ser de no mínimo 1 jogo")
    .max(100, "A suspensão máxima permitida é de 100 jogos")
    .optional()
    .nullable(),
});

export type RuleInput = z.infer<typeof ruleSchema>;
