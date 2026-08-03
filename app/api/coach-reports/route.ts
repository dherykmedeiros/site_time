import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/coach-reports — Lista todas as partidas do time com status do relatório do treinador
export const GET = withErrorHandler(async () => {
  const { session, error } = await requireAuth();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const userPlayerId = session.user.playerId;
  const isAdminOrCoachRole = session.user.role === "ADMIN" || session.user.role === "COACH";

  // If player is not admin/coach, verify if they coached at least one match
  if (!isAdminOrCoachRole && userPlayerId) {
    const coachedCount = await prisma.match.count({
      where: { teamId, coachPlayerId: userPlayerId },
    });
    if (coachedCount === 0) {
      return NextResponse.json(
        { error: "Acesso restrito aos responsáveis e treinadores das partidas.", code: "FORBIDDEN" },
        { status: 403 }
      );
    }
  } else if (!isAdminOrCoachRole && !userPlayerId) {
    return NextResponse.json(
      { error: "Acesso restrito aos responsáveis e treinadores das partidas.", code: "FORBIDDEN" },
      { status: 403 }
    );
  }

  // Fetch all matches for the team
  const matches = await prisma.match.findMany({
    where: {
      teamId,
      status: { in: ["SCHEDULED", "COMPLETED"] },
    },
    include: {
      coachPlayer: {
        select: {
          id: true,
          name: true,
          fullName: true,
          photoUrl: true,
          shirtNumber: true,
          position: true,
        },
      },
      coachReport: {
        select: {
          id: true,
          status: true,
          updatedAt: true,
          _count: {
            select: { evaluations: true },
          },
        },
      },
      _count: {
        select: { matchStats: true, rsvps: true },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const formattedMatches = matches.map((m) => {
    const reportStatus = m.coachReport
      ? m.coachReport.status === "PUBLISHED"
        ? "PUBLISHED"
        : "DRAFT"
      : "PENDING";

    const isDesignatedCoach = userPlayerId && m.coachPlayerId === userPlayerId;
    const canEdit = isDesignatedCoach || (session.user.role === "ADMIN" && !m.coachPlayerId);

    return {
      matchId: m.id,
      date: m.date.toISOString(),
      opponent: m.opponent,
      isHome: m.isHome,
      opponentBadgeUrl: m.opponentBadgeUrl,
      type: m.type,
      status: m.status,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      coachPlayerId: m.coachPlayerId,
      coachPlayer: m.coachPlayer,
      reportStatus,
      evaluationsCount: m.coachReport?._count.evaluations || 0,
      participantsCount: m._count.matchStats || m._count.rsvps || 0,
      canEdit,
      updatedAt: m.coachReport?.updatedAt.toISOString() ?? null,
    };
  });

  return NextResponse.json({
    matches: formattedMatches,
    canManageCoach: isAdminOrCoachRole,
  });
});
