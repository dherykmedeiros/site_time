import { z } from "zod";

export const evaluationSchema = z.object({
  playerId: z.string().min(1, "Selecione o jogador a ser avaliado"),
  content: z
    .string()
    .trim()
    .min(5, "As observações técnicas devem ter no mínimo 5 caracteres")
    .max(1000, "As observações técnicas devem ter no máximo 1000 caracteres"),
  technical: z.coerce
    .number()
    .int()
    .min(1, "A nota mínima é 1")
    .max(5, "A nota máxima é 5"),
  tactical: z.coerce
    .number()
    .int()
    .min(1, "A nota mínima é 1")
    .max(5, "A nota máxima é 5"),
  physical: z.coerce
    .number()
    .int()
    .min(1, "A nota mínima é 1")
    .max(5, "A nota máxima é 5"),
  discipline: z.coerce
    .number()
    .int()
    .min(1, "A nota mínima é 1")
    .max(5, "A nota máxima é 5"),
  date: z
    .string()
    .refine((val: string) => !isNaN(Date.parse(val)), "Data inválida"),
});

export type EvaluationInput = z.infer<typeof evaluationSchema>;
