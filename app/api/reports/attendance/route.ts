import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const teamId = session.user.teamId;
  if (!teamId) return NextResponse.json({ error: "Sem time vinculado" }, { status: 403 });
  
  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("seasonId") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const dateFilter: any = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) dateFilter.lte = new Date(to);

  const matches = await prisma.match.findMany({
    where: {
      teamId,
      status: "COMPLETED",
      ...(seasonId && { seasonId }),
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
    },
    include: {
      rsvps: {
        include: { player: true },
      },
      attendances: {
        where: { present: true },
      },
    },
    orderBy: { date: 'asc' },
  });

  const overview = {
    totalMatches: matches.length,
    avgAttendanceRate: 0,
    avgRsvpRate: 0,
    totalRsvpConfirmed: 0,
    totalPresent: 0,
  };

  const playerMap: Record<string, any> = {};
  const monthlyMap: Record<string, { month: string, date: Date | null, matchesCount: number, presentSum: number, summonedSum: number, uniquePlayers: Set<string> }> = {};
  const monthsPt = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  let totalSummoned = 0;

  for (const match of matches) {
    let monthLabel = "Desconhecido";
    if (match.date) {
      const d = new Date(match.date);
      monthLabel = `${monthsPt[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
      if (!monthlyMap[monthLabel]) {
        monthlyMap[monthLabel] = { month: monthLabel, date: match.date, matchesCount: 0, presentSum: 0, summonedSum: 0, uniquePlayers: new Set() };
      }
    }

    const presentSet = new Set(match.attendances.map(a => a.playerId));
    overview.totalPresent += presentSet.size;

    if (monthlyMap[monthLabel]) {
      monthlyMap[monthLabel].matchesCount++;
      monthlyMap[monthLabel].presentSum += presentSet.size;
    }

    let matchSummonedCount = 0;

    for (const rsvp of match.rsvps) {
      if (!rsvp.playerId) continue;
      
      if (!playerMap[rsvp.playerId]) {
        playerMap[rsvp.playerId] = {
          playerId: rsvp.playerId,
          playerName: rsvp.player?.name || "Desconhecido",
          position: rsvp.player?.position || "N/A",
          shirtNumber: rsvp.player?.shirtNumber || null,
          summoned: 0,
          rsvpConfirmed: 0,
          rsvpDeclined: 0,
          present: 0,
        };
      }

      if (rsvp.summoned) {
        playerMap[rsvp.playerId].summoned++;
        totalSummoned++;
        matchSummonedCount++;
      }
      
      if (rsvp.status === "CONFIRMED") {
        playerMap[rsvp.playerId].rsvpConfirmed++;
        overview.totalRsvpConfirmed++;
      } else if (rsvp.status === "DECLINED") {
        playerMap[rsvp.playerId].rsvpDeclined++;
      }
      
      const isPresent = presentSet.has(rsvp.playerId);
      if (isPresent) {
        playerMap[rsvp.playerId].present++;
        if (monthlyMap[monthLabel]) {
          monthlyMap[monthLabel].uniquePlayers.add(rsvp.playerId);
        }
      }
    }
    
    if (monthlyMap[monthLabel]) {
      monthlyMap[monthLabel].summonedSum += matchSummonedCount;
    }

    // Some players might be present without RSVP
    for (const att of match.attendances) {
      if (!att.playerId) continue;
      if (!playerMap[att.playerId]) {
         playerMap[att.playerId] = {
          playerId: att.playerId,
          playerName: "Sem RSVP",
          position: "N/A",
          shirtNumber: null,
          summoned: 0,
          rsvpConfirmed: 0,
          rsvpDeclined: 0,
          present: 0,
        };
      }
      
      const hasRsvp = match.rsvps.some(r => r.playerId === att.playerId);
      if (!hasRsvp) {
        playerMap[att.playerId].present++;
        if (monthlyMap[monthLabel]) {
          monthlyMap[monthLabel].uniquePlayers.add(att.playerId);
        }
      }
    }
  }

  if (totalSummoned > 0) {
    overview.avgAttendanceRate = overview.totalPresent / totalSummoned;
    overview.avgRsvpRate = overview.totalRsvpConfirmed / totalSummoned;
  }

  const players = Object.values(playerMap).map(p => ({
    ...p,
    attendanceRate: p.summoned > 0 ? p.present / p.summoned : (p.present > 0 ? 1 : 0),
    rsvpRate: p.summoned > 0 ? p.rsvpConfirmed / p.summoned : 0,
  })).sort((a, b) => b.attendanceRate - a.attendanceRate);

  const monthly = Object.values(monthlyMap).sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).map(m => ({
    month: m.month,
    totalPlayers: m.uniquePlayers.size,
    avgPresent: m.matchesCount > 0 ? m.presentSum / m.matchesCount : 0,
    attendanceRate: m.summonedSum > 0 ? m.presentSum / m.summonedSum : (m.presentSum > 0 ? 1 : 0),
  }));

  return NextResponse.json({
    overview,
    players,
    monthly,
  });
}
