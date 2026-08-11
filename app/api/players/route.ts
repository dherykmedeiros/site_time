import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireCoachOrAdmin, requireAuth } from "@/lib/auth";
import { createPlayerSchema } from "@/lib/validations/player";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { logActivity } from "@/lib/activity-logger";
import { syncMissingRSVPsForTeam } from "@/lib/match-rsvp-sync";

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

  const currentYear = new Date().getFullYear();
  const startOfCurrentYear = new Date(currentYear, 0, 1);

  const players = await prisma.player.findMany({
    where: { teamId: session.user.teamId },
    orderBy: { shirtNumber: "asc" },
    select: {
      id: true,
      name: true,
      position: true,
      secondaryPosition: true,
      shirtNumber: true,
      photoUrl: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { id: true, role: true } },
    },
  });

  const formattedPlayers = players.map((p) => {
    const isArchived = p.status === "INACTIVE" && p.updatedAt < startOfCurrentYear;
    return {
      id: p.id,
      name: p.name,
      position: p.position,
      secondaryPosition: p.secondaryPosition,
      shirtNumber: p.shirtNumber,
      photoUrl: p.photoUrl,
      status: p.status,
      isArchived,
      inactivityYear: p.updatedAt.getFullYear(),
      hasAccount: !!p.user,
      role: p.user?.role || "PLAYER",
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  });

  let filtered = formattedPlayers;

  if (status === "ACTIVE") {
    filtered = formattedPlayers.filter((p) => p.status === "ACTIVE");
  } else if (status === "INACTIVE") {
    filtered = formattedPlayers.filter((p) => p.status === "INACTIVE" && !p.isArchived);
  } else if (status === "ARCHIVED") {
    filtered = formattedPlayers.filter((p) => p.isArchived);
  } else if (status === "ALL_INCLUDING_ARCHIVED") {
    filtered = formattedPlayers;
  } else if (status === "ALL") {
    filtered = formattedPlayers.filter((p) => !p.isArchived);
  } else {
    // Default: Exclude old archived players from prior years to keep squad list clean
    filtered = formattedPlayers.filter((p) => !p.isArchived);
  }

  return NextResponse.json({ players: filtered });
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

  const { name, position, secondaryPosition, shirtNumber, status } = parsed.data;

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
      secondaryPosition: secondaryPosition || null,
      shirtNumber: finalShirtNumber,
      status,
      teamId: session.user.teamId,
    },
  });

  await logActivity(
    session.user.teamId,
    "PLAYER_ADDED",
    `Adicionou o jogador ${name} (#${finalShirtNumber}) ao elenco`,
    session.user.id,
    { playerId: player.id }
  );

  // Auto-create PENDING RSVPs for all SCHEDULED matches
  // so the new player appears without needing to recreate the game
  if (status === "ACTIVE") {
    await syncMissingRSVPsForTeam(session.user.teamId);
  }

  return NextResponse.json(
    {
      id: player.id,
      name: player.name,
      position: player.position,
      secondaryPosition: player.secondaryPosition,
      shirtNumber: player.shirtNumber,
      photoUrl: player.photoUrl,
      status: player.status,
      teamId: player.teamId,
      createdAt: player.createdAt.toISOString(),
    },
    { status: 201 }
  );
}
