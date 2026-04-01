import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { buildSuggestedLineup } from "@/lib/lineup-suggester";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const { id } = await params;
  const match = await prisma.match.findFirst({
    where: {
      id,
      teamId: session.user.teamId,
    },
    select: {
      id: true,
      positionLimits: {
        select: {
          position: true,
          maxPlayers: true,
        },
      },
      rsvps: {
        select: {
          status: true,
          player: {
            select: {
              id: true,
              name: true,
              position: true,
              shirtNumber: true,
              status: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  const lineup = buildSuggestedLineup({
    matchId: match.id,
    confirmedPlayers: match.rsvps.map((rsvp) => ({
      playerId: rsvp.player.id,
      playerName: rsvp.player.name,
      position: rsvp.player.position,
      shirtNumber: rsvp.player.shirtNumber,
      createdAt: rsvp.player.createdAt,
      status: rsvp.player.status,
      rsvpStatus: rsvp.status,
    })),
    positionLimits: match.positionLimits.map((limit) => ({
      position: limit.position,
      maxPlayers: limit.maxPlayers,
    })),
  });

  return NextResponse.json({
    matchId: match.id,
    generatedAt: new Date().toISOString(),
    lineup,
  });
}