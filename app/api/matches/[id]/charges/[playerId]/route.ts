import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

interface RouteContext {
  params: Promise<{ id: string; playerId: string }>;
}

// POST /api/matches/[id]/charges/[playerId] — Register match payment (mark as paid)
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

  // Check if match exists and has active charges
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
  }

  if (!match.hasCharge || !match.chargeAmount) {
    return NextResponse.json({ error: "Esta partida não possui cobrança ativa" }, { status: 400 });
  }

  // Check if player exists
  const player = await prisma.player.findFirst({
    where: { id: playerId, teamId },
  });

  if (!player) {
    return NextResponse.json({ error: "Jogador não encontrado" }, { status: 404 });
  }

  // Check if payment already exists
  const existing = await prisma.matchPayment.findUnique({
    where: {
      playerId_matchId: { playerId, matchId },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Jogador já efetuou o pagamento desta partida" }, { status: 409 });
  }

  // Create Transaction and MatchPayment atomically
  const [transaction] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        type: "INCOME",
        amount: match.chargeAmount,
        description: `Taxa de Jogo ${player.name} — vs ${match.opponent}`,
        category: "MATCH_FEE",
        date: new Date(),
        teamId,
        matchId,
      },
    }),
  ]);

  const payment = await prisma.matchPayment.create({
    data: {
      playerId,
      matchId,
      teamId,
      amount: match.chargeAmount,
      transactionId: transaction.id,
    },
  });

  return NextResponse.json(
    {
      id: payment.id,
      playerId: payment.playerId,
      matchId: payment.matchId,
      amount: Number(payment.amount),
      paidAt: payment.paidAt.toISOString(),
      transactionId: payment.transactionId,
    },
    { status: 201 }
  );
});

// DELETE /api/matches/[id]/charges/[playerId] — Reverse match payment (mark as unpaid)
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

  const { id: matchId, playerId } = await context.params;
  const teamId = session.user.teamId;

  // Find the match payment
  const payment = await prisma.matchPayment.findFirst({
    where: { playerId, matchId, teamId },
    select: { id: true, transactionId: true },
  });

  if (!payment) {
    return NextResponse.json({ error: "Registro de pagamento não encontrado" }, { status: 404 });
  }

  // Atomic delete: MatchPayment + associated Transaction
  await prisma.$transaction(async (tx) => {
    await tx.matchPayment.delete({ where: { id: payment.id } });
    if (payment.transactionId) {
      await tx.transaction.delete({ where: { id: payment.transactionId } });
    }
  });

  return new NextResponse(null, { status: 204 });
});
