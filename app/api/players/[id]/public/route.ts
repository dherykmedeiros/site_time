import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/players/:id/public — public player profile (no auth)
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const player = await prisma.player.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      fullName: true,
      position: true,
      shirtNumber: true,
      photoUrl: true,
      description: true,
      status: true,
      team: {
        select: {
          name: true,
          slug: true,
          badgeUrl: true,
          primaryColor: true,
          secondaryColor: true,
        },
      },
    },
  });

  if (!player) {
    return NextResponse.json({ error: "Jogador não encontrado" }, { status: 404 });
  }

  const [statsAggregate, recentStats] = await Promise.all([
    prisma.matchStats.aggregate({
      where: { playerId: id },
      _sum: { goals: true, assists: true, yellowCards: true, redCards: true },
      _count: { id: true },
    }),
    prisma.matchStats.findMany({
      where: { playerId: id },
      include: {
        match: {
          select: {
            id: true,
            date: true,
            opponent: true,
            homeScore: true,
            awayScore: true,
          },
        },
      },
      orderBy: { match: { date: "desc" } },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    id: player.id,
    name: player.name,
    fullName: player.fullName,
    position: player.position,
    shirtNumber: player.shirtNumber,
    photoUrl: player.photoUrl,
    description: player.description,
    status: player.status,
    team: player.team,
    career: {
      totalMatches: statsAggregate._count.id,
      totalGoals: statsAggregate._sum.goals ?? 0,
      totalAssists: statsAggregate._sum.assists ?? 0,
      totalYellowCards: statsAggregate._sum.yellowCards ?? 0,
      totalRedCards: statsAggregate._sum.redCards ?? 0,
    },
    recentMatches: recentStats.map((s: (typeof recentStats)[number]) => ({
      matchId: s.match.id,
      date: s.match.date.toISOString(),
      opponent: s.match.opponent,
      homeScore: s.match.homeScore,
      awayScore: s.match.awayScore,
      goals: s.goals,
      assists: s.assists,
      yellowCards: s.yellowCards,
      redCards: s.redCards,
    })),
  });
}
