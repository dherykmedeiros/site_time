import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface StandingRow {
  playerId: string;
  playerName: string;
  shirtNumber: number | null;
  position: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  goals: number;
  assists: number;
}

// GET /api/seasons/:id/standings — compute player standings from team CHAMPIONSHIP matches in the season
export const GET = withErrorHandler(async (_request: Request, context: RouteContext) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const { id } = await context.params;

  const season = await prisma.season.findFirst({
    where: { id, teamId: session.user.teamId },
  });

  if (!season) {
    return NextResponse.json({ error: "Temporada não encontrada" }, { status: 404 });
  }

  // Only CHAMPIONSHIP matches with scores for real standings (team-level)
  const matches = await prisma.match.findMany({
    where: {
      seasonId: id,
      teamId: session.user.teamId,
      type: "CHAMPIONSHIP",
      status: "COMPLETED",
      homeScore: { not: null },
      awayScore: { not: null },
    },
    select: {
      id: true,
      homeScore: true,
      awayScore: true,
      isHome: true,
      matchStats: {
        select: {
          playerId: true,
          goals: true,
          assists: true,
          player: { select: { name: true, shirtNumber: true, position: true } },
        },
      },
    },
  });

  // Build per-player stats
  const rows: Record<string, StandingRow> = {};

  for (const match of matches) {
    const home = match.homeScore!;
    const away = match.awayScore!;

    // Determine team result
    const teamGoalsFor = match.isHome ? home : away;
    const teamGoalsAgainst = match.isHome ? away : home;
    const won = teamGoalsFor > teamGoalsAgainst;
    const drawn = teamGoalsFor === teamGoalsAgainst;
    const lost = teamGoalsFor < teamGoalsAgainst;

    for (const stat of match.matchStats) {
      if (!rows[stat.playerId]) {
        rows[stat.playerId] = {
          playerId: stat.playerId,
          playerName: stat.player.name,
          shirtNumber: stat.player.shirtNumber,
          position: stat.player.position,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDiff: 0,
          points: 0,
          goals: 0,
          assists: 0,
        };
      }

      const row = rows[stat.playerId];
      row.played += 1;
      row.goalsFor += teamGoalsFor;
      row.goalsAgainst += teamGoalsAgainst;
      row.goals += stat.goals;
      row.assists += stat.assists;

      if (won) { row.won += 1; row.points += 3; }
      else if (drawn) { row.drawn += 1; row.points += 1; }
      else if (lost) { row.lost += 1; }

      row.goalDiff = row.goalsFor - row.goalsAgainst;
    }
  }

  const standings = Object.values(rows).sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor ||
      b.goals - a.goals
  );

  return NextResponse.json({ season, standings, matchCount: matches.length });
});
