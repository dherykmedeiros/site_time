import { prisma } from "@/lib/prisma";
import { PlayerPosition, MatchLineupRole } from "@prisma/client";

export const fieldTypeLabels: Record<string, string> = {
  GRASS: "Grama Natural",
  SYNTHETIC: "Grama Sintética",
  FUTSAL: "Futsal",
  SOCIETY: "Society",
  OTHER: "Outro",
};

export const competitiveLevelLabels: Record<string, string> = {
  CASUAL: "Casual / Amador",
  INTERMEDIATE: "Intermediário",
  COMPETITIVE: "Competitivo / Várzea Forte",
};

export const shortRoles: Record<string, string> = {
  GOALKEEPER: "GOL",
  DEFENDER: "ZAG",
  LEFT_BACK: "LE",
  RIGHT_BACK: "LD",
  LEFT_WINGBACK: "AE",
  RIGHT_WINGBACK: "AD",
  MIDFIELDER: "MEI",
  DEFENSIVE_MIDFIELDER: "VOL",
  FORWARD: "ATA",
  LEFT_WINGER: "PE",
  RIGHT_WINGER: "PD",
};

export const prettyRoles: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral Esquerdo",
  RIGHT_BACK: "Lateral Direito",
  LEFT_WINGBACK: "Ala Esquerdo",
  RIGHT_WINGBACK: "Ala Direito",
  MIDFIELDER: "Meio-campista",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta Esquerda",
  RIGHT_WINGER: "Ponta Direita",
};

export const positionThemes: Record<string, { border: string; text: string; label: string; badge: string }> = {
  GOALKEEPER: {
    border: "border-amber-500/10 hover:border-amber-400/30",
    text: "text-amber-400",
    label: "Goleiro",
    badge: "bg-amber-500/5 text-amber-400 border-amber-500/20",
  },
  DEFENDER: {
    border: "border-emerald-500/10 hover:border-emerald-400/30",
    text: "text-emerald-400",
    label: "Zagueiro",
    badge: "bg-emerald-500/5 text-emerald-400 border-emerald-500/20",
  },
  LEFT_BACK: {
    border: "border-emerald-500/10 hover:border-emerald-400/30",
    text: "text-emerald-400",
    label: "Lateral Esquerdo",
    badge: "bg-emerald-500/5 text-emerald-400 border-emerald-500/20",
  },
  RIGHT_BACK: {
    border: "border-emerald-500/10 hover:border-emerald-400/30",
    text: "text-emerald-400",
    label: "Lateral Direito",
    badge: "bg-emerald-500/5 text-emerald-400 border-emerald-500/20",
  },
  LEFT_WINGBACK: {
    border: "border-emerald-500/10 hover:border-emerald-400/30",
    text: "text-emerald-400",
    label: "Ala Esquerdo",
    badge: "bg-emerald-500/5 text-emerald-400 border-emerald-500/20",
  },
  RIGHT_WINGBACK: {
    border: "border-emerald-500/10 hover:border-emerald-400/30",
    text: "text-emerald-400",
    label: "Ala Direito",
    badge: "bg-emerald-500/5 text-emerald-400 border-emerald-500/20",
  },
  MIDFIELDER: {
    border: "border-cyan-500/10 hover:border-cyan-400/30",
    text: "text-cyan-400",
    label: "Meio-campista",
    badge: "bg-cyan-500/5 text-cyan-400 border-cyan-500/20",
  },
  DEFENSIVE_MIDFIELDER: {
    border: "border-cyan-500/10 hover:border-cyan-400/30",
    text: "text-cyan-400",
    label: "Volante",
    badge: "bg-cyan-500/5 text-cyan-400 border-cyan-500/20",
  },
  FORWARD: {
    border: "border-rose-500/10 hover:border-rose-400/30",
    text: "text-rose-400",
    label: "Atacante",
    badge: "bg-rose-500/5 text-rose-400 border-rose-500/20",
  },
  LEFT_WINGER: {
    border: "border-rose-500/10 hover:border-rose-400/30",
    text: "text-rose-400",
    label: "Ponta Esquerda",
    badge: "bg-rose-500/5 text-rose-400 border-rose-500/20",
  },
  RIGHT_WINGER: {
    border: "border-rose-500/10 hover:border-rose-400/30",
    text: "text-rose-400",
    label: "Ponta Direita",
    badge: "bg-rose-500/5 text-rose-400 border-rose-500/20",
  },
};

