import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { rsvpResponseSchema } from "@/lib/validations/match";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { trackOperationalEvent } from "@/lib/telemetry";
import { syncMissingRSVPsForTeam } from "@/lib/match-rsvp-sync";
import { formatPlayerPosition } from "@/lib/player-positions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/matches/:id/rsvp — Confirm or decline RSVP
export async function POST(request: Request, { params }: RouteParams) {
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

  const { id: matchId } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  await syncMissingRSVPsForTeam(session.user.teamId);

  // Find the player linked to this user
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { playerId: true },
  });

  if (!user?.playerId) {
    return NextResponse.json(
      { error: "Usuário não tem jogador vinculado", code: "NO_PLAYER_LINKED" },
      { status: 403 }
    );
  }

  // Check player is active
  const player = await prisma.player.findUnique({
    where: { id: user.playerId },
    select: { id: true, status: true, teamId: true, position: true, secondaryPosition: true, name: true, fullName: true, cpf: true },
  });

  if (!player || player.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Jogador está inativo", code: "PLAYER_INACTIVE" },
      { status: 400 }
    );
  }

  if (player.teamId !== session.user.teamId) {
    return NextResponse.json(
      {
        error: "Jogador não pertence ao mesmo time da sessão",
        code: "FORBIDDEN",
      },
      { status: 403 }
    );
  }

  // Find the match
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: session.user.teamId },
    include: {
      positionLimits: {
        select: { position: true, maxPlayers: true },
      },
    },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  // Check if player is summoned for championship matches
  if (match.type === "CHAMPIONSHIP") {
    const existingRsvp = await prisma.rSVP.findUnique({
      where: {
        playerId_matchId: {
          playerId: player.id,
          matchId,
        },
      },
      select: { summoned: true },
    });

    if (!existingRsvp || !existingRsvp.summoned) {
      return NextResponse.json(
        {
          error: "Apenas jogadores convocados para este jogo podem registrar presença.",
          code: "NOT_SUMMONED",
        },
        { status: 403 }
      );
    }
  }

  // Check match is SCHEDULED
  if (match.status !== "SCHEDULED") {
    return NextResponse.json(
      { error: "Partida não está agendada", code: "MATCH_ALREADY_PAST" },
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

  const parsed = rsvpResponseSchema.safeParse(body);
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

  const { status } = parsed.data;

  const bodyObj = (body && typeof body === "object" ? body : {}) as Record<string, any>;
  const reqFullName = typeof bodyObj.fullName === "string" ? bodyObj.fullName.trim() : "";
  const reqCpf = typeof bodyObj.cpf === "string" ? bodyObj.cpf.trim() : "";

  // Check document details if match requires it
  if (match.requiresDocumentDetails && status === "CONFIRMED") {
    const finalFullName = reqFullName || player.fullName || "";
    const finalCpf = reqCpf || player.cpf || "";
    const nameWords = finalFullName.trim().split(/\s+/).filter(Boolean);

    if (!finalFullName || !finalCpf || nameWords.length < 2 || finalFullName.trim().length < 6) {
      return NextResponse.json(
        {
          error: "Esta partida exige a confirmação do Nome Completo (nome e sobrenome) e CPF para presença.",
          code: "DOCUMENT_REQUIRED",
          requiresDocument: true,
          currentFullName: player.fullName || "",
          currentCpf: player.cpf || "",
        },
        { status: 400 }
      );
    }
  }

  // Update player fullName and CPF if provided
  if (reqFullName || reqCpf) {
    await prisma.player.update({
      where: { id: player.id },
      data: {
        ...(reqFullName && { fullName: reqFullName }),
        ...(reqCpf && { cpf: reqCpf }),
      },
    });
  }

  // Check if player has an active suspension for this match
  const activeSuspension = await prisma.fine.findFirst({
    where: {
      playerId: player.id,
      severity: "SUSPENSION",
      status: "ACTIVE",
      suspendedMatchId: matchId,
    },
    select: { id: true, description: true }
  });

  if (activeSuspension && status === "CONFIRMED") {
    return NextResponse.json(
      {
        error: `Você está suspenso para esta partida: ${activeSuspension.description}`,
        code: "PLAYER_SUSPENDED",
      },
      { status: 403 }
    );
  }

  if (status === "CONFIRMED" && match.positionLimits.length > 0) {
    const currentRsvp = await prisma.rSVP.findUnique({
      where: {
        playerId_matchId: {
          playerId: player.id,
          matchId,
        },
      },
      select: { status: true },
    });

    const confirmedRsvps = await prisma.rSVP.findMany({
      where: {
        matchId,
        status: "CONFIRMED",
        ...(currentRsvp?.status === "CONFIRMED" ? { playerId: { not: player.id } } : {}),
      },
      select: {
        player: {
          select: {
            position: true,
            secondaryPosition: true,
          },
        },
      },
    });

    const limitsMap = new Map<string, number>();
    for (const l of match.positionLimits) {
      limitsMap.set(l.position, l.maxPlayers);
    }

    const positionCounts: Record<string, number> = {};

    for (const rsvp of confirmedRsvps) {
      const primary = rsvp.player.position;
      const secondary = rsvp.player.secondaryPosition;

      const primaryLimit = limitsMap.get(primary);
      const currentPrimaryCount = positionCounts[primary] || 0;

      if (primaryLimit === undefined || currentPrimaryCount < primaryLimit) {
        positionCounts[primary] = currentPrimaryCount + 1;
      } else if (secondary) {
        const secondaryLimit = limitsMap.get(secondary);
        const currentSecondaryCount = positionCounts[secondary] || 0;
        if (secondaryLimit === undefined || currentSecondaryCount < secondaryLimit) {
          positionCounts[secondary] = currentSecondaryCount + 1;
        } else {
          positionCounts[primary] = currentPrimaryCount + 1;
        }
      } else {
        positionCounts[primary] = currentPrimaryCount + 1;
      }
    }

    const primaryPos = player.position;
    const secondaryPos = player.secondaryPosition;

    const primaryLimit = limitsMap.get(primaryPos);
    const primaryAvailable = primaryLimit === undefined || (positionCounts[primaryPos] || 0) < primaryLimit;

    let secondaryAvailable = false;
    if (secondaryPos && secondaryPos !== primaryPos) {
      const secondaryLimit = limitsMap.get(secondaryPos);
      secondaryAvailable = secondaryLimit === undefined || (positionCounts[secondaryPos] || 0) < secondaryLimit;
    }

    if (!primaryAvailable && !secondaryAvailable) {
      const hasSecondary = Boolean(secondaryPos && secondaryPos !== primaryPos);
      const posFormatted = formatPlayerPosition(primaryPos);
      const secPosFormatted = hasSecondary ? formatPlayerPosition(secondaryPos) : "";

      const errorMessage = hasSecondary
        ? `Limite atingido para as posições ${posFormatted} e ${secPosFormatted}`
        : `Limite atingido para a posição ${posFormatted}`;

      return NextResponse.json(
        {
          error: errorMessage,
          code: "POSITION_LIMIT_REACHED",
          position: primaryPos,
          secondaryPosition: secondaryPos || undefined,
          maxPlayers: primaryLimit ?? 0,
        },
        { status: 409 }
      );
    }
  }

  // Get existing RSVP to record status transition
  const existingRsvp = await prisma.rSVP.findUnique({
    where: {
      playerId_matchId: {
        playerId: player.id,
        matchId,
      },
    },
    select: { id: true, status: true },
  });

  // Upsert the RSVP for this player+match
  const rsvp = await prisma.rSVP.upsert({
    where: {
      playerId_matchId: {
        playerId: player.id,
        matchId,
      },
    },
    update: {
      status,
      respondedAt: new Date(),
    },
    create: {
      playerId: player.id,
      matchId,
      status,
      respondedAt: new Date(),
      summoned: match.type === "FRIENDLY",
    },
  });

  // Log status change history
  if (!existingRsvp || existingRsvp.status !== status) {
    await prisma.rSVPStatusLog.create({
      data: {
        rsvpId: rsvp.id,
        playerId: player.id,
        matchId,
        oldStatus: existingRsvp?.status ?? null,
        newStatus: status,
      },
    });

    trackOperationalEvent("player_rsvp_status_changed", {
      rsvpId: rsvp.id,
      playerId: player.id,
      playerName: player.name,
      matchId,
      oldStatus: existingRsvp?.status ?? null,
      newStatus: status,
    });
  }

  return NextResponse.json({
    playerId: rsvp.playerId,
    matchId: rsvp.matchId,
    status: rsvp.status,
    respondedAt: rsvp.respondedAt?.toISOString() ?? null,
  });
}
