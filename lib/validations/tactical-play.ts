import { z } from "zod";

export const tacticalPlayerMoveSchema = z.object({
  label: z.string().min(1, "Label é obrigatório"),
  position: z.string().min(1, "Posição é obrigatória"),
  startX: z.number().min(0).max(100),
  startY: z.number().min(0).max(100),
  waypoints: z
    .array(
      z.object({
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
      })
    )
    .default([]),
  endX: z.number().min(0).max(100),
  endY: z.number().min(0).max(100),
  role: z.enum(["runner", "passer", "target", "decoy"]),
});

export const tacticalPlayMovementsSchema = z.object({
  formation: z.string().min(1),
  players: z.array(tacticalPlayerMoveSchema).min(1, "Pelo menos 1 jogador é necessário").max(11, "Máximo de 11 jogadores"),
});

export const baseTacticalPlaySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100),
  description: z.string().max(500).optional(),
  category: z.enum(["CORNER_KICK", "FREE_KICK", "THROW_IN", "GOAL_KICK", "PENALTY", "GENERAL"]),
  movements: tacticalPlayMovementsSchema,
});

export const createTacticalPlaySchema = baseTacticalPlaySchema.extend({
  category: z.enum(["CORNER_KICK", "FREE_KICK", "THROW_IN", "GOAL_KICK", "PENALTY", "GENERAL"]).default("CORNER_KICK"),
});

export const updateTacticalPlaySchema = baseTacticalPlaySchema.partial();

export type TacticalPlayerMove = z.infer<typeof tacticalPlayerMoveSchema>;
export type TacticalPlayMovements = z.infer<typeof tacticalPlayMovementsSchema>;
export type CreateTacticalPlayInput = z.input<typeof createTacticalPlaySchema>;
export type UpdateTacticalPlayInput = z.input<typeof updateTacticalPlaySchema>;
