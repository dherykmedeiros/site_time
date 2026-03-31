import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  amount: z.number().positive("Valor deve ser maior que 0"),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/players/:id/membership — register monthly payment
export async function POST(request: Request, context: RouteContext) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 400 });
  }

  const { id: playerId } = await context.params;
  const teamId = session.user.teamId;

  const player = await prisma.player.findFirst({
    where: { id: playerId, teamId },
    select: { id: true, name: true },
  });

  if (!player) {
    return NextResponse.json({ error: "Jogador não encontrado" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { month, year, amount } = parsed.data;

  // Check not already paid
  const existing = await prisma.membershipPayment.findUnique({
    where: { playerId_month_year: { playerId, month, year } },
  });
  if (existing) {
    return NextResponse.json({ error: "Mensalidade já registrada para este mês" }, { status: 409 });
  }

  const now = new Date();
  const paidDate = new Date(year, month - 1, 1);

  // Create transaction + payment atomically
  const [transaction] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        type: "INCOME",
        amount,
        description: `Mensalidade ${player.name} — ${String(month).padStart(2, "0")}/${year}`,
        category: "MEMBERSHIP",
        date: paidDate <= now ? paidDate : now,
        teamId,
      },
    }),
  ]);

  const payment = await prisma.membershipPayment.create({
    data: {
      playerId,
      teamId,
      month,
      year,
      amount,
      transactionId: transaction.id,
    },
  });

  return NextResponse.json(
    {
      id: payment.id,
      playerId: payment.playerId,
      month: payment.month,
      year: payment.year,
      amount: Number(payment.amount),
      paidAt: payment.paidAt.toISOString(),
      transactionId: payment.transactionId,
    },
    { status: 201 }
  );
}
