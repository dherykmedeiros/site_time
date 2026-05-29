import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { PlayerPosition } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/matches/:id/guests/promote — Promote a guest player to an official player
export async function POST(request: Request, { params }: RouteParams) {
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

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const { guestPlayerId, shirtNumber, position } = body;

  if (!guestPlayerId) {
    return NextResponse.json(
      { error: "ID do convidado é obrigatório", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Find the guest player in this match and team
  const guest = await prisma.guestPlayer.findFirst({
    where: { id: guestPlayerId, matchId, teamId: session.user.teamId },
  });

  if (!guest) {
    return NextResponse.json(
      { error: "Jogador convidado não encontrado", code: "GUEST_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Determine shirt number and position
  const finalShirtNumber = shirtNumber !== undefined && shirtNumber !== null 
    ? parseInt(shirtNumber, 10) 
    : guest.shirtNumber;

  const finalPosition = (position || guest.position) as PlayerPosition | null;

  if (finalShirtNumber === null || isNaN(finalShirtNumber)) {
    return NextResponse.json(
      { error: "O número da camisa é obrigatório para cadastrar um jogador oficial.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (!finalPosition) {
    return NextResponse.json(
      { error: "A posição é obrigatória para cadastrar um jogador oficial.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Check if the shirt number is already taken by an active official player
  const existingPlayerWithShirt = await prisma.player.findFirst({
    where: {
      teamId: session.user.teamId,
      shirtNumber: finalShirtNumber,
      status: "ACTIVE",
    },
  });

  if (existingPlayerWithShirt) {
    return NextResponse.json(
      { error: `O número de camisa ${finalShirtNumber} já está em uso pelo jogador oficial ${existingPlayerWithShirt.name}.`, code: "SHIRT_NUMBER_CONFLICT" },
      { status: 400 }
    );
  }

  // Perform promotion atomically inside a transaction
  const promotedPlayer = await prisma.$transaction(async (tx) => {
    // 1. Create the official Player
    const player = await tx.player.create({
      data: {
        name: guest.name,
        shirtNumber: finalShirtNumber,
        position: finalPosition,
        teamId: session.user.teamId!,
        status: "ACTIVE",
      },
    });

    // 2. Migrate MatchLiveEvent records
    await tx.matchLiveEvent.updateMany({
      where: { guestPlayerId: guest.id },
      data: {
        playerId: player.id,
        guestPlayerId: null,
      },
    });

    // 3. Migrate MatchStats records
    await tx.matchStats.updateMany({
      where: { guestPlayerId: guest.id },
      data: {
        playerId: player.id,
        guestPlayerId: null,
      },
    });

    // 4. Migrate MatchPlayerRating records
    await tx.matchPlayerRating.updateMany({
      where: { ratedGuestId: guest.id },
      data: {
        ratedId: player.id,
        ratedGuestId: null,
      },
    });

    // 5. Delete the GuestPlayer record
    await tx.guestPlayer.delete({
      where: { id: guest.id },
    });

    return player;
  });

  return NextResponse.json({
    message: `Jogador convidado ${guest.name} promovido a oficial com sucesso!`,
    player: promotedPlayer,
  });
}
