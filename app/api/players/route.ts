import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireCoachOrAdmin, requireAuth } from "@/lib/auth";
import { createPlayerSchema } from "@/lib/validations/player";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

// GET /api/players — List players for the team
export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: { teamId: string; status?: "ACTIVE" | "INACTIVE" } = {
    teamId: session.user.teamId,
  };

  if (status === "ACTIVE" || status === "INACTIVE") {
    where.status = status;
  }

  const players = await prisma.player.findMany({
    where,
    orderBy: { shirtNumber: "asc" },
    include: {
      user: { select: { id: true, role: true } },
    },
  });

  return NextResponse.json({
    players: players.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      shirtNumber: p.shirtNumber,
      photoUrl: p.photoUrl,
      status: p.status,
      hasAccount: !!p.user,
      role: p.user?.role || "PLAYER",
      createdAt: p.createdAt.toISOString(),
    })),
  });
}

// POST /api/players — Create a new player (ADMIN/COACH)
export async function POST(request: Request) {
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
      { error: "Crie um time antes de adicionar jogadores" },
      { status: 403 }
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

  const parsed = createPlayerSchema.safeParse(body);
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

  const { name, position, shirtNumber, status } = parsed.data;

  let finalShirtNumber = shirtNumber;
  if (finalShirtNumber === undefined || finalShirtNumber === null) {
    const maxPlayer = await prisma.player.findFirst({
      where: { teamId: session.user.teamId },
      orderBy: { shirtNumber: "desc" },
      select: { shirtNumber: true },
    });
    finalShirtNumber = (maxPlayer?.shirtNumber ?? 0) + 1;
  }

  // Check shirtNumber uniqueness within the team
  const existing = await prisma.player.findUnique({
    where: {
      teamId_shirtNumber: {
        teamId: session.user.teamId,
        shirtNumber: finalShirtNumber,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Número de camisa já em uso no time", code: "SHIRT_NUMBER_TAKEN" },
      { status: 409 }
    );
  }

  const player = await prisma.player.create({
    data: {
      name,
      position,
      shirtNumber: finalShirtNumber,
      status,
      teamId: session.user.teamId,
    },
  });

  // Auto-create PENDING RSVPs for all future SCHEDULED matches
  // so the new player appears without needing to recreate the game
  if (status === "ACTIVE") {
    const futureMatches = await prisma.match.findMany({
      where: {
        teamId: session.user.teamId,
        status: "SCHEDULED",
        date: { gte: new Date() },
      },
      select: { id: true, type: true },
    });

    if (futureMatches.length > 0) {
      await prisma.rSVP.createMany({
        data: futureMatches.map((match) => ({
          playerId: player.id,
          matchId: match.id,
          status: "PENDING" as const,
          summoned: match.type === "FRIENDLY",
        })),
        skipDuplicates: true,
      });
    }
  }

  return NextResponse.json(
    {
      id: player.id,
      name: player.name,
      position: player.position,
      shirtNumber: player.shirtNumber,
      photoUrl: player.photoUrl,
      status: player.status,
      teamId: player.teamId,
      createdAt: player.createdAt.toISOString(),
    },
    { status: 201 }
  );
}
