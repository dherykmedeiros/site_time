import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin, requireAuth } from "@/lib/auth";
import { punishmentTypeSchema } from "@/lib/validations/punishment";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/teams/punishment-types — List all punishment types for the team (Anyone authenticated can see)
export const GET = withErrorHandler(async () => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  let types = await prisma.punishmentType.findMany({
    where: { teamId },
    orderBy: { createdAt: "asc" },
  });

  // Auto-seed defaults ("Advertência" and "Suspensão") if they don't exist yet
  if (types.length === 0) {
    await prisma.punishmentType.createMany({
      data: [
        {
          name: "Advertência",
          description: "Advertência padrão por indisciplina",
          severity: "WARNING",
          teamId,
        },
        {
          name: "Suspensão",
          description: "Suspensão padrão de partidas",
          severity: "SUSPENSION",
          teamId,
        },
      ],
      skipDuplicates: true,
    });

    types = await prisma.punishmentType.findMany({
      where: { teamId },
      orderBy: { createdAt: "asc" },
    });
  }

  return NextResponse.json({ punishmentTypes: types });
});

// POST /api/teams/punishment-types — Create a new punishment type (ADMIN/COACH)
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
  const parsed = punishmentTypeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, description, severity } = parsed.data;

  // Check if type name already exists for this team (case-insensitive checking in app logic or lower unique db key)
  const existing = await prisma.punishmentType.findFirst({
    where: {
      teamId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: `Já existe um tipo de punição cadastrado com o nome "${name}"` },
      { status: 400 }
    );
  }

  const newType = await prisma.punishmentType.create({
    data: {
      teamId,
      name,
      description: description || null,
      severity,
    },
  });

  return NextResponse.json({ punishmentType: newType }, { status: 201 });
});
