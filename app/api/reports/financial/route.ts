import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
function formatMonthYear(d: Date | string) {
  const date = new Date(d);
  const m = MONTHS_PT[date.getMonth()];
  const y = String(date.getFullYear()).slice(2);
  return `${m}/${y}`;
}

const CATEGORY_LABELS: Record<string, string> = {
  MEMBERSHIP: "Mensalidade",
  FRIENDLY_FEE: "Taxa de Amistoso",
  MATCH_FEE: "Taxa de Jogo",
  VENUE_RENTAL: "Aluguel de Campo",
  REFEREE: "Arbitragem",
  EQUIPMENT: "Equipamentos",
  OTHER: "Outros"
};

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const teamId = session.user.teamId;
  if (!teamId) return NextResponse.json({ error: "Sem time vinculado" }, { status: 403 });
  
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const dateFilter: any = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) dateFilter.lte = new Date(to);

  const txFilter: any = { teamId, status: "PAID" };
  if (from || to) txFilter.date = dateFilter;

  const transactions = await prisma.transaction.findMany({
    where: txFilter
  });

  const memberships = await prisma.membershipPayment.findMany({
    where: {
      player: { teamId }
    }
  });

  const activePlayersCount = await prisma.player.count({
    where: { teamId, status: "ACTIVE" }
  });

  let totalIncome = 0;
  let totalExpenses = 0;
  
  const monthlyStats = new Map<string, { income: number, expenses: number }>();
  const categoryStats = new Map<string, { amount: number, type: string }>();

  transactions.forEach(tx => {
    const amount = Number(tx.amount || 0);
    const monthKey = formatMonthYear(tx.date);
    
    const m = monthlyStats.get(monthKey) || { income: 0, expenses: 0 };
    
    if (tx.type === "INCOME") {
      totalIncome += amount;
      m.income += amount;
    } else {
      totalExpenses += amount;
      m.expenses += amount;
    }
    
    monthlyStats.set(monthKey, m);

    const cat = tx.category || "OTHER";
    const c = categoryStats.get(cat) || { amount: 0, type: tx.type };
    c.amount += amount;
    categoryStats.set(cat, c);
  });

  const byCategory = Array.from(categoryStats.entries()).map(([category, stats]) => ({
    category,
    categoryLabel: CATEGORY_LABELS[category] || category,
    amount: stats.amount,
    type: stats.type as "INCOME" | "EXPENSE"
  }));

  const monthly = Array.from(monthlyStats.entries()).map(([month, stats]) => ({
    month,
    income: stats.income,
    expenses: stats.expenses,
    net: stats.income - stats.expenses
  }));

  const membershipMonthly = new Map<string, { paid: number, month: number, year: number }>();

  memberships.forEach(m => {
    const key = `${m.month}/${m.year}`;
    const entry = membershipMonthly.get(key) || { paid: 0, month: m.month, year: m.year };
    entry.paid++;
    membershipMonthly.set(key, entry);
  });

  const totalPaidMemberships = memberships.length;
  const totalExpectedMemberships = membershipMonthly.size * activePlayersCount;
  const membershipCollectionRate = totalExpectedMemberships > 0
    ? (totalPaidMemberships / totalExpectedMemberships) * 100
    : (totalPaidMemberships > 0 ? 100 : 0);

  const membershipStatus = Array.from(membershipMonthly.values()).map(stats => {
    const monthLabel = MONTHS_PT[stats.month - 1] || String(stats.month);
    const totalPlayers = Math.max(stats.paid, activePlayersCount);
    const pending = Math.max(0, totalPlayers - stats.paid);
    const rate = totalPlayers > 0 ? (stats.paid / totalPlayers) * 100 : 0;

    return {
      month: monthLabel,
      year: stats.year,
      totalPlayers,
      paid: stats.paid,
      pending,
      rate
    };
  });

  return NextResponse.json({
    overview: {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      membershipCollectionRate
    },
    monthly,
    byCategory,
    membershipStatus
  });
}
