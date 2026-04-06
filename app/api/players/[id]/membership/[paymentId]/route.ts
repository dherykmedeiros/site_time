import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string; paymentId: string }>;
}

// DELETE /api/players/:id/membership/:paymentId — reverse a membership payment
export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id: playerId, paymentId } = await context.params;
  const teamId = session.user.teamId;

  const payment = await prisma.membershipPayment.findFirst({
    where: { id: paymentId, playerId, teamId },
    select: { id: true, transactionId: true },
  });

  if (!payment) {
    return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
  }

  // Delete payment record first to free FK, then delete linked transaction
  await prisma.membershipPayment.delete({ where: { id: payment.id } });

  if (payment.transactionId) {
    await prisma.transaction.delete({ where: { id: payment.transactionId } });
  }

  return new NextResponse(null, { status: 204 });
}
