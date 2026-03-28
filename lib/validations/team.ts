import { z } from "zod";

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
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
});

export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
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
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
