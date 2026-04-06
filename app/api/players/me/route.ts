import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { updateOwnPlayerProfileSchema } from "@/lib/validations/player";
import { withErrorHandler } from "@/lib/api-handler";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

async function getOwnedPlayer(userId: string, teamId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      playerId: true,
    },
  });

  if (!user?.playerId) {
    return null;
  }

  return prisma.player.findFirst({
    where: {
      id: user.playerId,
      teamId,
    },
  });
}

// GET /api/players/me - Player self profile data
export const GET = withErrorHandler(async () => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuario nao possui equipe vinculada" },
      { status: 400 }
    );
  }

  const player = await getOwnedPlayer(session.user.id, session.user.teamId);
  if (!player) {
    return NextResponse.json(
      { error: "Perfil de jogador nao encontrado", code: "PLAYER_PROFILE_NOT_FOUND" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: player.id,
    name: player.name,
    fullName: player.fullName,
    position: player.position,
    shirtNumber: player.shirtNumber,
    status: player.status,
    photoUrl: player.photoUrl,
    age: player.age,
    phone: player.phone,
    description: player.description,
    updatedAt: player.updatedAt.toISOString(),
  });
});

// PATCH /api/players/me - Update self editable profile fields only
export const PATCH = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAuth();
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
      { error: "Usuario nao possui equipe vinculada" },
      { status: 400 }
    );
  }

  const player = await getOwnedPlayer(session.user.id, session.user.teamId);
  if (!player) {
    return NextResponse.json(
      { error: "Perfil de jogador nao encontrado", code: "PLAYER_PROFILE_NOT_FOUND" },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = updateOwnPlayerProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos invalidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const payload = parsed.data;

  const updated = await prisma.player.update({
    where: { id: player.id },
    data: {
      fullName: payload.fullName === undefined ? undefined : payload.fullName,
      photoUrl: payload.photoUrl === undefined ? undefined : payload.photoUrl,
      age: payload.age === undefined ? undefined : payload.age,
      phone: payload.phone === undefined ? undefined : payload.phone,
      description: payload.description === undefined ? undefined : payload.description,
    },
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    fullName: updated.fullName,
    position: updated.position,
    shirtNumber: updated.shirtNumber,
    status: updated.status,
    photoUrl: updated.photoUrl,
    age: updated.age,
    phone: updated.phone,
    description: updated.description,
    updatedAt: updated.updatedAt.toISOString(),
  });
});
