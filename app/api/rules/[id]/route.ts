import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin } from "@/lib/auth";
import { ruleSchema } from "@/lib/validations/rule";
import { withErrorHandler } from "@/lib/api-handler";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/rules/[id] — update an existing rule (ADMIN/COACH only)
export const PATCH = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Verify the rule belongs to the team
  const existingRule = await prisma.rule.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existingRule) {
    return NextResponse.json({ error: "Regra não encontrada" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = ruleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { title, description, severity, punishmentTypeId, defaultMatches } = parsed.data;

  // Verify the punishmentTypeId belongs to the team if provided
  let resolvedTypeId = punishmentTypeId || null;
  if (resolvedTypeId) {
    const typeExists = await prisma.punishmentType.findFirst({
      where: { id: resolvedTypeId, teamId: session.user.teamId },
    });
    if (!typeExists) {
      return NextResponse.json({ error: "Tipo de punição não encontrado no time" }, { status: 404 });
    }
  }

  const rule = await prisma.rule.update({
    where: { id },
    data: {
      title,
      description,
      severity,
      punishmentTypeId: resolvedTypeId,
      defaultMatches: severity === "SUSPENSION" && defaultMatches !== undefined && defaultMatches !== null ? defaultMatches : null,
    },
    include: {
      punishmentType: true,
    },
  });

  return NextResponse.json({ rule });
});

// DELETE /api/rules/[id] — delete an existing rule (ADMIN/COACH only)
export const DELETE = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  // Verify the rule belongs to the team
  const existingRule = await prisma.rule.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!existingRule) {
    return NextResponse.json({ error: "Regra não encontrada" }, { status: 404 });
  }

  await prisma.rule.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
});
