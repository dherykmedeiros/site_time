import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { createCsvResponse } from "@/lib/export";
import { formatDateOnly, formatCurrency } from "@/lib/utils";

// Category translations mapping
const categoryLabels: Record<string, string> = {
  MEMBERSHIP: "Mensalidade",
  FRIENDLY_FEE: "Taxa de Amistoso",
  MATCH_FEE: "Taxa de Jogo",
  VENUE_RENTAL: "Aluguel de Campo",
  REFEREE: "Arbitragem",
  EQUIPMENT: "Equipamentos",
  OTHER: "Outros",
};

// GET /api/finances/export — Exporta transações financeiras em formato CSV (Excel)
export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "INCOME" | "EXPENSE" | null;
  const category = searchParams.get("category");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Prisma.TransactionWhereInput = { teamId };

  if (type) where.type = type;
  if (category) where.category = category as any;
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      match: { select: { opponent: true, date: true } },
    },
    orderBy: { date: "desc" },
    take: 1000,
  });

  const headers = ["Data", "Tipo", "Categoria", "Descrição", "Valor (R$)", "Partida Relacionada"];

  const rows = transactions.map((t) => [
    formatDateOnly(t.date),
    t.type === "INCOME" ? "Entrada (+)" : "Saída (-)",
    categoryLabels[t.category] || t.category,
    t.description,
    formatCurrency(Number(t.amount)),
    t.match ? `Vs ${t.match.opponent} (${formatDateOnly(t.match.date)})` : "-",
  ]);

  const filename = `relatorio_financeiro_${new Date().toISOString().slice(0, 10)}`;
  return createCsvResponse(filename, headers, rows);
});