export function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "10, 88, 75"; // default brand green
}

export function getPlayerMarkerClasses(position: string) {
  const p = position.toUpperCase();

  if (p === "GOALKEEPER") {
    return {
      ring: "border-[#d2f0ff]/95",
      surface: "bg-[linear-gradient(180deg,rgba(21,57,76,0.80)_0%,rgba(9,25,35,0.88)_100%)]",
      name: "bg-[rgba(12,36,46,0.72)]",
    };
  }

  if (["DEFENDER", "LEFT_BACK", "RIGHT_BACK", "LEFT_WINGBACK", "RIGHT_WINGBACK"].includes(p)) {
    return {
      ring: "border-[#d9fff0]/90",
      surface: "bg-[linear-gradient(180deg,rgba(18,63,46,0.82)_0%,rgba(8,29,22,0.90)_100%)]",
      name: "bg-[rgba(8,30,22,0.68)]",
    };
  }

  if (["MIDFIELDER", "DEFENSIVE_MIDFIELDER"].includes(p)) {
    return {
      ring: "border-[#fff0c4]/90",
      surface: "bg-[linear-gradient(180deg,rgba(71,58,19,0.78)_0%,rgba(31,24,7,0.90)_100%)]",
      name: "bg-[rgba(33,26,8,0.68)]",
    };
  }

  return {
    ring: "border-[#ffe1d5]/90",
    surface: "bg-[linear-gradient(180deg,rgba(82,36,28,0.78)_0%,rgba(32,12,8,0.90)_100%)]",
    name: "bg-[rgba(34,14,9,0.68)]",
  };
}

const positionOrder: Record<string, number> = {
  GOALKEEPER: 1,
  RIGHT_BACK: 2,
  RIGHT_WINGBACK: 2,
  DEFENDER: 3,
  LEFT_BACK: 4,
  LEFT_WINGBACK: 4,
  MIDFIELDER: 5,
  DEFENSIVE_MIDFIELDER: 6,
  RIGHT_WINGER: 7,
  FORWARD: 8,
  LEFT_WINGER: 9,
};

export interface PortalPlayer {
  id: string;
  name: string;
  shirtNumber: number;
  position: PlayerPosition;
  photoUrl?: string | null;
}

export interface LineupEntryInput {
  id: string;
  fieldX: number | null;
  fieldY: number | null;
  role: MatchLineupRole;
  player?: PortalPlayer | null;
  guestPlayer?: PortalPlayer | null;
}

export interface MappedTacticalPlayer {
  id: string;
  name: string;
  shirtNumber: number;
  position: PlayerPosition;
  x: number;
  y: number;
}

