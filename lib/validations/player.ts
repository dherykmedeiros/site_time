import { z } from "zod";
import { playerPositions } from "@/lib/player-positions";

export const createPlayerSchema = z.object({
  name: z
    .string()
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

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
export type InvitePlayerInput = z.infer<typeof invitePlayerSchema>;
