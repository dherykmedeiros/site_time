import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

const receiptSchema = z.object({
  playerId: z.string().min(1, "Player ID é obrigatório"),
  receiptUrl: z.string().url("URL do comprovante inválida"),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (request: Request, context: RouteContext) => {
  const { session, error } = await requireAuth();
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

  const { id: matchId } = await context.params;
  const teamId = session.user.teamId;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = receiptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { playerId, receiptUrl } = parsed.data;

  // Security: A non-admin user can only submit a receipt for themselves
  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && session.user.playerId !== playerId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  // Check if match exists and has charges
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
  }

  if (!match.hasCharge || !match.chargeAmount) {
    return NextResponse.json({ error: "Esta partida não possui cobrança ativa" }, { status: 400 });
  }

  // Check if player exists and belongs to the team
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

  if (existing && existing.status === "PAID") {
    return NextResponse.json({ error: "Jogador já efetuou o pagamento desta partida e foi aprovado" }, { status: 400 });
  }

  // Create or update the pending payment record
  const payment = await prisma.matchPayment.upsert({
    where: {
      playerId_matchId: { playerId, matchId },
    },
    update: {
      status: "PENDING",
      receiptUrl,
      amount: match.chargeAmount,
      transactionId: null,
    },
    create: {
      playerId,
      matchId,
      teamId,
      amount: match.chargeAmount,
      status: "PENDING",
      receiptUrl,
    },
  });

  return NextResponse.json({
    id: payment.id,
    playerId: payment.playerId,
    matchId: payment.matchId,
    amount: Number(payment.amount),
    status: payment.status,
    receiptUrl: payment.receiptUrl,
  });
});
