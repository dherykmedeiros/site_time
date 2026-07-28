import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
function formatMonthYear(d: Date | string) {
  const date = new Date(d);
  const m = MONTHS_PT[date.getMonth()];
  const y = String(date.getFullYear()).slice(2);
  return `${m}/${y}`;
}

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const teamId = session.user.teamId;
  if (!teamId) return NextResponse.json({ error: "Sem time vinculado" }, { status: 403 });
  
  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("seasonId") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const matchFilter: any = {
    teamId,
    status: "COMPLETED",
  };
  if (seasonId) matchFilter.seasonId = seasonId;
  if (from || to) {
    matchFilter.date = {};
    if (from) matchFilter.date.gte = new Date(from);
    if (to) matchFilter.date.lte = new Date(to);
  }

  const matches = await prisma.match.findMany({
    where: matchFilter,
    include: {
      matchStats: {
        include: {
          player: true,
        },
      },
    },
  });

  const fineFilter: any = { teamId };
  const fines = await prisma.fine.findMany({
    where: fineFilter,
    include: { player: true },
  });

  let totalYellowCards = 0;
  let totalRedCards = 0;
  
  const playerStats = new Map<string, any>();
  const monthlyStats = new Map<string, { yellowCards: number, redCards: number }>();

  matches.forEach(match => {
    const monthKey = formatMonthYear(match.date);
    const m = monthlyStats.get(monthKey) || { yellowCards: 0, redCards: 0 };
    
    match.matchStats.forEach(stat => {
      totalYellowCards += stat.yellowCards || 0;
      totalRedCards += stat.redCards || 0;
      m.yellowCards += stat.yellowCards || 0;
      m.redCards += stat.redCards || 0;
      
      if (stat.playerId && stat.player) {
        const p = playerStats.get(stat.playerId) || {
          playerId: stat.playerId,
          playerName: stat.player.name,
          position: stat.player.position,
          shirtNumber: stat.player.shirtNumber,
          yellowCards: 0,
          redCards: 0,
          totalCards: 0,
          fineCount: 0,
          suspendedMatches: 0
        };
        p.yellowCards += stat.yellowCards || 0;
        p.redCards += stat.redCards || 0;
        p.totalCards += (stat.yellowCards || 0) + (stat.redCards || 0);
        playerStats.set(stat.playerId, p);
      }
    });
    
    monthlyStats.set(monthKey, m);
  });

  let totalFines = 0;
  let totalSuspendedMatches = 0;

  fines.forEach(fine => {
    totalFines += 1;
    totalSuspendedMatches += fine.matchesSuspended || 0;
    if (fine.playerId && fine.player) {
      const p = playerStats.get(fine.playerId) || {
        playerId: fine.playerId,
        playerName: fine.player.name,
        position: fine.player.position,
        shirtNumber: fine.player.shirtNumber,
        yellowCards: 0,
        redCards: 0,
        totalCards: 0,
        fineCount: 0,
        suspendedMatches: 0
      };
      p.fineCount += 1;
      p.suspendedMatches += fine.matchesSuspended || 0;
      playerStats.set(fine.playerId, p);
    }
  });

  const playersArray = Array.from(playerStats.values()).sort((a, b) => b.totalCards - a.totalCards);
  const monthlyArray = Array.from(monthlyStats.entries()).map(([month, stats]) => ({
    month,
    ...stats
  }));

  return NextResponse.json({
    overview: {
      totalYellowCards,
      totalRedCards,
      totalFines,
      totalSuspendedMatches
    },
    players: playersArray,
    monthly: monthlyArray
  });
}
