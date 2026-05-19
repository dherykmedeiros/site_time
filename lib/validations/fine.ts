import { z } from "zod";

export const fineSchema = z.object({
  playerId: z.string().min(1, "Selecione o jogador"),
  ruleId: z.string().optional().nullable(),
  description: z
    .string()
    .trim()
    .min(2, "A descrição deve ter no mínimo 2 caracteres")
    .max(200, "A descrição deve ter no máximo 200 caracteres"),
  amount: z.coerce
    .number()
    .min(0.01, "O valor da multa deve ser maior que zero"),
  date: z
    .string()
    .refine((val: string) => !isNaN(Date.parse(val)), "Data inválida"),
  isPaid: z.boolean().optional(),
});

export type FineInput = z.infer<typeof fineSchema>;
