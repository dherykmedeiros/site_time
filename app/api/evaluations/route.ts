import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin, requireAuth } from "@/lib/auth";
import { evaluationSchema } from "@/lib/validations/evaluation";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/evaluations — List evaluations for the team (ADMIN/COACH can see all, PLAYER sees their own)
export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const isCoachOrAdmin = session.user.role === "ADMIN" || session.user.role === "COACH";

  let targetPlayerId = searchParams.get("playerId") || undefined;

  // If user is a regular player, force filtering to their own linked playerId
  if (!isCoachOrAdmin) {
    if (!session.user.playerId) {
      return NextResponse.json({ evaluations: [] });
    }
    targetPlayerId = session.user.playerId;
  }

  const evaluations = await prisma.playerEvaluation.findMany({
    where: {
      teamId: session.user.teamId,
      ...(targetPlayerId && { playerId: targetPlayerId }),
    },
    orderBy: { date: "desc" },
    include: {
      player: {
        select: {
          id: true,
          name: true,
          position: true,
          secondaryPosition: true,
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

  return NextResponse.json({ evaluations });
});

// POST /api/evaluations — Create a new evaluation for a player (ADMIN/COACH only)
export const POST = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireCoachOrAdmin();
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

  const evaluation = await prisma.playerEvaluation.create({
    data: {
      teamId: session.user.teamId,
      playerId,
      evaluatorId: session.user.id,
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

  return NextResponse.json({ evaluation }, { status: 201 });
});
