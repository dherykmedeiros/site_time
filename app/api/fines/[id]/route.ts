import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin } from "@/lib/auth";
import { fineSchema } from "@/lib/validations/fine";
import { withErrorHandler } from "@/lib/api-handler";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/fines/[id] — update an existing punishment (ADMIN/COACH only)
export const PATCH = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Find existing fine
  const existingFine = await prisma.fine.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existingFine) {
    return NextResponse.json({ error: "Punição não encontrada" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = fineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { playerId, ruleId, punishmentTypeId, description, severity, matchesSuspended, status = "ACTIVE", date } = parsed.data;

  // Verify the player belongs to this team
  const playerExists = await prisma.player.findFirst({
    where: { id: playerId, teamId: session.user.teamId },
  });

  if (!playerExists) {
    return NextResponse.json({ error: "Jogador não encontrado no time" }, { status: 404 });
  }

  // If ruleId is provided, verify it belongs to this team
  if (ruleId) {
    const ruleExists = await prisma.rule.findFirst({
      where: { id: ruleId, teamId: session.user.teamId },
    });
    if (!ruleExists) {
      return NextResponse.json({ error: "Regra não encontrada no time" }, { status: 404 });
    }
  }

  // If punishmentTypeId is provided, verify it belongs to this team
  if (punishmentTypeId) {
    const typeExists = await prisma.punishmentType.findFirst({
      where: { id: punishmentTypeId, teamId: session.user.teamId },
    });
    if (!typeExists) {
      return NextResponse.json({ error: "Tipo de punição não encontrado no time" }, { status: 404 });
    }
  }

  const fine = await prisma.fine.update({
    where: { id },
    data: {
      playerId,
      ruleId: ruleId || null,
      punishmentTypeId: punishmentTypeId || null,
      description,
      severity,
      matchesSuspended: severity === "SUSPENSION" ? matchesSuspended : null,
      status,
      date: new Date(date),
    },
    include: {
      player: {
        select: {
          id: true,
          name: true,
          shirtNumber: true,
        },
      },
      rule: {
        select: {
          id: true,
          title: true,
        },
      },
      punishmentType: true,
    },
  });

  return NextResponse.json({ fine });
});

// DELETE /api/fines/[id] — delete an existing punishment (ADMIN/COACH only)
export const DELETE = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Find existing fine
  const existingFine = await prisma.fine.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existingFine) {
    return NextResponse.json({ error: "Punição não encontrada" }, { status: 404 });
  }

  await prisma.fine.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
});
