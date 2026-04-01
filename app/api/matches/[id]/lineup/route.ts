import { NextResponse } from "next/server";
import { MatchLineupBlockPreset, MatchLineupFormation, Prisma } from "@prisma/client";
import { serializeBlockPreset, serializeFormation } from "@/lib/formations";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { buildMatchLineupSnapshot } from "@/lib/match-lineup";
import { patchMatchLineupSchema } from "@/lib/validations/match";

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
      lineupSelections: {
        orderBy: [
          { role: "asc" },
          { sortOrder: "asc" },
        ],
        select: {
          role: true,
          sortOrder: true,
          fieldX: true,
          fieldY: true,
          updatedAt: true,
          player: {
            select: {
              id: true,
              name: true,
              position: true,
            },
          },
        },
      },
    },
  });
}

function buildLineupResponse(match: NonNullable<Awaited<ReturnType<typeof loadMatchForLineup>>>, request: Request) {
  const snapshot = buildMatchLineupSnapshot({
    matchId: match.id,
    confirmedPlayers: match.rsvps.map((rsvp: (typeof match.rsvps)[number]) => ({
      playerId: rsvp.player.id,
      playerName: rsvp.player.name,
      position: rsvp.player.position,
      shirtNumber: rsvp.player.shirtNumber,
      createdAt: rsvp.player.createdAt,
      status: rsvp.player.status,
      rsvpStatus: rsvp.status,
    })),
    positionLimits: match.positionLimits.map((limit: (typeof match.positionLimits)[number]) => ({
      position: limit.position,
      maxPlayers: limit.maxPlayers,
    })),
    savedSelections: match.lineupSelections.map((selection: (typeof match.lineupSelections)[number]) => ({
      role: selection.role,
      sortOrder: selection.sortOrder,
      fieldX: selection.fieldX,
      fieldY: selection.fieldY,
      updatedAt: selection.updatedAt,
      player: selection.player,
    })),
    savedFormation: match.lineupFormation,
    savedBlockPreset: match.lineupBlockPreset,
  });

  const url = new URL(request.url);
  const imageUrl = `${url.origin}/api/og/match/${match.id}/lineup`;

  return NextResponse.json({
    matchId: match.id,
    generatedAt: snapshot.generatedAt,
    imageUrl,
    lineup: snapshot.lineup,
  });
}

export async function GET(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
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
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
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

  if (parsed.data.starters.length > 11) {
    return NextResponse.json(
      {
        error: "A escalação titular deve conter no máximo 11 atletas",
        code: "INVALID_STARTERS_COUNT",
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

  const allPlayerIds = [...parsed.data.starters.map((entry: { playerId: string }) => entry.playerId), ...parsed.data.bench];
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

  const invalidPlayers = allPlayerIds.filter((playerId) => !eligibleIds.has(playerId));
  if (invalidPlayers.length > 0) {
    return NextResponse.json(
      {
        error: "A escalação só pode conter atletas ativos e confirmados",
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
      ...parsed.data.starters.map((entry: { playerId: string; fieldX?: number | null; fieldY?: number | null }, index: number) => ({
        matchId: id,
        playerId: entry.playerId,
        role: "STARTER" as const,
        sortOrder: index,
        fieldX: entry.fieldX ?? null,
        fieldY: entry.fieldY ?? null,
      })),
      ...parsed.data.bench.map((playerId: string, index: number) => ({
        matchId: id,
        playerId,
        role: "BENCH" as const,
        sortOrder: index,
      })),
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

  return buildLineupResponse(updatedMatch, request);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
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

  return buildLineupResponse(updatedMatch, request);
}