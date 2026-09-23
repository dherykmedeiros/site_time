import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { processFriendlyRequestSchema } from "@/lib/validations/friendly-request";
import { sendFriendlyApprovalEmail, sendFriendlyRejectionEmail } from "@/lib/email";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import {
  buildFriendlyAvailability,
  dateKeyInTimeZone,
  normalizeAllowedWeekdays,
} from "@/lib/friendly-availability";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/friendly-requests/:id — Get request details (ADMIN)
export async function GET(request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const friendlyRequest = await prisma.friendlyRequest.findFirst({
    where: { id, teamId: session.user.teamId },
    include: {
      requesterTeam: {
        select: {
          id: true,
          name: true,
          slug: true,
          badgeUrl: true,
          city: true,
          region: true,
        },
      },
    },
  });

  if (!friendlyRequest) {
    return NextResponse.json(
      { error: "Solicitação não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: friendlyRequest.id,
    requesterTeamName: friendlyRequest.requesterTeamName,
    contactEmail: friendlyRequest.contactEmail,
    contactPhone: friendlyRequest.contactPhone,
    suggestedDates: friendlyRequest.suggestedDates,
    requestedDate: friendlyRequest.requestedDate?.toISOString() ?? null,
    suggestedVenue: friendlyRequest.suggestedVenue,
    proposedFee: friendlyRequest.proposedFee ? Number(friendlyRequest.proposedFee) : null,
    status: friendlyRequest.status,
    rejectionReason: friendlyRequest.rejectionReason,
    requesterTeamId: friendlyRequest.requesterTeamId,
    requesterTeam: friendlyRequest.requesterTeam
      ? {
          id: friendlyRequest.requesterTeam.id,
          name: friendlyRequest.requesterTeam.name,
          slug: friendlyRequest.requesterTeam.slug,
          badgeUrl: friendlyRequest.requesterTeam.badgeUrl,
          city: friendlyRequest.requesterTeam.city,
          region: friendlyRequest.requesterTeam.region,
        }
      : null,
    createdAt: friendlyRequest.createdAt.toISOString(),
    updatedAt: friendlyRequest.updatedAt.toISOString(),
  });
}

// PATCH /api/friendly-requests/:id — Approve or reject (ADMIN)
export async function PATCH(request: Request, { params }: RouteParams) {
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

  const { id } = await params;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const friendlyRequest = await prisma.friendlyRequest.findFirst({
    where: { id, teamId: session.user.teamId },
    include: {
      team: {
        select: {
          name: true,
          defaultVenue: true,
          badgeUrl: true,
          friendlyInvitesEnabled: true,
          friendlyInviteMinNoticeDays: true,
          friendlyInviteMaxAdvanceDays: true,
          friendlyInviteBufferBeforeDays: true,
          friendlyInviteBufferAfterDays: true,
          friendlyInviteAllowedWeekdays: true,
        },
      },
      requesterTeam: { select: { id: true, name: true, badgeUrl: true } },
    },
  });

  if (!friendlyRequest) {
    return NextResponse.json(
      { error: "Solicitação não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  if (friendlyRequest.status !== "PENDING") {
    return NextResponse.json(
      { error: "Solicitação já foi processada", code: "NOT_PENDING" },
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

  const parsed = processFriendlyRequestSchema.safeParse(body);
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

  const { action, matchDate, matchVenue, rejectionReason } = parsed.data;

  if (action === "approve") {
    const venue = matchVenue || friendlyRequest.suggestedVenue || friendlyRequest.team.defaultVenue || "A definir";
    const requestedMatchDate = matchDate ? new Date(matchDate) : friendlyRequest.requestedDate;
    if (!requestedMatchDate) {
      return NextResponse.json(
        { error: "Informe a data da partida", code: "MATCH_DATE_REQUIRED" },
        { status: 400 }
      );
    }
    const date = new Date(requestedMatchDate);
    const rangeStart = new Date(date);
    rangeStart.setUTCDate(rangeStart.getUTCDate() - friendlyRequest.team.friendlyInviteBufferAfterDays - 2);
    const rangeEnd = new Date(date);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + friendlyRequest.team.friendlyInviteBufferBeforeDays + 2);
    const scheduledMatches = await prisma.match.findMany({
      where: {
        teamId: session.user.teamId,
        status: "SCHEDULED",
        date: { gte: rangeStart, lte: rangeEnd },
      },
      select: { date: true },
    });
    const rules = {
      enabled: friendlyRequest.team.friendlyInvitesEnabled,
      minNoticeDays: friendlyRequest.team.friendlyInviteMinNoticeDays,
      maxAdvanceDays: friendlyRequest.team.friendlyInviteMaxAdvanceDays,
      bufferBeforeDays: friendlyRequest.team.friendlyInviteBufferBeforeDays,
      bufferAfterDays: friendlyRequest.team.friendlyInviteBufferAfterDays,
      allowedWeekdays: normalizeAllowedWeekdays(friendlyRequest.team.friendlyInviteAllowedWeekdays),
    };
    const availability = buildFriendlyAvailability({
      rules,
      scheduledMatches: scheduledMatches.map((match) => match.date),
    }).find((day) => day.date === dateKeyInTimeZone(date));
    if (!availability?.available) {
      return NextResponse.json(
        {
          error: availability?.reason || "A data não está disponível pelas regras do time",
          code: "DATE_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    try {
      // Create match + update request in transaction
      const [updatedRequest, match] = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Re-check status inside transaction to prevent race condition
        const current = await tx.friendlyRequest.findUnique({ where: { id }, select: { status: true } });
        if (current?.status !== "PENDING") throw new Error("NOT_PENDING");

        const updated = await tx.friendlyRequest.update({
          where: { id },
          data: { status: "APPROVED" },
        });

        // 1. Create match for Host Team
        const createdHostMatch = await tx.match.create({
          data: {
            date,
            venue,
            opponent: friendlyRequest.requesterTeamName,
            opponentBadgeUrl: friendlyRequest.requesterTeam?.badgeUrl || null,
            type: "FRIENDLY",
            status: "SCHEDULED",
            teamId: session.user.teamId!,
          },
        });

        // Auto-create PENDING RSVPs for active players of Host Team
        const activeHostPlayers = await tx.player.findMany({
          where: { teamId: session.user.teamId!, status: "ACTIVE" },
          select: { id: true },
        });

        if (activeHostPlayers.length > 0) {
          await tx.rSVP.createMany({
            data: activeHostPlayers.map((p) => ({
              playerId: p.id,
              matchId: createdHostMatch.id,
            })),
          });
        }

        // 2. Automated Bilateral Match Creation for Requester Team (If registered on VARzea)
        if (friendlyRequest.requesterTeamId) {
          const createdRequesterMatch = await tx.match.create({
            data: {
              date,
              venue,
              opponent: friendlyRequest.team.name,
              opponentBadgeUrl: friendlyRequest.team.badgeUrl || null,
              type: "FRIENDLY",
              status: "SCHEDULED",
              teamId: friendlyRequest.requesterTeamId,
            },
          });

          // Auto-create PENDING RSVPs for active players of Requester Team
          const activeRequesterPlayers = await tx.player.findMany({
            where: { teamId: friendlyRequest.requesterTeamId, status: "ACTIVE" },
            select: { id: true },
          });

          if (activeRequesterPlayers.length > 0) {
            await tx.rSVP.createMany({
              data: activeRequesterPlayers.map((p) => ({
                playerId: p.id,
                matchId: createdRequesterMatch.id,
              })),
            });
          }
        }

        return [updated, createdHostMatch] as const;
      });

    // Send approval email (non-blocking)
    if (friendlyRequest.contactEmail) {
      sendFriendlyApprovalEmail({
        to: friendlyRequest.contactEmail,
        requesterTeamName: friendlyRequest.requesterTeamName,
        teamName: friendlyRequest.team.name,
        matchDate: date.toLocaleDateString("pt-BR"),
        venue,
      }).catch(console.error);
    }

    return NextResponse.json({
      request: {
        id: updatedRequest.id,
        status: "APPROVED",
      },
      match: {
        id: match.id,
        date: match.date.toISOString(),
        venue: match.venue,
        opponent: match.opponent,
        type: match.type,
        status: match.status,
      },
    });
    } catch (err) {
      if (err instanceof Error && err.message === "NOT_PENDING") {
        return NextResponse.json(
          { error: "Solicitação já foi processada", code: "NOT_PENDING" },
          { status: 400 }
        );
      }
      throw err;
    }
  }

  // Reject
  const reason = rejectionReason || "Sem motivo informado";

  try {
    const updatedRequest = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Re-check status inside transaction to prevent race condition
      const current = await tx.friendlyRequest.findUnique({ where: { id }, select: { status: true } });
      if (current?.status !== "PENDING") throw new Error("NOT_PENDING");

      return tx.friendlyRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
          rejectionReason: reason,
        },
      });
    });

    // Send rejection email (non-blocking)
    if (friendlyRequest.contactEmail) {
      sendFriendlyRejectionEmail({
        to: friendlyRequest.contactEmail,
        requesterTeamName: friendlyRequest.requesterTeamName,
        teamName: friendlyRequest.team.name,
        reason,
      }).catch(console.error);
    }

    return NextResponse.json({
      request: {
        id: updatedRequest.id,
        status: "REJECTED",
        rejectionReason: reason,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_PENDING") {
      return NextResponse.json(
        { error: "Solicitação já foi processada", code: "NOT_PENDING" },
        { status: 400 }
      );
    }
    throw err;
  }
}