export function getTacticalPositions(starters: LineupEntryInput[]): MappedTacticalPlayer[] {
  const customPlacements = starters.filter(s => s.fieldX != null && s.fieldY != null).map(s => {
    const p = s.player || s.guestPlayer;
    const x = s.fieldY ?? 50;
    const y = s.fieldX ?? 50;
    return {
      id: s.id,
      name: p?.name || "Convidado",
      shirtNumber: p?.shirtNumber || 0,
      position: p?.position || "FORWARD",
      x,
      y
    };
  });

  const autoPlacements = starters.filter(s => s.fieldX == null || s.fieldY == null);

  const gks: LineupEntryInput[] = [];
  const defs: LineupEntryInput[] = [];
  const mids: LineupEntryInput[] = [];
  const fwds: LineupEntryInput[] = [];

  autoPlacements.forEach((s) => {
    const p = s.player || s.guestPlayer;
    const pos = (p?.position || "FORWARD").toUpperCase();
    if (pos === "GOALKEEPER") {
      gks.push(s);
    } else if (["DEFENDER", "LEFT_BACK", "RIGHT_BACK"].includes(pos)) {
      defs.push(s);
    } else if (["MIDFIELDER", "DEFENSIVE_MIDFIELDER"].includes(pos)) {
      mids.push(s);
    } else {
      fwds.push(s);
    }
  });

  const sortByPosition = (a: LineupEntryInput, b: LineupEntryInput) => {
    const pA = a.player || a.guestPlayer;
    const pB = b.player || b.guestPlayer;
    const orderA = positionOrder[pA?.position || "FORWARD"] || 99;
    const orderB = positionOrder[pB?.position || "FORWARD"] || 99;
    return orderA - orderB;
  };

  gks.sort(sortByPosition);
  defs.sort(sortByPosition);
  mids.sort(sortByPosition);
  fwds.sort(sortByPosition);

  const mappedAuto: MappedTacticalPlayer[] = [];

  gks.forEach((s) => {
    const p = s.player || s.guestPlayer;
    mappedAuto.push({
      id: s.id,
      name: p?.name || "Convidado",
      shirtNumber: p?.shirtNumber || 0,
      position: p?.position || "GOALKEEPER",
      x: 12,
      y: 50,
    });
  });

  const D = defs.length;
  defs.forEach((s, idx) => {
    const p = s.player || s.guestPlayer;
    let px = 22;
    let py = 50;
    if (D === 4) {
      const spots = [
        { x: 24, y: 18 },
        { x: 22, y: 38 },
        { x: 22, y: 62 },
        { x: 24, y: 82 },
      ];
      px = spots[idx].x;
      py = spots[idx].y;
    } else if (D === 3) {
      const spots = [
        { x: 24, y: 22 },
        { x: 22, y: 50 },
        { x: 24, y: 78 },
      ];
      px = spots[idx].x;
      py = spots[idx].y;
    } else if (D === 5) {
      const spots = [
        { x: 24, y: 15 },
        { x: 22, y: 32 },
        { x: 20, y: 50 },
        { x: 22, y: 68 },
        { x: 24, y: 85 },
      ];
      px = spots[idx].x;
      py = spots[idx].y;
    } else if (D > 0) {
      const step = 64 / (D - 1 || 1);
      px = 22;
      py = Math.round(18 + idx * step);
    }
    mappedAuto.push({
      id: s.id,
      name: p?.name || "Convidado",
      shirtNumber: p?.shirtNumber || 0,
      position: p?.position || "DEFENDER",
      x: px,
      y: py,
    });
  });

  const M = mids.length;
  mids.forEach((s, idx) => {
    const p = s.player || s.guestPlayer;
    let px = 44;
    let py = 50;
    if (M === 3) {
      const spots = [
        { x: 42, y: 25 },
        { x: 48, y: 50 },
        { x: 42, y: 75 },
      ];
      px = spots[idx].x;
      py = spots[idx].y;
    } else if (M === 4) {
      const spots = [
        { x: 42, y: 20 },
        { x: 46, y: 40 },
        { x: 46, y: 60 },
        { x: 42, y: 80 },
      ];
      px = spots[idx].x;
      py = spots[idx].y;
    } else if (M === 2) {
      const spots = [
        { x: 44, y: 33 },
        { x: 44, y: 67 },
      ];
      px = spots[idx].x;
      py = spots[idx].y;
    } else if (M > 0) {
      const step = 60 / (M - 1 || 1);
      px = 44;
      py = Math.round(20 + idx * step);
    }
    mappedAuto.push({
      id: s.id,
      name: p?.name || "Convidado",
      shirtNumber: p?.shirtNumber || 0,
      position: p?.position || "MIDFIELDER",
      x: px,
      y: py,
    });
  });

  const F = fwds.length;
  fwds.forEach((s, idx) => {
    const p = s.player || s.guestPlayer;
    let px = 80;
    let py = 50;
    if (F === 3) {
      const spots = [
        { x: 74, y: 22 },
        { x: 84, y: 50 },
        { x: 74, y: 78 },
      ];
      px = spots[idx].x;
      py = spots[idx].y;
    } else if (F === 2) {
      const spots = [
        { x: 80, y: 33 },
        { x: 80, y: 67 },
      ];
      px = spots[idx].x;
      py = spots[idx].y;
    } else if (F === 1) {
      px = 84;
      py = 50;
    } else if (F > 0) {
      const step = 60 / (F - 1 || 1);
      px = 78;
      py = Math.round(20 + idx * step);
    }
    mappedAuto.push({
      id: s.id,
      name: p?.name || "Convidado",
      shirtNumber: p?.shirtNumber || 0,
      position: p?.position || "FORWARD",
      x: px,
      y: py,
    });
  });

  return [...customPlacements, ...mappedAuto];
}

