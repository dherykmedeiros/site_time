import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ruleSchema } from "@/lib/validations/rule";
import { withErrorHandler } from "@/lib/api-handler";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/rules/[id] — update an existing rule (ADMIN only)
export const PATCH = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireAdmin();
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

  const { title, description, severity, defaultMatches } = parsed.data;

  const rule = await prisma.rule.update({
    where: { id },
    data: {
      title,
      description,
      severity,
      defaultMatches: severity === "SUSPENSION" && defaultMatches !== undefined && defaultMatches !== null ? defaultMatches : null,
    },
  });

  return NextResponse.json({ rule });
});

// DELETE /api/rules/[id] — delete an existing rule (ADMIN only)
export const DELETE = withErrorHandler(async (request: Request, context: RouteParams) => {
  const { id } = await context.params;
  const { session, error } = await requireAdmin();
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
