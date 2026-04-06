import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { updatePlayerSchema } from "@/lib/validations/player";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/players/:id — Player detail with aggregated stats
export async function GET(request: Request, context: RouteContext) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  const player = await prisma.player.findFirst({
    where: { id, teamId: session.user.teamId },
    include: {
      user: { select: { id: true } },
    },
  });

  if (!player) {
    return NextResponse.json(
      { error: "Jogador não encontrado no time", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  const statsAggregate = await prisma.matchStats.aggregate({
    where: { playerId: id },
    _sum: {
      goals: true,
      assists: true,
      yellowCards: true,
      redCards: true,
    },
    _count: { id: true },
  });

  return NextResponse.json({
    id: player.id,
    name: player.name,
    fullName: player.fullName,
    position: player.position,
    shirtNumber: player.shirtNumber,
    photoUrl: player.photoUrl,
    age: player.age,
    phone: player.phone,
    description: player.description,
    status: player.status,
    hasAccount: !!player.user,
    stats: {
      totalMatches: statsAggregate._count.id,
      totalGoals: statsAggregate._sum.goals ?? 0,
      totalAssists: statsAggregate._sum.assists ?? 0,
      totalYellowCards: statsAggregate._sum.yellowCards ?? 0,
      totalRedCards: statsAggregate._sum.redCards ?? 0,
    },
    createdAt: player.createdAt.toISOString(),
    updatedAt: player.updatedAt.toISOString(),
  });
}

// PATCH /api/players/:id — Update player
export async function PATCH(request: Request, context: RouteContext) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const ip = extractClientIp(request);
  const rl = await rateLimitMutation(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Muitas tentativas. Tente em ${rl.retryAfterMinutes} min.`, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  const player = await prisma.player.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!player) {
    return NextResponse.json(
      { error: "Jogador não encontrado", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = updatePlayerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos inválidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Check shirtNumber uniqueness if being changed
  if (data.shirtNumber !== undefined && data.shirtNumber !== player.shirtNumber) {
    const existing = await prisma.player.findUnique({
      where: {
        teamId_shirtNumber: {
          teamId: session.user.teamId,
          shirtNumber: data.shirtNumber,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Número de camisa já em uso", code: "SHIRT_NUMBER_TAKEN" },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.player.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true } },
    },
  });

  const statsAggregate = await prisma.matchStats.aggregate({
    where: { playerId: id },
    _sum: {
      goals: true,
      assists: true,
      yellowCards: true,
      redCards: true,
    },
    _count: { id: true },
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    fullName: updated.fullName,
    position: updated.position,
    shirtNumber: updated.shirtNumber,
    photoUrl: updated.photoUrl,
    age: updated.age,
    phone: updated.phone,
    description: updated.description,
    status: updated.status,
    hasAccount: !!updated.user,
    stats: {
      totalMatches: statsAggregate._count.id,
      totalGoals: statsAggregate._sum.goals ?? 0,
      totalAssists: statsAggregate._sum.assists ?? 0,
      totalYellowCards: statsAggregate._sum.yellowCards ?? 0,
      totalRedCards: statsAggregate._sum.redCards ?? 0,
    },
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}

// DELETE /api/players/:id — Soft-delete (set status to INACTIVE)
export async function DELETE(request: Request, context: RouteContext) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  const player = await prisma.player.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!player) {
    return NextResponse.json(
      { error: "Jogador não encontrado", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  await prisma.player.update({
    where: { id },
    data: { status: "INACTIVE" },
  });

  return NextResponse.json({ message: "Player removed" });
}
