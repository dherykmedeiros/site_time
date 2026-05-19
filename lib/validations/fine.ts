import { z } from "zod";

export const fineSchema = z.object({
  playerId: z.string().min(1, "Selecione o jogador"),
  ruleId: z.string().optional().nullable(),
  description: z
    .string()
    .trim()
    .min(2, "O motivo deve ter no mínimo 2 caracteres")
    .max(200, "O motivo deve ter no máximo 200 caracteres"),
  severity: z.enum(["WARNING", "SUSPENSION"], {
    message: "Gravidade inválida. Escolha Advertência ou Suspensão.",
  }),
  matchesSuspended: z.coerce
    .number()
    .int("Deve ser um número inteiro")
    .min(1, "A suspensão deve ser de no mínimo 1 jogo")
    .max(100, "A suspensão máxima permitida é de 100 jogos")
    .optional()
    .nullable(),
  status: z.enum(["ACTIVE", "SERVED", "CANCELLED"]).optional(),
  date: z
    .string()
    .refine((val: string) => !isNaN(Date.parse(val)), "Data inválida"),
});

export type FineInput = z.infer<typeof fineSchema>;
