import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

interface RouteContext {
  params: Promise<{ id: string; paymentId: string }>;
}

// DELETE /api/players/:id/membership/:paymentId — reverse a membership payment
export const DELETE = withErrorHandler(async (request: Request, context: RouteContext) => {
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

  // Atomic delete: payment + linked transaction in single transaction
  await prisma.$transaction(async (tx) => {
    await tx.membershipPayment.delete({ where: { id: payment.id } });
    if (payment.transactionId) {
      await tx.transaction.delete({ where: { id: payment.transactionId } });
    }
  });

  return new NextResponse(null, { status: 204 });
});
