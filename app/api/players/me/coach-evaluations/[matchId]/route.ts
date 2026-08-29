import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

interface RouteParams {
  params: Promise<{ matchId: string }>;
}

// GET /api/players/me/coach-evaluations/:matchId — Retorna estritamente o parecer do treinador para o próprio atleta
export const GET = withErrorHandler(async (request: Request, { params }: RouteParams) => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const playerId = session.user.playerId;
  if (!playerId) {
    return NextResponse.json({ error: "Usuário não possui perfil de atleta vinculado" }, { status: 403 });
  }

  const { matchId } = await params;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      opponent: true,
      date: true,
      type: true,
      isHome: true,
      homeScore: true,
      awayScore: true,
      coachPlayer: {
        select: {
          id: true,
          name: true,
          fullName: true,
          photoUrl: true,
          shirtNumber: true,
        },
      },
      coachPlayerB: {
        select: {
          id: true,
          name: true,
          fullName: true,
          photoUrl: true,
          shirtNumber: true,
        },
      },
      coachReport: {
        select: {
          id: true,
          evaluations: {
            where: { playerId },
            select: {
              id: true,
              teamSide: true,
              rating: true,
              feedback: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!match || !match.coachReport) {
    return NextResponse.json({ error: "Relatório do treinador não encontrado para esta partida", code: "NOT_FOUND" }, { status: 404 });
  }

  const evaluation = match.coachReport.evaluations[0];
  if (!evaluation) {
    return NextResponse.json({ error: "Nenhuma avaliação encontrada para o seu perfil nesta partida", code: "NOT_FOUND" }, { status: 404 });
  }

  const isTeamB = match.type === "TRAINING" && evaluation.teamSide === "B";
  const activeCoach = isTeamB ? (match.coachPlayerB || match.coachPlayer) : match.coachPlayer;

  return NextResponse.json({
    matchId: match.id,
    opponent: match.type === "TRAINING" ? "Time B" : match.opponent,
    date: match.date.toISOString(),
    isHome: match.isHome,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    coachName: activeCoach?.name ?? (isTeamB ? "Treinador Time B" : "Treinador Time A"),
    coachFullName: activeCoach?.fullName ?? null,
    coachPhotoUrl: activeCoach?.photoUrl ?? null,
    rating: evaluation.rating,
    feedback: evaluation.feedback || "O treinador não deixou comentários adicionais.",
  });
});
