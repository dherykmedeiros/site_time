import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  updateOwnAvailabilitySchema,
  type AvailabilityFrequencyValue,
  type AvailabilityLevelValue,
  type PlayerAvailabilityRuleInput,
} from "@/lib/validations/player-availability";
import { withErrorHandler } from "@/lib/api-handler";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

type AvailabilityRuleRow = {
  id: string;
  dayOfWeek: number;
  startMinutes: number;
  endMinutes: number;
  frequency: AvailabilityFrequencyValue;
  availability: AvailabilityLevelValue;
  notes: string | null;
};

async function getOwnedPlayer(userId: string, teamId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { playerId: true },
  });

  if (!user?.playerId) {
    return null;
  }

  return prisma.player.findFirst({
    where: {
      id: user.playerId,
      teamId,
    },
    select: { id: true },
  });
}

function serializeRules(rows: AvailabilityRuleRow[]) {
  return rows.map((rule) => ({
    id: rule.id,
    dayOfWeek: rule.dayOfWeek,
    startMinutes: rule.startMinutes,
    endMinutes: rule.endMinutes,
    frequency: rule.frequency,
    availability: rule.availability,
    notes: rule.notes,
  }));
}

async function listRules(playerId: string) {
  return prisma.$queryRaw<AvailabilityRuleRow[]>(Prisma.sql`
    SELECT
      "id",
      "dayOfWeek",
      "startMinutes",
      "endMinutes",
      "frequency",
      "availability",
      "notes"
    FROM "player_availability_rules"
    WHERE "playerId" = ${playerId}
    ORDER BY "dayOfWeek" ASC, "startMinutes" ASC, "createdAt" ASC
  `);
}

async function replaceRules(tx: Prisma.TransactionClient, playerId: string, rules: PlayerAvailabilityRuleInput[]) {
  await tx.$executeRaw(Prisma.sql`
    DELETE FROM "player_availability_rules"
    WHERE "playerId" = ${playerId}
  `);

  for (const rule of rules) {
    const id = crypto.randomUUID();
    await tx.$executeRaw(Prisma.sql`
      INSERT INTO "player_availability_rules" (
        "id",
        "playerId",
        "dayOfWeek",
        "startMinutes",
        "endMinutes",
        "frequency",
        "availability",
        "notes",
        "createdAt",
        "updatedAt"
      ) VALUES (
        ${id},
        ${playerId},
        ${rule.dayOfWeek},
        ${rule.startMinutes},
        ${rule.endMinutes},
        CAST(${rule.frequency} AS "AvailabilityFrequency"),
        CAST(${rule.availability} AS "AvailabilityLevel"),
        ${rule.notes?.trim() ? rule.notes.trim() : null},
        NOW(),
        NOW()
      )
    `);
  }
}

export const GET = withErrorHandler(async () => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuario nao possui equipe vinculada" },
      { status: 400 }
    );
  }

  const player = await getOwnedPlayer(session.user.id, session.user.teamId);
  if (!player) {
    return NextResponse.json(
      { error: "Perfil de jogador nao encontrado", code: "PLAYER_PROFILE_NOT_FOUND" },
      { status: 404 }
    );
  }

  const rules = await listRules(player.id);

  return NextResponse.json({
    rules: serializeRules(rules),
  });
});

export const PATCH = withErrorHandler(async (request: Request) => {
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

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuario nao possui equipe vinculada" },
      { status: 400 }
    );
  }

  const player = await getOwnedPlayer(session.user.id, session.user.teamId);
  if (!player) {
    return NextResponse.json(
      { error: "Perfil de jogador nao encontrado", code: "PLAYER_PROFILE_NOT_FOUND" },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = updateOwnAvailabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos invalidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await replaceRules(tx, player.id, parsed.data.rules);
  });

  const rules = await listRules(player.id);

  return NextResponse.json({
    rules: serializeRules(rules),
  });
});