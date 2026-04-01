import { z } from "zod";

export const matchAvailabilityQuerySchema = z.object({
  date: z
    .string()
    .trim()
    .min(1, "Data obrigatória")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Data inválida"),
});

export type MatchAvailabilityQueryInput = z.infer<typeof matchAvailabilityQuerySchema>;