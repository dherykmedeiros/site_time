import { prisma } from "@/lib/prisma";
import { trackOperationalEvent } from "@/lib/telemetry";
import { Prisma } from "@prisma/client";
import {
  createTacticalPlaySchema,
  updateTacticalPlaySchema,
  type CreateTacticalPlayInput,
  type UpdateTacticalPlayInput,
} from "@/lib/validations/tactical-play";

/**
 * Creates a new tactical play.
 */
export async function createTacticalPlay(input: CreateTacticalPlayInput & { teamId: string; createdById: string }) {
  const data = createTacticalPlaySchema.parse(input);

  const play = await prisma.tacticalPlay.create({
    data: {
      name: data.name,
      description: data.description || null,
      category: data.category,
      movements: data.movements as Prisma.InputJsonValue,
      teamId: input.teamId,
      createdById: input.createdById,
    },
  });

  trackOperationalEvent("tactical_play_created", {
    id: play.id,
    teamId: play.teamId,
    name: play.name,
    category: play.category,
  });

  return play;
}

/**
 * Lists all tactical plays for a team, optionally filtered by category.
 */
export async function listTacticalPlays(teamId: string, category?: string) {
  return prisma.tacticalPlay.findMany({
    where: {
      teamId,
      ...(category ? { category } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Updates a tactical play ensuring it belongs to the specified team.
 */
export async function updateTacticalPlay(id: string, teamId: string, input: UpdateTacticalPlayInput) {
  const data = updateTacticalPlaySchema.parse(input);

  const play = await prisma.tacticalPlay.findFirst({
    where: { id, teamId },
  });

  if (!play) {
    return null;
  }

  const updated = await prisma.tacticalPlay.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description || null } : {}),
      ...(data.category ? { category: data.category } : {}),
      ...(data.movements ? { movements: data.movements as Prisma.InputJsonValue } : {}),
    },
  });

  trackOperationalEvent("tactical_play_updated", {
    id: updated.id,
    teamId,
    name: updated.name,
    category: updated.category,
  });

  return updated;
}

/**
 * Deletes a tactical play ensuring it belongs to the specified team.
 */
export async function deleteTacticalPlay(id: string, teamId: string) {
  const deleteResult = await prisma.tacticalPlay.deleteMany({
    where: { id, teamId },
  });

  const deleted = deleteResult.count > 0;

  if (deleted) {
    trackOperationalEvent("tactical_play_deleted", {
      id,
      teamId,
    });
  }

  return { deleted };
}
