import { NextResponse } from "next/server";
import { MatchLineupBlockPreset, MatchLineupFormation, Prisma } from "@prisma/client";
import { serializeBlockPreset, serializeFormation } from "@/lib/formations";
import { prisma } from "@/lib/prisma";
import { requireCoachOrAdmin } from "@/lib/auth";
import { buildMatchLineupSnapshot } from "@/lib/match-lineup";
import { trackOperationalEvent } from "@/lib/telemetry";
import { patchMatchLineupSchema } from "@/lib/validations/match";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function loadMatchForLineup(matchId: string, teamId: string) {
  return prisma.match.findFirst({
    where: {
      id: matchId,
      teamId,
    },
    select: {
      id: true,
      type: true,
      status: true,
      lineupFormation: true,
      lineupBlockPreset: true,
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
      guestPlayers: {
        select: {
          id: true,
          name: true,
          position: true,
          shirtNumber: true,
          createdAt: true,
        },
      },
      lineupSelections: {
        orderBy: [
          { role: "asc" },
          { sortOrder: "asc" },
        ],
        select: {
          role: true,
          teamSide: true,
          sortOrder: true,
          fieldX: true,
          fieldY: true,
          updatedAt: true,
          playerId: true,
          guestPlayerId: true,
          player: {
            select: {
              id: true,
              name: true,
              position: true,
              shirtNumber: true,
            },
          },
          guestPlayer: {
            select: {
              id: true,
              name: true,
              position: true,
              shirtNumber: true,
            },
          },
        },
      },
    },
  });
}

function buildLineupResponse(match: NonNullable<Awaited<ReturnType<typeof loadMatchForLineup>>>, request: Request) {
  const confirmedPlayers = [
    ...match.rsvps.map((rsvp: (typeof match.rsvps)[number]) => ({
      playerId: rsvp.player.id,
      playerName: rsvp.player.name,
      position: rsvp.player.position,
      shirtNumber: rsvp.player.shirtNumber,
      createdAt: rsvp.player.createdAt,
      status: rsvp.player.status,
      rsvpStatus: rsvp.status,
      isGuest: false,
    })),
    ...match.guestPlayers.map((guest: (typeof match.guestPlayers)[number]) => ({
      playerId: guest.id,
      playerName: guest.name,
      position: guest.position || "FORWARD",
      shirtNumber: guest.shirtNumber || 0,
      createdAt: guest.createdAt,
      status: "ACTIVE" as const,
      rsvpStatus: "CONFIRMED" as const,
      isGuest: true,
    })),
  ];

  const snapshot = buildMatchLineupSnapshot({
    matchId: match.id,
    confirmedPlayers,
    positionLimits: match.positionLimits.map((limit: (typeof match.positionLimits)[number]) => ({
      position: limit.position,
      maxPlayers: limit.maxPlayers,
    })),
    savedSelections: match.lineupSelections.map((selection: (typeof match.lineupSelections)[number]) => ({
      role: selection.role,
      teamSide: selection.teamSide || "A",
      sortOrder: selection.sortOrder,
      fieldX: selection.fieldX,
      fieldY: selection.fieldY,
      updatedAt: selection.updatedAt,
      player: selection.playerId 
        ? selection.player! 
        : {
            id: selection.guestPlayer!.id,
            name: selection.guestPlayer!.name,
            position: selection.guestPlayer!.position || "FORWARD",
            shirtNumber: selection.guestPlayer!.shirtNumber,
          },
    })),
    savedFormation: match.lineupFormation,
    savedBlockPreset: match.lineupBlockPreset,
  });

  const url = new URL(request.url);
  const imageUrl = `${url.origin}/api/og/match/${match.id}/lineup`;

  // For training matches, also compute detailed trainingDivision
  let trainingDivision = null;
  if (match.type === "TRAINING") {
    const assignedIds = new Set<string>();

    const mapItem = (s: (typeof match.lineupSelections)[number]) => {
      const id = s.playerId || s.guestPlayerId!;
      assignedIds.add(id);
      const p = s.player || s.guestPlayer!;
      return {
        id,
        playerId: s.playerId,
        guestPlayerId: s.guestPlayerId,
        name: p.name,
        position: p.position,
        shirtNumber: p.shirtNumber,
        fieldX: s.fieldX,
        fieldY: s.fieldY,
        role: s.role,
        teamSide: s.teamSide || "A",
        isGuest: Boolean(s.guestPlayerId),
      };
    };

    const teamAStarters = match.lineupSelections
      .filter((s) => (s.teamSide === "A" || !s.teamSide) && s.role === "STARTER")
      .map(mapItem);
    const teamABench = match.lineupSelections
      .filter((s) => (s.teamSide === "A" || !s.teamSide) && s.role === "BENCH")
      .map(mapItem);

    const teamBStarters = match.lineupSelections
      .filter((s) => s.teamSide === "B" && s.role === "STARTER")
      .map(mapItem);
    const teamBBench = match.lineupSelections
      .filter((s) => s.teamSide === "B" && s.role === "BENCH")
      .map(mapItem);

    const eligibleConfirmed = confirmedPlayers.filter(
      (p) => p.status === "ACTIVE" && p.rsvpStatus === "CONFIRMED"
    );

    const unassigned = eligibleConfirmed
      .filter((p) => !assignedIds.has(p.playerId))
      .map((p) => ({
        id: p.playerId,
        playerId: p.isGuest ? null : p.playerId,
        guestPlayerId: p.isGuest ? p.playerId : null,
        name: p.playerName,
        position: p.position,
        shirtNumber: p.shirtNumber,
        isGuest: p.isGuest,
      }));

    trainingDivision = {
      teamA: {
        starters: teamAStarters,
        bench: teamABench,
      },
      teamB: {
        starters: teamBStarters,
        bench: teamBBench,
      },
      unassigned,
    };
  }

  return NextResponse.json({
    matchId: match.id,
    matchType: match.type,
    generatedAt: snapshot.generatedAt,
    imageUrl,
    lineup: snapshot.lineup,
    trainingDivision,
  });
}

