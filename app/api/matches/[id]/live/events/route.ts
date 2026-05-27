import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { liveEventSchema } from "@/lib/validations/match";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/matches/:id/live/events — Add a live event (ADMIN only)
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

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
    include: { matchLive: true },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "MATCH_NOT_FOUND" },
      { status: 404 }
    );
  }

  let live = match.matchLive;
  if (!live) {
    return NextResponse.json(
      { error: "A partida ao vivo ainda não foi iniciada.", code: "LIVE_NOT_STARTED" },
      { status: 400 }
    );
  }

  // Live events can only be added while a half is running
  if (live.liveStatus !== "FIRST_HALF" && live.liveStatus !== "SECOND_HALF") {
    return NextResponse.json(
      { error: "A partida precisa estar com o cronômetro rolando para registrar eventos.", code: "LIVE_STATE_ERROR" },
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

  const parsed = liveEventSchema.safeParse(body);
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

  const { type, playerId, guestPlayerId, description } = parsed.data;

  // Calculate minute based on timestamps
  const now = new Date();
  let minute = 1;
  const half = live.liveStatus === "FIRST_HALF" ? 1 : 2;

  if (half === 1 && live.firstHalfStart) {
    const diffMs = now.getTime() - new Date(live.firstHalfStart).getTime();
    minute = Math.max(1, Math.round(diffMs / 60000));
  } else if (half === 2 && live.secondHalfStart) {
    const diffMs = now.getTime() - new Date(live.secondHalfStart).getTime();
    minute = Math.max(1, Math.round(diffMs / 60000));
  }

  // Create the event and update the score in a transaction if it's a goal
  const event = await prisma.$transaction(async (tx) => {
    const newEvent = await tx.matchLiveEvent.create({
      data: {
        matchLiveId: live.id,
        type,
        minute,
        half,
        playerId: playerId || null,
        guestPlayerId: guestPlayerId || null,
        description: description || null,
      },
    });

    if (type === "GOAL") {
      let homeIncrement = 0;
      let awayIncrement = 0;

      const isOurTeamGoal = playerId || guestPlayerId;

      if (isOurTeamGoal) {
        if (match.isHome) homeIncrement = 1;
        else awayIncrement = 1;
      } else {
        // Opponent scored
        if (match.isHome) awayIncrement = 1;
        else homeIncrement = 1;
      }

      await tx.matchLive.update({
        where: { id: live.id },
        data: {
          homeScore: { increment: homeIncrement },
          awayScore: { increment: awayIncrement },
        },
      });
    }

    return newEvent;
  });

  return NextResponse.json(
    {
      message: "Evento registrado com sucesso",
      event,
    },
    { status: 201 }
  );
}

// DELETE /api/matches/:id/live/events — Remove a live event (ADMIN only)
export async function DELETE(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const eventId = url.searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json(
      { error: "ID do evento obrigatório", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
    include: { matchLive: true },
  });

  if (!match || !match.matchLive) {
    return NextResponse.json(
      { error: "Partida ou evento ao vivo não encontrado", code: "MATCH_NOT_FOUND" },
      { status: 404 }
    );
  }

  const event = await prisma.matchLiveEvent.findFirst({
    where: { id: eventId, matchLiveId: match.matchLive.id },
  });

  if (!event) {
    return NextResponse.json(
      { error: "Evento não encontrado", code: "EVENT_NOT_FOUND" },
      { status: 404 }
    );
  }

  // Delete event and update scores in a transaction if it was a goal
  await prisma.$transaction(async (tx) => {
    await tx.matchLiveEvent.delete({
      where: { id: eventId },
    });

    if (event.type === "GOAL") {
      let homeDecrement = 0;
      let awayDecrement = 0;

      const isOurTeamGoal = event.playerId || event.guestPlayerId;

      if (isOurTeamGoal) {
        if (match.isHome) homeDecrement = 1;
        else awayDecrement = 1;
      } else {
        // Opponent goal
        if (match.isHome) awayDecrement = 1;
        else homeDecrement = 1;
      }

      const liveData = match.matchLive!;
      const newHomeScore = Math.max(0, liveData.homeScore - homeDecrement);
      const newAwayScore = Math.max(0, liveData.awayScore - awayDecrement);

      await tx.matchLive.update({
        where: { id: liveData.id },
        data: {
          homeScore: newHomeScore,
          awayScore: newAwayScore,
        },
      });
    }
  });

  return NextResponse.json({
    message: "Evento removido com sucesso",
    eventId,
  });
}
