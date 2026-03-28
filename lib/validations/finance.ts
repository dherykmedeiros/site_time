import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Tipo deve ser INCOME ou EXPENSE",
  }),
  amount: z.number().positive("Valor deve ser maior que 0"),
  description: z
    .string()
    .min(2, "Descrição deve ter no mínimo 2 caracteres")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  category: z.enum(
    ["MEMBERSHIP", "FRIENDLY_FEE", "VENUE_RENTAL", "REFEREE", "EQUIPMENT", "OTHER"],
    { message: "Categoria inválida" }
  ),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Data inválida")
    .refine(
      (val) => new Date(val) <= new Date(),
      "Data não pode ser no futuro"
    ),
});

export const updateTransactionSchema = z.object({
  type: z
    .enum(["INCOME", "EXPENSE"], { message: "Tipo deve ser INCOME ou EXPENSE" })
    .optional(),
  amount: z
    .number()
    .positive("Valor deve ser maior que 0")
    .optional(),
  description: z
    .string()
    .min(2, "Descrição deve ter no mínimo 2 caracteres")
    .max(200, "Descrição deve ter no máximo 200 caracteres")
    .optional(),
  category: z
    .enum(
      ["MEMBERSHIP", "FRIENDLY_FEE", "VENUE_RENTAL", "REFEREE", "EQUIPMENT", "OTHER"],
      { message: "Categoria inválida" }
    )
    .optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Data inválida")
    .optional(),
});

export const summaryQuerySchema = z.object({
  month: z.coerce.number().int().min(1, "Mês deve ser 1-12").max(12, "Mês deve ser 1-12"),
  year: z.coerce.number().int().min(2000, "Ano inválido").max(2100, "Ano inválido"),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type SummaryQueryInput = z.infer<typeof summaryQuerySchema>;
