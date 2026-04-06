import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { buildSuggestedSharePerPresent, defaultBordereauChecklist } from "@/lib/bordereau";
import { trackOperationalEvent } from "@/lib/telemetry";
import { patchMatchBordereauSchema } from "@/lib/validations/match";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteParams {
  params: Promise<{ id: string }>;
}

type ChecklistRow = {
  id: string;
  label: string;
  isChecked: boolean;
  sortOrder: number;
};

type AttendanceRow = {
  playerId: string;
  present: boolean;
  checkedInAt: Date | null;
};

type ExpenseRow = {
  id: string;
  amount: number | string;
  category: string;
  description: string;
  date: Date;
  matchId: string | null;
};

async function ensureDefaultChecklist(matchId: string) {
  const existing = await prisma.$queryRaw<ChecklistRow[]>(Prisma.sql`
    SELECT "id", "label", "isChecked", "sortOrder"
    FROM "match_checklist_items"
    WHERE "matchId" = ${matchId}
    ORDER BY "sortOrder" ASC
  `);

  if (existing.length > 0) {
    return existing;
  }

  await prisma.$transaction(async (tx) => {
    for (const [index, label] of defaultBordereauChecklist.entries()) {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "match_checklist_items" (
          "id",
          "matchId",
          "label",
          "isChecked",
          "sortOrder",
          "createdAt",
          "updatedAt"
        ) VALUES (
          ${crypto.randomUUID()},
          ${matchId},
          ${label},
          false,
          ${index},
          NOW(),
          NOW()
        )
      `);
    }
  });

  return prisma.$queryRaw<ChecklistRow[]>(Prisma.sql`
    SELECT "id", "label", "isChecked", "sortOrder"
    FROM "match_checklist_items"
    WHERE "matchId" = ${matchId}
    ORDER BY "sortOrder" ASC
  `);
}

async function buildBordereauResponse(matchId: string, teamId: string) {
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
    select: {
      id: true,
      rsvps: {
        select: {
          playerId: true,
          status: true,
        },
      },
    },
  });

  if (!match) {
    return null;
  }

  const [checklistRows, attendanceRows, expenseRows, players] = await Promise.all([
    ensureDefaultChecklist(matchId),
    prisma.$queryRaw<AttendanceRow[]>(Prisma.sql`
      SELECT "playerId", "present", "checkedInAt"
      FROM "match_attendances"
      WHERE "matchId" = ${matchId}
    `),
    prisma.$queryRaw<ExpenseRow[]>(Prisma.sql`
      SELECT "id", "amount", "category", "description", "date", "matchId"
      FROM "transactions"
      WHERE "matchId" = ${matchId} AND "type" = 'EXPENSE'
      ORDER BY "date" DESC, "createdAt" DESC
    `),
    prisma.player.findMany({
      where: { teamId },
      select: { id: true, name: true, status: true },
      orderBy: [{ shirtNumber: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const attendanceMap = new Map(attendanceRows.map((row) => [row.playerId, row]));
  const rsvpMap = new Map(match.rsvps.map((row) => [row.playerId, row.status]));
  const presentCount = attendanceRows.filter((row) => row.present).length;
  const totalExpense = expenseRows.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return {
    matchId,
    checklist: checklistRows.map((item) => ({
      id: item.id,
      label: item.label,
      isChecked: item.isChecked,
      sortOrder: item.sortOrder,
    })),
    attendance: players.map((player) => {
      const attendance = attendanceMap.get(player.id);
      return {
        playerId: player.id,
        playerName: player.name,
        rsvpStatus: rsvpMap.get(player.id) ?? "PENDING",
        present: attendance?.present ?? false,
        checkedInAt: attendance?.checkedInAt?.toISOString() ?? null,
      };
    }),
    expenses: expenseRows.map((expense) => ({
      id: expense.id,
      amount: Number(expense.amount),
      category: expense.category,
      description: expense.description,
      date: expense.date.toISOString(),
      matchId: expense.matchId,
    })),
    costSummary: {
      totalExpense,
      presentCount,
      suggestedSharePerPresent: buildSuggestedSharePerPresent(totalExpense, presentCount),
    },
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const response = await buildBordereauResponse(id, session.user.teamId);

  if (!response) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  return NextResponse.json(response);
}

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

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const match = await prisma.match.findFirst({
    where: { id, teamId: session.user.teamId },
    select: { id: true, status: true },
  });

  if (!match) {
    return NextResponse.json(
      { error: "Partida não encontrada", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  if (match.status !== "SCHEDULED") {
    return NextResponse.json(
      {
        error: "O bordero so pode ser alterado em partidas agendadas",
        code: "INVALID_MATCH_STATUS",
      },
      { status: 409 }
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

  const parsed = patchMatchBordereauSchema.safeParse(body);
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

  if (parsed.data.checklist) {
    const checklistSortOrders = parsed.data.checklist.map((item) => item.sortOrder);
    const uniqueSortOrders = new Set(checklistSortOrders);
    if (uniqueSortOrders.size !== checklistSortOrders.length) {
      return NextResponse.json(
        {
          error: "Checklist invalido: existem itens com a mesma ordem",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }
  }

  const attendancePlayerIds = parsed.data.attendance?.map((item) => item.playerId) ?? [];
  const uniqueAttendancePlayerIds = new Set(attendancePlayerIds);
  if (uniqueAttendancePlayerIds.size !== attendancePlayerIds.length) {
    return NextResponse.json(
      { error: "Jogador duplicado no check-in", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (attendancePlayerIds.length > 0) {
    const ownedPlayers = await prisma.player.findMany({
      where: {
        teamId: session.user.teamId,
        id: { in: attendancePlayerIds },
      },
      select: { id: true },
    });

    if (ownedPlayers.length !== attendancePlayerIds.length) {
      return NextResponse.json(
        { error: "Jogador inválido para este time", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    if (parsed.data.checklist) {
      await tx.$executeRaw(Prisma.sql`
        DELETE FROM "match_checklist_items"
        WHERE "matchId" = ${id}
      `);

      for (const item of parsed.data.checklist) {
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO "match_checklist_items" (
            "id",
            "matchId",
            "label",
            "isChecked",
            "sortOrder",
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${crypto.randomUUID()},
            ${id},
            ${item.label},
            ${item.isChecked},
            ${item.sortOrder},
            NOW(),
            NOW()
          )
        `);
      }
    }

    if (parsed.data.attendance) {
      const existingAttendances = await tx.$queryRaw<AttendanceRow[]>(Prisma.sql`
        SELECT "playerId", "present", "checkedInAt"
        FROM "match_attendances"
        WHERE "matchId" = ${id}
      `);
      const existingMap = new Map(existingAttendances.map((row) => [row.playerId, row]));

      await tx.$executeRaw(Prisma.sql`
        DELETE FROM "match_attendances"
        WHERE "matchId" = ${id}
      `);

      for (const item of parsed.data.attendance) {
        const existing = existingMap.get(item.playerId);
        const checkedInAt = item.present
          ? existing?.checkedInAt ?? new Date()
          : null;

        await tx.$executeRaw(Prisma.sql`
          INSERT INTO "match_attendances" (
            "id",
            "matchId",
            "playerId",
            "present",
            "checkedInAt",
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${crypto.randomUUID()},
            ${id},
            ${item.playerId},
            ${item.present},
            ${checkedInAt},
            NOW(),
            NOW()
          )
        `);
      }
    }
  });

  const response = await buildBordereauResponse(id, session.user.teamId);

  trackOperationalEvent("match_bordereau_saved", {
    teamId: session.user.teamId,
    matchId: id,
    checklistCount: parsed.data.checklist?.length ?? 0,
    attendanceCount: parsed.data.attendance?.length ?? 0,
  });

  return NextResponse.json(response);
}