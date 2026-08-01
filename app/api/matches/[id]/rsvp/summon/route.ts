import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin } from "@/lib/auth";
import { z } from "zod";

const summonSchema = z.object({
  playerId: z.string(),
  summoned: z.boolean(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  // Validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = summonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { playerId, summoned } = parsed.data;

  // Verify the player belongs to the same team
  const player = await prisma.player.findFirst({
    where: { id: playerId, teamId: session.user.teamId },
  });

  if (!player) {
    return NextResponse.json({ error: "Jogador não encontrado" }, { status: 404 });
  }

  // Verify the match belongs to the same team
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
  }

  // Upsert RSVP
  const rsvp = await prisma.rSVP.upsert({
    where: {
      playerId_matchId: {
        playerId,
        matchId,
      },
    },
    update: {
      summoned,
    },
    create: {
      playerId,
      matchId,
      status: "PENDING",
      summoned,
    },
    include: {
      player: { select: { name: true } },
    },
  });

  return NextResponse.json({
    playerId: rsvp.playerId,
    playerName: rsvp.player.name,
    status: rsvp.status,
    respondedAt: rsvp.respondedAt?.toISOString() ?? null,
    summoned: rsvp.summoned,
  });
}
