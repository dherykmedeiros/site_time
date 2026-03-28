import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { createPlayerSchema } from "@/lib/validations/player";

// GET /api/players — List players for the team
export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 400 }
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
      user: { select: { id: true } },
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
      createdAt: p.createdAt.toISOString(),
    })),
  });
}

// POST /api/players — Create a new player
export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Crie um time antes de adicionar jogadores" },
      { status: 400 }
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

  // Check shirtNumber uniqueness within the team
  const existing = await prisma.player.findUnique({
    where: {
      teamId_shirtNumber: {
        teamId: session.user.teamId,
        shirtNumber,
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
      shirtNumber,
      status,
      teamId: session.user.teamId,
    },
  });

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
