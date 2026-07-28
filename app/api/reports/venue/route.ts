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
  const selectedVenue = searchParams.get("venue") || undefined;

  const dateFilter: any = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) dateFilter.lte = new Date(to);

  // Fetch all completed matches for the team to calculate venue list & statistics
  const allMatches = await prisma.match.findMany({
    where: {
      teamId,
      status: "COMPLETED",
      ...(seasonId && { seasonId }),
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
    },
    include: {
      attendances: {
        where: { present: true },
        include: { player: true },
      },
      matchStats: {
        include: { player: true },
      },
    },
    orderBy: { date: "asc" },
  });

  // Calculate stats per venue for the dropdown and comparison chart
  const venueStatsMap: Record<string, { venue: string; matches: number; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; totalPresent: number }> = {};

  for (const match of allMatches) {
    const vName = match.venue?.trim() || "Outros / Não informado";
    if (!venueStatsMap[vName]) {
      venueStatsMap[vName] = {
        venue: vName,
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        totalPresent: 0,
      };
    }

    const teamGoals = match.isHome ? (match.homeScore || 0) : (match.awayScore || 0);
    const opponentGoals = match.isHome ? (match.awayScore || 0) : (match.homeScore || 0);

    venueStatsMap[vName].matches++;
    venueStatsMap[vName].goalsFor += teamGoals;
    venueStatsMap[vName].goalsAgainst += opponentGoals;
    venueStatsMap[vName].totalPresent += match.attendances.length;

    if (teamGoals > opponentGoals) venueStatsMap[vName].wins++;
    else if (teamGoals < opponentGoals) venueStatsMap[vName].losses++;
    else venueStatsMap[vName].draws++;
  }

  const venuesList = Object.values(venueStatsMap)
    .map((v) => ({
      venue: v.venue,
      matchCount: v.matches,
      winRate: v.matches > 0 ? (v.wins / v.matches) * 100 : 0,
      avgAttendance: v.matches > 0 ? v.totalPresent / v.matches : 0,
      goalsFor: v.goalsFor,
      goalsAgainst: v.goalsAgainst,
    }))
    .sort((a, b) => b.matchCount - a.matchCount);

  // Filter matches for the requested venue (or all matches if not specified or 'ALL')
  const activeVenueFilter = selectedVenue && selectedVenue !== "ALL" ? selectedVenue : undefined;
  const filteredMatches = activeVenueFilter
    ? allMatches.filter((m) => (m.venue?.trim() || "Outros / Não informado") === activeVenueFilter)
    : allMatches;

  const overview = {
    selectedVenue: activeVenueFilter || "Todos os Locais",
    totalMatches: filteredMatches.length,
    wins: 0,
    draws: 0,
    losses: 0,
    winRate: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    avgAttendance: 0,
    totalPresent: 0,
  };

  const playerMap: Record<string, { playerId: string; playerName: string; position: string; shirtNumber: number | null; matchesPlayed: number; presentCount: number; goals: number; assists: number }> = {};

  for (const match of filteredMatches) {
    const teamGoals = match.isHome ? (match.homeScore || 0) : (match.awayScore || 0);
    const opponentGoals = match.isHome ? (match.awayScore || 0) : (match.homeScore || 0);

    overview.goalsFor += teamGoals;
    overview.goalsAgainst += opponentGoals;
    overview.totalPresent += match.attendances.length;

    if (teamGoals > opponentGoals) overview.wins++;
    else if (teamGoals < opponentGoals) overview.losses++;
    else overview.draws++;

    // Track present players
    for (const att of match.attendances) {
      if (!att.playerId) continue;
      if (!playerMap[att.playerId]) {
        playerMap[att.playerId] = {
          playerId: att.playerId,
          playerName: att.player?.name || "Jogador",
          position: att.player?.position || "N/A",
          shirtNumber: att.player?.shirtNumber || null,
          matchesPlayed: 0,
          presentCount: 0,
          goals: 0,
          assists: 0,
        };
      }
      playerMap[att.playerId].presentCount++;
    }

    // Track goals & assists
    for (const stat of match.matchStats) {
      if (!stat.playerId) continue;
      if (!playerMap[stat.playerId]) {
        playerMap[stat.playerId] = {
          playerId: stat.playerId,
          playerName: stat.player?.name || "Jogador",
          position: stat.player?.position || "N/A",
          shirtNumber: stat.player?.shirtNumber || null,
          matchesPlayed: 0,
          presentCount: 0,
          goals: 0,
          assists: 0,
        };
      }
      playerMap[stat.playerId].goals += stat.goals || 0;
      playerMap[stat.playerId].assists += stat.assists || 0;
    }
  }

  if (overview.totalMatches > 0) {
    overview.winRate = (overview.wins / overview.totalMatches) * 100;
    overview.goalDifference = overview.goalsFor - overview.goalsAgainst;
    overview.avgAttendance = overview.totalPresent / overview.totalMatches;
  }

  const totalMatchesCount = overview.totalMatches;

  const players = Object.values(playerMap)
    .map((p) => {
      const attendanceRate = totalMatchesCount > 0 ? Math.min(100, (p.presentCount / totalMatchesCount) * 100) : 0;
      return {
        ...p,
        matchesPlayed: totalMatchesCount,
        attendanceRate,
      };
    })
    .sort((a, b) => b.presentCount - a.presentCount || b.goals - a.goals);

  return NextResponse.json({
    venuesList,
    overview,
    players,
  });
}
