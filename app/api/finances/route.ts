import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { createTransactionSchema } from "@/lib/validations/finance";
import { Prisma } from "@prisma/client";

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

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
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

  return NextResponse.json({
    transactions: transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      category: t.category,
      date: t.date.toISOString(),
      createdAt: t.createdAt.toISOString(),
    })),
    balance,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
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
  const dateObj = new Date(date);

  if (dateObj > new Date()) {
    return NextResponse.json(
      { error: "Data no futuro", code: "DATE_IN_FUTURE" },
      { status: 400 }
    );
  }

  const transaction = await prisma.transaction.create({
    data: {
      type,
      amount,
      description,
      category,
      date: dateObj,
      teamId: session.user.teamId,
    },
  });

  return NextResponse.json(
    {
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      description: transaction.description,
      category: transaction.category,
      date: transaction.date.toISOString(),
      createdAt: transaction.createdAt.toISOString(),
    },
    { status: 201 }
  );
}
