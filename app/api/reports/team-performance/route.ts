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
    orderBy: { date: 'asc' },
  });

  const overview = {
    totalMatches: 0, wins: 0, draws: 0, losses: 0, winRate: 0,
    goalsFor: 0, goalsAgainst: 0, goalDifference: 0, cleanSheets: 0,
    avgGoalsFor: 0, avgGoalsAgainst: 0,
  };

  const byTypeMap: Record<string, any> = {};
  const byVenue = {
    home: { matches: 0, wins: 0, draws: 0, losses: 0, winRate: 0, goalsFor: 0, goalsAgainst: 0 },
    away: { matches: 0, wins: 0, draws: 0, losses: 0, winRate: 0, goalsFor: 0, goalsAgainst: 0 },
  };

  const monthlyMap: Record<string, any> = {};
  const monthsPt = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  let currentStreakType: 'W' | 'D' | 'L' | 'none' = 'none';
  let currentStreakCount = 0;
  let longestWinStreak = 0;
  let longestUnbeatenStreak = 0;
  let currentUnbeatenStreak = 0;

  for (const match of matches) {
    if (match.homeScore === null || match.awayScore === null) continue;

    const teamGoals = match.isHome ? match.homeScore : match.awayScore;
    const opponentGoals = match.isHome ? match.awayScore : match.homeScore;
    
    let result: 'W' | 'D' | 'L' = 'D';
    if (teamGoals > opponentGoals) result = 'W';
    else if (teamGoals < opponentGoals) result = 'L';

    // Overview
    overview.totalMatches++;
    overview.goalsFor += teamGoals;
    overview.goalsAgainst += opponentGoals;
    if (opponentGoals === 0) overview.cleanSheets++;
    if (result === 'W') overview.wins++;
    else if (result === 'D') overview.draws++;
    else if (result === 'L') overview.losses++;

    // Type
    const mType = match.type || "FRIENDLY";
    if (!byTypeMap[mType]) byTypeMap[mType] = { type: mType, matches: 0, wins: 0, draws: 0, losses: 0 };
    byTypeMap[mType].matches++;
    if (result === 'W') byTypeMap[mType].wins++;
    else if (result === 'D') byTypeMap[mType].draws++;
    else if (result === 'L') byTypeMap[mType].losses++;

    // Venue
    const venueStats = match.isHome ? byVenue.home : byVenue.away;
    venueStats.matches++;
    venueStats.goalsFor += teamGoals;
    venueStats.goalsAgainst += opponentGoals;
    if (result === 'W') venueStats.wins++;
    else if (result === 'D') venueStats.draws++;
    else if (result === 'L') venueStats.losses++;

    // Monthly
    let monthLabel = "Desconhecido";
    if (match.date) {
      const d = new Date(match.date);
      monthLabel = `${monthsPt[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    }
    if (!monthlyMap[monthLabel]) monthlyMap[monthLabel] = { month: monthLabel, matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, date: match.date };
    monthlyMap[monthLabel].matches++;
    monthlyMap[monthLabel].goalsFor += teamGoals;
    monthlyMap[monthLabel].goalsAgainst += opponentGoals;
    if (result === 'W') monthlyMap[monthLabel].wins++;
    else if (result === 'D') monthlyMap[monthLabel].draws++;
    else if (result === 'L') monthlyMap[monthLabel].losses++;

    // Streaks
    if (result === currentStreakType) {
      currentStreakCount++;
    } else {
      currentStreakType = result;
      currentStreakCount = 1;
    }
    
    if (result === 'W') {
      if (currentStreakType === 'W' && currentStreakCount > longestWinStreak) longestWinStreak = currentStreakCount;
    }

    if (result === 'W' || result === 'D') {
      currentUnbeatenStreak++;
      if (currentUnbeatenStreak > longestUnbeatenStreak) longestUnbeatenStreak = currentUnbeatenStreak;
    } else {
      currentUnbeatenStreak = 0;
    }
  }

  if (overview.totalMatches > 0) {
    overview.winRate = (overview.wins / overview.totalMatches) * 100;
    overview.goalDifference = overview.goalsFor - overview.goalsAgainst;
    overview.avgGoalsFor = overview.goalsFor / overview.totalMatches;
    overview.avgGoalsAgainst = overview.goalsAgainst / overview.totalMatches;
  }

  const byType = Object.values(byTypeMap).map(t => ({
    ...t,
    winRate: t.matches > 0 ? (t.wins / t.matches) * 100 : 0
  }));

  if (byVenue.home.matches > 0) byVenue.home.winRate = (byVenue.home.wins / byVenue.home.matches) * 100;
  if (byVenue.away.matches > 0) byVenue.away.winRate = (byVenue.away.wins / byVenue.away.matches) * 100;

  const monthly = Object.values(monthlyMap).sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).map(({ date, ...rest }) => rest);

  const streaks = {
    currentStreak: { type: currentStreakType, count: currentStreakCount },
    longestWinStreak,
    longestUnbeatenStreak,
  };

  return NextResponse.json({
    overview,
    byType,
    byVenue,
    monthly,
    streaks,
  });
}
