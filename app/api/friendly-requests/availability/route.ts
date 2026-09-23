import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildFriendlyAvailability,
  normalizeAllowedWeekdays,
} from "@/lib/friendly-availability";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async (request: Request) => {
  const teamSlug = new URL(request.url).searchParams.get("teamSlug")?.trim();
  if (!teamSlug) {
    return NextResponse.json(
      { error: "Time não informado", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const team = await prisma.team.findUnique({
    where: { slug: teamSlug },
    select: {
      id: true,
      friendlyInvitesEnabled: true,
      friendlyInviteMinNoticeDays: true,
      friendlyInviteMaxAdvanceDays: true,
      friendlyInviteBufferBeforeDays: true,
      friendlyInviteBufferAfterDays: true,
      friendlyInviteAllowedWeekdays: true,
    },
  });

  if (!team) {
    return NextResponse.json(
      { error: "Time não encontrado", code: "TEAM_NOT_FOUND" },
      { status: 404 }
    );
  }

  const now = new Date();
  const rangeStart = new Date(now);
  rangeStart.setUTCDate(rangeStart.getUTCDate() - team.friendlyInviteBufferAfterDays - 1);
  const rangeEnd = new Date(now);
  rangeEnd.setUTCDate(
    rangeEnd.getUTCDate() + team.friendlyInviteMaxAdvanceDays + team.friendlyInviteBufferBeforeDays + 2
  );

  const matches = await prisma.match.findMany({
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

  return NextResponse.json({
    rules,
    days: buildFriendlyAvailability({
      rules,
      scheduledMatches: matches.map((match) => match.date),
      now,
    }),
  });
});
