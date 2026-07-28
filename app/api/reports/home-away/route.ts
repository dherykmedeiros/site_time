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
      matchAttendances: {
        include: {
          player: true,
        }
      },
    },
  });

  const summary = {
    homeMatches: 0,
    awayMatches: 0,
    homeAvgAttendance: 0,
    awayAvgAttendance: 0,
    homeWins: 0,
    homeLosses: 0,
    homeDraws: 0,
    awayWins: 0,
    awayLosses: 0,
    awayDraws: 0,
  };

  let homeTotalPresent = 0;
  let awayTotalPresent = 0;

  const playerStats: Record<string, { player: any, homePresent: number, homeTotal: number, awayPresent: number, awayTotal: number }> = {};

  for (const match of matches) {
    const isHome = match.isHome;
    const teamScore = isHome ? match.homeScore : match.awayScore;
    const oppScore = isHome ? match.awayScore : match.homeScore;
    
    let result = "D";
    if (teamScore !== null && oppScore !== null) {
      if (teamScore > oppScore) result = "W";
      else if (teamScore < oppScore) result = "L";
    }

    let presentCount = 0;

    for (const att of match.matchAttendances) {
      if (!att.playerId) continue;
      
      if (!playerStats[att.playerId]) {
        playerStats[att.playerId] = {
          player: att.player,
          homePresent: 0,
          homeTotal: 0,
          awayPresent: 0,
          awayTotal: 0,
        };
      }

      if (isHome) {
        playerStats[att.playerId].homeTotal++;
        if (att.present) {
          playerStats[att.playerId].homePresent++;
          presentCount++;
        }
      } else {
        playerStats[att.playerId].awayTotal++;
        if (att.present) {
          playerStats[att.playerId].awayPresent++;
          presentCount++;
        }
      }
    }

    if (isHome) {
      summary.homeMatches++;
      homeTotalPresent += presentCount;
      if (result === "W") summary.homeWins++;
      else if (result === "L") summary.homeLosses++;
      else if (result === "D") summary.homeDraws++;
    } else {
      summary.awayMatches++;
      awayTotalPresent += presentCount;
      if (result === "W") summary.awayWins++;
      else if (result === "L") summary.awayLosses++;
      else if (result === "D") summary.awayDraws++;
    }
  }

  summary.homeAvgAttendance = summary.homeMatches > 0 ? homeTotalPresent / summary.homeMatches : 0;
  summary.awayAvgAttendance = summary.awayMatches > 0 ? awayTotalPresent / summary.awayMatches : 0;

  const players = Object.values(playerStats).map(stat => {
    const homeRate = stat.homeTotal > 0 ? stat.homePresent / stat.homeTotal : 0;
    const awayRate = stat.awayTotal > 0 ? stat.awayPresent / stat.awayTotal : 0;
    return {
      playerId: stat.player?.id || "",
      playerName: stat.player?.name || "Desconhecido",
      position: stat.player?.position || "N/A",
      homePresent: stat.homePresent,
      homeTotal: stat.homeTotal,
      awayPresent: stat.awayPresent,
      awayTotal: stat.awayTotal,
      homeRate,
      awayRate,
      difference: Math.abs(homeRate - awayRate),
    };
  }).sort((a, b) => b.difference - a.difference);

  return NextResponse.json({
    summary,
    players,
  });
}
