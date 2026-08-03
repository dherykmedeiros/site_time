import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";
import { z } from "zod";
import { trackOperationalEvent } from "@/lib/telemetry";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const assignCoachSchema = z.object({
  coachPlayerId: z.string().nullable(),
});

// POST /api/matches/:id/coach — Designar atleta como treinador da partida (Exclusivo ADMIN / COACH)
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

  const parsed = assignCoachSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "ID do treinador inválido", code: "VALIDATION_ERROR", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { coachPlayerId } = parsed.data;

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId },
    select: { id: true },
  });

  if (!match) {
    return NextResponse.json({ error: "Partida não encontrada", code: "NOT_FOUND" }, { status: 404 });
  }

  if (coachPlayerId) {
    const player = await prisma.player.findFirst({
      where: { id: coachPlayerId, teamId, status: "ACTIVE" },
      select: { id: true, name: true },
    });

    if (!player) {
      return NextResponse.json({ error: "Atleta não encontrado ou inativo no time", code: "NOT_FOUND" }, { status: 404 });
    }
  }

  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: { coachPlayerId },
    include: {
      coachPlayer: {
        select: {
          id: true,
          name: true,
          fullName: true,
          photoUrl: true,
          position: true,
          shirtNumber: true,
        },
      },
    },
  });

  // Sync with MatchCoachReport if exists
  await prisma.matchCoachReport.updateMany({
    where: { matchId },
    data: { coachPlayerId },
  });

  trackOperationalEvent("match_coach_assigned", {
    matchId,
    coachPlayerId,
    adminId: session.user.id,
  });

  return NextResponse.json({
    message: "Treinador da partida designado com sucesso",
    coachPlayerId: updatedMatch.coachPlayerId,
    coachPlayer: updatedMatch.coachPlayer,
  });
});