export async function GET(request: Request, { params }: RouteParams) {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const match = await loadMatchForLineup(id, session.user.teamId);

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  return buildLineupResponse(match, request);
}

export async function PATCH(request: Request, { params }: RouteParams) {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = patchMatchLineupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Escalação inválida",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { id } = await params;
  const match = await loadMatchForLineup(id, session.user.teamId);

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  const maxStarters = match.type === "TRAINING" ? 22 : 11;
  if (parsed.data.starters.length > maxStarters) {
    return NextResponse.json(
      {
        error: `A escalação titular deve conter no máximo ${maxStarters} atletas`,
        code: "INVALID_STARTERS_COUNT",
      },
      { status: 400 }
    );
  }

  if (match.status !== "SCHEDULED") {
    return NextResponse.json(
      {
        error: "A escalação só pode ser alterada em partidas agendadas",
        code: "INVALID_MATCH_STATUS",
      },
      { status: 409 }
    );
  }

  const eligibleIds = new Set(
    match.rsvps
      .filter((rsvp: (typeof match.rsvps)[number]) => rsvp.status === "CONFIRMED" && rsvp.player.status === "ACTIVE")
      .map((rsvp: (typeof match.rsvps)[number]) => rsvp.player.id)
  );

  const guestIds = new Set(match.guestPlayers.map((guest: (typeof match.guestPlayers)[number]) => guest.id));

  const allPlayerIds = [
    ...parsed.data.starters.map((entry: { playerId: string }) => entry.playerId),
    ...parsed.data.bench.map((item: string | { playerId: string }) => (typeof item === "string" ? item : item.playerId)),
  ];
  const uniquePlayerIds = new Set(allPlayerIds);
  if (uniquePlayerIds.size !== allPlayerIds.length) {
    return NextResponse.json(
      {
        error: "A escalação não pode repetir atletas entre titulares e banco",
        code: "DUPLICATE_LINEUP_PLAYER",
      },
      { status: 400 }
    );
  }

  const invalidPlayers = allPlayerIds.filter((playerId) => !eligibleIds.has(playerId) && !guestIds.has(playerId));
  if (invalidPlayers.length > 0) {
    return NextResponse.json(
      {
        error: "A escalação só pode conter atletas ativos, confirmados ou convidados da partida",
        code: "INVALID_LINEUP_PLAYER",
      },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.matchLineupSelection.deleteMany({ where: { matchId: id } });
    await tx.match.update({
      where: { id },
      data: {
        lineupFormation: serializeFormation(parsed.data.formation ?? null) as MatchLineupFormation | null,
        lineupBlockPreset: serializeBlockPreset(parsed.data.blockPreset ?? null) as MatchLineupBlockPreset | null,
      },
    });

    const data = [
      ...parsed.data.starters.map((entry: { playerId: string; fieldX?: number | null; fieldY?: number | null; teamSide?: string }, index: number) => {
        const isGuest = guestIds.has(entry.playerId);
        return {
          matchId: id,
          playerId: isGuest ? null : entry.playerId,
          guestPlayerId: isGuest ? entry.playerId : null,
          role: "STARTER" as const,
          teamSide: entry.teamSide || "A",
          sortOrder: index,
          fieldX: entry.fieldX ?? null,
          fieldY: entry.fieldY ?? null,
        };
      }),
      ...parsed.data.bench.map((item: string | { playerId: string; teamSide?: string }, index: number) => {
        const playerId = typeof item === "string" ? item : item.playerId;
        const teamSide = typeof item === "string" ? "A" : (item.teamSide || "A");
        const isGuest = guestIds.has(playerId);
        return {
          matchId: id,
          playerId: isGuest ? null : playerId,
          guestPlayerId: isGuest ? playerId : null,
          role: "BENCH" as const,
          teamSide,
          sortOrder: index,
        };
      }),
    ];

    if (data.length > 0) {
      await tx.matchLineupSelection.createMany({ data });
    }
  });

  const updatedMatch = await loadMatchForLineup(id, session.user.teamId);
  if (!updatedMatch) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  trackOperationalEvent("match_lineup_saved", {
    teamId: session.user.teamId,
    matchId: id,
    startersCount: parsed.data.starters.length,
    benchCount: parsed.data.bench.length,
    hasFormation: parsed.data.formation != null,
  });

  return buildLineupResponse(updatedMatch, request);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { session, error } = await requireCoachOrAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const match = await loadMatchForLineup(id, session.user.teamId);

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  if (match.status !== "SCHEDULED") {
    return NextResponse.json(
      {
        error: "A escalação só pode ser resetada em partidas agendadas",
        code: "INVALID_MATCH_STATUS",
      },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.matchLineupSelection.deleteMany({ where: { matchId: id } });
    await tx.match.update({ where: { id }, data: { lineupFormation: null, lineupBlockPreset: null } });
  });

  const updatedMatch = await loadMatchForLineup(id, session.user.teamId);
  if (!updatedMatch) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  trackOperationalEvent("match_lineup_reset", {
    teamId: session.user.teamId,
    matchId: id,
  });

  return buildLineupResponse(updatedMatch, request);
}