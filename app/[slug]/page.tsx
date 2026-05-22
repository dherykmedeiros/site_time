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

const positionThemes: Record<string, { border: string; text: string; glow: string; label: string; badge: string }> = {
  GOALKEEPER: {
    border: "border-amber-500/20 hover:border-amber-400/50",
    text: "text-amber-400",
    glow: "rgba(245, 158, 11, 0.12)",
    label: "Goleiro",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  DEFENDER: {
    border: "border-emerald-500/20 hover:border-emerald-400/50",
    text: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.12)",
    label: "Zagueiro",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  LEFT_BACK: {
    border: "border-emerald-500/20 hover:border-emerald-400/50",
    text: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.12)",
    label: "Lateral Esquerdo",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  RIGHT_BACK: {
    border: "border-emerald-500/20 hover:border-emerald-400/50",
    text: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.12)",
    label: "Lateral Direito",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  MIDFIELDER: {
    border: "border-cyan-500/20 hover:border-cyan-400/50",
    text: "text-cyan-400",
    glow: "rgba(6, 182, 212, 0.12)",
    label: "Meio-campista",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
  DEFENSIVE_MIDFIELDER: {
    border: "border-cyan-500/20 hover:border-cyan-400/50",
    text: "text-cyan-400",
    glow: "rgba(6, 182, 212, 0.12)",
    label: "Volante",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
  FORWARD: {
    border: "border-rose-500/20 hover:border-rose-400/50",
    text: "text-rose-400",
    glow: "rgba(244, 63, 94, 0.12)",
    label: "Atacante",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
  LEFT_WINGER: {
    border: "border-rose-500/20 hover:border-rose-400/50",
    text: "text-rose-400",
    glow: "rgba(244, 63, 94, 0.12)",
    label: "Ponta Esquerda",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
  RIGHT_WINGER: {
    border: "border-rose-500/20 hover:border-rose-400/50",
    text: "text-rose-400",
    glow: "rgba(244, 63, 94, 0.12)",
    label: "Ponta Direito",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/30",
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
        "--brand-soft": `rgba(${primaryRgb}, 0.1)`,
        "--brand-neon": themeSecondary,
      } as React.CSSProperties}
    >
      {/* Background Gradients utilizing custom colors */}
      <div 
        className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-15"
        style={{
          background: `radial-gradient(circle at 50% 20%, rgba(var(--team-primary-rgb), 0.7) 0%, transparent 60%)`,
        }}
      />
      <div className="absolute top-[500px] right-[-10%] w-[500px] h-[500px] pointer-events-none opacity-5 rounded-full filter blur-[120px] bg-cyan-500" />
      <div className="absolute bottom-[300px] left-[-10%] w-[500px] h-[500px] pointer-events-none opacity-5 rounded-full filter blur-[120px] bg-[var(--team-primary)]" />

      {/* Public Navbar */}
      <PublicNavbar teamName={team.name} badgeUrl={team.badgeUrl} slug={team.slug} />

      {/* Premium Editorial Sports Hero */}
      <header className="relative overflow-hidden px-4 pb-28 pt-12 lg:pb-36 lg:pt-20">
        <div className="relative mx-auto mt-4 grid max-w-6xl gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded border border-[var(--border)] bg-[#0f1418] px-3.5 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-[var(--brand)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand)]"></span>
              </span>
              <span>⭐ {team.competitiveLevel ? competitiveLevelLabels[team.competitiveLevel] : "Competitivo"}</span>
            </div>

            <h1 className="text-balance text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl uppercase tracking-tight font-mono">
              <span className="block text-white">PORTAL OFICIAL</span>
              <span className="block text-[var(--brand)]">{team.name}</span>
            </h1>
            
            {team.description && (
              <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[#94a3b8] font-medium border-l-2 border-[var(--brand)] pl-4">
                {team.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-mono text-[#8fa39b] font-semibold">
              {team.city && (
                <div className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{team.city}{team.region ? ` - ${team.region}` : ""}</span>
                </div>
              )}
              {team.defaultVenue && (
                <div className="flex items-center gap-1.5">
                  <span>🏟️</span>
                  <span>{team.defaultVenue}</span>
                </div>
              )}
              {team.fieldType && (
                <div className="flex items-center gap-1.5">
                  <span>🌱</span>
                  <span>{fieldTypeLabels[team.fieldType]}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#elenco"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--brand)] px-8 py-3 text-xs font-black uppercase tracking-wider text-[#090d0f] transition-all hover:bg-[var(--brand-strong)] hover:-translate-y-0.5 active:translate-y-0 duration-150 shadow"
              >
                Conhecer Elenco
              </a>
              <a
                href="#amistoso"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--border)] bg-[#0f1418] hover:bg-[#13191c] px-8 py-3 text-xs font-black uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 active:translate-y-0 duration-150"
              >
                Desafiar Equipe
              </a>
            </div>
          </div>

          <aside className="relative overflow-hidden max-w-md rounded-md border border-[var(--border)] bg-[#0f1418] p-8 shadow-xl lg:ml-auto lg:w-full space-y-6">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--brand)]" />
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0 rounded-full bg-black/60 flex items-center justify-center border border-white/10 overflow-hidden">
                {team.badgeUrl ? (
                  <img 
                    src={team.badgeUrl} 
                    alt={`Escudo do ${team.name}`} 
                    className="w-full h-full object-cover p-1.5"
                  />
                ) : (
                  <span className="text-xl font-black text-white font-mono uppercase tracking-widest">
                    {team.shortName || team.name.substring(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Status da Temporada</p>
                <p className="mt-1 text-xl font-black tracking-tight text-white uppercase">{summaryLine}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-md border border-[var(--border)] bg-[#090d0f] p-5">
                <p className="font-mono text-[9px] text-[#94a3b8] font-black uppercase tracking-wider">Aproveitamento Geral</p>
                <p className="text-4xl font-black text-[var(--brand)] mt-1 tracking-tight">{winRate}%</p>
              </div>
              <div className="rounded-md border border-[var(--border)] bg-[#090d0f] p-5">
                <p className="font-mono text-[9px] text-[#94a3b8] font-black uppercase tracking-wider">Ataque Produtivo</p>
                <p className="text-4xl font-black text-white mt-1 tracking-tight">
                  {avgGoalsScored} <span className="text-xs font-bold text-[#94a3b8] uppercase font-sans">/ jogo</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Core Stats Bar */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 -mt-24 relative z-10">
          <div className="app-surface p-6 hover:border-[var(--brand)] shadow-lg card-hover">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa39b]">Atletas Integrados</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-white">{team.players.length}</p>
            <p className="mt-1 text-xs text-[#8fa39b] font-medium">Integrados ao elenco principal</p>
          </div>

          <div className="app-surface p-6 hover:border-[var(--brand)] shadow-lg card-hover">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa39b]">Jogos Realizados</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-white">{totalGames}</p>
            <p className="mt-1 text-xs text-[#8fa39b] font-medium">Partidas computadas na temporada</p>
          </div>

          <div className="app-surface p-6 hover:border-[var(--brand)] shadow-lg card-hover">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa39b]">Saldo de Gols</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-white">{goalBalance >= 0 ? `+${goalBalance}` : goalBalance}</p>
            <p className="mt-1 text-xs text-[#8fa39b] font-medium">
              {goalsScored} pró · {goalsConceded} contra
            </p>
          </div>

          <div className="app-surface p-6 hover:border-[var(--brand)] shadow-lg card-hover">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa39b]">Gols na Temporada</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-[var(--brand)]">{goalsScored}</p>
            <p className="mt-1 text-xs text-[#8fa39b] font-medium">
              Marcados em confrontos oficiais
            </p>
          </div>
        </section>

        {/* Dynamic Highlights Panel (Hall of Fame) */}
        <section id="destaques" className="scroll-mt-24 space-y-6">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight font-mono">Estrelas da Temporada</h2>
              <p className="text-xs text-[#94a3b8] font-medium">Os destaques estatísticos e atletas em evidência na arena</p>
            </div>
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[var(--brand)]">Hall da Fama</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Highlight 1: Artilheiro */}
            <div className="rounded-md border border-[var(--border)] bg-[#0f1418] p-6 flex flex-col justify-between min-h-[220px] transition-colors hover:border-[#ffffff/15] group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">⚽ Artilheiro</span>
                  <span className="font-mono text-[9px] font-black bg-[var(--brand-soft)] text-[var(--brand)] px-2 py-0.5 rounded border border-[var(--brand-soft)]">GOLS</span>
                </div>
                <p className="mt-4 text-5xl font-black tracking-tight text-white font-mono">{bestScorer?.goals || 0}</p>
                <p className="mt-1 font-mono text-[9px] font-black text-[#64748b] uppercase tracking-widest">Gols marcados</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                {bestScorer?.photoUrl ? (
                  <img src={bestScorer.photoUrl} alt="Foto" className="h-10 w-10 rounded-md object-cover border border-[var(--border)] shadow-sm" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-[#090d0f] border border-[var(--border)] flex items-center justify-center font-mono font-black text-white text-xs">
                    #{bestScorer?.shirtNumber ?? "—"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-white uppercase truncate tracking-tight group-hover:text-[var(--brand)] transition-colors">{bestScorer?.playerName || "Sem registro"}</p>
                  <p className="font-mono text-[9px] text-[#94a3b8] font-bold truncate mt-0.5">
                    {bestScorer ? `Camisa #${bestScorer.shirtNumber}` : "Aguardando gols"}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 2: Assistência */}
            <div className="rounded-md border border-[var(--border)] bg-[#0f1418] p-6 flex flex-col justify-between min-h-[220px] transition-colors hover:border-[#ffffff/15] group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">🎯 Garçom</span>
                  <span className="font-mono text-[9px] font-black bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">PASSE</span>
                </div>
                <p className="mt-4 text-5xl font-black tracking-tight text-white font-mono">{bestAssist?.assists || 0}</p>
                <p className="mt-1 font-mono text-[9px] font-black text-[#64748b] uppercase tracking-widest">Assistências</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                {bestAssist?.photoUrl ? (
                  <img src={bestAssist.photoUrl} alt="Foto" className="h-10 w-10 rounded-md object-cover border border-[var(--border)] shadow-sm" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-[#090d0f] border border-[var(--border)] flex items-center justify-center font-mono font-black text-white text-xs">
                    #{bestAssist?.shirtNumber ?? "—"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-white uppercase truncate tracking-tight group-hover:text-cyan-400 transition-colors">{bestAssist?.playerName || "Sem registro"}</p>
                  <p className="font-mono text-[9px] text-[#94a3b8] font-bold truncate mt-0.5">
                    {bestAssist ? `Camisa #${bestAssist.shirtNumber}` : "Aguardando passes"}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 3: Presença */}
            <div className="rounded-md border border-[var(--border)] bg-[#0f1418] p-6 flex flex-col justify-between min-h-[220px] transition-colors hover:border-[#ffffff/15] group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">📅 Mais Presente</span>
                  <span className="font-mono text-[9px] font-black bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">JOGOS</span>
                </div>
                <p className="mt-4 text-5xl font-black tracking-tight text-white font-mono">{bestPresence?.matches || 0}</p>
                <p className="mt-1 font-mono text-[9px] font-black text-[#64748b] uppercase tracking-widest">Presenças em campo</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                {bestPresence?.photoUrl ? (
                  <img src={bestPresence.photoUrl} alt="Foto" className="h-10 w-10 rounded-md object-cover border border-[var(--border)] shadow-sm" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-[#090d0f] border border-[var(--border)] flex items-center justify-center font-mono font-black text-white text-xs">
                    #{bestPresence?.shirtNumber ?? "—"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-white uppercase truncate tracking-tight group-hover:text-amber-400 transition-colors">{bestPresence?.playerName || "Sem registro"}</p>
                  <p className="font-mono text-[9px] text-[#94a3b8] font-bold truncate mt-0.5">
                    {bestPresence ? `Camisa #${bestPresence.shirtNumber}` : "Aguardando partidas"}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 4: Melhor Avaliado */}
            <div className="rounded-md border border-[var(--border)] bg-[#0f1418] p-6 flex flex-col justify-between min-h-[220px] transition-colors hover:border-[#ffffff/15] group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">⭐ Melhor Nota</span>
                  <span className="font-mono text-[9px] font-black bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/20">AVALIAÇÃO</span>
                </div>
                <p className="mt-4 text-5xl font-black tracking-tight text-white font-mono">{bestRated?.averageStars?.toFixed(1) || "0.0"}</p>
                <p className="mt-1 font-mono text-[9px] font-black text-[#64748b] uppercase tracking-widest">Média de estrelas</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                {bestRated?.photoUrl ? (
                  <img src={bestRated.photoUrl} alt="Foto" className="h-10 w-10 rounded-md object-cover border border-[var(--border)] shadow-sm" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-[#090d0f] border border-[var(--border)] flex items-center justify-center font-mono font-black text-white text-xs">
                    #{bestRated?.shirtNumber ?? "—"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-white uppercase truncate tracking-tight group-hover:text-violet-400 transition-colors">{bestRated?.playerName || "Sem registro"}</p>
                  <p className="font-mono text-[9px] text-[#94a3b8] font-bold truncate mt-0.5">
                    {bestRated ? `${bestRated.totalRatings} avaliações` : "Aguardando votos"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MATCHES SECTION (3-LEVEL TIMELINE) */}
        <section id="retrospecto" className="space-y-6 scroll-mt-24">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight font-mono">Linha do Tempo de Partidas</h2>
              <p className="text-xs text-[#94a3b8] font-medium">Os compromissos agendados e histórico recente de confrontos</p>
            </div>
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[var(--brand)]">Agenda & Resultados</p>
          </div>

          <div className="space-y-8">
            {/* LEVEL 1: Próximo Jogo (Highlighted at the top) */}
            {nextMatch && (
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                  </span>
                  PRÓXIMO COMPROMISSO
                </span>
                
                <div className="match-ticket p-6 shadow-xl relative overflow-hidden bg-[#0f1418]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 border border-blue-500/20 rounded">
                          {nextMatch.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                        </span>
                        <span className="font-mono text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider">
                          {new Date(nextMatch.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight mt-3 uppercase flex items-center flex-wrap gap-2.5">
                        <span>{team.shortName || team.name}</span>
                        <span className="text-[#64748b] font-normal text-sm lowercase font-sans">vs</span>
                        <span className="text-[var(--brand-neon)]">{nextMatch.opponent}</span>
                      </h3>
                      <p className="text-xs text-[#94a3b8] font-mono font-semibold mt-2.5 flex items-center gap-1.5">
                        <span>📍</span>
                        <span>{nextMatch.venue}</span>
                      </p>
                    </div>
                    <span 
                      className="font-mono text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded shrink-0 text-center w-full sm:w-auto border border-blue-500/25 text-blue-400 bg-blue-500/5"
                    >
                      Agendado
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 2: Partidas Finalizadas (chronological descending) */}
            <div className="space-y-4">
              <h3 className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-3 py-1 rounded border border-[#34d399]/20 w-fit">
                🏆 HISTÓRICO DE RESULTADOS
              </h3>
              {finishedMatches.length === 0 ? (
                <div className="rounded-md border border-[var(--border)] p-12 text-center text-[#94a3b8] font-mono text-xs uppercase font-bold bg-black/20 border-dashed">
                  Nenhum jogo disputado registrado.
                </div>
              ) : (
                <div className="grid gap-4">
                  {finishedMatches.map((match) => {
                    const isCancelled = match.status === "CANCELLED";
                    const win = match.homeScore !== null && match.awayScore !== null && (
                      match.isHome ? match.homeScore > match.awayScore : match.awayScore > match.homeScore
                    );
                    const draw = match.homeScore !== null && match.awayScore !== null && match.homeScore === match.awayScore;
                    
                    let badgeColor = "bg-white/5 text-[#94a3b8] border-white/5";
                    let resultLabel = "Empate";
                    
                    if (isCancelled) {
                      resultLabel = "Cancelado";
                      badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                    } else if (win) {
                      resultLabel = "Vitória";
                      badgeColor = "bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand-soft)]";
                    } else if (!draw) {
                      resultLabel = "Derrota";
                      badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                    }

                    return (
                      <div key={match.id} className="app-surface p-5 hover:border-[var(--brand)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 card-hover">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] font-black bg-white/5 text-[#94a3b8] px-2 py-0.5 border border-white/10 rounded">
                              {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                            </span>
                            <span className="font-mono text-[10px] text-[#94a3b8] font-bold">
                              {new Date(match.date).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-lg font-black text-white mt-2 flex items-center gap-3 uppercase font-mono">
                            <span>{team.shortName || team.name}</span>
                            {!isCancelled && match.homeScore !== null && match.awayScore !== null ? (
                              <span className="font-black font-mono text-white bg-black/60 px-3 py-0.5 rounded border border-white/5 text-sm sm:text-base">
                                {match.isHome 
                                  ? `${match.homeScore} - ${match.awayScore}`
                                  : `${match.awayScore} - ${match.homeScore}`
                                }
                              </span>
                            ) : (
                              <span className="text-[#64748b] font-normal lowercase text-xs font-sans">vs</span>
                            )}
                            <span className="text-[var(--brand-neon)]">{match.opponent}</span>
                          </p>
                          <p className="text-xs text-[#94a3b8] font-mono mt-1 flex items-center gap-1">
                            <span>📍</span>
                            <span>{match.venue}</span>
                          </p>
                        </div>
                        <span className={`font-mono text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded border shrink-0 text-center w-full sm:w-auto ${badgeColor}`}>
                          {resultLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LEVEL 3: Outros Jogos Agendados (chronological ascending) */}
            {remainingScheduled.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20 w-fit">
                  🗓️ OUTROS COMPROMISSOS FUTUROS
                </h3>
                <div className="grid gap-4">
                  {remainingScheduled.map((match) => (
                    <div key={match.id} className="app-surface p-5 hover:border-[var(--brand)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 card-hover">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-black bg-white/5 text-[#94a3b8] px-2 py-0.5 border border-white/10 rounded">
                            {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                          </span>
                          <span className="font-mono text-[10px] text-[#94a3b8] font-bold">
                            {new Date(match.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-lg font-black text-white mt-2 flex items-center gap-3 uppercase font-mono">
                          <span>{team.shortName || team.name}</span>
                          <span className="text-[#64748b] font-normal lowercase text-xs font-sans">vs</span>
                          <span className="text-[var(--brand-neon)]">{match.opponent}</span>
                        </p>
                        <p className="text-xs text-[#94a3b8] font-mono mt-1 flex items-center gap-1">
                          <span>📍</span>
                          <span>{match.venue}</span>
                        </p>
                      </div>
                      <span className="font-mono text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded bg-white/5 border border-white/10 shrink-0 text-center w-full sm:w-auto text-[#94a3b8]">
                        Agendado
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ELENCO OFICIAL (SQUAD DOSSIER) */}
        <section id="elenco" className="scroll-mt-24 space-y-6">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight font-mono">Guerreiros do Elenco</h2>
              <p className="text-xs text-[#94a3b8] font-medium mt-1">Nossos atletas que defendem as cores do clube oficialmente</p>
            </div>
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">
              {team.players.length} Inscritos
            </p>
          </div>

          {team.players.length === 0 ? (
            <div className="rounded-md border border-[var(--border)] p-12 text-center text-[#94a3b8] text-sm border-dashed">
              Nenhum jogador cadastrado ou ativo no elenco.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.players.map((player) => {
                const theme = positionThemes[player.position] || {
                  border: "border-white/10 hover:border-white/30",
                  text: "text-[#94a3b8]",
                  glow: "rgba(255, 255, 255, 0.05)",
                  label: player.position,
                  badge: "bg-white/5 text-[#94a3b8] border-white/10",
                };

                return (
                  <Link
                    key={player.id}
                    href={`/jogadores/${player.id}`}
                    className="group block"
                    aria-label={`Ver perfil de ${player.name}`}
                  >
                    <article className="athlete-card">
                      {/* Image Container / Empty State Dossier Banner */}
                      <div className="athlete-img-container">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-b from-[#13191c] to-[#090d0f] relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--team-primary-rgb),0.08),transparent_80%)] pointer-events-none" />
                            <span className="font-mono text-[10rem] font-black text-white/5 tracking-tighter select-none">
                              {player.shirtNumber}
                            </span>
                            <span className="absolute bottom-6 font-mono text-[10px] font-black uppercase tracking-widest text-[#94a3b8] border border-[var(--border)] bg-[#0f1418]/80 px-3 py-1 rounded">
                              Ficha Técnica
                            </span>
                          </div>
                        )}
                        {/* Jersey Number Over Badge */}
                        <div className="absolute top-4 right-4 h-10 w-10 bg-[#090d0f]/90 border border-[var(--border)] rounded-md flex items-center justify-center font-mono font-black text-white shadow">
                          #{player.shirtNumber}
                        </div>
                      </div>

                      {/* Info and Details */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex rounded border px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest ${theme.badge}`}>
                            {theme.label}
                          </span>
                          <span className="font-mono text-[9px] text-[#64748b] font-bold uppercase tracking-widest">
                            Elenco Oficial
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="font-mono text-xl font-black text-white uppercase tracking-tight group-hover:text-[var(--team-primary)] transition-colors duration-150 truncate">
                            {player.name}
                          </h3>
                          <p className="font-mono text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest">
                            Camisa #{player.shirtNumber}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
                          <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider">
                            Ver Perfil Completo
                          </span>
                          <span className="font-mono text-[10px] font-black text-[var(--brand)] transition-transform group-hover:translate-x-1">
                            &rarr;
                          </span>
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
          <section id="agenda-aberta" className="scroll-mt-24 rounded-md border border-[var(--border)] bg-[#0f1418] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
              <div>
                <p className="font-mono text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">Disponibilidade de Arena</p>
                <h2 className="mt-1.5 font-mono text-2xl font-black uppercase text-white tracking-tight">Datas Disponíveis para Amistoso</h2>
              </div>
              {team.openMatchSlots.length > 0 && (
                <span className="rounded border border-[var(--brand-soft)] bg-[var(--brand-soft)] px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-[var(--brand)]">
                  {team.openMatchSlots.length} Horário(s) Aberto(s)
                </span>
              )}
            </div>

            {hasDiscoveryInfo && (
              <div className="flex flex-wrap gap-2">
                {team.city && (
                  <span className="rounded border border-[var(--border)] bg-[#090d0f] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    Cidade: {team.city}
                  </span>
                )}
                {team.region && (
                  <span className="rounded border border-[var(--border)] bg-[#090d0f] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    Região: {team.region}
                  </span>
                )}
                {team.fieldType && (
                  <span className="rounded border border-[var(--border)] bg-[#090d0f] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    Campo: {fieldTypeLabels[team.fieldType]}
                  </span>
                )}
                {team.competitiveLevel && (
                  <span className="rounded border border-[var(--border)] bg-[#090d0f] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    Nível: {competitiveLevelLabels[team.competitiveLevel]}
                  </span>
                )}
              </div>
            )}

            {team.openMatchSlots.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 pt-2">
                {team.openMatchSlots.map((slot) => (
                  <article key={slot.id} className="rounded-md border border-[var(--border)] bg-[#090d0f] p-6 flex flex-col justify-between shadow transition-colors hover:border-white/10 group">
                    <div className="space-y-2">
                      <p className="font-mono text-base font-black text-white uppercase tracking-tight">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(slot.date)}
                      </p>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                        {(slot.timeLabel || "Horário a definir") + " • " + (slot.venueLabel || "Local a definir")}
                      </p>
                      {slot.notes && <p className="font-mono text-[10px] text-[#64748b] italic pt-1">Nota: {slot.notes}</p>}
                    </div>
                    <Link
                      href={`/${team.slug}?slot=${slot.id}#amistoso`}
                      className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[#090d0f] text-[10px] font-black uppercase tracking-wider px-6 transition-all duration-150 shadow-sm"
                    >
                      Propor jogo neste horário
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="font-mono text-xs text-[#94a3b8] pt-2 font-bold uppercase tracking-wide">
                No momento não temos datas abertas cadastradas, mas você pode sugerir um dia e local no formulário abaixo!
              </p>
            )}
          </section>
        )}

        {/* FORMS SECTION (AMISTOSO / RECRUTAMENTO SPLIT) */}
        <section id="amistoso" className="scroll-mt-24 grid gap-8 lg:grid-cols-2">
          
          {/* Friendly Request Form Card */}
          <div className="rounded-md border border-[var(--border)] bg-[#0f1418] p-6 sm:p-8 flex flex-col space-y-6">
            <div className="space-y-4">
              <span className="rounded border border-[var(--brand-soft)] bg-[var(--brand-soft)] px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-[var(--brand)]">
                AMISTOSO
              </span>
              <h2 className="font-mono text-balance text-3xl font-black uppercase text-white tracking-tight mt-2">
                Desafie o {team.name}
              </h2>
              <p className="text-xs leading-relaxed text-[#94a3b8] font-semibold uppercase tracking-wide">
                Representa outra equipe e quer agendar um confronto contra o {team.name}? Envie os detalhes do local, horário e proposta e nossa comissão responderá!
              </p>
            </div>
            
            {selectedSlot && (
              <div className="rounded border border-[var(--brand-soft)] bg-[var(--brand-soft)] px-4 py-3 font-mono text-[10px] text-[var(--brand)] font-bold animate-fade-in uppercase tracking-wider">
                🎯 Agendando proposta com base no horário aberto de {selectedSlotDateText}.
              </div>
            )}
            
            <FriendlyRequestForm 
              teamSlug={team.slug}
              initialSuggestedDates={suggestedDatesInitialValue}
              initialSuggestedVenue={suggestedVenueInitialValue}
            />
          </div>

          {/* Recruitment Form Card */}
          <div className="rounded-md border border-[var(--border)] bg-[#0f1418] p-6 sm:p-8 flex flex-col space-y-6">
            <div className="space-y-4">
              <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-cyan-400">
                RECRUTAMENTO
              </span>
              <h2 className="font-mono text-balance text-3xl font-black uppercase text-white tracking-tight mt-2">
                Faça Parte do Elenco
              </h2>
              <p className="text-xs leading-relaxed text-[#94a3b8] font-semibold uppercase tracking-wide">
                {team.publicDirectoryOptIn 
                  ? `Quer vestir a camisa do ${team.name} e mostrar seu futebol? Deixe seus dados abaixo para a comissão técnica avaliar!`
                  : `O recrutamento público está atualmente fechado para esta equipe no momento.`
                }
              </p>
            </div>

            {team.publicDirectoryOptIn ? (
              <RecruitmentForm teamSlug={team.slug} />
            ) : (
              <div className="rounded-md border border-[var(--border)] bg-[#090d0f] p-8 text-center text-[#94a3b8] flex flex-col justify-center items-center min-h-[250px]">
                <span className="text-3xl mb-3">🔒</span>
                <p className="font-mono text-sm font-black text-white uppercase tracking-wider">Recrutamento Suspenso</p>
                <p className="font-mono text-[10px] text-[#64748b] font-bold uppercase tracking-wider mt-2 max-w-xs mx-auto">
                  Esta equipe optou por não aceitar novas candidaturas de recrutamento público no momento.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Identity Details */}
        {(team.primaryColor || team.secondaryColor) && (
          <section className="text-center pt-4 space-y-6">
            <h2 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Manto e Cores Oficiais</h2>
            <div className="flex justify-center gap-6">
              {team.primaryColor && (
                <div className="flex items-center gap-3 bg-[#0f1418] border border-[var(--border)] rounded-md px-5 py-2.5 shadow-md">
                  <div className="h-6 w-6 rounded-md border border-white/10 shadow-sm" style={{ backgroundColor: team.primaryColor }} />
                  <span className="font-mono text-[10px] font-black uppercase text-white tracking-widest">Manto Principal</span>
                </div>
              )}
              {team.secondaryColor && (
                <div className="flex items-center gap-3 bg-[#0f1418] border border-[var(--border)] rounded-md px-5 py-2.5 shadow-md">
                  <div className="h-6 w-6 rounded-md border border-white/10 shadow-sm" style={{ backgroundColor: team.secondaryColor }} />
                  <span className="font-mono text-[10px] font-black uppercase text-white tracking-widest">Manto Reserva</span>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl mt-24 border-t border-[rgba(255,255,255,0.08)] px-4 pt-10 text-center text-xs font-semibold text-[#64748b] sm:px-6 lg:px-8 space-y-2">
        <p>&copy; {new Date().getFullYear()} {team.name}. Todos os direitos reservados.</p>
        <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-black font-mono">Plataforma Esportiva Premium VARzea</p>
      </footer>
    </div>
  );
}
