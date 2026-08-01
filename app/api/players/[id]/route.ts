import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireCoachOrAdmin, requireAuth } from "@/lib/auth";
import { updatePlayerSchema } from "@/lib/validations/player";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/players/:id — Player detail with aggregated stats
export async function GET(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
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
    secondaryPosition: player.secondaryPosition,
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
  const { session, error } = await requireCoachOrAdmin();
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

  // If player became ACTIVE (was inactive before or status explicitly set to ACTIVE),
  // auto-create PENDING RSVPs for all future SCHEDULED matches where they don't have one yet
  const playerBecameActive =
    data.status === "ACTIVE" && player.status !== "ACTIVE";

  if (playerBecameActive) {
    const futureMatches = await prisma.match.findMany({
      where: {
        teamId: session.user.teamId,
        status: "SCHEDULED",
        date: { gte: new Date() },
        // Exclude matches where they already have an RSVP
        rsvps: { none: { playerId: id } },
      },
      select: { id: true, type: true },
    });

    if (futureMatches.length > 0) {
      await prisma.rSVP.createMany({
        data: futureMatches.map((match) => ({
          playerId: id,
          matchId: match.id,
          status: "PENDING" as const,
          summoned: match.type === "FRIENDLY",
        })),
        skipDuplicates: true,
      });
    }
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
    id: updated.id,
    name: updated.name,
    fullName: updated.fullName,
    position: updated.position,
    secondaryPosition: updated.secondaryPosition,
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
  const { session, error } = await requireCoachOrAdmin();
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
