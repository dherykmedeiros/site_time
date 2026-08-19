import { NextResponse } from "next/server";
import { MatchLineupBlockPreset, MatchLineupFormation, Prisma } from "@prisma/client";
import { serializeBlockPreset, serializeFormation, parseFormation, parseBlockPreset } from "@/lib/formations";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { trackOperationalEvent } from "@/lib/telemetry";
import { patchMatchLineupSchema } from "@/lib/validations/match";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

async function loadDefaultLineup(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      defaultFormation: true,
      defaultBlockPreset: true,
      defaultLineup: {
        orderBy: [
          { role: "asc" },
          { sortOrder: "asc" },
        ],
        select: {
          role: true,
          sortOrder: true,
          fieldX: true,
          fieldY: true,
          player: {
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
  return team;
}

function buildDefaultLineupResponse(team: NonNullable<Awaited<ReturnType<typeof loadDefaultLineup>>>) {
  const starters = team.defaultLineup
    .filter(item => item.role === "STARTER")
    .map(item => ({
      playerId: item.player.id,
      playerName: item.player.name,
      position: item.player.position,
      shirtNumber: item.player.shirtNumber,
      fieldX: item.fieldX,
      fieldY: item.fieldY,
    }));

  const bench = team.defaultLineup
    .filter(item => item.role === "BENCH")
    .map(item => ({
      playerId: item.player.id,
      playerName: item.player.name,
      position: item.player.position,
      shirtNumber: item.player.shirtNumber,
    }));

  return NextResponse.json({
    teamId: team.id,
    formation: parseFormation(team.defaultFormation),
    blockPreset: parseBlockPreset(team.defaultBlockPreset),
    starters,
    bench,
  });
}

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const team = await loadDefaultLineup(session.user.teamId);
  if (!team) {
    return NextResponse.json(
      { error: "Time não encontrado", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  return buildDefaultLineupResponse(team);
}

export async function PATCH(request: Request) {
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

  if (parsed.data.starters.length > 11) {
    return NextResponse.json(
      {
        error: "A escalação titular deve conter no máximo 11 atletas",
        code: "INVALID_STARTERS_COUNT",
      },
      { status: 400 }
    );
  }

  const teamId = session.user.teamId;

  // Verify all playerIds belong to the team and are active
  const activePlayers = await prisma.player.findMany({
    where: {
      teamId,
      status: "ACTIVE",
    },
    select: { id: true },
  });
  const activePlayerIds = new Set(activePlayers.map(p => p.id));

  const allPlayerIds = [
    ...parsed.data.starters.map(entry => entry.playerId),
    ...parsed.data.bench.map(item => (typeof item === "string" ? item : item.playerId)),
  ];

  const invalidPlayers = allPlayerIds.filter(id => !activePlayerIds.has(id));
  if (invalidPlayers.length > 0) {
    return NextResponse.json(
      {
        error: "A escalação só pode conter atletas ativos do seu time",
        code: "INVALID_LINEUP_PLAYER",
      },
      { status: 400 }
    );
  }

  // Update in a transaction
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Delete existing default selections
    await tx.defaultLineupSelection.deleteMany({
      where: { teamId },
    });

    // Update Team columns
    await tx.team.update({
      where: { id: teamId },
      data: {
        defaultFormation: serializeFormation(parsed.data.formation ?? null) as MatchLineupFormation | null,
        defaultBlockPreset: serializeBlockPreset(parsed.data.blockPreset ?? null) as MatchLineupBlockPreset | null,
      },
    });

    // Create new selections
    const data = [
      ...parsed.data.starters.map((entry, index) => ({
        teamId,
        playerId: entry.playerId,
        role: "STARTER" as const,
        sortOrder: index,
        fieldX: entry.fieldX ?? null,
        fieldY: entry.fieldY ?? null,
      })),
      ...parsed.data.bench.map((item, index) => ({
        teamId,
        playerId: typeof item === "string" ? item : item.playerId,
        role: "BENCH" as const,
        sortOrder: index,
      })),
    ];

    if (data.length > 0) {
      await tx.defaultLineupSelection.createMany({ data });
    }
  });

  const updatedTeam = await loadDefaultLineup(teamId);
  if (!updatedTeam) {
    return NextResponse.json(
      { error: "Time não encontrado", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  trackOperationalEvent("default_lineup_saved", {
    teamId,
    startersCount: parsed.data.starters.length,
    benchCount: parsed.data.bench.length,
    hasFormation: parsed.data.formation != null,
  });

  return buildDefaultLineupResponse(updatedTeam);
}

export async function DELETE(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const teamId = session.user.teamId;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.defaultLineupSelection.deleteMany({
      where: { teamId },
    });
    await tx.team.update({
      where: { id: teamId },
      data: {
        defaultFormation: null,
        defaultBlockPreset: null,
      },
    });
  });

  const updatedTeam = await loadDefaultLineup(teamId);
  if (!updatedTeam) {
    return NextResponse.json(
      { error: "Time não encontrado", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  trackOperationalEvent("default_lineup_reset", {
    teamId,
  });

  return buildDefaultLineupResponse(updatedTeam);
}
