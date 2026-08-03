import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { z } from "zod";
import { trackOperationalEvent } from "@/lib/telemetry";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const adminRsvpSchema = z.object({
  playerId: z.string().min(1, "ID do jogador é obrigatório"),
  status: z.enum(["CONFIRMED", "PENDING", "DECLINED"], {
    message: "Status inválido",
  }),
});

// POST /api/matches/:id/rsvp/admin — Alteração manual do status de presença pelo Administrador
export const POST = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id: matchId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido", code: "VALIDATION_ERROR" }, { status: 400 });
  }

  const parsed = adminRsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Campos inválidos", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { playerId, status } = parsed.data;

  // Verify match belongs to session team
  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
    select: { id: true },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada", code: "NOT_FOUND" }, { status: 404 });
  }

  // Verify player belongs to session team
  const player = await prisma.player.findFirst({
    where: { id: playerId, teamId },
    select: { id: true, name: true },
  });

  if (!player) {
    return NextResponse.json({ error: "Jogador não encontrado", code: "NOT_FOUND" }, { status: 404 });
  }

  // Find existing RSVP to track history
  const existingRsvp = await prisma.rSVP.findUnique({
    where: {
      playerId_matchId: {
        playerId,
        matchId,
      },
    },
    select: { id: true, status: true },
  });

  // Upsert RSVP
  const rsvp = await prisma.rSVP.upsert({
    where: {
      playerId_matchId: {
        playerId,
        matchId,
      },
    },
    update: {
      status,
      respondedAt: new Date(),
    },
    create: {
      playerId,
      matchId,
      status,
      respondedAt: new Date(),
    },
  });

  // Log status change if changed
  if (!existingRsvp || existingRsvp.status !== status) {
    await prisma.rSVPStatusLog.create({
      data: {
        rsvpId: rsvp.id,
        playerId,
        matchId,
        oldStatus: existingRsvp?.status ?? null,
        newStatus: status,
      },
    });

    trackOperationalEvent("admin_rsvp_status_changed", {
      rsvpId: rsvp.id,
      playerId,
      playerName: player.name,
      matchId,
      oldStatus: existingRsvp?.status ?? null,
      newStatus: status,
      adminId: session.user.id,
    });
  }

  return NextResponse.json({
    playerId: rsvp.playerId,
    matchId: rsvp.matchId,
    status: rsvp.status,
    respondedAt: rsvp.respondedAt?.toISOString() ?? null,
  });
});
