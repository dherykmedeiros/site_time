import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { createFriendlyRequestSchema } from "@/lib/validations/friendly-request";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";
import {
  buildFriendlyAvailability,
  dateKeyInTimeZone,
  normalizeAllowedWeekdays,
} from "@/lib/friendly-availability";

// GET /api/friendly-requests — List friendly requests (ADMIN)
export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: { teamId: string; status?: "PENDING" | "APPROVED" | "REJECTED" } = {
    teamId: session.user.teamId,
  };

  if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    where.status = status as "PENDING" | "APPROVED" | "REJECTED";
  }

  const requests = await prisma.friendlyRequest.findMany({
    where,
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
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({
    requests: requests.map((r) => ({
      id: r.id,
      requesterTeamName: r.requesterTeamName,
      contactEmail: r.contactEmail,
      contactPhone: r.contactPhone,
      suggestedDates: r.suggestedDates,
      requestedDate: r.requestedDate?.toISOString() ?? null,
      suggestedVenue: r.suggestedVenue,
      proposedFee: r.proposedFee ? Number(r.proposedFee) : null,
      status: r.status,
      requesterTeamId: r.requesterTeamId,
      requesterTeam: r.requesterTeam
        ? {
            id: r.requesterTeam.id,
            name: r.requesterTeam.name,
            slug: r.requesterTeam.slug,
            badgeUrl: r.requesterTeam.badgeUrl,
            city: r.requesterTeam.city,
            region: r.requesterTeam.region,
          }
        : null,
      createdAt: r.createdAt.toISOString(),
    })),
  });
});

// POST /api/friendly-requests — Create friendly request (PUBLIC, rate-limited)
export const POST = withErrorHandler(async (request: Request) => {
  const ip = extractClientIp(request);
  const { allowed, retryAfterMinutes } = await rateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: `Muitas solicitações. Tente novamente em ${retryAfterMinutes} minutos.`,
        code: "RATE_LIMITED",
      },
      { status: 429 }
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

  const parsed = createFriendlyRequestSchema.safeParse(body);
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

  const { teamSlug, ...data } = parsed.data;

  // Find team by slug
  const team = await prisma.team.findUnique({
    where: { slug: teamSlug },
  });

  if (!team) {
    return NextResponse.json(
      { error: "Time não encontrado", code: "TEAM_NOT_FOUND" },
      { status: 404 }
    );
  }

  const requestedDate = data.requestedDate ? new Date(data.requestedDate) : null;
  if (requestedDate) {
    const rangeStart = new Date(requestedDate);
    rangeStart.setUTCDate(rangeStart.getUTCDate() - team.friendlyInviteBufferAfterDays - 2);
    const rangeEnd = new Date(requestedDate);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + team.friendlyInviteBufferBeforeDays + 2);

    const scheduledMatches = await prisma.match.findMany({
      where: {
        teamId: team.id,
        status: "SCHEDULED",
        date: { gte: rangeStart, lte: rangeEnd },
      },
      select: { date: true },
    });
    const rules = {
      enabled: team.friendlyInvitesEnabled,
      minNoticeDays: team.friendlyInviteMinNoticeDays,
      maxAdvanceDays: team.friendlyInviteMaxAdvanceDays,
      bufferBeforeDays: team.friendlyInviteBufferBeforeDays,
      bufferAfterDays: team.friendlyInviteBufferAfterDays,
      allowedWeekdays: normalizeAllowedWeekdays(team.friendlyInviteAllowedWeekdays),
    };
    const requestedDay = dateKeyInTimeZone(requestedDate);
    const availability = buildFriendlyAvailability({
      rules,
      scheduledMatches: scheduledMatches.map((match) => match.date),
    }).find((day) => day.date === requestedDay);

    if (!availability?.available) {
      return NextResponse.json(
        {
          error: availability?.reason || "A data selecionada não está disponível para convite",
          code: "DATE_UNAVAILABLE",
        },
        { status: 409 }
      );
    }
  }

  let resolvedRequesterTeamId = data.requesterTeamId || null;
  if (!resolvedRequesterTeamId && data.requesterTeamName) {
    const matchedTeam = await prisma.team.findFirst({
      where: {
        name: { equals: data.requesterTeamName, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (matchedTeam) {
      resolvedRequesterTeamId = matchedTeam.id;
    }
  }

  const friendlyRequest = await prisma.friendlyRequest.create({
    data: {
      requesterTeamName: data.requesterTeamName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || null,
      suggestedDates: data.suggestedDates,
      requestedDate,
      suggestedVenue: data.suggestedVenue || null,
      proposedFee: data.proposedFee ?? null,
      teamId: team.id,
      requesterTeamId: resolvedRequesterTeamId,
    },
  });

  return NextResponse.json(
    {
      id: friendlyRequest.id,
      status: "PENDING",
      message: "Solicitação enviada com sucesso. Você receberá uma resposta por e-mail.",
    },
    { status: 201 }
  );
});
