import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FriendlyRequestForm } from "@/app/FriendlyRequestForm";
import { RecruitmentForm } from "@/app/RecruitmentForm";
import { PublicNavbar } from "@/components/PublicNavbar";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ slot?: string }>;
}

const competitiveLevelLabels: Record<string, string> = {
  CASUAL: "Casual / Recreativo",
  INTERMEDIATE: "Intermediário",
  COMPETITIVE: "Competitivo / Várzea Forte",
};

const fieldTypeLabels: Record<string, string> = {
  GRASS: "Grama Natural",
  SYNTHETIC: "Grama Sintética",
  FUTSAL: "Futsal",
  SOCIETY: "Society",
  OTHER: "Outro",
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

// HELPER: Convert HEX to RGB for inline transparency styles
function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "16, 185, 129"; // fallback
}

function getTacticalPositions(starters: any[]) {
  const mapped = starters.map((s) => {
    const p = s.player;
    let x = s.fieldX;
    let y = s.fieldY;
    
    if (x == null || y == null) {
      if (p.position === "GOALKEEPER") {
        x = 50; y = 14;
      } else if (p.position === "LEFT_BACK") {
        x = 18; y = 35;
      } else if (p.position === "RIGHT_BACK") {
        x = 82; y = 35;
      } else if (p.position === "DEFENDER") {
        x = 50; y = 35;
      } else if (p.position === "DEFENSIVE_MIDFIELDER") {
        x = 50; y = 56;
      } else if (p.position === "MIDFIELDER") {
        x = 50; y = 56;
      } else if (p.position === "LEFT_WINGER") {
        x = 22; y = 80;
      } else if (p.position === "RIGHT_WINGER") {
        x = 78; y = 80;
      } else if (p.position === "FORWARD") {
        x = 50; y = 80;
      } else {
        x = 50; y = 56;
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

  const coordinateCounts: Record<string, number[]> = {};
  mapped.forEach((player, idx) => {
    const key = `${player.y}`;
    if (!coordinateCounts[key]) {
      coordinateCounts[key] = [];
    }
    coordinateCounts[key].push(idx);
  });

  Object.keys(coordinateCounts).forEach((key) => {
    const indices = coordinateCounts[key];
    if (indices.length > 1) {
      const step = 64 / (indices.length - 1 || 1);
      indices.forEach((idx, offsetIdx) => {
        const customX = indices.length === 1 ? 50 : 18 + offsetIdx * step;
        if (mapped[idx].x === 50) {
          mapped[idx].x = Math.round(customX);
        }
      });
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
    return "[PAREDÃO INSUPERÁVEL]";
  }
  if (isBestScorer && stats.highlights.bestScorer.goals > 0) {
    return "[ARTILHEIRO DE OURO]";
  }
  if (isBestRated && stats.highlights.bestRated.averageStars > 0) {
    return "[DIFERENCIADO]";
  }
  if (isBestAssist && stats.highlights.bestAssist.assists > 0) {
    return "[MOTOR DE ASSISTÊNCIAS]";
  }
  if (isBestPresence) {
    return "[XERIFE DE AÇO]";
  }

  switch (player.position) {
    case "DEFENDER":
    case "LEFT_BACK":
    case "RIGHT_BACK":
      return "[MURALHA DA VARZEA]";
    case "MIDFIELDER":
    case "DEFENSIVE_MIDFIELDER":
      return "[MAESTRO DO MEIO]";
    case "FORWARD":
    case "LEFT_WINGER":
    case "RIGHT_WINGER":
      return "[BROCADOR NATO]";
    default:
      return "[MANTO SACRADO]";
  }
}

// Minimal Premium SVG Icons
function IconMapPin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconStadium({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function IconPitch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" />
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" />
    </svg>
  );
}

function IconTrophy({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 4h4M5 8h14M5 8a2 2 0 110-4h4V8m10-4v4h-4a2 2 0 110-4h4z" />
    </svg>
  );
}

function IconCalendar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function IconStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function IconGoal({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 000 20M2 12h20M12 2c3.5 0 6.5 4.5 6.5 10S15.5 22 12 22 5.5 17.5 5.5 12 8.5 2 12 2z" />
    </svg>
  );
}

function IconAssist({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function IconArrowRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function IconShield({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconLock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

// SEO Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
    select: { name: true, description: true, city: true, badgeUrl: true },
  });

  if (!team) {
    return { title: "Time Não Encontrado | VARzea" };
  }

  const description = team.description || `Confira as conquistas, estatísticas, elenco oficial e linha do tempo de partidas do ${team.name} no portal oficial.`;
  return {
    title: `${team.name} — Página Oficial | VARzea`,
    description,
    openGraph: {
      title: `${team.name} — Arena Oficial`,
      description,
      type: "website",
      ...(team.badgeUrl && { images: [{ url: team.badgeUrl, width: 200, height: 200, alt: `Escudo ${team.name}` }] }),
    },
  };
}

export default async function TeamPublicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const selectedSlotId = resolvedSearchParams?.slot;

  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      players: {
        where: { status: "ACTIVE" },
        orderBy: { shirtNumber: "asc" },
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
      openMatchSlots: {
        where: { status: "OPEN" },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!team) {
    notFound();
  }

  // Conversions for Branding
  const themePrimary = team.primaryColor || "#10b981";
  const themeSecondary = team.secondaryColor || "#34d399";
  const primaryRgb = hexToRgb(themePrimary);
  const secondaryRgb = hexToRgb(themeSecondary);

  // Statistics Calculations
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
  const avgGoalsScored = totalGames > 0 ? (goalsScored / totalGames).toFixed(1) : "0.0";
  const avgGoalsConceded = totalGames > 0 ? (goalsConceded / totalGames).toFixed(1) : "0.0";

  // Calculate Season Highlights
  const allPlayers = await prisma.player.findMany({
    where: { teamId: team.id },
    select: {
      id: true,
      name: true,
      shirtNumber: true,
      position: true,
      photoUrl: true,
      status: true,
    },
  });
  const playerMap = new Map(allPlayers.map((p) => [p.id, p]));

  const playerStats = await prisma.matchStats.groupBy({
    by: ["playerId"],
    where: { match: { teamId: team.id } },
    _sum: { goals: true, assists: true },
    _count: { matchId: true },
  });

  const ratingsAgg = await prisma.matchPlayerRating.groupBy({
    by: ["ratedId"],
    where: { match: { teamId: team.id } },
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

  // Split and Sort Matches precisely matching the timeline rules
  const scheduledMatches = team.matches
    .filter((m) => m.status === "SCHEDULED")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextMatch = scheduledMatches[0] || null;
  const remainingScheduled = scheduledMatches.slice(1);

  // Construct a highlights adapter object to match homePage's getPlayerStamp signature
  const stats = {
    highlights: {
      bestScorer: bestScorer ? { playerId: bestScorer.playerId, goals: bestScorer.goals } : null,
      bestAssist: bestAssist ? { playerId: bestAssist.playerId, assists: bestAssist.assists } : null,
      bestRated: bestRated ? { playerId: bestRated.playerId, averageStars: bestRated.averageStars } : null,
      bestPresence: bestPresence ? { playerId: bestPresence.playerId } : null,
    }
  };

  let startersData: any[] = [];
  if (nextMatch) {
    if (nextMatch.lineupSelections && nextMatch.lineupSelections.length > 0) {
      startersData = nextMatch.lineupSelections.filter((l: any) => l.role === "STARTER");
    } else {
      const goalkeepers = team.players.filter((p: any) => p.position === "GOALKEEPER");
      const defenders = team.players.filter((p: any) => ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"].includes(p.position));
      const midfielders = team.players.filter((p: any) => ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"].includes(p.position));
      const forwards = team.players.filter((p: any) => ["FORWARD", "LEFT_WINGER", "RIGHT_WINGER"].includes(p.position));
      
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
  }
  const tacticalPlayers = getTacticalPositions(startersData);

  const finishedMatches = team.matches
    .filter((m) => m.status === "COMPLETED" || m.status === "CANCELLED")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const goalBalance = goalsScored - goalsConceded;
  const summaryLine = totalGames > 0 ? `${wins}V · ${draws}E · ${losses}D` : "Temporada em construção";
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

  return (
    <div 
      className="min-h-screen text-[#f0f7f4] relative overflow-hidden bg-[#030708] pb-24 font-sans selection:bg-[var(--team-primary)] selection:text-[#020506] antialiased"
      style={{
        "--team-primary": themePrimary,
        "--team-secondary": themeSecondary,
        "--team-primary-rgb": primaryRgb,
        "--team-secondary-rgb": secondaryRgb,
        "--brand": themePrimary,
        "--brand-strong": themePrimary,
        "--brand-soft": `rgba(${primaryRgb}, 0.08)`,
        "--brand-neon": themeSecondary,
      } as React.CSSProperties}
    >
      {/* Public Navbar */}
      <PublicNavbar teamName={team.name} badgeUrl={team.badgeUrl} slug={team.slug} />

      {/* Printed Sports Gazette Top Branding Info Banner */}
      <div className="mx-auto max-w-6xl mt-6 px-4">
        <div className="border-double border-y-4 border-slate-800 py-3 flex flex-wrap items-center justify-between gap-y-2 text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
          <div>[ GAZETA ESPORTIVA DO TERRÃO ]</div>
          <div className="hidden sm:block">EDIÇÃO Nº 42 • SÉRIE OFICIAL</div>
          <div>BOLETIM EXTRA • PORTAL DO CLUBE</div>
        </div>
      </div>

      {/* Editorial Sports Hero Section */}
      <header className="relative overflow-hidden px-4 pb-20 pt-8 lg:pb-24 lg:pt-14">
        <div className="relative mx-auto mt-4 grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            {/* Elegant Shield-style Level Tag */}
            <div className="inline-flex items-center gap-2 rounded-none bg-[#090d0f] border-2 border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 font-mono">
              <IconShield className="w-3.5 h-3.5 text-[var(--brand)]" />
              <span>{team.competitiveLevel ? competitiveLevelLabels[team.competitiveLevel] : "Competitivo"}</span>
            </div>

            {/* Massive punchy typography - Space Grotesk used for visual impact with tight tracking */}
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-[0.25em] text-[var(--brand)] uppercase font-mono">
                Portal Oficial
              </p>
              <h1 className="text-balance text-5xl font-black leading-[0.9] sm:text-7xl lg:text-8xl uppercase tracking-tighter text-white font-mono">
                {team.name}
              </h1>
            </div>
            
            {team.description && (
              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-400 font-medium border-l-4 border-[var(--brand)] pl-4 font-mono">
                {team.description}
              </p>
            )}

            {/* Printed Club Manifesto Column */}
            <div className="border-2 border-dashed border-slate-800 bg-[#090d0f]/50 p-6 space-y-3 relative shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
              <span className="absolute -top-3 left-4 bg-black border border-slate-800 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-[var(--brand)] font-mono">
                [MANIFESTO DE VESTIÁRIO]
              </span>
              <p className="text-xs leading-relaxed text-slate-400 font-mono uppercase text-justify pt-1">
                <span className="float-left text-4xl font-extrabold pr-2 leading-none font-mono text-[var(--brand)]">A</span>
                QUI A PAIXÃO NÃO É COBRADA EM BILHETERIA E O SUOR PESA MAIS QUE QUALQUER CONTRATO MILIONÁRIO. CADA CAPÍTULO DA NOSSA HISTÓRIA É ESCRITO NO TERRÃO OU NO SINTÉTICO, JOGO A JOGO, PELA HONRA DA COMUNIDADE. VESTIMOS A CAMISA COM A ALMA.
              </p>
            </div>

            {/* Info Row with SVG Icons instead of AI emojis */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-slate-400 font-semibold font-mono uppercase tracking-wider">
              {team.city && (
                <div className="flex items-center gap-2">
                  <IconMapPin className="w-4 h-4 text-[var(--brand)]" />
                  <span>{team.city}{team.region ? ` - ${team.region}` : ""}</span>
                </div>
              )}
              {team.defaultVenue && (
                <div className="flex items-center gap-2">
                  <IconStadium className="w-4 h-4 text-[var(--brand)]" />
                  <span>{team.defaultVenue}</span>
                </div>
              )}
              {team.fieldType && (
                <div className="flex items-center gap-2">
                  <IconPitch className="w-4 h-4 text-[var(--brand)]" />
                  <span>{fieldTypeLabels[team.fieldType]}</span>
                </div>
              )}
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#elenco"
                className="inline-flex min-h-12 items-center justify-center rounded-none border-2 border-black bg-[var(--brand)] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#090d0f] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none duration-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]"
              >
                Conhecer Elenco
              </a>
              <a
                href="#amistoso"
                className="inline-flex min-h-12 items-center justify-center rounded-none border-2 border-slate-800 bg-[#0f1418] hover:bg-slate-900 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--brand)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none duration-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]"
              >
                Desafiar Equipe
              </a>
            </div>
          </div>

          {/* Premium Season Pass Card (Visual Scoreboard) */}
          <aside className="relative overflow-hidden max-w-md rounded-none border-2 border-slate-800 bg-[#0b0f11] p-8 shadow-[6px_6px_0px_0px_#000] lg:ml-auto lg:w-full space-y-6">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[var(--brand)]" />
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 shrink-0 rounded-none bg-black flex items-center justify-center border border-slate-800 overflow-hidden">
                {team.badgeUrl ? (
                  <img 
                    src={team.badgeUrl} 
                    alt={`Escudo do ${team.name}`} 
                    className="w-full h-full object-cover p-2"
                  />
                ) : (
                  <span className="text-2xl font-black text-white font-mono uppercase tracking-tighter">
                    {team.shortName || team.name.substring(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">Campanha</p>
                <p className="mt-0.5 text-2xl font-black tracking-tight text-white font-mono uppercase">{summaryLine}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 font-mono">
              <div className="rounded-none border border-slate-800 bg-[#090d0f] p-5 shadow-[3px_3px_0px_0px_#000]">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Aproveitamento Geral</p>
                <p className="text-4xl font-black text-[var(--brand)] mt-1 tracking-tighter">{winRate}%</p>
              </div>
              <div className="rounded-none border border-slate-800 bg-[#090d0f] p-5 shadow-[3px_3px_0px_0px_#000]">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Ataque na Temporada</p>
                <p className="text-4xl font-black text-white mt-1 tracking-tighter">
                  {avgGoalsScored} <span className="text-xs font-black text-slate-500 uppercase tracking-wide">/ jogo</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto mt-6 max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24">
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          {[
            { label: "Atletas Registrados", value: team.players.length, desc: "Inscritos no elenco principal", color: "border-slate-800" },
            { label: "Jogos Disputados", value: totalMatches, desc: "Partidas oficiais finalizadas", color: "border-slate-800" },
            { label: "Saldo de Gols", value: goalBalance >= 0 ? `+${goalBalance}` : goalBalance, desc: `${goalsScored} pró · ${goalsConceded} contra`, color: "border-slate-800" },
            { label: "Gols na Temporada", value: goalsScored, desc: "Gols marcados de forma coletiva", color: "border-[var(--team-primary)]" }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`rounded-none border-2 ${item.color} bg-[#0b0f11] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--team-primary)] duration-200`}
            >
              <p className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400">{item.label}</p>
              <p className="mt-2 text-4xl font-black tracking-tight text-white font-mono leading-none">{item.value}</p>
              <p className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Estrelas da Temporada (Hall of Fame) - Asymmetric, premium layout */}
        <section id="destaques" className="scroll-mt-24 space-y-6">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)] font-mono">Destaques Individuais</p>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight font-mono mt-1">Estrelas da Temporada</h2>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Métricas Oficiais
            </span>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 font-mono">
            {/* Highlight 1: MVP Poster Card (col-span-2) */}
            <div className="lg:col-span-2 relative min-h-[340px] border-2 border-[var(--team-primary)] bg-[#0b0f11] p-8 shadow-[8px_8px_0px_0px_#000] overflow-hidden flex flex-col justify-between group hover:shadow-[8px_8px_0px_0px_var(--team-primary)] transition-all duration-300 rounded-none">
              {/* Massive background number */}
              <span className="absolute -right-6 -bottom-10 text-[13rem] font-black text-white/[0.02] select-none pointer-events-none leading-none">
                {bestScorer?.goals || 0}
              </span>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
                <div>
                  <span className="text-[9px] font-black bg-[var(--team-primary)] text-black px-3 py-1 uppercase tracking-widest">
                    [DESTAQUE PRINCIPAL / ARTILHEIRO]
                  </span>
                  <h3 className="mt-4 text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                    {bestScorer?.goals || 0} GOLS
                  </h3>
                  <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Líder absoluto de finalizações na temporada atual
                  </p>
                </div>
                {bestScorer?.photoUrl ? (
                  <div className="h-28 w-28 shrink-0 border-2 border-black bg-[#090d0f] overflow-hidden shadow-[4px_4px_0px_0px_#000] relative rounded-none">
                    <img src={bestScorer.photoUrl} alt="MVP" className="h-full w-full object-cover transition-transform group-hover:scale-105 rounded-none" />
                    <div className="absolute top-0 right-0 h-6 w-6 bg-black border-l border-b border-slate-800 flex items-center justify-center text-[9px] font-black text-[var(--team-primary)]">
                      #{bestScorer?.shirtNumber}
                    </div>
                  </div>
                ) : (
                  <div className="h-28 w-28 shrink-0 border-2 border-dashed border-slate-800 bg-[#090d0f] flex flex-col items-center justify-center text-slate-600 relative rounded-none shadow-[4px_4px_0px_0px_#000]">
                    <span className="text-4xl font-black text-white/5 select-none leading-none">#{bestScorer?.shirtNumber ?? "—"}</span>
                    <span className="text-[9px] uppercase tracking-wider mt-1">[SEM FOTO]</span>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[var(--team-primary)] transition-colors">
                    {bestScorer?.playerName || "Sem registro"}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Artilharia do elenco · Manto #{bestScorer?.shirtNumber ?? "—"}
                  </p>
                </div>
                <div className="text-[9px] font-black text-[var(--team-primary)] bg-black border border-slate-800 px-3 py-1.5 uppercase tracking-wider">
                  [OFFICIAL MVP CARD]
                </div>
              </div>
            </div>

            {/* Side Dossiers Stack */}
            <div className="flex flex-col gap-4">
              {/* Highlight 2: Garçom */}
              <div className="relative overflow-hidden border-2 border-slate-800 bg-[#0b0f11] p-5 flex items-center justify-between shadow-[4px_4px_0px_0px_#000] group hover:border-cyan-400 hover:shadow-[4px_4px_0px_0px_rgba(6,182,212,0.9)] transition-all duration-200 rounded-none">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <IconAssist className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">[GARÇOM]</span>
                  </div>
                  <p className="text-lg font-black text-white uppercase truncate tracking-tight max-w-[160px] group-hover:text-cyan-400 transition-colors">
                    {bestAssist?.playerName || "Sem registro"}
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    {bestAssist ? `Camisa #${bestAssist.shirtNumber}` : "Aguardando passes"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-white leading-none tracking-tighter">
                    {bestAssist?.assists || 0}
                  </p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">ASSISTÊNCIAS</p>
                </div>
              </div>

              {/* Highlight 3: Presença */}
              <div className="relative overflow-hidden border-2 border-slate-800 bg-[#0b0f11] p-5 flex items-center justify-between shadow-[4px_4px_0px_0px_#000] group hover:border-amber-400 hover:shadow-[4px_4px_0px_0px_rgba(245,158,11,0.9)] transition-all duration-200 rounded-none">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <IconCalendar className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">[MAIS ATUANTE]</span>
                  </div>
                  <p className="text-lg font-black text-white uppercase truncate tracking-tight max-w-[160px] group-hover:text-amber-500 transition-colors">
                    {bestPresence?.playerName || "Sem registro"}
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    {bestPresence ? `Camisa #${bestPresence.shirtNumber}` : "Aguardando partidas"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-white leading-none tracking-tighter">
                    {bestPresence?.matches || 0}
                  </p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">PARTIDAS</p>
                </div>
              </div>

              {/* Highlight 4: Melhor Nota */}
              <div className="relative overflow-hidden border-2 border-slate-800 bg-[#0b0f11] p-5 flex items-center justify-between shadow-[4px_4px_0px_0px_#000] group hover:border-violet-400 hover:shadow-[4px_4px_0px_0px_rgba(139,92,246,0.9)] transition-all duration-200 rounded-none">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <IconStar className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">[MELHOR NOTA]</span>
                  </div>
                  <p className="text-lg font-black text-white uppercase truncate tracking-tight max-w-[160px] group-hover:text-violet-400 transition-colors">
                    {bestRated?.playerName || "Sem registro"}
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    {bestRated ? `${bestRated.totalRatings} avaliações` : "Aguardando votos"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-white leading-none tracking-tighter">
                    {bestRated?.averageStars?.toFixed(1) || "0.0"}
                  </p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">MÉDIA</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MATCHES SECTION (3-LEVEL TIMELINE) - High contrast & professional Sofascore layout */}
        <section id="retrospecto" className="space-y-6 scroll-mt-24">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)] font-mono">Linha do Tempo</p>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight font-mono mt-1">Histórico & Agenda</h2>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Cronograma de Jogos
            </span>
          </div>

          <div className="space-y-8">
            {/* LEVEL 1: Próximo Jogo (Highlighted at the top as a physical ticket) */}
            {nextMatch && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--team-primary)] tracking-widest uppercase font-mono">
                  <IconCalendar className="w-4 h-4" />
                  PRÓXIMO COMPROMISSO
                </div>
                
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] items-stretch">
                  {/* Bilhete de Ingresso Impresso */}
                  <div className="relative flex flex-col md:flex-row items-stretch bg-[#0b0f11] border-2 border-black shadow-[6px_6px_0px_0px_var(--team-primary)] overflow-hidden rounded-none">
                    {/* Left Accent Bar in Brand Color */}
                    <div className="w-2 shrink-0" style={{ backgroundColor: themePrimary }} />

                    {/* Ticket Main Details Body */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6 z-10 font-mono">
                      <div className="space-y-4">
                        {/* Ticket Header Meta */}
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
                          <span className="bg-black border border-slate-800 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-slate-300">
                            {nextMatch.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-300">
                            {new Date(nextMatch.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Scoreboard style naming */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase font-mono leading-none">
                            {team.shortName || team.name}
                          </span>
                          <span className="px-3 py-1 bg-black border border-slate-800 text-xs font-mono font-black text-slate-500 tracking-widest">
                            VS
                          </span>
                          <span className="text-3xl sm:text-4xl font-black tracking-tighter uppercase font-mono leading-none" style={{ color: themeSecondary }}>
                            {nextMatch.opponent}
                          </span>
                        </div>

                        {/* Map info */}
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">
                          <IconMapPin className="w-4 h-4 text-[var(--team-primary)] shrink-0" />
                          <span>LOCAL: {nextMatch.venue}</span>
                        </div>
                      </div>

                      {/* Barcode details in ticket footer */}
                      <div className="text-[9px] text-slate-500 font-mono font-bold tracking-widest uppercase border-t border-slate-800/40 pt-4">
                        [ PORTÃO ABERTO • TRAGA SUA TORCIDA ]
                      </div>
                    </div>

                    {/* Perforated Stub Section */}
                    <div className="w-full md:w-56 p-6 md:p-8 flex flex-col items-center justify-center border-t-2 md:border-t-0 md:border-l-2 border-dashed border-slate-800 relative bg-[#0e1317]/50 shrink-0 text-center z-10">
                      {/* Punch-hole cutouts mapping exactly to the division line */}
                      <div className="absolute -top-3.5 -left-3.5 h-7 w-7 rounded-full bg-[#070a0c] border-2 border-slate-800 hidden md:block" />
                      <div className="absolute -bottom-3.5 -left-3.5 h-7 w-7 rounded-full bg-[#070a0c] border-2 border-slate-800 hidden md:block" />
                      <div className="absolute -top-3.5 -left-3.5 h-7 w-7 rounded-full bg-[#070a0c] border-2 border-slate-800 md:hidden" />
                      <div className="absolute -top-3.5 -right-3.5 h-7 w-7 rounded-full bg-[#070a0c] border-2 border-slate-800 md:hidden" />

                      <div className="space-y-3 w-full font-mono">
                        <div className="text-slate-500 text-[9px] font-black uppercase tracking-widest leading-none">SEÇÃO / STATUS</div>
                        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 text-[9px] font-black uppercase tracking-widest w-fit">
                          ADMIT ONE · AGENDADO
                        </div>

                        {/* Mock Barcode Graphic */}
                        <div className="mt-4 flex flex-col items-center gap-1.5 opacity-40 hover:opacity-75 transition-opacity duration-200" aria-hidden="true">
                          <div className="flex items-center gap-[2px] justify-center">
                            <div className="w-[1px] h-8 bg-slate-400" />
                            <div className="w-[3px] h-8 bg-slate-400" />
                            <div className="w-[1px] h-8 bg-slate-400" />
                            <div className="w-[2px] h-8 bg-slate-400" />
                            <div className="w-[1px] h-8 bg-slate-400" />
                            <div className="w-[4px] h-8 bg-slate-400" />
                            <div className="w-[1px] h-8 bg-slate-400" />
                            <div className="w-[2px] h-8 bg-slate-400" />
                            <div className="w-[3px] h-8 bg-slate-400" />
                            <div className="w-[1px] h-8 bg-slate-400" />
                            <div className="w-[2px] h-8 bg-slate-400" />
                            <div className="w-[1px] h-8 bg-slate-400" />
                          </div>
                          <span className="text-[7px] text-slate-500 uppercase tracking-widest leading-none">
                            MATCH-STUB-{nextMatch.id.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prancheta Tática do Professor */}
                  <div className="relative border-2 border-black bg-[#0b0f11] p-4 flex flex-col justify-between shadow-[6px_6px_0px_0px_#000] rounded-none w-full lg:w-[320px] shrink-0 aspect-[4/5] overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-28 bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-[7px] font-black uppercase text-slate-300 font-mono tracking-widest z-20">
                      PRANCHETA TÁTICA
                    </div>

                    <div className="relative w-full h-full border border-dashed border-slate-800/80 bg-gradient-to-b from-[#081812] to-[#040a08] flex flex-col justify-between overflow-hidden mt-4 p-2">
                      {/* Soccer Pitch Markings */}
                      <div className="absolute inset-0 border border-white/5 m-1 pointer-events-none" />
                      <div className="absolute top-1/2 left-0 right-0 border-t border-white/5 pointer-events-none" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/5 pointer-events-none" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-b border-x border-white/5 pointer-events-none" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-t border-x border-white/5 pointer-events-none" />

                      {/* Render Starting Lineup Jerseys */}
                      <div className="relative w-full h-full z-10">
                        {tacticalPlayers.map((player) => (
                          <div
                            key={player.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-help"
                            style={{
                              left: `${player.x}%`,
                              top: `${player.y}%`,
                            }}
                            title={`${player.name} (${player.position})`}
                          >
                            <div 
                              className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-[9px] font-black shadow-md transition-transform group-hover:scale-110"
                              style={{ backgroundColor: themePrimary, color: "#000" }}
                            >
                              {player.shirtNumber || "—"}
                            </div>
                            <div className="bg-black/95 px-1 py-0.5 border border-slate-800 text-[6px] font-black text-white font-mono uppercase tracking-tighter max-w-[60px] truncate text-center mt-0.5 leading-none">
                              {player.name.split(" ")[0]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 2: Partidas Finalizadas (Sofascore style list display) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IconTrophy className="w-4 h-4 text-[var(--team-primary)]" />
                <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">
                  HISTÓRICO DE RESULTADOS
                </h3>
              </div>

              {finishedMatches.length === 0 ? (
                <div className="rounded-none border-2 border-slate-800 p-12 text-center text-slate-500 text-sm font-medium bg-black/20 border-dashed">
                  Nenhum jogo disputado registrado.
                </div>
              ) : (
                <div className="border-2 border-slate-800 rounded-none bg-[#0b0f11] overflow-hidden divide-y-2 divide-slate-800 shadow-[4px_4px_0px_0px_#000]">
                  {finishedMatches.map((match) => {
                    const isCancelled = match.status === "CANCELLED";
                    const win = match.homeScore !== null && match.awayScore !== null && (
                      match.isHome ? match.homeScore > match.awayScore : match.awayScore > match.homeScore
                    );
                    const draw = match.homeScore !== null && match.awayScore !== null && match.homeScore === match.awayScore;
                    
                    let badgeColor = "bg-[#090d0f] text-slate-400 border-2 border-slate-800 font-black";
                    let outcomeChar = "E";
                    let resultLabel = "Empate";
                    
                    if (isCancelled) {
                      resultLabel = "Cancelado";
                      outcomeChar = "C";
                      badgeColor = "bg-[#090d0f] text-red-500 border-2 border-red-500 font-black";
                    } else if (win) {
                      resultLabel = "Vitória";
                      outcomeChar = "V";
                      badgeColor = "bg-[var(--team-primary)] text-black border-2 border-black font-black";
                    } else if (!draw) {
                      resultLabel = "Derrota";
                      outcomeChar = "D";
                      badgeColor = "bg-rose-600 text-white border-2 border-black font-black";
                    }

                    return (
                      <div key={match.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-white/[0.01]">
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
                          {/* Outcome badge column */}
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`h-8 w-8 rounded-none flex items-center justify-center font-mono font-black text-xs ${badgeColor}`}>
                              {outcomeChar}
                            </span>
                            <span className="sm:hidden text-xs font-bold text-slate-400 uppercase">
                              {resultLabel}
                            </span>
                          </div>

                          {/* Match description */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                              <span className="uppercase text-[10px] font-bold text-slate-400 tracking-wider">
                                {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(match.date).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            
                            {/* Score Display Row */}
                            <div className="flex items-center gap-3">
                              <span className="text-base font-extrabold text-white tracking-tight uppercase font-mono truncate">
                                {team.shortName || team.name}
                              </span>
                              
                              {!isCancelled && match.homeScore !== null && match.awayScore !== null ? (
                                <div className="shrink-0 flex items-center gap-1 bg-black/40 border border-white/5 rounded px-2.5 py-0.5 font-mono text-sm font-black text-white select-none">
                                  <span>{match.isHome ? match.homeScore : match.awayScore}</span>
                                  <span className="text-slate-600 font-normal">:</span>
                                  <span>{match.isHome ? match.awayScore : match.homeScore}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">VS</span>
                              )}

                              <span className="text-base font-extrabold tracking-tight uppercase font-mono truncate" style={{ color: themeSecondary }}>
                                {match.opponent}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <IconMapPin className="w-3.5 h-3.5 text-slate-500" />
                              <span className="truncate">{match.venue}</span>
                            </div>

                            {match.matchStats && match.matchStats.length > 0 && (
                              <div className="mt-2.5 border-t border-slate-800/40 pt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-mono">
                                {match.matchStats.some((s) => s.goals > 0) && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-400 uppercase font-black">⚽ Gols:</span>
                                    <span className="text-white font-black">
                                      {match.matchStats
                                        .filter((s) => s.goals > 0)
                                        .map((s) => `${s.player.name.split(" ")[0]} (${s.goals})`)
                                        .join(", ")}
                                    </span>
                                  </div>
                                )}
                                {match.matchStats.some((s) => s.assists > 0) && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-400 uppercase font-black">🎯 Assist:</span>
                                    <span className="text-slate-300 font-bold">
                                      {match.matchStats
                                        .filter((s) => s.assists > 0)
                                        .map((s) => `${s.player.name.split(" ")[0]} (${s.assists})`)
                                        .join(", ")}
                                    </span>
                                  </div>
                                )}
                                {match.matchStats.some((s) => s.yellowCards > 0) && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-amber-500 font-black">🟨:</span>
                                    <span className="text-slate-400">
                                      {match.matchStats
                                        .filter((s) => s.yellowCards > 0)
                                        .map((s) => `${s.player.name.split(" ")[0]}${s.yellowCards > 1 ? ` (${s.yellowCards})` : ""}`)
                                        .join(", ")}
                                    </span>
                                  </div>
                                )}
                                {match.matchStats.some((s) => s.redCards > 0) && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-red-500 font-black">🟥:</span>
                                    <span className="text-slate-400">
                                      {match.matchStats
                                        .filter((s) => s.redCards > 0)
                                        .map((s) => `${s.player.name.split(" ")[0]}`)
                                        .join(", ")}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Outcome tag desktop */}
                        <div className="hidden sm:flex items-center justify-end shrink-0">
                          <span className={`px-3 py-1 rounded-none text-[10px] font-black uppercase tracking-wider font-mono border-2 ${
                            isCancelled ? "bg-black text-red-500 border-red-500" :
                            win ? "bg-black text-[var(--team-primary)] border-[var(--team-primary)]" :
                            draw ? "bg-black text-slate-400 border-slate-800" : "bg-black text-rose-500 border-rose-500"
                          }`}>
                            {resultLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LEVEL 3: Outros Jogos Agendados (chronological ascending) */}
            {remainingScheduled.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <IconCalendar className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">
                    OUTROS COMPROMISSOS FUTUROS
                  </h3>
                </div>
                
                <div className="border-2 border-slate-800 rounded-none bg-[#0b0f11] overflow-hidden divide-y-2 divide-slate-800 shadow-[4px_4px_0px_0px_#000]">
                  {remainingScheduled.map((match) => (
                    <div key={match.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-white/[0.01]">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <span className="bg-black text-blue-400 px-2 py-0.5 border-2 border-blue-500 rounded-none text-[9px] font-black uppercase tracking-widest font-mono">
                            {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-300">
                            {new Date(match.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-base font-extrabold text-white tracking-tight uppercase font-mono">
                            {team.shortName || team.name}
                          </span>
                          <span className="text-xs font-bold text-slate-600 font-mono tracking-widest">VS</span>
                          <span className="text-base font-extrabold tracking-tight uppercase font-mono" style={{ color: themeSecondary }}>
                            {match.opponent}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <IconMapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate">{match.venue}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center shrink-0">
                        <span className="px-3 py-1 bg-black border-2 border-slate-800 rounded-none text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                          Agendado
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ELENCO OFICIAL (SQUAD DOSSIER) - Clean athletical visual dossier cards */}
        <section id="elenco" className="scroll-mt-24 space-y-6">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand)] font-mono">Atletas Oficiais</p>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight font-mono mt-1">Guerreiros do Elenco</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {team.players.length} Atletas
            </span>
          </div>

          {team.players.length === 0 ? (
            <div className="rounded-xl border border-white/5 p-12 text-center text-slate-500 text-sm font-medium border-dashed">
              Nenhum jogador cadastrado ou ativo no elenco.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.players.map((player) => {
                const theme = positionThemes[player.position] || {
                  border: "border-white/10 hover:border-white/20",
                  text: "text-slate-400",
                  label: player.position,
                  badge: "bg-white/5 text-slate-400 border-white/10",
                };

                const playerStats = ranking.find((p) => p.playerId === player.id);
                const statsGoals = playerStats?.goals ?? 0;
                const statsAssists = playerStats?.assists ?? 0;
                const statsMatches = playerStats?.matches ?? 0;
                const statsRating = playerStats?.averageStars ?? null;

                return (
                  <Link
                    key={player.id}
                    href={`/jogadores/${player.id}`}
                    className="group block"
                    aria-label={`Ver perfil de ${player.name}`}
                  >
                    <article className="relative bg-[#0b0f11] border-2 border-slate-800 p-2.5 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[5px_5px_0px_0px_var(--team-primary)] hover:border-[var(--team-primary)] transition-all duration-200 rounded-none flex flex-col justify-between h-full">
                      {/* Inner double border margin */}
                      <div className="border border-slate-800/40 p-2 flex flex-col justify-between h-full bg-[#0e1317]/50">
                        
                        {/* Card Image Frame */}
                        <div className="relative w-full h-[240px] bg-[#090d0f] border border-slate-800 overflow-hidden shrink-0">
                          {/* Vintage Editorial Stamp Ribbon */}
                          <div className="absolute bottom-3 left-3 -rotate-3 bg-red-700 border border-black px-2 py-0.5 text-[8px] font-mono font-black uppercase text-white tracking-widest shadow-md z-10 select-none">
                            {getPlayerStamp(player, stats)}
                          </div>

                          {player.photoUrl ? (
                            <img
                              src={player.photoUrl}
                              alt={player.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 rounded-none filter grayscale contrast-125 saturate-50 group-hover:grayscale-0 group-hover:contrast-100 group-hover:saturate-100"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col justify-center items-center bg-[#090d0f] relative overflow-hidden">
                              {/* Giant background jersey number */}
                              <span className="font-mono text-[9rem] font-black text-white/[0.02] tracking-tighter select-none leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                {player.shirtNumber}
                              </span>
                              <svg className="w-16 h-16 text-slate-800/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Jersey number stamp inside picture top right */}
                          <div className="absolute top-3 right-3 h-8 w-8 bg-[#0b0f11] border border-slate-800 flex items-center justify-center font-mono font-black text-xs text-white">
                            #{player.shirtNumber}
                          </div>

                          {/* Position Badge top left */}
                          <div className="absolute top-3 left-3">
                            <span className={`inline-flex border px-2 py-0.5 font-mono text-[8px] font-black uppercase tracking-widest ${theme.badge}`}>
                              {theme.label}
                            </span>
                          </div>
                        </div>

                        {/* Card Dossier Data (Player Info + Stats Table) */}
                        <div className="mt-4 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-0.5">
                            <h3 className="font-mono text-base font-black text-white uppercase tracking-tight group-hover:text-[var(--team-primary)] transition-colors duration-150 truncate">
                              {player.name}
                            </h3>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                              VARZEA OFFICIAL CARD
                            </p>
                          </div>

                          {/* Printed scout stats sheet base */}
                          <div className="grid grid-cols-4 gap-1 border-t border-b border-slate-800/60 py-2 bg-[#090d0f]/60 font-mono text-center">
                            <div>
                              <p className="text-[8px] text-slate-500 font-bold uppercase">JOG</p>
                              <p className="text-xs font-black text-white mt-0.5">{statsMatches}</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-500 font-bold uppercase">GOL</p>
                              <p className="text-xs font-black text-[var(--team-primary)] mt-0.5">{statsGoals}</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-500 font-bold uppercase">AST</p>
                              <p className="text-xs font-black text-cyan-400 mt-0.5">{statsAssists}</p>
                            </div>
                            <div>
                              <p className="text-[8px] text-slate-500 font-bold uppercase">NOTA</p>
                              <p className="text-xs font-black text-violet-400 mt-0.5">{statsRating ? statsRating.toFixed(1) : "—"}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest pt-1">
                            <span>Ver Scout Completo</span>
                            <IconArrowRight className="w-3 h-3 text-[var(--team-primary)] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Match Availability & Open Slots */}
        {(team.openMatchSlots.length > 0 || hasDiscoveryInfo) && (
          <section id="agenda-aberta" className="scroll-mt-24 rounded-none border-2 border-slate-800 bg-[#0b0f11] p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_0px_#000]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-800 pb-5">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand)] font-mono">[DISPONIBILIDADE DE ARENA]</p>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight font-mono mt-1">Datas para Amistosos</h2>
              </div>
              {team.openMatchSlots.length > 0 && (
                <span className="rounded-none border-2 border-[var(--brand)] bg-black px-3 py-1 text-xs font-black text-[var(--brand)] font-mono">
                  {team.openMatchSlots.length} HORÁRIO(S) ABERTO(S)
                </span>
              )}
            </div>

            {hasDiscoveryInfo && (
              <div className="flex flex-wrap gap-2">
                {team.city && (
                  <span className="rounded-none border-2 border-slate-800 bg-[#090d0f] px-3 py-1.5 text-xs font-black text-slate-400 font-mono uppercase">
                    CIDADE: {team.city}
                  </span>
                )}
                {team.region && (
                  <span className="rounded-none border-2 border-slate-800 bg-[#090d0f] px-3 py-1.5 text-xs font-black text-slate-400 font-mono uppercase">
                    REGIÃO: {team.region}
                  </span>
                )}
                {team.fieldType && (
                  <span className="rounded-none border-2 border-slate-800 bg-[#090d0f] px-3 py-1.5 text-xs font-black text-slate-400 font-mono uppercase">
                    CAMPO: {fieldTypeLabels[team.fieldType]}
                  </span>
                )}
                {team.competitiveLevel && (
                  <span className="rounded-none border-2 border-slate-800 bg-[#090d0f] px-3 py-1.5 text-xs font-black text-slate-400 font-mono uppercase">
                    NÍVEL: {competitiveLevelLabels[team.competitiveLevel]}
                  </span>
                )}
              </div>
            )}

            {team.openMatchSlots.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 pt-2">
                {team.openMatchSlots.map((slot) => (
                  <article key={slot.id} className="rounded-none border-2 border-slate-800 bg-[#090d0f] p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--team-primary)] transition-all duration-200 group">
                    <div className="space-y-2">
                      <p className="text-base font-black text-white uppercase tracking-tight font-mono">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(slot.date)}
                      </p>
                      <p className="text-xs font-black text-slate-400 font-mono uppercase tracking-wider">
                        {(slot.timeLabel || "HORÁRIO A DEFINIR") + " • " + (slot.venueLabel || "LOCAL A DEFINIR")}
                      </p>
                      {slot.notes && <p className="text-xs text-slate-500 font-mono uppercase pt-1">[NOTA: {slot.notes}]</p>}
                    </div>
                    <Link
                      href={`/${team.slug}?slot=${slot.id}#amistoso`}
                      className="mt-6 inline-flex min-h-10 items-center justify-center rounded-none border-2 border-[var(--brand)] bg-transparent text-[var(--brand)] hover:bg-[var(--brand)] hover:text-black text-xs font-black uppercase tracking-wider px-6 py-2.5 transition-all duration-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]"
                    >
                      Propor jogo neste horário
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 pt-2 font-medium">
                No momento não temos datas abertas cadastradas, mas você pode sugerir um dia e local no formulário abaixo!
              </p>
            )}
          </section>
        )}

        {/* FORMS SECTION (AMISTOSO / RECRUTAMENTO SPLIT) */}
        <section id="amistoso" className="scroll-mt-24 grid gap-8 lg:grid-cols-2">
          
          {/* Friendly Request Form Card */}
          <div className="rounded-none border-2 border-slate-800 bg-[#0b0f11] p-6 sm:p-8 flex flex-col space-y-6 shadow-[6px_6px_0px_0px_#000]">
            <div className="space-y-3">
              <span className="inline-flex rounded-none bg-black border-2 border-[var(--brand)] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--brand)] font-mono">
                [DESAFIO AMISTOSO]
              </span>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight mt-2 font-mono">
                Desafie o {team.name}
              </h2>
              <p className="text-xs leading-relaxed text-slate-400 font-semibold tracking-wide uppercase">
                Representa outra equipe e quer agendar um confronto contra o {team.name}? Envie os detalhes do local, horário e proposta e nossa comissão responderá!
              </p>
            </div>
            
            {selectedSlot && (
              <div className="rounded-none border-2 border-[var(--team-primary)] bg-black px-4 py-3 text-xs text-[var(--brand)] font-black animate-fade-in uppercase tracking-wider font-mono">
                [HORÁRIO SELECIONADO] Agendando proposta com base no horário aberto de {selectedSlotDateText}.
              </div>
            )}
            
            <FriendlyRequestForm 
              teamSlug={team.slug}
              initialSuggestedDates={suggestedDatesInitialValue}
              initialSuggestedVenue={suggestedVenueInitialValue}
            />
          </div>

          {/* Recruitment Form Card */}
          <div className="rounded-none border-2 border-slate-800 bg-[#0b0f11] p-6 sm:p-8 flex flex-col space-y-6 shadow-[6px_6px_0px_0px_#000]">
            <div className="space-y-3">
              <span className="inline-flex rounded-none bg-black border-2 border-cyan-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">
                [RECRUTAMENTO ATLETAS]
              </span>
              <h2 className="text-3xl font-black uppercase text-white tracking-tight mt-2 font-mono">
                Faça Parte do Elenco
              </h2>
              <p className="text-xs leading-relaxed text-slate-400 font-semibold tracking-wide uppercase">
                {team.publicDirectoryOptIn 
                  ? `Quer vestir a camisa do ${team.name} e mostrar seu futebol? Deixe seus dados abaixo para a comissão técnica avaliar!`
                  : `O recrutamento público está atualmente fechado para esta equipe no momento.`
                }
              </p>
            </div>

            {team.publicDirectoryOptIn ? (
              <RecruitmentForm teamSlug={team.slug} />
            ) : (
              <div className="rounded-none border border-slate-800 bg-black/40 p-8 text-center text-slate-400 flex flex-col justify-center items-center min-h-[280px] shadow-[4px_4px_0px_0px_#000]">
                <IconLock className="w-10 h-10 mb-4 text-slate-600" />
                <p className="text-sm font-black text-white uppercase tracking-wider font-mono">[RECRUTAMENTO FECHADO]</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2 max-w-xs mx-auto">
                  Esta equipe optou por não aceitar novas candidaturas de recrutamento público no momento.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Identity Details */}
        {(team.primaryColor || team.secondaryColor) && (
          <section className="text-center pt-4 space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono">[IDENTIDADE VISUAL E CORES]</p>
            <div className="flex justify-center flex-wrap gap-6">
              {team.primaryColor && (
                <div className="flex items-center gap-3 bg-[#0b0f11] border-2 border-slate-800 rounded-none px-5 py-2.5 shadow-[4px_4px_0px_0px_#000]">
                  <div className="h-6 w-6 rounded-none border-2 border-black" style={{ backgroundColor: team.primaryColor }} />
                  <span className="text-[10px] font-black uppercase text-white tracking-widest font-mono">Manto Principal</span>
                </div>
              )}
              {team.secondaryColor && (
                <div className="flex items-center gap-3 bg-[#0b0f11] border-2 border-slate-800 rounded-none px-5 py-2.5 shadow-[4px_4px_0px_0px_#000]">
                  <div className="h-6 w-6 rounded-none border-2 border-black" style={{ backgroundColor: team.secondaryColor }} />
                  <span className="text-[10px] font-black uppercase text-white tracking-widest font-mono">Manto Reserva</span>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl mt-24 border-t border-[rgba(255,255,255,0.06)] px-4 pt-10 text-center text-xs font-semibold text-slate-500 sm:px-6 lg:px-8 space-y-2">
        <p>&copy; {new Date().getFullYear()} {team.name}. Todos os direitos reservados.</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">Plataforma de Gestão Esportiva VARzea</p>
      </footer>
    </div>
  );
}
