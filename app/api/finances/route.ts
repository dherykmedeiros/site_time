import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { createTransactionSchema } from "@/lib/validations/finance";
import { trackOperationalEvent } from "@/lib/telemetry";
import { Prisma } from "@prisma/client";

type TransactionListRow = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number | string;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
  matchId: string | null;
  matchOpponent: string | null;
  matchDate: Date | null;
};

// GET /api/finances — List transactions with filters + pagination + balance
export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const teamId = session.user.teamId;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10) || 20, 1), 100);

  const where: Prisma.TransactionWhereInput = { teamId };

  if (type && ["INCOME", "EXPENSE"].includes(type)) {
    where.type = type as "INCOME" | "EXPENSE";
  }
  if (
    category &&
    ["MEMBERSHIP", "FRIENDLY_FEE", "VENUE_RENTAL", "REFEREE", "EQUIPMENT", "OTHER"].includes(category)
  ) {
    where.category = category as Prisma.EnumTransactionCategoryFilter;
  }
  if (from || to) {
    where.date = {};
    if (from) (where.date as Prisma.DateTimeFilter).gte = new Date(from);
    if (to) (where.date as Prisma.DateTimeFilter).lte = new Date(to);
  }

  const filters: Prisma.Sql[] = [Prisma.sql`t."teamId" = ${teamId}`];
  if (type && ["INCOME", "EXPENSE"].includes(type)) {
    filters.push(Prisma.sql`t."type" = ${type}`);
  }
  if (
    category &&
    ["MEMBERSHIP", "FRIENDLY_FEE", "VENUE_RENTAL", "REFEREE", "EQUIPMENT", "OTHER"].includes(category)
  ) {
    filters.push(Prisma.sql`t."category" = ${category}`);
  }
  if (from) {
    filters.push(Prisma.sql`t."date" >= ${new Date(from)}`);
  }
  if (to) {
    filters.push(Prisma.sql`t."date" <= ${new Date(to)}`);
  }

  const whereSql = Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}`;

  const [transactions, total] = await Promise.all([
    prisma.$queryRaw<TransactionListRow[]>(Prisma.sql`
      SELECT
        t."id",
        t."type",
        t."amount",
        t."description",
        t."category",
        t."date",
        t."createdAt",
        t."matchId",
        m."opponent" AS "matchOpponent",
        m."date" AS "matchDate"
      FROM "transactions" t
      LEFT JOIN "matches" m ON m."id" = t."matchId"
      ${whereSql}
      ORDER BY t."date" DESC, t."createdAt" DESC
      OFFSET ${(page - 1) * limit}
      LIMIT ${limit}
    `),
    prisma.$queryRaw<Array<{ total: bigint }>>(Prisma.sql`
      SELECT COUNT(*)::bigint AS "total"
      FROM "transactions" t
      ${whereSql}
    `),
  ]);

  // Calculate overall balance (all transactions for team, not just filtered)
  const balanceAgg = await prisma.transaction.groupBy({
    by: ["type"],
    where: { teamId },
    _sum: { amount: true },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  for (const entry of balanceAgg) {
    if (entry.type === "INCOME") totalIncome = Number(entry._sum.amount ?? 0);
    if (entry.type === "EXPENSE") totalExpense = Number(entry._sum.amount ?? 0);
  }
  const balance = totalIncome - totalExpense;
  const totalCount = Number(total[0]?.total ?? 0);

  return NextResponse.json({
    transactions: transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      category: t.category,
      date: t.date.toISOString(),
      createdAt: t.createdAt.toISOString(),
      matchId: t.matchId,
      matchOpponent: t.matchOpponent,
      matchDate: t.matchDate?.toISOString() ?? null,
    })),
    balance,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
}

// POST /api/finances — Create transaction (ADMIN)
export async function POST(request: Request) {
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

  const parsed = createTransactionSchema.safeParse(body);
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

  const { type, amount, description, category, date } = parsed.data;
  const { matchId } = parsed.data;
  const dateObj = new Date(date);

  if (dateObj > new Date()) {
    return NextResponse.json(
      { error: "Data no futuro", code: "DATE_IN_FUTURE" },
      { status: 400 }
    );
  }

  if (matchId) {
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        teamId: session.user.teamId,
      },
      select: { id: true, status: true },
    });

    if (!match) {
      return NextResponse.json(
        { error: "Partida não encontrada", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    if (match.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Nao e permitido vincular despesa a partida cancelada", code: "INVALID_MATCH_STATUS" },
        { status: 409 }
      );
    }
  }

  const [transaction] = await prisma.$queryRaw<TransactionListRow[]>(Prisma.sql`
    INSERT INTO "transactions" (
      "id",
      "type",
      "amount",
      "description",
      "category",
      "date",
      "teamId",
      "matchId",
      "createdAt",
      "updatedAt"
    ) VALUES (
      ${crypto.randomUUID()},
      CAST(${type} AS "TransactionType"),
      ${amount},
      ${description},
      CAST(${category} AS "TransactionCategory"),
      ${dateObj},
      ${session.user.teamId},
      ${matchId ?? null},
      NOW(),
      NOW()
    )
    RETURNING "id", "type", "amount", "description", "category", "date", "createdAt", "matchId"
  `);

  if (transaction.matchId) {
    trackOperationalEvent("finance_match_expense_created", {
      teamId: session.user.teamId,
      transactionId: transaction.id,
      matchId: transaction.matchId,
      category: transaction.category,
      amount: Number(transaction.amount),
    });
  }

  return NextResponse.json(
    {
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      description: transaction.description,
      category: transaction.category,
      date: transaction.date.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
      matchId: transaction.matchId,
    },
    { status: 201 }
  );
}
