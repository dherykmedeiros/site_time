import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 403 }
    );
  }

  const teamId = session.user.teamId;
  const { searchParams } = new URL(request.url);
  const seasonId = searchParams.get("seasonId") || undefined;
  const matchType = searchParams.get("matchType") || searchParams.get("type") || undefined;

  // Build the match filter
  const matchWhere: any = { teamId };
  if (seasonId) matchWhere.seasonId = seasonId;
  if (matchType && (matchType === "FRIENDLY" || matchType === "CHAMPIONSHIP")) {
    matchWhere.type = matchType;
  }

  // Fetch all ratings for this team/season
  const ratings = await prisma.matchPlayerRating.findMany({
    where: {
      match: matchWhere,
    },
    include: {
      rated: {
        select: {
          id: true,
          name: true,
          photoUrl: true,
          shirtNumber: true,
          position: true,
        },
      },
    },
  });

  // Calculate averages per rated player
  const playerStatsMap = new Map<string, { sum: number; count: number; player: any }>();

  ratings.forEach((rating: any) => {
    const player = rating.rated;
    if (!player) return;

    const existing = playerStatsMap.get(player.id);
    if (existing) {
      existing.sum += rating.stars;
      existing.count += 1;
    } else {
      playerStatsMap.set(player.id, {
        sum: rating.stars,
        count: 1,
        player,
      });
    }
  });

  const ratedPlayersList = Array.from(playerStatsMap.values()).map(({ sum, count, player }) => {
    return {
      playerId: player.id,
      playerName: player.name,
      photoUrl: player.photoUrl,
      shirtNumber: player.shirtNumber,
      position: player.position,
      averageStars: Number((sum / count).toFixed(1)),
      totalRatings: count,
    };
  });

  // Define consolidated position grouping helper
  function getConsolidatedPosition(position: string) {
    switch (position) {
      case "GOALKEEPER":
        return { category: "GOALKEEPER", title: "Goleiros", order: 1 };
      case "DEFENDER":
        return { category: "DEFENDER", title: "Zagueiros", order: 2 };
      case "LEFT_BACK":
      case "RIGHT_BACK":
        return { category: "LATERAL", title: "Laterais", order: 3 };
      case "DEFENSIVE_MIDFIELDER":
        return { category: "DEFENSIVE_MIDFIELDER", title: "Volantes", order: 4 };
      case "MIDFIELDER":
        return { category: "MIDFIELDER", title: "Meio-campistas", order: 5 };
      case "LEFT_WINGER":
      case "RIGHT_WINGER":
        return { category: "WINGER", title: "Pontas", order: 6 };
      case "FORWARD":
        return { category: "FORWARD", title: "Atacantes", order: 7 };
      default:
        return { category: "OTHER", title: "Outros", order: 8 };
    }
  }

  // Pre-populate all standard groups to ensure they are returned even if empty
  const groupsMap = new Map<string, { category: string; title: string; order: number; players: any[] }>();
  
  const standardPositions = [
    "GOALKEEPER", "DEFENDER", "LEFT_BACK", "DEFENSIVE_MIDFIELDER", 
    "MIDFIELDER", "LEFT_WINGER", "FORWARD"
  ];
  
  standardPositions.forEach((pos) => {
    const info = getConsolidatedPosition(pos);
    groupsMap.set(info.category, {
      category: info.category,
      title: info.title,
      order: info.order,
      players: [],
    });
  });

  // Group rated players
  ratedPlayersList.forEach((player) => {
    const info = getConsolidatedPosition(player.position);
    let group = groupsMap.get(info.category);
    if (!group) {
      group = {
        category: info.category,
        title: info.title,
        order: info.order,
        players: [],
      };
      groupsMap.set(info.category, group);
    }
    group.players.push(player);
  });

  // Sort players in each group by averageStars (descending), then totalRatings (descending)
  const rankings = Array.from(groupsMap.values())
    .map((group) => {
      group.players.sort((a, b) => {
        if (b.averageStars !== a.averageStars) {
          return b.averageStars - a.averageStars;
        }
        return b.totalRatings - a.totalRatings;
      });
      return group;
    })
    .sort((a, b) => a.order - b.order);

  // Fetch season info if filtered
  let season: { id: string; name: string } | null = null;
  if (seasonId) {
    const seasonRecord = await prisma.season.findUnique({
      where: { id: seasonId },
      select: { id: true, name: true },
    });
    season = seasonRecord;
  }

  // Fetch all seasons for the team (for the filter select)
  const seasons = await prisma.season.findMany({
    where: { teamId },
    select: { id: true, name: true, status: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ rankings, season, seasons });
}
