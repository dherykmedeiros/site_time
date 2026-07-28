import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const POSITION_LABELS: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral esquerdo",
  RIGHT_BACK: "Lateral direito",
  LEFT_WINGBACK: "Ala esquerdo",
  RIGHT_WINGBACK: "Ala direito",
  MIDFIELDER: "Meio-campista",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta esquerda",
  RIGHT_WINGER: "Ponta direita"
};

const FORMATION_LABELS: Record<string, string> = {
  FOUR_FOUR_TWO: "4-4-2",
  FOUR_THREE_THREE: "4-3-3",
  FOUR_TWO_THREE_ONE: "4-2-3-1",
  THREE_FIVE_TWO: "3-5-2",
  THREE_FOUR_THREE: "3-4-3",
  FIVE_THREE_TWO: "5-3-2",
  FOUR_ONE_FOUR_ONE: "4-1-4-1",
  FIVE_FOUR_ONE: "5-4-1",
};

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const teamId = session.user.teamId;
  if (!teamId) return NextResponse.json({ error: "Sem time vinculado" }, { status: 403 });
  
  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("seasonId") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const matchFilter: any = { teamId, status: "COMPLETED" };
  if (seasonId) matchFilter.seasonId = seasonId;
  if (from || to) {
    matchFilter.date = {};
    if (from) matchFilter.date.gte = new Date(from);
    if (to) matchFilter.date.lte = new Date(to);
  }

  const matches = await prisma.match.findMany({
    where: matchFilter,
    include: {
      lineupSelections: {
        include: { player: true }
      }
    }
  });

  let totalSelectionsSum = 0;
  const formationCount = new Map<string, number>();
  const playerStats = new Map<string, any>();
  const positionStats = new Map<string, { starters: number, bench: number, players: Set<string> }>();

  matches.forEach(match => {
    const formation = (match as any).lineupFormation || "Desconhecido";
    formationCount.set(formation, (formationCount.get(formation) || 0) + 1);

    totalSelectionsSum += match.lineupSelections.length;

    match.lineupSelections.forEach(sel => {
      if (sel.playerId && sel.player) {
        const p = playerStats.get(sel.playerId) || {
          playerId: sel.playerId,
          playerName: sel.player.name,
          position: sel.player.position,
          shirtNumber: sel.player.shirtNumber,
          totalSelections: 0,
          starterCount: 0,
          benchCount: 0
        };
        p.totalSelections++;
        if (sel.role === "STARTER") p.starterCount++;
        else p.benchCount++;
        playerStats.set(sel.playerId, p);

        const pos = sel.player.position || "UNKNOWN";
        const posEntry = positionStats.get(pos) || { starters: 0, bench: 0, players: new Set<string>() };
        if (sel.role === "STARTER") posEntry.starters++;
        else posEntry.bench++;
        posEntry.players.add(sel.playerId);
        positionStats.set(pos, posEntry);
      }
    });
  });

  let rawMostUsedFormation: string | null = null;
  let maxForm = 0;
  for (const [form, count] of formationCount.entries()) {
    if (count > maxForm && form !== "Desconhecido") {
      maxForm = count;
      rawMostUsedFormation = form;
    }
  }

  const mostUsedFormation = rawMostUsedFormation 
    ? (FORMATION_LABELS[rawMostUsedFormation] || rawMostUsedFormation.replace(/_/g, "-")) 
    : "N/A";

  const totalMatches = matches.length;
  
  const playersArray = Array.from(playerStats.values()).map(p => {
    return {
      ...p,
      starterRate: p.totalSelections > 0 ? (p.starterCount / p.totalSelections) * 100 : 0,
      notSelectedCount: totalMatches - p.totalSelections
    };
  }).sort((a, b) => b.totalSelections - a.totalSelections);

  const positionDistribution = Array.from(positionStats.entries()).map(([pos, stats]) => ({
    position: pos,
    positionLabel: POSITION_LABELS[pos] || pos,
    avgStarters: totalMatches > 0 ? stats.starters / totalMatches : 0,
    avgBench: totalMatches > 0 ? stats.bench / totalMatches : 0,
    totalPlayers: stats.players.size
  }));

  return NextResponse.json({
    overview: {
      totalMatches,
      avgSquadSize: totalMatches > 0 ? totalSelectionsSum / totalMatches : 0,
      mostUsedFormation
    },
    players: playersArray,
    positionDistribution
  });
}
