import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  buildMatchAvailabilityForecast,
  resolveAvailabilitySlot,
  type AvailabilityForecastPlayer,
} from "@/lib/player-availability";
import { matchAvailabilityQuerySchema } from "@/lib/validations/match-availability";
import type { AvailabilityFrequencyValue, AvailabilityLevelValue } from "@/lib/validations/player-availability";

type AvailabilityRuleRow = {
  playerId: string;
  dayOfWeek: number;
  startMinutes: number;
  endMinutes: number;
  frequency: AvailabilityFrequencyValue;
  availability: AvailabilityLevelValue;
};

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const parsed = matchAvailabilityQuerySchema.safeParse({
    date: searchParams.get("date") ?? "",
  });

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

  const activePlayers = await prisma.player.findMany({
    where: {
      teamId: session.user.teamId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      position: true,
    },
    orderBy: [{ shirtNumber: "asc" }, { createdAt: "asc" }],
  });

  let ruleRows: AvailabilityRuleRow[] = [];
  if (activePlayers.length > 0) {
    const playerIds = activePlayers.map((player) => player.id);
    ruleRows = await prisma.$queryRaw<AvailabilityRuleRow[]>(Prisma.sql`
      SELECT
        "playerId",
        "dayOfWeek",
        "startMinutes",
        "endMinutes",
        "frequency",
        "availability"
      FROM "player_availability_rules"
      WHERE "playerId" IN (${Prisma.join(playerIds)})
      ORDER BY "playerId" ASC, "dayOfWeek" ASC, "startMinutes" ASC
    `);
  }

  const rulesByPlayer = new Map<string, AvailabilityRuleRow[]>();
  for (const rule of ruleRows) {
    const current = rulesByPlayer.get(rule.playerId) ?? [];
    current.push(rule);
    rulesByPlayer.set(rule.playerId, current);
  }

  const players: AvailabilityForecastPlayer[] = activePlayers.map((player) => ({
    id: player.id,
    position: player.position,
    availabilityRules: rulesByPlayer.get(player.id) ?? [],
  }));

  const slot = resolveAvailabilitySlot(parsed.data.date);
  const forecast = buildMatchAvailabilityForecast({
    matchDate: slot.matchDate,
    dayOfWeek: slot.dayOfWeek,
    minutesOfDay: slot.minutesOfDay,
    players,
  });

  return NextResponse.json(forecast);
}