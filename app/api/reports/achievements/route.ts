import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const ACHIEVEMENT_LABELS: Record<string, string> = {
  HAT_TRICK: "Hat-trick",
  TOP_SCORER_ROUND: "Artilheiro da Rodada",
  VETERAN: "Veterano",
  ASSIST_MASTER: "Mestre das Assistências",
  FULL_ATTENDANCE_MONTH: "Presença Total do Mês"
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
      matchVotes: {
        include: { player: true }
      }
    }
  });

  const achFilter: any = {
    player: { teamId }
  };
  if (from || to) {
    achFilter.awardedAt = {};
    if (from) achFilter.awardedAt.gte = new Date(from);
    if (to) achFilter.awardedAt.lte = new Date(to);
  }

  const achievementsList = await prisma.achievement.findMany({
    where: achFilter,
    include: { player: true }
  });

  let totalMvpVotes = 0;
  const mvpStats = new Map<string, any>();
  const achStats = new Map<string, { count: number }>();
  const playerAchStats = new Map<string, any>();
  const uniqueAchieversSet = new Set<string>();

  matches.forEach(match => {
    match.matchVotes.forEach(vote => {
      totalMvpVotes++;
      if (vote.playerId && vote.player) {
        const p = mvpStats.get(vote.playerId) || {
          playerId: vote.playerId,
          playerName: vote.player.name,
          position: vote.player.position,
          shirtNumber: vote.player.shirtNumber,
          photoUrl: vote.player.photoUrl,
          mvpVotes: 0
        };
        p.mvpVotes++;
        mvpStats.set(vote.playerId, p);
      }
    });
  });

  achievementsList.forEach(ach => {
    uniqueAchieversSet.add(ach.playerId);
    const typeCount = achStats.get(ach.type) || { count: 0 };
    typeCount.count++;
    achStats.set(ach.type, typeCount);

    if (ach.player) {
      const p = playerAchStats.get(ach.playerId) || {
        playerId: ach.playerId,
        playerName: ach.player.name,
        position: ach.player.position,
        achievements: 0,
        types: new Set<string>()
      };
      p.achievements++;
      p.types.add(ach.type);
      playerAchStats.set(ach.playerId, p);
    }
  });

  const topMvps = Array.from(mvpStats.values())
    .sort((a, b) => b.mvpVotes - a.mvpVotes)
    .slice(0, 10);

  const byType = Array.from(achStats.entries()).map(([type, stats]) => ({
    type,
    typeLabel: ACHIEVEMENT_LABELS[type] || type,
    count: stats.count
  }));

  const playerAchievements = Array.from(playerAchStats.values()).map(p => ({
    ...p,
    types: Array.from(p.types)
  })).sort((a, b) => b.achievements - a.achievements);

  return NextResponse.json({
    overview: {
      totalAchievements: achievementsList.length,
      totalMvpVotes,
      uniqueAchievers: uniqueAchieversSet.size
    },
    byType,
    topMvps,
    playerAchievements
  });
}
