import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { FriendlyRequestForm } from "@/app/FriendlyRequestForm";
import { RecruitmentForm } from "@/app/RecruitmentForm";
import ThemeToggle from "@/components/portal/ThemeToggle";

const fieldTypeLabels: Record<string, string> = {
  GRASS: "Grama Natural",
  SYNTHETIC: "Grama Sintética",
  FUTSAL: "Futsal",
  SOCIETY: "Society",
  OTHER: "Outro",
};

const competitiveLevelLabels: Record<string, string> = {
  CASUAL: "Casual / Amador",
  INTERMEDIATE: "Intermediário",
  COMPETITIVE: "Competitivo / Várzea Forte",
};

const shortRoles: Record<string, string> = {
  GOALKEEPER: "GOL",
  DEFENDER: "ZAG",
  LEFT_BACK: "LE",
  RIGHT_BACK: "LD",
  MIDFIELDER: "MEI",
  DEFENSIVE_MIDFIELDER: "VOL",
  FORWARD: "ATA",
  LEFT_WINGER: "ATA",
  RIGHT_WINGER: "ATA",
};

const prettyRoles: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral Esquerdo",
  RIGHT_BACK: "Lateral Direito",
  MIDFIELDER: "Meio-campista",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta Esquerda",
  RIGHT_WINGER: "Ponta Direita",
};

const positionThemes: Record<string, { border: string; text: string; label: string; badge: string }> = {
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
    label: "Ponta Direito",
    badge: "bg-rose-500/5 text-rose-400 border-rose-500/20",
  },
};

function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "10, 88, 75"; // default brand green
}

function ClubCrest({
  className = "w-9 h-[42px] shrink-0",
  variant = "normal",
  initials = "MC",
  badgeUrl = null
}: {
  className?: string;
  variant?: "normal" | "white" | "footer";
  initials?: string;
  badgeUrl?: string | null;
}) {
  if (badgeUrl) {
    return (
      <img
        src={badgeUrl}
        alt={`Escudo ${initials}`}
        className={`${className} object-contain`}
      />
    );
  }

  let fill = "var(--primary)";
  let stroke = "var(--ink)";
  let textFill = "var(--text-inv)";
  let lineStroke = "var(--bg)";

  if (variant === "white") {
    fill = "#fff";
    stroke = "#fff";
    textFill = "var(--primary)";
    lineStroke = "var(--primary)";
  } else if (variant === "footer") {
    fill = "var(--primary)";
    stroke = "#fff";
    textFill = "#fff";
    lineStroke = "#fff";
  }

  return (
    <svg className={className} viewBox="0 0 36 42">
      <path d="M18 1 L34 5 V22 C34 30 27 38 18 41 C9 38 2 30 2 22 V5 Z" fill={fill} stroke={stroke} strokeWidth="1" />
      <path d="M2 14 H34 M2 28 H34" stroke={lineStroke} strokeWidth=".8" opacity=".5" />
      <text x="18" y="26" textAnchor="middle" fill={textFill} className="font-serif font-bold" fontSize="13">
        {initials}
      </text>
    </svg>
  );
}

const FIELD_ZONES = [
  { key: "build", label: "Saída", left: "8%", width: "16%" },
  { key: "defense", label: "Defesa", left: "24%", width: "20%" },
  { key: "midfield", label: "Meio", left: "44%", width: "22%" },
  { key: "attack", label: "Ataque", left: "66%", width: "18%" },
] as const;

