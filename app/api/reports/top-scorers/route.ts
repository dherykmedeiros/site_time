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
      matchStats: {
        include: {
          player: true,
        }
      },
      attendances: {
        where: { present: true },
      },
    },
    orderBy: { date: 'asc' },
  });

  const playerMap: Record<string, any> = {};
  const monthlyMap: Record<string, { month: string, goals: number, assists: number, date: Date | null }> = {};
  const monthsPt = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  for (const match of matches) {
    let monthLabel = "Desconhecido";
    if (match.date) {
      const d = new Date(match.date);
      monthLabel = `${monthsPt[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
      if (!monthlyMap[monthLabel]) monthlyMap[monthLabel] = { month: monthLabel, goals: 0, assists: 0, date: match.date };
    }

    // Matches played
    for (const att of match.attendances) {
      if (!att.playerId) continue;
      if (!playerMap[att.playerId]) {
        playerMap[att.playerId] = {
          playerId: att.playerId,
          playerName: "",
          position: "",
          shirtNumber: null,
          photoUrl: null,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
          matchesPlayed: 0,
        };
      }
      playerMap[att.playerId].matchesPlayed++;
    }

    // Stats
    for (const stat of match.matchStats) {
      if (!stat.playerId) continue;
      if (!playerMap[stat.playerId]) {
        playerMap[stat.playerId] = {
          playerId: stat.playerId,
          playerName: stat.player?.name || "Desconhecido",
          position: stat.player?.position || "N/A",
          shirtNumber: stat.player?.shirtNumber || null,
          photoUrl: stat.player?.photoUrl || null,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
          matchesPlayed: 0,
        };
      }
      
      if (stat.player) {
        playerMap[stat.playerId].playerName = stat.player.name;
        playerMap[stat.playerId].position = stat.player.position;
        playerMap[stat.playerId].shirtNumber = stat.player.shirtNumber;
        playerMap[stat.playerId].photoUrl = stat.player.photoUrl;
      }

      const g = stat.goals || 0;
      const a = stat.assists || 0;
      
      playerMap[stat.playerId].goals += g;
      playerMap[stat.playerId].assists += a;
      playerMap[stat.playerId].yellowCards += stat.yellowCards || 0;
      playerMap[stat.playerId].redCards += stat.redCards || 0;

      if (monthlyMap[monthLabel]) {
        monthlyMap[monthLabel].goals += g;
        monthlyMap[monthLabel].assists += a;
      }
    }
  }

  const players = Object.values(playerMap).map(p => ({
    ...p,
    goalContributions: p.goals + p.assists,
  })).sort((a, b) => b.goals - a.goals || b.assists - a.assists);

  const monthly = Object.values(monthlyMap).sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).map(({ date, ...rest }) => rest);

  return NextResponse.json({
    players,
    monthly,
  });
}
