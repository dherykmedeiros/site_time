import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { z } from "zod";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";
import { withErrorHandler } from "@/lib/api-handler";

const chargeSchema = z.object({
  amount: z.number().positive("O valor deve ser maior que zero"),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/matches/[id]/charges — Get squad players and their payment/attendance status
export const GET = withErrorHandler(async (request: Request, context: RouteContext) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id: matchId } = await context.params;
  const teamId = session.user.teamId;

  // Verify match exists and belongs to team
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
    select: {
      id: true,
      opponent: true,
      date: true,
      hasCharge: true,
      chargeAmount: true,
      pixKey: true,
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
  }

  // Fetch all active players in the team with their RSVP, Attendance, and MatchPayment for this match
  const players = await prisma.player.findMany({
    where: { teamId, status: "ACTIVE" },
    include: {
      rsvps: {
        where: { matchId },
      },
      attendances: {
        where: { matchId },
      },
      matchPayments: {
        where: { matchId },
      },
    },
    orderBy: { name: "asc" },
  });

  const playerCharges = players.map((p) => {
    const rsvp = p.rsvps[0]?.status ?? "PENDING";
    const present = p.attendances[0]?.present ?? false;
    const payment = p.matchPayments[0]
      ? {
          id: p.matchPayments[0].id,
          amount: Number(p.matchPayments[0].amount),
          paidAt: p.matchPayments[0].paidAt.toISOString(),
          transactionId: p.matchPayments[0].transactionId,
          status: p.matchPayments[0].status,
          receiptUrl: p.matchPayments[0].receiptUrl,
        }
      : null;

    return {
      id: p.id,
      name: p.name,
      shirtNumber: p.shirtNumber,
      photoUrl: p.photoUrl,
      rsvp,
      present,
      payment,
    };
  });

  return NextResponse.json({
    match: {
      id: match.id,
      opponent: match.opponent,
      date: match.date.toISOString(),
      hasCharge: match.hasCharge,
      chargeAmount: match.chargeAmount ? Number(match.chargeAmount) : null,
      pixKey: match.pixKey,
    },
    players: playerCharges,
  });
});

// POST /api/matches/[id]/charges — Set/Generate charge amount for a match
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

  const { id: matchId } = await context.params;
  const teamId = session.user.teamId;

  // Verify match exists and belongs to team
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = chargeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { amount } = parsed.data;

  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: {
      hasCharge: true,
      chargeAmount: amount,
    },
  });

  return NextResponse.json({
    id: updatedMatch.id,
    hasCharge: updatedMatch.hasCharge,
    chargeAmount: Number(updatedMatch.chargeAmount),
  });
});
