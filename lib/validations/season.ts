import { z } from "zod";

export const createSeasonSchema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório").max(80),
  type: z.enum(["LEAGUE", "CUP", "TOURNAMENT"] as const, {
    error: () => ({ message: "Tipo inválido" }),
  }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional()
    .nullable(),
});

export const updateSeasonSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  type: z.enum(["LEAGUE", "CUP", "TOURNAMENT"]).optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional()
    .nullable(),
  status: z.enum(["ACTIVE", "FINISHED"]).optional(),
});

export type CreateSeasonInput = z.infer<typeof createSeasonSchema>;
export type UpdateSeasonInput = z.infer<typeof updateSeasonSchema>;
