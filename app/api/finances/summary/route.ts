import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { summaryQuerySchema } from "@/lib/validations/finance";

// GET /api/finances/summary — Monthly financial summary
export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const teamId = session.user.teamId;
  const { searchParams } = new URL(request.url);

  const parsed = summaryQuerySchema.safeParse({
    month: searchParams.get("month"),
    year: searchParams.get("year"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Mês ou ano inválido",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { month, year } = parsed.data;

  // Date range for the month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // Group by category and type
  const byCategory = await prisma.transaction.groupBy({
    by: ["category", "type"],
    where: {
      teamId,
      date: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
    _count: { _all: true },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  const categoryBreakdown = byCategory.map((entry) => {
    const total = Number(entry._sum.amount ?? 0);
    if (entry.type === "INCOME") totalIncome += total;
    if (entry.type === "EXPENSE") totalExpense += total;

    return {
      category: entry.category,
      type: entry.type,
      total,
      count: entry._count._all,
    };
  });

  return NextResponse.json({
    month,
    year,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    byCategory: categoryBreakdown,
  });
}