export interface RankingEntry {
  playerId: string;
  playerName: string;
  photoUrl: string | null;
  shirtNumber: number | null;
  position: PlayerPosition;
  status: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  matches: number;
  averageStars: number | null;
  totalRatings: number;
}

export interface TeamStatsType {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  goalsScored: number;
  goalsConceded: number;
  topScorers: Array<{ playerName: string; total: number }>;
  activeSeason: { id: string; name: string } | null;
  activeSeasonStandings: Array<{
    playerId: string;
    playerName: string;
    shirtNumber: number | null;
    points: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalDiff: number;
  }>;
  ranking: RankingEntry[];
  highlights: {
    bestScorer: RankingEntry | null;
    bestHighlightScorer?: RankingEntry | null;
    bestAssist: RankingEntry | null;
    bestPresence: RankingEntry | null;
    bestRated: RankingEntry | null;
  };
}

export interface StampPlayerInput {
  id: string;
  position: PlayerPosition;
}

export function getPlayerStamp(player: StampPlayerInput, stats: TeamStatsType) {
  const isBestScorer = stats.highlights.bestScorer?.playerId === player.id;
  const isBestAssist = stats.highlights.bestAssist?.playerId === player.id;
  const isBestRated = stats.highlights.bestRated?.playerId === player.id;
  const isBestPresence = stats.highlights.bestPresence?.playerId === player.id;

  if (player.position === "GOALKEEPER") {
    return "Paredão Insuperável";
  }
  if (isBestScorer && (stats.highlights.bestScorer?.goals ?? 0) > 0) {
    return "Artilheiro de Ouro";
  }
  if (isBestRated && (stats.highlights.bestRated?.averageStars ?? 0) > 0) {
    return "Diferenciado";
  }
  if (isBestAssist && (stats.highlights.bestAssist?.assists ?? 0) > 0) {
    return "Motor de Assistências";
  }
  if (isBestPresence) {
    return "Xerife de Aço";
  }

  switch (player.position) {
    case "DEFENDER":
    case "LEFT_BACK":
    case "RIGHT_BACK":
    case "LEFT_WINGBACK":
    case "RIGHT_WINGBACK":
      return "Muralha da Várzea";
    case "MIDFIELDER":
    case "DEFENSIVE_MIDFIELDER":
      return "Maestro do Meio";
    case "FORWARD":
    case "LEFT_WINGER":
    case "RIGHT_WINGER":
      return "Brocador Nato";
    default:
      return "Manto Sagrado";
  }
}

export function getPlayerTag(player: StampPlayerInput, stats: TeamStatsType) {
  const isBestScorer = stats.highlights.bestScorer?.playerId === player.id;
  const isBestAssist = stats.highlights.bestAssist?.playerId === player.id;
  const isBestRated = stats.highlights.bestRated?.playerId === player.id;
  const isBestPresence = stats.highlights.bestPresence?.playerId === player.id;

  if (isBestScorer) return "Artilheiro";
  if (isBestAssist) return "Garçom";
  if (isBestRated) return "Scout Altíssimo";
  if (isBestPresence) return "Incontestável";

  switch (player.position) {
    case "GOALKEEPER":
      return "Insuperável";
    case "DEFENDER":
    case "LEFT_BACK":
    case "RIGHT_BACK":
    case "LEFT_WINGBACK":
    case "RIGHT_WINGBACK":
      return "Muralha";
    case "MIDFIELDER":
    case "DEFENSIVE_MIDFIELDER":
      return "Maestro";
    default:
      return "Brocador";
  }
}

