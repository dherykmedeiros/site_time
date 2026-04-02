import { z } from "zod";

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
const badgeUrlSchema = z
  .string()
  .max(2048, "URL do escudo muito longa")
  .refine(
    (value) => value.startsWith("/uploads/") || value.startsWith("http://") || value.startsWith("https://"),
    "URL do escudo inválida"
  );

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  shortName: z
    .string()
    .trim()
    .min(2, "Sigla deve ter no mínimo 2 caracteres")
    .max(6, "Sigla deve ter no máximo 6 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "Sigla deve conter apenas letras e números")
    .optional(),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  primaryColor: z
    .string()
    .regex(hexColorRegex, "Cor primária deve estar no formato #RRGGBB")
    .optional(),
  secondaryColor: z
    .string()
    .regex(hexColorRegex, "Cor secundária deve estar no formato #RRGGBB")
    .optional(),
  defaultVenue: z
    .string()
    .max(200, "Local padrão deve ter no máximo 200 caracteres")
    .optional(),
  badgeUrl: badgeUrlSchema.optional(),
});

export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  shortName: z
    .string()
    .trim()
    .min(2, "Sigla deve ter no mínimo 2 caracteres")
    .max(6, "Sigla deve ter no máximo 6 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "Sigla deve conter apenas letras e números")
    .optional()
    .nullable(),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  primaryColor: z
    .string()
    .regex(hexColorRegex, "Cor primária deve estar no formato #RRGGBB")
    .optional(),
  secondaryColor: z
    .string()
    .regex(hexColorRegex, "Cor secundária deve estar no formato #RRGGBB")
    .optional(),
  defaultVenue: z
    .string()
    .max(200, "Local padrão deve ter no máximo 200 caracteres")
    .optional(),
  badgeUrl: badgeUrlSchema.optional().nullable(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
