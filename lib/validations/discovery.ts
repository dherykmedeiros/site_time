import { z } from "zod";

const optionalShortText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} inválido`)
    .max(max, `${label} deve ter no máximo ${max} caracteres`)
    .optional();

export const teamFieldTypeSchema = z.enum([
  "GRASS",
  "SYNTHETIC",
  "FUTSAL",
  "SOCIETY",
  "OTHER",
]);

export const teamCompetitiveLevelSchema = z.enum([
  "CASUAL",
  "INTERMEDIATE",
  "COMPETITIVE",
]);

export const openMatchSlotStatusSchema = z.enum(["OPEN", "BOOKED", "CLOSED"]);

export const updateTeamDiscoverySchema = z
  .object({
    city: optionalShortText(80, "Cidade").nullable(),
    region: optionalShortText(80, "Região").nullable(),
    fieldType: teamFieldTypeSchema.optional().nullable(),
    competitiveLevel: teamCompetitiveLevelSchema.optional().nullable(),
    publicDirectoryOptIn: z.boolean().optional(),
  })
  .strict();

export const createOpenSlotSchema = z
  .object({
    date: z.string().datetime({ offset: true }),
    timeLabel: optionalShortText(60, "Faixa de horário").nullable(),
    venueLabel: optionalShortText(120, "Local").nullable(),
    notes: optionalShortText(280, "Observações").nullable(),
  })
  .strict();

export const updateOpenSlotSchema = z
  .object({
    id: z.string().min(1).max(64),
    date: z.string().datetime({ offset: true }).optional(),
    timeLabel: optionalShortText(60, "Faixa de horário").nullable().optional(),
    venueLabel: optionalShortText(120, "Local").nullable().optional(),
    notes: optionalShortText(280, "Observações").nullable().optional(),
    status: openMatchSlotStatusSchema.optional(),
  })
  .strict();

export const discoveryQuerySchema = z
  .object({
    q: z.string().trim().min(1).max(100).optional(),
    city: z.string().trim().min(1).max(80).optional(),
    region: z.string().trim().min(1).max(80).optional(),
    fieldType: teamFieldTypeSchema.optional(),
    weekday: z
      .union([z.literal("0"), z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.literal("5"), z.literal("6")])
      .optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
  })
  .strict();

export type UpdateTeamDiscoveryInput = z.infer<typeof updateTeamDiscoverySchema>;
export type CreateOpenSlotInput = z.infer<typeof createOpenSlotSchema>;
export type UpdateOpenSlotInput = z.infer<typeof updateOpenSlotSchema>;
export type DiscoveryQueryInput = z.infer<typeof discoveryQuerySchema>;
