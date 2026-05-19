import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { fineSchema } from "@/lib/validations/fine";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/fines — list all punishments (fines) for the team (Anyone authenticated can see)
export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId") || undefined;
  const status = searchParams.get("status") || undefined; // ACTIVE, SERVED, CANCELLED

  const fines = await prisma.fine.findMany({
    where: {
      teamId: session.user.teamId,
      ...(playerId && { playerId }),
      ...(status && { status }),
    },
    orderBy: { date: "desc" },
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
    },
  });

  return NextResponse.json({ fines });
});

// POST /api/fines — apply a new punishment (fine) for a player (ADMIN only)
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
  const parsed = fineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { playerId, ruleId, description, severity, matchesSuspended, status = "ACTIVE", date } = parsed.data;

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

  const teamId = session.user.teamId;

  const fine = await prisma.fine.create({
    data: {
      teamId,
      playerId,
      ruleId: ruleId || null,
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
    },
  });

  return NextResponse.json({ fine }, { status: 201 });
});
