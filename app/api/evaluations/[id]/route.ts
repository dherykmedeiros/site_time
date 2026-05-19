import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { evaluationSchema } from "@/lib/validations/evaluation";
import { withErrorHandler } from "@/lib/api-handler";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/evaluations/[id] — Update an existing player evaluation (ADMIN only)
export const PATCH = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Find existing evaluation belonging to this team
  const existingEval = await prisma.playerEvaluation.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existingEval) {
    return NextResponse.json({ error: "Avaliação não encontrada" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = evaluationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { playerId, content, technical, tactical, physical, discipline, date } = parsed.data;

  // Verify the player belongs to this team
  const playerExists = await prisma.player.findFirst({
    where: { id: playerId, teamId: session.user.teamId },
  });

  if (!playerExists) {
    return NextResponse.json({ error: "Jogador não encontrado no time" }, { status: 404 });
  }

  const evaluation = await prisma.playerEvaluation.update({
    where: { id },
    data: {
      playerId,
      content,
      technical,
      tactical,
      physical,
      discipline,
      date: new Date(date),
    },
    include: {
      player: {
        select: {
          id: true,
          name: true,
          position: true,
          shirtNumber: true,
        },
      },
      evaluator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ evaluation });
});

// DELETE /api/evaluations/[id] — Delete an existing player evaluation (ADMIN only)
export const DELETE = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Find existing evaluation belonging to this team
  const existingEval = await prisma.playerEvaluation.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existingEval) {
    return NextResponse.json({ error: "Avaliação não encontrada" }, { status: 404 });
  }

  await prisma.playerEvaluation.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
});
