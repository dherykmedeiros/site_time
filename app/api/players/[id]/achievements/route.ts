import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/players/:id/achievements — list achievements for a player (public-ish, still needs session for team scoping)
export const GET = withErrorHandler(async (_request: Request, context: RouteContext) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id: playerId } = await context.params;

  const player = await prisma.player.findFirst({
    where: { id: playerId, teamId: session.user.teamId },
    select: { id: true },
  });

  if (!player) {
    return NextResponse.json({ error: "Jogador não encontrado" }, { status: 404 });
  }

  const achievements = await prisma.achievement.findMany({
    where: { playerId },
    orderBy: { awardedAt: "desc" },
    take: 500,
    select: {
      id: true,
      type: true,
      awardedAt: true,
      match: { select: { id: true, opponent: true, date: true } },
    },
  });

  return NextResponse.json({ achievements });
});
