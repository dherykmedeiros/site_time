import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

import { logAuditEvent, logActivityEvent } from "@/lib/audit";

interface RouteContext {
  params: Promise<{ id: string; playerId: string }>;
}

export const POST = withErrorHandler(async (request: Request, context: RouteContext) => {
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

  const { id: matchId, playerId } = await context.params;
  const teamId = session.user.teamId;

  // Check if match exists
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
  }

  // Check if player exists
  const player = await prisma.player.findFirst({
    where: { id: playerId, teamId },
  });

  if (!player) {
    return NextResponse.json({ error: "Jogador não encontrado" }, { status: 404 });
  }

  // Check if payment exists and is pending
  const payment = await prisma.matchPayment.findUnique({
    where: {
      playerId_matchId: { playerId, matchId },
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Comprovante pendente não encontrado para este jogador" }, { status: 404 });
  }

  if (payment.status === "PAID") {
    return NextResponse.json({ error: "O pagamento já está aprovado" }, { status: 400 });
  }

  // Atomically create Transaction and update MatchPayment
  const result = await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        type: "INCOME",
        amount: payment.amount,
        description: `Taxa de Jogo ${player.name} — vs ${match.opponent}`,
        category: "MATCH_FEE",
        date: new Date(),
        teamId,
        matchId,
      },
    });

    const updatedPayment = await tx.matchPayment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        transactionId: transaction.id,
        paidAt: new Date(),
      },
    });

    return updatedPayment;
  });

  logAuditEvent({
    teamId,
    userId: session.user.id,
    userEmail: session.user.email,
    action: "PAYMENT_APPROVED",
    targetEntity: "MatchPayment",
    targetId: result.id,
    details: { playerId, matchId, amount: Number(result.amount) },
    ipAddress: ip,
  });

  logActivityEvent({
    teamId,
    userId: session.user.id,
    type: "PAYMENT_APPROVED",
    description: `Pagamento de taxa de jogo de ${player.name} aprovado (R$ ${Number(result.amount).toFixed(2)})`,
    visibility: "STAFF_ONLY",
  });

  return NextResponse.json({
    id: result.id,
    playerId: result.playerId,
    matchId: result.matchId,
    amount: Number(result.amount),
    status: result.status,
    paidAt: result.paidAt.toISOString(),
    transactionId: result.transactionId,
  });
});
