import { z } from "zod";
import { playerPositions } from "@/lib/player-positions";
import { isSafeUrl } from "@/lib/utils";

export const createPlayerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  position: z.enum(playerPositions, {
    message: "Posição inválida",
  }),
  shirtNumber: z
    .number()
    .int("Número deve ser inteiro")
    .min(1, "Número da camisa deve ser entre 1 e 99")
    .max(99, "Número da camisa deve ser entre 1 e 99"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
});

export const updatePlayerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  position: z
    .enum(playerPositions, {
      message: "Posição inválida",
    })
    .optional(),
  shirtNumber: z
    .number()
    .int("Número deve ser inteiro")
    .min(1, "Número da camisa deve ser entre 1 e 99")
    .max(99, "Número da camisa deve ser entre 1 e 99")
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const invitePlayerSchema = z.object({
  playerId: z.string().cuid("ID do jogador inválido"),
  email: z
    .string()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
});

const playerPhotoUrlSchema = z
  .string()
  .max(2048, "URL da foto muito longa")
  .refine(
    (value) => isSafeUrl(value),
    "URL da foto inválida ou domínio não permitido"
  );

export const updateOwnPlayerProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Nome completo deve ter no mínimo 2 caracteres")
      .max(120, "Nome completo deve ter no máximo 120 caracteres")
      .nullable()
      .optional(),
    photoUrl: playerPhotoUrlSchema.nullable().optional(),
    age: z
      .number()
      .int("Idade deve ser um número inteiro")
      .min(10, "Idade mínima é 10")
      .max(99, "Idade máxima é 99")
      .nullable()
      .optional(),
    phone: z
      .string()
      .trim()
      .min(8, "Telefone inválido")
      .max(30, "Telefone deve ter no máximo 30 caracteres")
      .nullable()
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, "Descrição deve ter no máximo 500 caracteres")
      .nullable()
      .optional(),
  })
  .strict();

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
export type InvitePlayerInput = z.infer<typeof invitePlayerSchema>;
export type UpdateOwnPlayerProfileInput = z.infer<typeof updateOwnPlayerProfileSchema>;
