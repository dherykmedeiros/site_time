import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { ruleSchema } from "@/lib/validations/rule";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/rules — list all rules for the team (Anyone authenticated can see)
export const GET = withErrorHandler(async () => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const rules = await prisma.rule.findMany({
    where: { teamId: session.user.teamId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ rules });
});

// POST /api/rules — create a new rule (ADMIN only)
export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const ip = extractClientIp(request);
  const rl = await rateLimitMutation(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${rl.retryAfterMinutes} min.`, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = ruleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { title, description, fineAmount } = parsed.data;

  const rule = await prisma.rule.create({
    data: {
      teamId: session.user.teamId,
      title,
      description,
      fineAmount: fineAmount !== undefined && fineAmount !== null ? fineAmount : null,
    },
  });

  return NextResponse.json({ rule }, { status: 201 });
});