export async function getTeamData(slug?: string) {
  const selectFields = {
    id: true,
    name: true,
    shortName: true,
    slug: true,
    description: true,
    badgeUrl: true,
    foundedYear: true,
    city: true,
    region: true,
    defaultVenue: true,
    fieldType: true,
    competitiveLevel: true,
    primaryColor: true,
    secondaryColor: true,
    kitHomeUrl: true,
    kitAwayUrl: true,
    kitGkUrl: true,
    publicDirectoryOptIn: true,
    defaultFormation: true,
    createdAt: true,
  };

  const includesConfig = {
    defaultLineup: {
      orderBy: {
        sortOrder: "asc" as const,
      },
      include: {
        player: true,
      },
    },
    openMatchSlots: {
      where: { status: "OPEN" as const },
      orderBy: { date: "asc" as const },
      select: {
        id: true,
        date: true,
        timeLabel: true,
        venueLabel: true,
        notes: true,
      },
    },
    players: {
      where: { status: "ACTIVE" as const },
      orderBy: { shirtNumber: "asc" as const },
      select: {
        id: true,
        name: true,
        position: true,
        shirtNumber: true,
        photoUrl: true,
      },
    },
  };

  if (slug) {
    return prisma.team.findUnique({
      where: { slug },
      include: {
        ...includesConfig,
      },
    });
  }

  return prisma.team.findFirst({
    include: {
      ...includesConfig,
    },
  });
}

