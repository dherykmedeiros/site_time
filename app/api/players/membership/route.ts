import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const querySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});

// GET /api/players/membership?month=&year= — list all active players with payment status
export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    month: searchParams.get("month") ?? new Date().getMonth() + 1,
    year: searchParams.get("year") ?? new Date().getFullYear(),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Parâmetros inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { month, year } = parsed.data;
  const teamId = session.user.teamId;

  const [players, payments] = await Promise.all([
    prisma.player.findMany({
      where: { teamId, status: "ACTIVE" },
      orderBy: { shirtNumber: "asc" },
      select: { id: true, name: true, position: true, shirtNumber: true, photoUrl: true },
    }),
    prisma.membershipPayment.findMany({
      where: { teamId, month, year },
      select: {
        id: true,
        playerId: true,
        amount: true,
        paidAt: true,
        transactionId: true,
      },
    }),
  ]);

  const paymentMap = new Map(payments.map((p) => [p.playerId, p]));

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return NextResponse.json({
    month,
    year,
    summary: {
      totalPlayers: players.length,
      paidCount: payments.length,
      pendingCount: players.length - payments.length,
      totalCollected: totalPaid,
    },
    players: players.map((player) => {
      const payment = paymentMap.get(player.id);
      return {
        ...player,
        payment: payment
          ? {
              id: payment.id,
              amount: Number(payment.amount),
              paidAt: payment.paidAt.toISOString(),
              transactionId: payment.transactionId,
            }
          : null,
      };
    }),
  });
}
