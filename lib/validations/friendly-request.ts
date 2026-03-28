import { z } from "zod";

export const createFriendlyRequestSchema = z.object({
  teamSlug: z.string().min(1, "Slug do time é obrigatório"),
  requesterTeamName: z
    .string()
    .min(2, "Nome do time deve ter no mínimo 2 caracteres")
    .max(100, "Nome do time deve ter no máximo 100 caracteres"),
  contactEmail: z.string().email("E-mail inválido"),
  contactPhone: z
    .string()
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .optional()
    .nullable(),
  suggestedDates: z
    .string()
    .min(5, "Datas sugeridas devem ter no mínimo 5 caracteres")
    .max(500, "Datas sugeridas devem ter no máximo 500 caracteres"),
  suggestedVenue: z
    .string()
    .max(200, "Local sugerido deve ter no máximo 200 caracteres")
    .optional()
    .nullable(),
  proposedFee: z
    .number()
    .min(0, "Valor deve ser >= 0")
    .optional()
    .nullable(),
});

export const processFriendlyRequestSchema = z.object({
  action: z.enum(["approve", "reject"], {
    message: "Ação deve ser 'approve' ou 'reject'",
  }),
  matchDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Data inválida")
    .optional(),
  matchVenue: z
    .string()
    .max(200, "Local deve ter no máximo 200 caracteres")
    .optional(),
  rejectionReason: z
    .string()
    .max(500, "Motivo deve ter no máximo 500 caracteres")
    .optional(),
});

export type CreateFriendlyRequestInput = z.infer<typeof createFriendlyRequestSchema>;
export type ProcessFriendlyRequestInput = z.infer<typeof processFriendlyRequestSchema>;
