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
  fineAmount: z.coerce
    .number()
    .min(0, "O valor deve ser maior ou igual a zero")
    .optional()
    .nullable(),
});

export type RuleInput = z.infer<typeof ruleSchema>;