export async function getTeamMatches(teamId: string) {
  // Otimização: Buscamos apenas os compromissos necessários (próximos 6 e últimos 5 completados)
  const [scheduledMatches, finishedMatches] = await Promise.all([
    prisma.match.findMany({
      where: { teamId, status: "SCHEDULED" },
      orderBy: { date: "asc" },
      take: 6,
      include: {
        lineupSelections: {
          include: {
            player: true,
            guestPlayer: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),
    prisma.match.findMany({
      where: { teamId, status: "COMPLETED" },
      orderBy: { date: "desc" },
      take: 5,
      select: {
        id: true,
        date: true,
        opponent: true,
        venue: true,
        type: true,
        homeScore: true,
        awayScore: true,
        isHome: true,
        status: true,
      },
    }),
  ]);

  return { scheduledMatches, finishedMatches };
}

export async function getTeamStats(teamId: string): Promise<TeamStatsType> {
  const completedMatches = await prisma.match.findMany({
    where: { teamId, status: "COMPLETED" },
    select: { homeScore: true, awayScore: true, isHome: true },
  });

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;

  for (const m of completedMatches) {
    const teamGoalsFor = m.isHome ? m.homeScore ?? 0 : m.awayScore ?? 0;
    const teamGoalsAgainst = m.isHome ? m.awayScore ?? 0 : m.homeScore ?? 0;
    goalsScored += teamGoalsFor;
    goalsConceded += teamGoalsAgainst;
    if (teamGoalsFor > teamGoalsAgainst) wins++;
    else if (teamGoalsFor < teamGoalsAgainst) losses++;
    else draws++;
  }

  const totalMatches = completedMatches.length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  const activeSeason = await prisma.season.findFirst({
    where: { teamId, status: "ACTIVE" },
    orderBy: { startDate: "desc" },
    select: { id: true, name: true },
  });

  const players = await prisma.player.findMany({
    where: { teamId },
    select: {
      id: true,
      name: true,
      shirtNumber: true,
      position: true,
      photoUrl: true,
      status: true,
    },
  });

  const playerStats = await prisma.matchStats.groupBy({
    by: ["playerId"],
    where: { match: { teamId } },
    _sum: {
      goals: true,
      assists: true,
      yellowCards: true,
      redCards: true,
    },
    _count: {
      matchId: true,
    },
  });

  const attendanceStats = await prisma.matchAttendance.groupBy({
    by: ["playerId"],
    where: {
      present: true,
      match: { teamId, status: "COMPLETED" },
    },
    _count: {
      matchId: true,
    },
  });
  const presenceMap = new Map<string, number>(
    attendanceStats.map((a) => [a.playerId, a._count.matchId])
  );

  const ratingsAgg = await prisma.matchPlayerRating.groupBy({
    by: ["ratedId"],
    where: { match: { teamId } },
    _avg: { stars: true },
    _count: { stars: true },
  });
  const ratingsMap = new Map(
    ratingsAgg.map((r) => [r.ratedId, { avg: r._avg.stars ?? 0, count: r._count.stars }])
  );

  const playerStatsMap = new Map(playerStats.map((s) => [s.playerId, s]));

  const ranking = players.map((player) => {
    const s = playerStatsMap.get(player.id);
    const ratingInfo = ratingsMap.get(player.id);
    const playedMatches = presenceMap.get(player.id) ?? 0;

    return {
      playerId: player.id,
      playerName: player.name,
      photoUrl: player.photoUrl,
      shirtNumber: player.shirtNumber,
      position: player.position,
      status: player.status,
      goals: s?._sum.goals ?? 0,
      assists: s?._sum.assists ?? 0,
      yellowCards: s?._sum.yellowCards ?? 0,
      redCards: s?._sum.redCards ?? 0,
      matches: playedMatches,
      averageStars: ratingInfo ? Number(ratingInfo.avg.toFixed(1)) : null,
      totalRatings: ratingInfo?.count ?? 0,
    };
  });

  const topScorersList = [...ranking]
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals || a.matches - b.matches);
  const bestScorer = topScorersList[0] || null;

  const topAssistsList = [...ranking]
    .filter((p) => p.assists > 0)
    .sort((a, b) => b.assists - a.assists || a.matches - b.matches);
  const bestAssist = topAssistsList[0] || null;

  const topPresenceList = [...ranking]
    .filter((p) => p.matches > 0)
    .sort((a, b) => b.matches - a.matches);
  const bestPresence = topPresenceList[0] || null;

  const topRatedList = [...ranking]
    .filter((p) => p.totalRatings > 0 && p.averageStars !== null)
    .sort((a, b) => (b.averageStars ?? 0) - (a.averageStars ?? 0) || b.totalRatings - a.totalRatings);
  const bestRated = topRatedList[0] || null;

  const topScorers = topScorersList.slice(0, 5).map((s) => ({
    playerName: s.playerName,
    total: s.goals,
  }));

  let activeSeasonStandings: Array<{
    playerId: string;
    playerName: string;
    shirtNumber: number | null;
    points: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalDiff: number;
  }> = [];

  if (activeSeason) {
    const seasonMatches = await prisma.match.findMany({
      where: {
        teamId,
        seasonId: activeSeason.id,
        status: "COMPLETED",
        homeScore: { not: null },
        awayScore: { not: null },
      },
      select: {
        homeScore: true,
        awayScore: true,
        isHome: true,
        attendances: {
          where: { present: true },
          select: {
            playerId: true,
            player: { select: { name: true, shirtNumber: true } },
          },
        },
      },
    });

    const standingMap: Record<
      string,
      {
        playerId: string;
        playerName: string;
        shirtNumber: number | null;
        points: number;
        played: number;
        won: number;
        drawn: number;
        lost: number;
        goalsFor: number;
        goalsAgainst: number;
        goalDiff: number;
      }
    > = {};

    for (const match of seasonMatches) {
      const teamGoalsFor = match.isHome ? match.homeScore ?? 0 : match.awayScore ?? 0;
      const teamGoalsAgainst = match.isHome ? match.awayScore ?? 0 : match.homeScore ?? 0;
      const won = teamGoalsFor > teamGoalsAgainst;
      const drawn = teamGoalsFor === teamGoalsAgainst;
      const lost = teamGoalsFor < teamGoalsAgainst;

      for (const attendance of match.attendances) {
        if (!standingMap[attendance.playerId]) {
          standingMap[attendance.playerId] = {
            playerId: attendance.playerId,
            playerName: attendance.player.name,
            shirtNumber: attendance.player.shirtNumber,
            points: 0,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDiff: 0,
          };
        }

        const row = standingMap[attendance.playerId];
        row.played += 1;
        row.goalsFor += teamGoalsFor;
        row.goalsAgainst += teamGoalsAgainst;
        if (won) {
          row.won += 1;
          row.points += 3;
        } else if (drawn) {
          row.drawn += 1;
          row.points += 1;
        } else if (lost) {
          row.lost += 1;
        }
        row.goalDiff = row.goalsFor - row.goalsAgainst;
      }
    }

    activeSeasonStandings = Object.values(standingMap)
      .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.won - a.won)
      .map(({ goalsFor, goalsAgainst, ...row }) => row);
  }

  return {
    totalMatches,
    wins,
    draws,
    losses,
    winRate,
    goalsScored,
    goalsConceded,
    topScorers,
    activeSeason,
    activeSeasonStandings,
    ranking,
    highlights: {
      bestScorer,
      bestHighlightScorer: bestScorer,
      bestAssist,
      bestPresence,
      bestRated,
    },
  };
}