function getPlayerMarkerClasses(position: string) {
  const p = position.toUpperCase();

  if (p === "GOALKEEPER") {
    return {
      ring: "border-[#d2f0ff]/95",
      surface: "bg-[linear-gradient(180deg,rgba(21,57,76,0.80)_0%,rgba(9,25,35,0.88)_100%)]",
      name: "bg-[rgba(12,36,46,0.72)]",
    };
  }

  if (["DEFENDER", "LEFT_BACK", "RIGHT_BACK"].includes(p)) {
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

function getTacticalPositions(starters: any[]) {
  const mapped = starters.map((s) => {
    const p = s.player;
    let x = s.fieldX;
    let y = s.fieldY;
    
    if (x != null && y != null) {
      const displayX = y;
      const displayY = x;
      x = displayX;
      y = displayY;
    } else {
      if (p.position === "GOALKEEPER") {
        x = 10; y = 50;
      } else if (p.position === "LEFT_BACK") {
        x = 24; y = 82;
      } else if (p.position === "RIGHT_BACK") {
        x = 24; y = 18;
      } else if (p.position === "DEFENDER") {
        x = 22; y = 50;
      } else if (p.position === "DEFENSIVE_MIDFIELDER") {
        x = 46; y = 50;
      } else if (p.position === "MIDFIELDER") {
        x = 42; y = 30;
      } else if (p.position === "LEFT_WINGER") {
        x = 74; y = 78;
      } else if (p.position === "RIGHT_WINGER") {
        x = 74; y = 22;
      } else if (p.position === "FORWARD") {
        x = 84; y = 50;
      } else {
        x = 46; y = 50;
      }
    }
    
    return {
      id: s.id,
      name: p.name,
      shirtNumber: p.shirtNumber,
      position: p.position,
      x,
      y
    };
  });

  // Group by initial coordinates to prevent overlapping
  const positionGroups: Record<string, number[]> = {};
  mapped.forEach((player, idx) => {
    const key = `${player.x}-${player.y}`;
    if (!positionGroups[key]) {
      positionGroups[key] = [];
    }
    positionGroups[key].push(idx);
  });

  Object.keys(positionGroups).forEach((key) => {
    const indices = positionGroups[key];
    if (indices.length > 1) {
      // Symmetrical distribution around the center vertical axis if y is 50
      const firstPlayer = mapped[indices[0]];
      if (firstPlayer.y === 50) {
        if (indices.length === 2) {
          mapped[indices[0]].y = 38;
          mapped[indices[1]].y = 62;
        } else if (indices.length === 3) {
          mapped[indices[0]].y = 32;
          mapped[indices[1]].y = 50;
          mapped[indices[2]].y = 68;
        } else {
          const step = 40 / (indices.length - 1);
          indices.forEach((idx, offsetIdx) => {
            mapped[idx].y = Math.round(30 + offsetIdx * step);
          });
        }
      } else {
        // Otherwise, shift them slightly in diagonal so they do not overlap
        indices.forEach((idx, offsetIdx) => {
          if (offsetIdx > 0) {
            mapped[idx].x = Math.min(94, mapped[idx].x + offsetIdx * 6);
            mapped[idx].y = Math.min(94, mapped[idx].y + offsetIdx * 6);
          }
        });
      }
    }
  });

  return mapped;
}

function getPlayerStamp(player: any, stats: any) {
  const isBestScorer = stats.highlights.bestScorer?.playerId === player.id;
  const isBestAssist = stats.highlights.bestAssist?.playerId === player.id;
  const isBestRated = stats.highlights.bestRated?.playerId === player.id;
  const isBestPresence = stats.highlights.bestPresence?.playerId === player.id;

  if (player.position === "GOALKEEPER") {
    return "Paredão Insuperável";
  }
  if (isBestScorer && stats.highlights.bestScorer.goals > 0) {
    return "Artilheiro de Ouro";
  }
  if (isBestRated && stats.highlights.bestRated.averageStars > 0) {
    return "Diferenciado";
  }
  if (isBestAssist && stats.highlights.bestAssist.assists > 0) {
    return "Motor de Assistências";
  }
  if (isBestPresence) {
    return "Xerife de Aço";
  }

  switch (player.position) {
    case "DEFENDER":
    case "LEFT_BACK":
    case "RIGHT_BACK":
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

function getPlayerTag(player: any, stats: any) {
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
      return "Muralha";
    case "MIDFIELDER":
    case "DEFENSIVE_MIDFIELDER":
      return "Maestro";
    default:
      return "Brocador";
  }
}

async function getTeamData(slug: string) {
  return prisma.team.findUnique({
    where: { slug },
    include: {
      openMatchSlots: {
        where: { status: "OPEN" },
        orderBy: { date: "asc" },
        select: {
          id: true,
          date: true,
          timeLabel: true,
          venueLabel: true,
          notes: true,
        },
      },
      players: {
        where: { status: "ACTIVE" },
        orderBy: { shirtNumber: "asc" },
        select: {
          id: true,
          name: true,
          position: true,
          shirtNumber: true,
          photoUrl: true,
        },
      },
      matches: {
        orderBy: { date: "desc" },
        include: {
          lineupSelections: {
            include: {
              player: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
          matchStats: {
            include: {
              player: true,
            },
          },
        },
      },
      _count: {
        select: {
          players: true,
          matches: true,
        },
      },
    },
  });
}

async function getTeamStats(teamId: string) {
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
  const playerMap = new Map(players.map((p) => [p.id, p]));

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

  const ratingsAgg = await prisma.matchPlayerRating.groupBy({
    by: ["ratedId"],
    where: { match: { teamId } },
    _avg: { stars: true },
    _count: { stars: true },
  });
  const ratingsMap = new Map(
    ratingsAgg.map((r) => [r.ratedId, { avg: r._avg.stars ?? 0, count: r._count.stars }])
  );

  const ranking = playerStats.map((s) => {
    const player = playerMap.get(s.playerId);
    const ratingInfo = ratingsMap.get(s.playerId);
    return {
      playerId: s.playerId,
      playerName: player?.name ?? "Desconhecido",
      photoUrl: player?.photoUrl ?? null,
      shirtNumber: player?.shirtNumber ?? 0,
      position: player?.position ?? "FORWARD",
      status: player?.status ?? "ACTIVE",
      goals: s._sum.goals ?? 0,
      assists: s._sum.assists ?? 0,
      yellowCards: s._sum.yellowCards ?? 0,
      redCards: s._sum.redCards ?? 0,
      matches: s._count.matchId,
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
        type: "CHAMPIONSHIP",
        status: "COMPLETED",
        homeScore: { not: null },
        awayScore: { not: null },
      },
      select: {
        homeScore: true,
        awayScore: true,
        isHome: true,
        matchStats: {
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

      for (const stat of match.matchStats) {
        if (!standingMap[stat.playerId]) {
          standingMap[stat.playerId] = {
            playerId: stat.playerId,
            playerName: stat.player.name,
            shirtNumber: stat.player.shirtNumber,
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

        const row = standingMap[stat.playerId];
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
      bestAssist,
      bestPresence,
      bestRated,
    },
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ slot?: string; tab?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
  });
  if (!team) {
    return { title: "Portal Esportivo | VARzea" };
  }
  const description = team.description || `Portal oficial do ${team.name}. Confira elenco, estatísticas e envie convites de amistosos.`;
  return {
    title: `${team.name} — Arena Oficial | VARzea`,
    description,
    openGraph: {
      title: team.name,
      description,
      type: "website",
      url: `/${team.slug}`,
      siteName: "VARzea",
      locale: "pt_BR",
      ...(team.badgeUrl && { images: [{ url: team.badgeUrl, width: 200, height: 200, alt: `Escudo ${team.name}` }] }),
    },
  };
}

export default async function TeamPublicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const session = await getSession();
  const team = await getTeamData(slug);

  if (!team) {
    notFound();
  }

  const { slot: selectedSlotId, tab: selectedTab } = await searchParams;
  const isSecretaria = selectedTab === "secretaria" || !!selectedSlotId;
  const isAlbum = selectedTab === "album" && !selectedSlotId;
  const isEsportes = !isSecretaria && !isAlbum;
  const stats = await getTeamStats(team.id);

  // Conversions for Branding
  const themePrimary = team.primaryColor || "#0a584b";
  const themeSecondary = team.secondaryColor || "#c89832";
  const primaryRgb = hexToRgb(themePrimary);
  const secondaryRgb = hexToRgb(themeSecondary);

  // Statistics calculations
  const completedMatches = team.matches.filter((m) => m.status === "COMPLETED");
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;

  completedMatches.forEach((m) => {
    if (m.homeScore !== null && m.awayScore !== null) {
      const isHome = m.isHome;
      const teamGoalsFor = isHome ? m.homeScore : m.awayScore;
      const teamGoalsAgainst = isHome ? m.awayScore : m.homeScore;
      goalsScored += teamGoalsFor;
      goalsConceded += teamGoalsAgainst;
      if (teamGoalsFor > teamGoalsAgainst) wins++;
      else if (teamGoalsFor === teamGoalsAgainst) draws++;
      else losses++;
    }
  });

  const totalGames = completedMatches.length;
  const totalMatches = totalGames;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const avgGoalsScored = totalGames > 0 ? (goalsScored / totalGames).toFixed(2) : "0.00";
  const goalBalance = goalsScored - goalsConceded;

  // Split and Sort Matches
  const scheduledMatches = team.matches
    .filter((m) => m.status === "SCHEDULED")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextMatch = scheduledMatches[0] || null;
  const remainingScheduled = scheduledMatches.slice(1);

  let startersData: any[] = [];
  if (nextMatch && nextMatch.lineupSelections && nextMatch.lineupSelections.length > 0) {
    startersData = nextMatch.lineupSelections.filter((l: any) => l.role === "STARTER");
  } else {
    const matchCounts = new Map<string, number>();
    stats.ranking.forEach((r) => {
      matchCounts.set(r.playerId, r.matches);
    });
    const getMatchCount = (playerId: string) => matchCounts.get(playerId) || 0;
    const sortByMatchesDesc = (a: any, b: any) => getMatchCount(b.id) - getMatchCount(a.id);

    const goalkeepers = team.players
      .filter((p: any) => p.position === "GOALKEEPER")
      .sort(sortByMatchesDesc);
    const defenders = team.players
      .filter((p: any) => ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"].includes(p.position))
      .sort(sortByMatchesDesc);
    const midfielders = team.players
      .filter((p: any) => ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"].includes(p.position))
      .sort(sortByMatchesDesc);
    const forwards = team.players
      .filter((p: any) => ["FORWARD", "LEFT_WINGER", "RIGHT_WINGER"].includes(p.position))
      .sort(sortByMatchesDesc);
    
    const selectedGK = goalkeepers.slice(0, 1);
    const selectedDEF = defenders.slice(0, 4);
    const selectedMID = midfielders.slice(0, 3);
    const selectedFWD = forwards.slice(0, 3);
    
    const suggestedPlayers = [...selectedGK, ...selectedDEF, ...selectedMID, ...selectedFWD];
    startersData = suggestedPlayers.map((p: any) => ({
      id: `suggested-${p.id}`,
      role: "STARTER",
      fieldX: null,
      fieldY: null,
      player: p
    }));
  }
  const tacticalPlayers = getTacticalPositions(startersData);

  const finishedMatches = team.matches
    .filter((m) => m.status === "COMPLETED" || m.status === "CANCELLED")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hasDiscoveryInfo = Boolean(team.city || team.region || team.fieldType || team.competitiveLevel);

  const selectedSlot = selectedSlotId
    ? team.openMatchSlots.find((slot) => slot.id === selectedSlotId) ?? null
    : null;
  const selectedSlotDateText = selectedSlot
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(selectedSlot.date)
    : null;
  const selectedSlotTimeLabel = selectedSlot?.timeLabel || "";
  const suggestedDatesInitialValue = selectedSlotDateText
    ? `Preferencia pelo horario aberto em ${selectedSlotDateText}${selectedSlotTimeLabel ? ` (${selectedSlotTimeLabel})` : ""}`
    : "";
  const suggestedVenueInitialValue = selectedSlot?.venueLabel || "";

  // Highlights extraction
  const bestScorer = stats.highlights.bestScorer || null;
  const bestAssist = stats.highlights.bestAssist || null;
  const bestPresence = stats.highlights.bestPresence || null;
  const bestRated = stats.highlights.bestRated || null;

  const activeScorer = bestScorer || { shirtNumber: "-", playerName: "A definir", position: "ATA", goals: 0 };
  const activeAssist = bestAssist || { shirtNumber: "-", playerName: "A definir", position: "MEI", assists: 0 };
  const activePresence = bestPresence || { shirtNumber: "-", playerName: "A definir", position: "ZAG", matches: 0 };
  const activeRated = bestRated || { shirtNumber: "-", playerName: "A definir", position: "GOL", averageStars: 0.0, totalRatings: 0 };

  const clubInitials = team.shortName || team.name.substring(0, 2).toUpperCase();

  return (
    <div
      className="mcfc-portal-body min-h-screen text-[var(--text)] relative overflow-hidden bg-[var(--bg)] pb-24 font-sans selection:bg-[var(--primary)] selection:text-[var(--text-inv)] antialiased"
      style={{
        "--primary": themePrimary,
        "--primary-2": themeSecondary,
        "--primary-deep": `rgba(${primaryRgb}, 0.8)`,
        "--primary-tint": `rgba(${primaryRgb}, 0.08)`,
        "--accent": themeSecondary,
      } as React.CSSProperties}
    >
      <input type="radio" id="caderno-esportes" name="cadernos" className="hidden" defaultChecked={isEsportes} />
      <input type="radio" id="caderno-album" name="cadernos" className="hidden" defaultChecked={isAlbum} />
      <input type="radio" id="caderno-secretaria" name="cadernos" className="hidden" defaultChecked={isSecretaria} />

      <style>{`
        #caderno-esportes:checked ~ main #content-esportes { 
          display: block !important; 
        }
        #caderno-album:checked ~ main #content-album { 
          display: block !important; 
        }
        #caderno-secretaria:checked ~ main #content-secretaria { 
          display: block !important; 
        }

        #caderno-esportes:checked ~ main label[for="caderno-esportes"],
        #caderno-album:checked ~ main label[for="caderno-album"],
        #caderno-secretaria:checked ~ main label[for="caderno-secretaria"] {
          background-color: var(--primary) !important;
          color: var(--text-inv) !important;
          border-color: var(--primary) !important;
          font-weight: 700 !important;
          box-shadow: none !important;
        }

        .mcfc-portal-body label {
          font-family: inherit;
        }
      `}</style>

      {/* ── theme handling & restricted access banner ── */}
      {session && (
        <div className="relative z-50 bg-[#10b981] border-b border-black/20 px-4 py-2.5 text-center text-[10px] font-black uppercase tracking-widest text-[#090d0f] font-mono">
          [ACESSO ADMINISTRATIVO HABILITADO] —{" "}
          <Link href="/dashboard" className="underline hover:opacity-80 transition-opacity font-mono font-black">
            Ir para Painel de Controle &rarr;
          </Link>
        </div>
      )}

      {/* ── statusbar ── */}
      <div className="statusbar">
        <div className="wrap">
          <div className="left">
            <span>
              <span className="dot"></span> &nbsp;
              {stats.activeSeason ? `Temporada ${stats.activeSeason.name} · ativa` : "Temporada em curso"}
            </span>
            {nextMatch && (
              <span className="ticker">
                // PRÓXIMO JOGO · {new Date(nextMatch.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} · {new Date(nextMatch.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} · vs {nextMatch.opponent}
              </span>
            )}
          </div>
          <div className="right font-mono">
            <a href="?tab=secretaria#amistoso">Solicitar amistoso</a>
            <a href="?tab=secretaria#recrutamento">Quero jogar</a>
            <Link href="/dashboard">Acesso restrito ↗</Link>
          </div>
        </div>
      </div>

      {/* ── header.site ── */}
      <header className="site">
        <div className="wrap">
          <Link href={`/${team.slug}`} className="brand">
            <ClubCrest initials={clubInitials} badgeUrl={team.badgeUrl} />
            <div className="txt">
              <div className="top">Fundado em {(team as any).foundedYear || 2026} · {team.city || "Fortaleza"}/{team.region || "CE"}</div>
              <div className="name">{team.name}</div>
            </div>
          </Link>
          <nav className="primary font-sans">
            <a href="?tab=album#elenco">Elenco</a>
            <a href="?tab=esportes#desempenho">Desempenho</a>
            <a href="?tab=esportes#calendario">Calendário</a>
            <a href="?tab=esportes#tatica">Tática</a>
            <a href="?tab=secretaria#amistoso">Amistosos</a>
            <a href="?tab=album#identidade">Identidade</a>
          </nav>
          <div className="actions">
            <ThemeToggle />
            <a href="?tab=secretaria#amistoso" className="btn secondary hidden md:inline-flex">Desafiar equipe</a>
            <a href="?tab=album#elenco" className="btn green hidden md:inline-flex">Conhecer elenco <span className="btn-arr">→</span></a>
          </div>
        </div>
      </header>

      {/* ── hero ── */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-id">
              <div className="scroll-chips">
                <span className="tag primary">Temporada {stats.activeSeason ? stats.activeSeason.name : "2026"}</span>
                {team.competitiveLevel && (
                  <span className="tag">{competitiveLevelLabels[team.competitiveLevel]}</span>
                )}
                {team.fieldType && (
                  <span className="tag info">{fieldTypeLabels[team.fieldType]}</span>
                )}
                <span className="tag">
                  <span className="dot" style={{ background: "var(--accent)" }}></span> Aberto a amistosos
                </span>
              </div>
              <h1 className="font-serif leading-[1.05] tracking-tight mt-3 text-5xl md:text-6xl font-bold uppercase text-[var(--ink)]">
                {team.name}.
              </h1>
              <p className="tagline font-serif italic text-lg text-[var(--text-2)] mt-4 max-w-xl">
                {team.description || `"Sempre em frente." — Desde a fundação, o que move o time é a nossa comunidade.`}
              </p>
              <div className="since font-mono text-[11px] text-[var(--text-3)] flex gap-4 uppercase mt-6 border-b border-[var(--border)] pb-6">
                <span>FUND. <b>{(team as any).foundedYear || 2026}</b></span>
                <span>·</span>
                <span>SEDE <b>{team.city || "Fortaleza"} · {team.region || "Ceará"}</b></span>
                <span>·</span>
                <span>CAMPO <b>{team.defaultVenue || "Arena Principal"}</b></span>
              </div>
              
              {/* Manifesto */}
              <div className="manifesto mt-8 p-6 bg-[var(--surface-2)] border-l-4 border-[var(--primary)] relative">
                <div className="tag-row flex justify-between text-[11px] font-mono text-[var(--text-3)] uppercase tracking-wide mb-3">
                  <span className="lab font-bold">▸ Manifesto de vestiário</span>
                  <span>{(team as any).foundedYear || 2026} · revisão I</span>
                </div>
                <blockquote className="font-serif text-[15px] italic text-[var(--text-2)] leading-relaxed">
                  Aqui a paixão não é cobrada em bilheteria e o suor pesa mais que qualquer contrato milionário. Cada capítulo da nossa história é escrito no terrão ou no sintético, jogo a jogo, pela honra da comunidade.
                </blockquote>
              </div>

              {/* Geographical and technical meta descriptors */}
              <div className="hero-meta grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
                <div>
                  <div className="l text-[10.5px] font-mono text-[var(--text-3)] uppercase tracking-wider">Cidade</div>
                  <div className="v font-serif font-bold text-lg text-[var(--ink)] mt-1">{team.city || "Fortaleza"}</div>
                </div>
                <div>
                  <div className="l text-[10.5px] font-mono text-[var(--text-3)] uppercase tracking-wider">Região</div>
                  <div className="v font-serif font-bold text-lg text-[var(--ink)] mt-1">{team.region || "Antônio Bezerra"}</div>
                </div>
                <div>
                  <div className="l text-[10.5px] font-mono text-[var(--text-3)] uppercase tracking-wider">Superfície</div>
                  <div className="v font-serif font-bold text-lg text-[var(--ink)] mt-1">{team.fieldType ? fieldTypeLabels[team.fieldType] : "Grama Sintética"}</div>
                </div>
                <div>
                  <div className="l text-[10.5px] font-mono text-[var(--text-3)] uppercase tracking-wider">Nível</div>
                  <div className="v font-serif font-bold text-lg text-[var(--ink)] mt-1">{team.competitiveLevel ? competitiveLevelLabels[team.competitiveLevel].split("/")[0] : "Intermediário"}</div>
                </div>
              </div>

              <div className="hero-ctas flex gap-4 mt-8">
                <a href="?tab=album#elenco" className="btn primary">Conhecer o elenco <span className="btn-arr">→</span></a>
                <a href="?tab=secretaria#amistoso" className="btn secondary">Desafiar o time</a>
              </div>
            </div>

            {/* Hero Right Visuals */}
            <div className="hero-right flex flex-col gap-6 justify-center">
              {/* Crest Wall */}
              <div className="crest-wall p-6 rounded bg-gradient-to-b from-[var(--primary-deep)] to-[rgba(10,88,75,0.9)] text-[#fff]">
                <div className="head flex justify-between text-[11px] font-mono opacity-80 uppercase tracking-widest mb-4">
                  <span className="id">TEMPORADA {stats.activeSeason ? stats.activeSeason.name : "2026"}</span>
                  <span>Campanha Ativa</span>
                </div>
                <div className="body flex items-center gap-6 py-4">
                  <ClubCrest variant="white" initials={clubInitials} className="w-[84px] h-[98px]" badgeUrl={team.badgeUrl} />
                  <div className="who">
                    <div className="lab text-[9px] font-mono opacity-65 uppercase tracking-wider">Clube oficial</div>
                    <div className="t font-serif font-bold text-2xl tracking-tight leading-none mt-1">{team.name}</div>
                    <div className="s text-xs opacity-75 mt-2">Liga Regional de Várzea · {team.city || "Ceará"}</div>
                  </div>
                </div>
                <div className="stat-row grid grid-cols-4 gap-4 mt-4 border-t border-white/20 pt-4 text-center font-mono">
                  <div>
                    <div className="l text-[9px] opacity-75 uppercase">VITÓRIAS</div>
                    <div className="v text-xl font-bold mt-0.5">{wins}</div>
                  </div>
                  <div>
                    <div className="l text-[9px] opacity-75 uppercase">EMPATES</div>
                    <div className="v text-xl font-bold mt-0.5">{draws}</div>
                  </div>
                  <div>
                    <div className="l text-[9px] opacity-75 uppercase">DERROTAS</div>
                    <div className="v text-xl font-bold mt-0.5">{losses}</div>
                  </div>
                  <div>
                    <div className="l text-[9px] opacity-75 uppercase">SALDO</div>
                    <div className="v text-xl font-bold mt-0.5">{goalBalance >= 0 ? `+${goalBalance}` : goalBalance}</div>
                  </div>
                </div>
              </div>

              {/* Next Match Fixture Ticket */}
              {nextMatch && (
                <div className="next-match p-6 bg-[var(--surface-2)] border border-[var(--border)] rounded">
                  <div className="head flex justify-between text-[10.5px] font-mono text-[var(--text-3)] uppercase tracking-wider mb-4">
                    <span className="id">▸ Próximo compromisso</span>
                    <span className="tag success">Confirmado</span>
                  </div>
                  <div className="matchup flex items-center justify-between gap-4 py-2 font-serif">
                    <div className="side home flex flex-col items-center flex-1 text-center">
                      <div className="mini-crest w-8 h-8 rounded-full bg-[var(--primary-tint)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center font-bold font-mono text-xs">{clubInitials}</div>
                      <div className="n font-bold text-sm text-[var(--ink)] mt-2">{team.shortName || team.name.split(" ")[0]}</div>
                      <div className="r text-[9.5px] font-mono text-[var(--text-3)] uppercase tracking-wider mt-0.5">Casa</div>
                    </div>
                    <div className="vs font-mono text-xs text-[var(--text-3)] font-black">VS</div>
                    <div className="side away flex flex-col items-center flex-1 text-center">
                      <div className="mini-crest w-8 h-8 rounded-full bg-[var(--surface-sunk)] border border-[var(--border)] text-[var(--text-2)] flex items-center justify-center font-bold font-mono text-xs">{nextMatch.opponent.substring(0,2).toUpperCase()}</div>
                      <div className="n font-bold text-sm text-[var(--ink)] mt-2">{nextMatch.opponent.split(" ")[0]}</div>
                      <div className="r text-[9.5px] font-mono text-[var(--text-3)] uppercase tracking-wider mt-0.5">Visitante</div>
                    </div>
                  </div>
                  <div className="meta grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[var(--border)] font-mono text-center">
                    <div>
                      <div className="l text-[8px] text-[var(--text-3)] uppercase">Data</div>
                      <div className="v text-xs font-bold mt-0.5">{new Date(nextMatch.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</div>
                    </div>
                    <div>
                      <div className="l text-[8px] text-[var(--text-3)] uppercase">Horário</div>
                      <div className="v text-xs font-bold mt-0.5">{new Date(nextMatch.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                    <div>
                      <div className="l text-[8px] text-[var(--text-3)] uppercase">Local</div>
                      <div className="v text-xs font-bold mt-0.5 truncate max-w-[80px]" title={nextMatch.venue}>{nextMatch.venue}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── kpi-strip ── */}
        <div className="kpi-strip mt-14 py-8 border-y border-[var(--border)] bg-[var(--surface)]">
          <div className="wrap">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 font-mono text-center md:text-left">
              <div className="k border-r border-dashed border-[var(--border)] last:border-0 pr-4">
                <div className="l text-[9.5px] text-[var(--text-3)] uppercase tracking-widest">Campanha · V·E·D</div>
                <div className="v text-2xl font-bold tracking-tight mt-1 text-[var(--ink)]">{wins}·{draws}·{losses}</div>
                <div className="d text-[9px] text-[var(--text-3)] mt-1">Jogos oficiais</div>
              </div>
              <div className="k border-r border-dashed border-[var(--border)] last:border-0 pr-4">
                <div className="l text-[9.5px] text-[var(--text-3)] uppercase tracking-widest">Aproveitamento</div>
                <div className="v text-2xl font-bold tracking-tight mt-1 text-[var(--ink)]">{winRate}%</div>
                <div className="d text-[9px] text-[var(--text-3)] mt-1">Pontos disputados</div>
              </div>
              <div className="k border-r border-dashed border-[var(--border)] last:border-0 pr-4">
                <div className="l text-[9.5px] text-[var(--text-3)] uppercase tracking-widest">Gols marcados</div>
                <div className="v text-2xl font-bold tracking-tight mt-1 text-[var(--primary)]">{goalsScored}</div>
                <div className="d text-[9px] text-[var(--text-3)] mt-1">Média de {avgGoalsScored} / jogo</div>
              </div>
              <div className="k border-r border-dashed border-[var(--border)] last:border-0 pr-4">
                <div className="l text-[9.5px] text-[var(--text-3)] uppercase tracking-widest">Saldo de gols</div>
                <div className="v text-2xl font-bold tracking-tight mt-1 text-[var(--ink)]">{goalBalance >= 0 ? `+${goalBalance}` : goalBalance}</div>
                <div className="d text-[9px] text-[var(--text-3)] mt-1">{goalsConceded} sofridos</div>
              </div>
              <div className="k border-r border-dashed border-[var(--border)] last:border-0 pr-4">
                <div className="l text-[9.5px] text-[var(--text-3)] uppercase tracking-widest">Atletas no elenco</div>
                <div className="v text-2xl font-bold tracking-tight mt-1 text-[var(--ink)]">{team.players.length}</div>
                <div className="d text-[9px] text-[var(--text-3)] mt-1">Inscritos oficiais</div>
              </div>
              <div className="k border-r border-dashed border-[var(--border)] last:border-0 pr-4">
                <div className="l text-[9.5px] text-[var(--text-3)] uppercase tracking-widest">Jogos disputados</div>
                <div className="v text-2xl font-bold tracking-tight mt-1 text-[var(--ink)]">{totalMatches}</div>
                <div className="d text-[9px] text-[var(--text-3)] mt-1">Total na temporada</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── pure-css tab selector bar ── */}
      <div className="sticky top-[68px] z-30 border-b border-[var(--border)] bg-[var(--surface-2)] backdrop-blur bg-opacity-95 shadow-sm mt-8">
        <div className="wrap">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-none justify-center md:justify-start">
            <label htmlFor="caderno-esportes" className="cursor-pointer text-center py-2.5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-2)] hover:text-[var(--text)] transition-colors duration-150 rounded font-mono border border-transparent select-none flex items-center gap-2">
              <span className="text-sm">📰</span>
              <span>Esportes & Jogos</span>
            </label>
            <label htmlFor="caderno-album" className="cursor-pointer text-center py-2.5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-2)] hover:text-[var(--text)] transition-colors duration-150 rounded font-mono border border-transparent select-none flex items-center gap-2">
              <span className="text-sm">👥</span>
              <span>Álbum & Tabela</span>
            </label>
            <label htmlFor="caderno-secretaria" className="cursor-pointer text-center py-2.5 px-6 text-xs font-bold uppercase tracking-wider text-[var(--text-2)] hover:text-[var(--text)] transition-colors duration-150 rounded font-mono border border-transparent select-none flex items-center gap-2">
              <span className="text-sm">📋</span>
              <span>Secretaria</span>
            </label>
          </div>
        </div>
      </div>

      {/* ── main content ── */}
      <main className="mx-auto max-w-6xl mt-8">
        
        {/* ── CADERNO 1: ESPORTES & JOGOS ── */}
        <div id="content-esportes" className="space-y-16 animate-fade-in px-4">
          
          {/* Estrelas da Temporada */}
          <section id="desempenho" className="scroll-mt-24 space-y-6">
            <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div className="left">
                <span className="eyebrow">Destaques individuais</span>
                <h2 className="font-serif text-3xl font-bold uppercase text-[var(--ink)] mt-1">Estrelas da temporada.</h2>
                <p className="text-[13px] text-[var(--text-2)] mt-1">Métricas oficiais consolidadas a partir das súmulas oficiais das partidas.</p>
              </div>
              <div className="right">
                <span className="pill">Atualizado recentemente</span>
              </div>
            </div>

            <div className="top-grid">
              <article className="top-card feature group relative overflow-hidden">
                <div className="absolute -right-4 -bottom-8 text-[11rem] font-serif font-bold text-[var(--primary-tint)] opacity-40 group-hover:scale-105 transition-transform duration-300 select-none pointer-events-none leading-none">
                  {activeScorer.goals}
                </div>
                <div className="tag-row">
                  <span className="pos">▸ Destaque principal</span>
                  <span>ARTILHEIRO</span>
                </div>
                <div className="player">
                  <div className="num">#{activeScorer.shirtNumber}</div>
                  <div className="who">
                    <div className="n">{activeScorer.playerName}</div>
                    <div className="role">
                      {prettyRoles[activeScorer.position] || activeScorer.position}
                    </div>
                  </div>
                </div>
                <p className="desc text-xs text-[var(--text-2)] mt-4 leading-relaxed max-w-sm z-10">
                  Líder absoluto de finalizações na temporada atual. Essencial no aproveitamento tático ofensivo da equipe.
                </p>
                <div className="main-stat pt-4 mt-6 z-10">
                  <span className="val">{activeScorer.goals}</span>
                  <span className="unit">gol(s) marcado(s)</span>
                </div>
              </article>

              <article className="top-card group">
                <div className="tag-row">
                  <span>02 / Assistências</span>
                  <span>GARÇOM</span>
                </div>
                <div className="player">
                  <div className="num">#{activeAssist.shirtNumber}</div>
                  <div className="who">
                    <div className="n truncate max-w-[120px]">{activeAssist.playerName}</div>
                    <div className="role">{prettyRoles[activeAssist.position] || activeAssist.position}</div>
                  </div>
                </div>
                <p className="desc text-xs text-[var(--text-2)] mt-4 leading-relaxed">
                  Maestro do meio-campo, servindo os companheiros com passes precisos e decisivos.
                </p>
                <div className="main-stat pt-4 mt-6">
                  <span className="val">{activeAssist.assists}</span>
                  <span className="unit">passes para gol</span>
                </div>
              </article>

              <article className="top-card group">
                <div className="tag-row">
                  <span>03 / Mais atuante</span>
                  <span>PRESENÇA</span>
                </div>
                <div className="player">
                  <div className="num">#{activePresence.shirtNumber}</div>
                  <div className="who">
                    <div className="n truncate max-w-[120px]">{activePresence.playerName}</div>
                    <div className="role">{prettyRoles[activePresence.position] || activePresence.position}</div>
                  </div>
                </div>
                <p className="desc text-xs text-[var(--text-2)] mt-4 leading-relaxed">
                  Pilar físico do elenco, demonstrando consistência e regularidade em todas as partidas.
                </p>
                <div className="main-stat pt-4 mt-6">
                  <span className="val">{activePresence.matches}</span>
                  <span className="unit">jogos disputados</span>
                </div>
              </article>

              <article className="top-card group">
                <div className="tag-row">
                  <span>04 / Maior nota</span>
                  <span>SCOUT</span>
                </div>
                <div className="player">
                  <div className="num">#{activeRated.shirtNumber}</div>
                  <div className="who">
                    <div className="n truncate max-w-[120px]">{activeRated.playerName}</div>
                    <div className="role">{prettyRoles[activeRated.position] || activeRated.position}</div>
                  </div>
                </div>
                <p className="desc text-xs text-[var(--text-2)] mt-4 leading-relaxed">
                  Consistência técnica excepcional e alto índice de avaliações de desempenho coletivo.
                </p>
                <div className="main-stat pt-4 mt-6">
                  <span className="val">{activeRated.averageStars?.toFixed(1) || "0.0"}</span>
                  <span className="unit">{activeRated.totalRatings} avaliações</span>
                </div>
              </article>
            </div>
          </section>

          {/* Calendário: Linha do tempo de partidas */}
          <section id="calendario" className="scroll-mt-24 space-y-6">
            <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div className="left">
                <span className="eyebrow">Linha do tempo</span>
                <h2 className="font-serif text-3xl font-bold uppercase text-[var(--ink)] mt-1">Histórico & agenda.</h2>
                <p className="text-[13px] text-[var(--text-2)] mt-1">Resultados passados de amistosos/campeonatos e próximos confrontos.</p>
              </div>
            </div>

            <div className="split-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Resultados Passados */}
              <div className="card bg-[var(--surface)] border border-[var(--border)] rounded p-6">
                <div className="card-head flex justify-between items-center border-b border-[var(--border)] pb-4 mb-4">
                  <span className="t font-serif font-bold text-lg text-[var(--ink)]">Histórico de resultados</span>
                  <span className="s font-mono text-[10.5px] text-[var(--text-3)] uppercase">{finishedMatches.length} partidas disputadas</span>
                </div>
                
                {finishedMatches.length === 0 ? (
                  <p className="text-center font-mono text-xs text-[var(--text-3)] py-12">Nenhuma partida finalizada registrada.</p>
                ) : (
                  <div className="divide-y divide-[var(--border)]">
                    {finishedMatches.slice(0, 5).map((match) => {
                      const isCancelled = match.status === "CANCELLED";
                      const win = match.homeScore !== null && match.awayScore !== null && (
                        match.isHome ? match.homeScore > match.awayScore : match.awayScore > match.homeScore
                      );
                      const draw = match.homeScore !== null && match.awayScore !== null && match.homeScore === match.awayScore;

                      let badgeColor = "bg-[var(--surface-sunk)] text-[var(--text-2)]";
                      let badgeChar = "E";

                      if (isCancelled) {
                        badgeColor = "bg-[var(--danger)] text-white";
                        badgeChar = "C";
                      } else if (win) {
                        badgeColor = "bg-[var(--primary)] text-white";
                        badgeChar = "V";
                      } else if (!draw) {
                        badgeColor = "bg-[var(--danger)] text-[#fff]";
                        badgeChar = "D";
                      }

                      return (
                        <div key={match.id} className="match-row py-3.5 flex items-center justify-between gap-4 font-mono">
                          <div className="date text-[11px] text-[var(--text-3)] leading-none uppercase shrink-0">
                            <b>{new Date(match.date).toLocaleDateString("pt-BR", { day: "2-digit" })}</b>
                            <span className="block text-[9px] mt-0.5">{new Date(match.date).toLocaleDateString("pt-BR", { month: "short" }).substring(0,3)}</span>
                          </div>
                          <div>
                            <span className={`tag text-[9px] ${match.type === "CHAMPIONSHIP" ? "info" : ""}`}>
                              {match.type === "FRIENDLY" ? "Amist" : "Camp"}
                            </span>
                          </div>
                          <div className="teams flex-1 min-w-0">
                            <div className="opp font-sans font-semibold text-[13.5px] text-[var(--ink)] truncate">
                              {team.shortName || team.name} vs {match.opponent}
                            </div>
                            <div className="det text-[9px] text-[var(--text-3)] truncate mt-0.5">
                              {match.venue}
                            </div>
                          </div>
                          <div className="score font-bold text-sm text-[var(--ink)] shrink-0">
                            {!isCancelled && match.homeScore !== null && match.awayScore !== null ? (
                              `${match.isHome ? match.homeScore : match.awayScore} - ${match.isHome ? match.awayScore : match.homeScore}`
                            ) : (
                              "vs"
                            )}
                          </div>
                          <div className="res shrink-0">
                            <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${badgeColor}`}>
                              {badgeChar}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Próximos Compromissos */}
              <div className="card bg-[var(--surface)] border border-[var(--border)] rounded p-6">
                <div className="card-head flex justify-between items-center border-b border-[var(--border)] pb-4 mb-4">
                  <span className="t font-serif font-bold text-lg text-[var(--ink)]">Próximos compromissos</span>
                  <span className="s font-mono text-[10.5px] text-[var(--text-3)] uppercase">{scheduledMatches.length} agendados</span>
                </div>

                {scheduledMatches.length === 0 ? (
                  <p className="text-center font-mono text-xs text-[var(--text-3)] py-12">Nenhuma partida futura agendada.</p>
                ) : (
                  <div className="divide-y divide-[var(--border)]">
                    {scheduledMatches.slice(0, 5).map((match) => (
                      <div key={match.id} className="fixture-row py-3.5 flex items-center justify-between gap-4 font-mono">
                        <div className="day text-[11px] text-[var(--text-3)] leading-none uppercase shrink-0">
                          <b>{new Date(match.date).toLocaleDateString("pt-BR", { day: "2-digit" })}</b>
                          <span className="block text-[9px] mt-0.5">{new Date(match.date).toLocaleDateString("pt-BR", { month: "short" }).substring(0,3)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="opp font-sans font-semibold text-[13.5px] text-[var(--ink)] truncate">
                            vs {match.opponent}
                          </div>
                          <div className="det text-[9px] text-[var(--text-3)] truncate mt-0.5">
                            {match.type === "FRIENDLY" ? "Amistoso" : "Championship"} · {match.venue}
                          </div>
                        </div>
                        <div className="when text-right shrink-0">
                          <div className="h font-bold text-xs text-[var(--ink)]">
                            {new Date(match.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="t mt-1">
                            <span className="tag success text-[8px] py-0.5 px-1.5">CONFIRMADO</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Prancheta Tática */}
          <section id="tatica" className="scroll-mt-24 space-y-6">
            <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div className="left">
                <span className="eyebrow">Prancheta tática</span>
                <h2 className="font-serif text-3xl font-bold uppercase text-[var(--ink)] mt-1">Escalação de referência.</h2>
                <p className="text-[13px] text-[var(--text-2)] mt-1">Formação base utilizada nos últimos confrontos e escalada de início.</p>
              </div>
              <div className="right">
                <span className="pill">Formação: 4-3-3</span>
              </div>
            </div>

            <div className="pitch-wrap grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              <div className="pitch col-span-1 md:col-span-2 relative aspect-[3/2] w-full overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,#2f8f59_0%,#276e48_42%,#1a4e35_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_28px_rgba(0,0,0,0.16)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_30%,transparent_55%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.024)_0,rgba(255,255,255,0.024)_27px,rgba(0,0,0,0.022)_27px,rgba(0,0,0,0.022)_54px)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_18%,transparent_82%,rgba(0,0,0,0.16)_100%)] pointer-events-none" />
                
                {FIELD_ZONES.map((zone) => (
                  <div
                    key={zone.key}
                    className="pointer-events-none absolute top-[8%] bottom-[8%] rounded-[18px] border border-white/6 bg-white/[0.025]"
                    style={{ left: zone.left, width: zone.width }}
                  >
                    <span className="absolute left-3 top-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/28">
                      {zone.label}
                    </span>
                  </div>
                ))}
                
                <div className="absolute inset-4 rounded-[24px] border-2 border-white/70 pointer-events-none" />
                <div className="absolute left-[4%] top-[21%] h-[58%] w-[15.7%] rounded-r-[18px] border-2 border-l-0 border-white/70 pointer-events-none" />
                <div className="absolute left-[4%] top-[36%] h-[28%] w-[5.2%] rounded-r-[12px] border-2 border-l-0 border-white/70 pointer-events-none" />
                <div className="absolute right-[4%] top-[21%] h-[58%] w-[15.7%] rounded-l-[18px] border-2 border-r-0 border-white/70 pointer-events-none" />
                <div className="absolute right-[4%] top-[36%] h-[28%] w-[5.2%] rounded-l-[12px] border-2 border-r-0 border-white/70 pointer-events-none" />
                <div className="absolute left-1/2 top-[11%] bottom-[11%] w-px -translate-x-1/2 bg-white/70 pointer-events-none" />
                <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 pointer-events-none" />
                <div className="absolute left-[14.5%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 pointer-events-none" />
                <div className="absolute right-[14.5%] top-1/2 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 pointer-events-none" />
                
                {tacticalPlayers.map((player) => {
                  const marker = getPlayerMarkerClasses(player.position);
                  return (
                    <div
                      key={player.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none spot animate-fade-in"
                      style={{
                        left: `${player.x}%`,
                        top: `${player.y}%`,
                      }}
                    >
                      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/16 bg-white/8 p-0.5 shadow-[0_6px_14px_rgba(0,0,0,0.3)] backdrop-blur-[2px] transition-transform duration-150 hover:scale-[1.05]">
                        <div className={`flex h-full w-full flex-col items-center justify-center rounded-full border ${marker.ring} ${marker.surface} text-white`}>
                          <span className="text-[11px] font-black tracking-tighter leading-none">{player.shirtNumber || "—"}</span>
                          <span className="text-[6.5px] font-bold tracking-wider opacity-85 uppercase mt-0.5 leading-none">
                            {shortRoles[player.position] || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="pointer-events-none mt-1 rounded-[4px] border border-white/10 px-1.5 py-0.5 text-center text-[8.5px] font-bold leading-none text-white shadow-sm backdrop-blur-[2px]"
                        style={{ backgroundColor: marker.name }}
                      >
                        <span className="block truncate max-w-[68px]">{player.name.split(" ")[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lineup-list bg-[var(--surface)] border border-[var(--border)] rounded p-6 flex flex-col justify-between">
                <div className="head border-b border-[var(--border)] pb-3 mb-4 flex justify-between items-center">
                  <span className="t font-serif font-bold text-base text-[var(--ink)]">Line-up de referência</span>
                  <span className="s font-mono text-[10px] text-[var(--text-3)] uppercase">{tacticalPlayers.length} atletas</span>
                </div>
                <div className="divide-y divide-[var(--border)] overflow-y-auto max-h-[300px] flex-1 pr-2">
                  {tacticalPlayers.map((player) => (
                    <div key={player.id} className="lineup-row py-2 flex items-center justify-between font-mono text-xs">
                      <span className="pos text-[9px] font-bold text-[var(--text-3)] uppercase w-10 shrink-0">
                        {shortRoles[player.position] || "N/A"}
                      </span>
                      <span className="n font-bold text-[var(--primary)] w-8 text-center shrink-0">
                        #{player.shirtNumber || "—"}
                      </span>
                      <span className="nm font-sans font-semibold text-[var(--ink)] flex-1 truncate px-2">
                        {player.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-[var(--border)] mt-4 text-[10px] font-mono text-[var(--text-3)] uppercase leading-relaxed">
                  // Súmulas oficiais geridas via dashboard administrativo.
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── CADERNO 2: ÁLBUM & TABELA ── */}
        <div id="content-album" className="space-y-16 animate-fade-in px-4">
          
          {/* Classificação */}
          {stats.activeSeason && (
            <section id="ranking" className="scroll-mt-24 space-y-6">
              <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div className="left">
                  <span className="eyebrow">Classificação interna</span>
                  <h2 className="font-serif text-3xl font-bold uppercase text-[var(--ink)] mt-1">Tabela individual da temporada.</h2>
                  <p className="text-[13px] text-[var(--text-2)] mt-1">Desempenho acumulado dos atletas oficiais na temporada: {stats.activeSeason.name}.</p>
                </div>
                <div className="right">
                  <span className="pill">Série A · Campeonato</span>
                </div>
              </div>

              <div className="card bg-[var(--surface)] border border-[var(--border)] rounded overflow-hidden">
                {stats.activeSeasonStandings.length === 0 ? (
                  <p className="text-center font-mono text-xs text-[var(--text-3)] py-16">Nenhuma estatística disponível nesta temporada.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="rank-table">
                      <thead>
                        <tr>
                          <th>Pos</th>
                          <th>Atleta</th>
                          <th className="r">Jogos</th>
                          <th className="r">V</th>
                          <th className="r">E</th>
                          <th className="r">D</th>
                          <th className="r">SG</th>
                          <th className="r">PTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.activeSeasonStandings.map((row, idx) => (
                          <tr key={row.playerId}>
                            <td className="pos">{String(idx + 1).padStart(2, "0")}</td>
                            <td>
                              <div className="nm font-sans text-sm font-semibold text-[var(--ink)]">{row.playerName}</div>
                              <div className="sub text-[9.5px] font-mono text-[var(--text-3)]">Camisa #{row.shirtNumber ?? "—"}</div>
                            </td>
                            <td className="r">{row.played}</td>
                            <td className="r text-[var(--success)]">{row.won}</td>
                            <td className="r text-[var(--text-3)]">{row.drawn}</td>
                            <td className="r text-[var(--danger)]">{row.lost}</td>
                            <td className="r">{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</td>
                            <td className="r font-bold text-[var(--primary)]">{row.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Elenco */}
          <section id="elenco" className="scroll-mt-24 space-y-6">
            <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div className="left">
                <span className="eyebrow">Atletas oficiais</span>
                <h2 className="font-serif text-3xl font-bold uppercase text-[var(--ink)] mt-1">Guerreiros do elenco.</h2>
                <p className="text-[13px] text-[var(--text-2)] mt-1">Conheça os {team.players.length} atletas registrados na liga regional.</p>
              </div>
            </div>

            {team.players.length === 0 ? (
              <p className="text-center font-mono text-xs text-[var(--text-3)] py-16">Nenhum jogador registrado no elenco.</p>
            ) : (
              <div className="squad-grid">
                {team.players.map((player) => {
                  const roleShort = shortRoles[player.position] || "ATH";
                  const rolePretty = prettyRoles[player.position] || player.position;
                  
                  const playerStats = stats.ranking.find((p) => p.playerId === player.id);
                  const pMatches = playerStats?.matches ?? 0;
                  const pGoals = playerStats?.goals ?? 0;
                  const pAssists = playerStats?.assists ?? 0;
                  const pRating = playerStats?.averageStars ? playerStats.averageStars.toFixed(1) : "—";

                  return (
                    <Link href={`/jogadores/${player.id}`} key={player.id} className="player-card group">
                      <div className="top">
                        <span className={`pos ${roleShort}`}>{roleShort}</span>
                        <span>#{player.shirtNumber || "0"} · {getPlayerTag(player, stats)}</span>
                      </div>
                      <div className="center">
                        <div className="num font-serif text-[42px] leading-none text-[var(--ink)]">
                          {String(player.shirtNumber || 0).padStart(2, "0")}
                        </div>
                        <div className="who">
                          <div className="name font-sans text-[14.5px] font-bold text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                            {player.name}
                          </div>
                          <div className="pl-tag text-[9.5px] font-mono tracking-wider mt-0.5">
                            {rolePretty}
                          </div>
                        </div>
                      </div>
                      <div className="stats mt-auto font-mono text-center">
                        <div>
                          <div className="l text-[8px] text-[var(--text-3)]">JOG</div>
                          <div className="v text-xs font-bold text-[var(--ink)]">{pMatches}</div>
                        </div>
                        <div>
                          <div className="l text-[8px] text-[var(--text-3)]">GOL</div>
                          <div className="v text-xs font-bold text-[var(--primary)]">{pGoals}</div>
                        </div>
                        <div>
                          <div className="l text-[8px] text-[var(--text-3)]">AST</div>
                          <div className="v text-xs font-bold text-cyan-500">{pAssists}</div>
                        </div>
                        <div>
                          <div className="l text-[8px] text-[var(--text-3)]">NOTA</div>
                          <div className="v text-xs font-bold text-violet-500">{pRating}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Identidade Visual */}
          <section id="identidade" className="scroll-mt-24 space-y-6">
            <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div className="left">
                <span className="eyebrow">Identidade visual & cores</span>
                <h2 className="font-serif text-3xl font-bold uppercase text-[var(--ink)] mt-1">Os mantos oficiais.</h2>
                <p className="text-[13px] text-[var(--text-2)] mt-1">Paleta de cores e uniformes clássicos atualizados para a temporada.</p>
              </div>
            </div>

            <div className="kits-grid">
              <article className="kit-card">
                <div className="vis">
                  <svg className="kit-shirt" viewBox="0 0 200 240">
                    <path d="M40 30 L80 10 Q100 30 120 10 L160 30 L180 60 L160 80 L160 220 L40 220 L40 80 L20 60 Z" fill={themePrimary} stroke="rgba(0,0,0,0.15)" strokeWidth="2"/>
                    <path d="M40 30 L80 10 Q100 30 120 10 L160 30" fill="rgba(0,0,0,0.08)"/>
                    <text x="100" y="140" textAnchor="middle" fill="#fff" className="font-serif font-black" fontSize="40">{clubInitials}</text>
                    <text x="100" y="180" textAnchor="middle" fill="#fff" className="font-mono font-bold" fontSize="14">10</text>
                  </svg>
                </div>
                <div className="meta">
                  <span className="lab">01 / Manto principal · home</span>
                  <div className="n">Manto Titular</div>
                  <div className="text-[13px] text-[var(--text-2)]">Camisa titular usada em jogos como mandante. Cores oficiais com detalhes sutis.</div>
                  <div className="palette">
                    <span className="sw" style={{ background: themePrimary }}></span>
                    <span className="sw" style={{ background: themeSecondary }}></span>
                    <span className="sw" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)" }}></span>
                  </div>
                </div>
              </article>

              <article className="kit-card">
                <div className="vis">
                  <svg className="kit-shirt" viewBox="0 0 200 240">
                    <path d="M40 30 L80 10 Q100 30 120 10 L160 30 L180 60 L160 80 L160 220 L40 220 L40 80 L20 60 Z" fill="#ffffff" stroke={themePrimary} strokeWidth="2"/>
                    <path d="M40 30 L80 10 Q100 30 120 10 L160 30" fill="rgba(0,0,0,0.02)"/>
                    <text x="100" y="140" textAnchor="middle" fill={themePrimary} className="font-serif font-black" fontSize="40">{clubInitials}</text>
                    <text x="100" y="180" textAnchor="middle" fill={themePrimary} className="font-mono font-bold" fontSize="14">23</text>
                  </svg>
                </div>
                <div className="meta">
                  <span className="lab">02 / Manto reserva · away</span>
                  <div className="n">Manto Visitante</div>
                  <div className="text-[13px] text-[var(--text-2)]">Camisa clássica reserva, ideal para confrontos externos de alto contraste.</div>
                  <div className="palette">
                    <span className="sw" style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)" }}></span>
                    <span className="sw" style={{ background: themePrimary }}></span>
                    <span className="sw" style={{ background: "var(--ink)" }}></span>
                  </div>
                </div>
              </article>

              <article className="kit-card">
                <div className="vis">
                  <svg className="kit-shirt" viewBox="0 0 200 240">
                    <path d="M40 30 L80 10 Q100 30 120 10 L160 30 L180 60 L160 80 L160 220 L40 220 L40 80 L20 60 Z" fill="var(--ink)" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
                    <path d="M40 30 L80 10 Q100 30 120 10 L160 30" fill="rgba(255,255,255,0.05)"/>
                    <text x="100" y="140" textAnchor="middle" fill={themeSecondary} className="font-serif font-black" fontSize="40">{clubInitials}</text>
                    <text x="100" y="180" textAnchor="middle" fill={themeSecondary} className="font-mono font-bold" fontSize="14">01</text>
                  </svg>
                </div>
                <div className="meta">
                  <span className="lab">03 / Manto de goleiro</span>
                  <div className="n">Manto do Paredão</div>
                  <div className="text-[13px] text-[var(--text-2)]">Camisa exclusiva do arqueiro. Alta elegância e contraste nas arenas.</div>
                  <div className="palette">
                    <span className="sw" style={{ background: "var(--ink)" }}></span>
                    <span className="sw" style={{ background: themeSecondary }}></span>
                    <span className="sw" style={{ background: "rgba(255,255,255,0.1)" }}></span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>

        {/* ── CADERNO 3: SECRETARIA ── */}
        <div id="content-secretaria" className="space-y-16 animate-fade-in px-4">
          
          {/* Disponibilidade de arena */}
          {(team.openMatchSlots.length > 0 || hasDiscoveryInfo) && (
            <section className="scroll-mt-24 rounded border border-[var(--border)] bg-[var(--surface-2)] p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)] font-mono">[Disponibilidade de arena]</p>
                  <h2 className="font-serif text-2xl font-bold uppercase text-[var(--ink)] mt-1">Datas para amistosos.</h2>
                </div>
                {team.openMatchSlots.length > 0 && (
                  <span className="rounded bg-[var(--primary)] text-[var(--text-inv)] text-[10px] px-3 py-1 font-mono uppercase font-bold tracking-wider">
                    {team.openMatchSlots.length} vaga(s) de jogo
                  </span>
                )}
              </div>

              {team.openMatchSlots.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 pt-2">
                  {team.openMatchSlots.map((slot) => (
                    <article key={slot.id} className="rounded border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between hover:border-[var(--primary)] transition-all duration-200 group">
                      <div className="space-y-2">
                        <p className="text-base font-serif font-bold text-[var(--ink)]">
                          {new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(slot.date)}
                        </p>
                        <p className="text-xs font-mono text-[var(--text-2)] uppercase tracking-wider">
                          {(slot.timeLabel || "HORÁRIO A DEFINIR") + " • " + (slot.venueLabel || "LOCAL A DEFINIR")}
                        </p>
                        {slot.notes && (
                          <p className="text-[10.5px] text-[var(--text-3)] font-mono border-t border-[var(--border)] pt-2 mt-2">
                            [Nota]: {slot.notes}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/${team.slug}?slot=${slot.id}#amistoso`}
                        className="mt-6 inline-flex min-h-10 items-center justify-center rounded border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-inv)] text-[10.5px] font-mono uppercase font-bold tracking-wider px-6 transition-all duration-150"
                      >
                        Propor jogo neste horário
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-2)] font-mono leading-relaxed">// Nenhuma vaga pré-agendada no momento. Sugira um local e data abaixo.</p>
              )}
            </section>
          )}

          {/* Form Split */}
          <section id="amistoso" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Solicitar Amistoso Column */}
            <div className="form-info bg-[var(--surface)] border border-[var(--border)] rounded p-6 flex flex-col justify-between">
              <div>
                <div className="head flex justify-between text-[11px] font-mono text-[var(--text-3)] uppercase mb-4">
                  <span className="lab font-bold">▸ Desafio amistoso</span>
                  <span>Disponibilidade</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--ink)]">Desafie o {team.name}</h3>
                <p className="text-[13px] text-[var(--text-2)] leading-relaxed mt-3">
                  Quer marcar um amistoso contra a nossa equipe? Preencha as datas e horários de preferência no formulário ao lado. Nossa diretoria responderá em até 24h úteis.
                </p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 mt-6 text-xs font-mono border-t border-[var(--border)] pt-6">
                  <div>
                    <dt className="text-[var(--text-3)] uppercase">Cidade</dt>
                    <dd className="font-bold text-[var(--ink)] mt-0.5">{team.city || "Fortaleza/CE"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-3)] uppercase">Região</dt>
                    <dd className="font-bold text-[var(--ink)] mt-0.5">{team.region || "Antônio Bezerra"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-3)] uppercase">Superfície</dt>
                    <dd className="font-bold text-[var(--ink)] mt-0.5">{team.fieldType ? fieldTypeLabels[team.fieldType] : "Sintética"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-3)] uppercase">Nível</dt>
                    <dd className="font-bold text-[var(--ink)] mt-0.5">{team.competitiveLevel ? competitiveLevelLabels[team.competitiveLevel].split("/")[0] : "Amador"}</dd>
                  </div>
                </dl>
              </div>

              {selectedSlot && (
                <div className="rounded border border-[var(--primary)] bg-[var(--primary-tint)] px-4 py-3 text-xs text-[var(--primary)] font-bold uppercase tracking-wider font-mono mt-8">
                  [VAGA DE ARENA PREFEITA] Selecionamos a data: {selectedSlotDateText}.
                </div>
              )}

              <div className="mt-8">
                <FriendlyRequestForm
                  teamSlug={team.slug}
                  initialSuggestedDates={suggestedDatesInitialValue}
                  initialSuggestedVenue={suggestedVenueInitialValue}
                />
              </div>
            </div>

            {/* Recrutamento Column */}
            <div id="recrutamento" className="form-info bg-[var(--surface)] border border-[var(--border)] rounded p-6 flex flex-col justify-between">
              <div>
                <div className="head flex justify-between text-[11px] font-mono text-[var(--text-3)] uppercase mb-4">
                  <span className="lab font-bold">▸ Recrutamento</span>
                  <span>Faça parte</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--ink)]">Seja um Guerreiro</h3>
                <p className="text-[13px] text-[var(--text-2)] leading-relaxed mt-3">
                  Acha que tem nível para jogar no elenco do {team.name}? Candidate-se agora enviando seus dados. A comissão técnica avalia periodicamente novos atletas.
                </p>
                
                {team.publicDirectoryOptIn ? (
                  <div className="mt-8">
                    <RecruitmentForm teamSlug={team.slug} />
                  </div>
                ) : (
                  <div className="rounded border border-[var(--border)] bg-[var(--surface-2)] p-12 text-center text-[var(--text-3)] flex flex-col justify-center items-center mt-8">
                    <svg className="w-12 h-12 text-[var(--text-3)] opacity-60 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider font-mono">[Recrutamento Inativo]</p>
                    <p className="text-[11px] text-[var(--text-2)] mt-2 max-w-xs mx-auto">Esta equipe optou por fechar as candidaturas de recrutamento público no momento.</p>
                  </div>
                )}
              </div>

              {team.publicDirectoryOptIn && (
                <div className="pipeline-steps border-t border-[var(--border)] pt-6 mt-8 font-mono text-[12px]">
                  <h4 className="font-sans font-bold text-[13px] text-[var(--ink)] mb-4">Pipeline de avaliação:</h4>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="text-[var(--primary)] font-bold font-mono">01</span>
                      <div>
                        <div className="font-bold text-[var(--ink)]">Triagem inicial</div>
                        <div className="text-[11px] text-[var(--text-3)] mt-0.5">Análise das características e posições de necessidade pela comissão.</div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[var(--primary)] font-bold font-mono">02</span>
                      <div>
                        <div className="font-bold text-[var(--ink)]">Contato rápido</div>
                        <div className="text-[11px] text-[var(--text-3)] mt-0.5">Chamada curta para esclarecimento de regras, custos e compromissos.</div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[var(--primary)] font-bold font-mono">03</span>
                      <div>
                        <div className="font-bold text-[var(--ink)]">Treino aberto</div>
                        <div className="text-[11px] text-[var(--text-3)] mt-0.5">Avaliação em campo no Antônio Bezerra com o time titular.</div>
                      </div>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ── footer ── */}
      <footer className="site mt-24">
        <div className="wrap">
          <div className="top">
            <div className="brand-col col-span-2">
              <Link href={`/${team.slug}`} className="brand">
                <ClubCrest variant="footer" initials={clubInitials} badgeUrl={team.badgeUrl} />
                <div className="txt">
                  <div className="top">Fundado em {(team as any).foundedYear || 2026}</div>
                  <div className="name text-white">{team.name}</div>
                </div>
              </Link>
              <p className="mt-4 max-w-xs text-xs opacity-75 leading-relaxed">
                Aqui a paixão não é cobrada em bilheteria — e o suor pesa mais que qualquer contrato milionário.
              </p>
            </div>
            <div>
              <h4>Clube</h4>
              <ul>
                <li><a href="?tab=album#elenco">Elenco</a></li>
                <li><a href="?tab=esportes#desempenho">Desempenho</a></li>
                <li><a href="?tab=esportes#tatica">Tática</a></li>
                <li><a href="?tab=album#identidade">Identidade</a></li>
              </ul>
            </div>
            <div>
              <h4>Calendário</h4>
              <ul>
                <li><a href="?tab=esportes#calendario">Histórico</a></li>
                <li><a href="?tab=esportes#calendario">Agenda</a></li>
                <li><a href="?tab=album#ranking">Classificação</a></li>
              </ul>
            </div>
            <div>
              <h4>Atendimento</h4>
              <ul>
                <li><a href="?tab=secretaria#amistoso">Solicitar Amistoso</a></li>
                <li><a href="?tab=secretaria#recrutamento">Quero jogar</a></li>
                <li><Link href="/dashboard">Console Restrito ↗</Link></li>
              </ul>
            </div>
          </div>
          <div className="bottom flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[rgba(255,255,255,0.06)] mt-8 text-[11px] opacity-60 font-mono">
            <div>&copy; {new Date().getFullYear()} {team.name}. Todos os direitos reservados.</div>
            <div className="powered flex gap-2 items-center mt-4 md:mt-0">
              <span>Operado por</span>
              <span className="vmark w-4 h-4 bg-white text-black rounded flex items-center justify-center font-bold text-[8px]">V/</span>
              <span className="text-white font-bold">VARzea</span>
              <span>· br-ne-1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
