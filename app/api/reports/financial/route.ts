import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  let totalIncome = 0;
  let totalExpenses = 0;
  
  const monthlyStats = new Map<string, { income: number, expenses: number }>();
  const categoryStats = new Map<string, { amount: number, type: string }>();

  transactions.forEach(tx => {
    const amount = Number(tx.amount || 0);
    const monthKey = format(new Date(tx.date), "MMM/yy", { locale: ptBR });
    
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

  let totalMembershipRecords = memberships.length;
  let totalPaidMemberships = 0;

  const membershipMonthly = new Map<string, { total: number, paid: number, pending: number, year: number }>();

  memberships.forEach(m => {
    if (m.status === "PAID") totalPaidMemberships++;
    const key = `${m.month}/${m.year}`;
    const entry = membershipMonthly.get(key) || { total: 0, paid: 0, pending: 0, year: m.year };
    entry.total++;
    if (m.status === "PAID") entry.paid++;
    else entry.pending++;
    membershipMonthly.set(key, entry);
  });

  const membershipCollectionRate = totalMembershipRecords > 0 ? (totalPaidMemberships / totalMembershipRecords) * 100 : 0;

  const membershipStatus = Array.from(membershipMonthly.entries()).map(([key, stats]) => {
    const [mStr] = key.split('/');
    const rate = stats.total > 0 ? (stats.paid / stats.total) * 100 : 0;
    return {
      month: mStr,
      year: stats.year,
      totalPlayers: stats.total,
      paid: stats.paid,
      pending: stats.pending,
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
