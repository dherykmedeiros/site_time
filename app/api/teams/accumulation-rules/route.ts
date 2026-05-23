import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin, requireAuth } from "@/lib/auth";
import { punishmentAccumulationRuleSchema } from "@/lib/validations/punishment";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/teams/accumulation-rules — List all accumulation rules for the team (Anyone authenticated can see)
export const GET = withErrorHandler(async () => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const rules = await prisma.punishmentAccumulationRule.findMany({
    where: { teamId },
    include: {
      sourceType: {
        select: {
          id: true,
          name: true,
          severity: true,
        },
      },
      targetType: {
        select: {
          id: true,
          name: true,
          severity: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ accumulationRules: rules });
});

// POST /api/teams/accumulation-rules — Create or update an accumulation rule (ADMIN/COACH)
export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
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
  const parsed = punishmentAccumulationRuleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { sourceTypeId, accumulateCount, targetTypeId, targetMatches, expiryDays } = parsed.data;

  // Verify both source and target types belong to this team
  const [sourceExists, targetExists] = await Promise.all([
    prisma.punishmentType.findFirst({ where: { id: sourceTypeId, teamId } }),
    prisma.punishmentType.findFirst({ where: { id: targetTypeId, teamId } }),
  ]);

  if (!sourceExists) {
    return NextResponse.json({ error: "Tipo de punição de origem não encontrado" }, { status: 404 });
  }

  if (!targetExists) {
    return NextResponse.json({ error: "Tipo de punição de destino não encontrado" }, { status: 404 });
  }

  if (sourceTypeId === targetTypeId) {
    return NextResponse.json(
      { error: "O tipo de punição de origem não pode ser igual ao tipo de punição de destino." },
      { status: 400 }
    );
  }

  // Create or Update using upsert based on teamId and sourceTypeId
  const rule = await prisma.punishmentAccumulationRule.upsert({
    where: {
      teamId_sourceTypeId: {
        teamId,
        sourceTypeId,
      },
    },
    update: {
      accumulateCount,
      targetTypeId,
      targetMatches: targetExists.severity === "SUSPENSION" ? (targetMatches || 1) : null,
      expiryDays: expiryDays || null,
    },
    create: {
      teamId,
      sourceTypeId,
      accumulateCount,
      targetTypeId,
      targetMatches: targetExists.severity === "SUSPENSION" ? (targetMatches || 1) : null,
      expiryDays: expiryDays || null,
    },
    include: {
      sourceType: {
        select: {
          id: true,
          name: true,
        },
      },
      targetType: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json({ accumulationRule: rule }, { status: 201 });
});
