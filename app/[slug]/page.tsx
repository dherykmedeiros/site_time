import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FriendlyRequestForm } from "@/app/FriendlyRequestForm";
import { RecruitmentForm } from "@/app/RecruitmentForm";
import { PublicNavbar } from "@/components/PublicNavbar";

interface PageProps {
  params: Promise<{ slug: string }>;
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

export default async function TeamPublicPage({ params }: PageProps) {
  const { slug } = await params;

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

  return (
    <div 
      className="min-h-screen text-[#f0f7f4] relative overflow-hidden bg-[#030708] pb-24 font-sans selection:bg-[var(--team-primary)] selection:text-[#020506] antialiased"
      style={{
        "--team-primary": themePrimary,
        "--team-secondary": themeSecondary,
        "--team-primary-rgb": primaryRgb,
        "--team-secondary-rgb": secondaryRgb,
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

      {/* Public Glassmorphic Navbar aware of slug */}
      <PublicNavbar teamName={team.name} badgeUrl={team.badgeUrl} slug={team.slug} />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10 space-y-24">
        
        {/* HERO SECTION */}
        <section className="app-surface p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden bg-gradient-to-br from-[rgba(10,20,24,0.7)] to-[rgba(var(--team-primary-rgb),0.02)] border-[rgba(var(--team-primary-rgb),0.2)]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--team-secondary)] to-transparent opacity-60 animate-pulse" />
          
          {/* Badge with glowing boundary */}
          <div className="relative group shrink-0">
            <div 
              className="absolute -inset-1 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" 
              style={{
                background: `linear-gradient(to right, var(--team-primary), var(--team-secondary))`,
              }}
            />
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-black/80 flex items-center justify-center border-2 border-white/10 overflow-hidden">
              {team.badgeUrl ? (
                <img 
                  src={team.badgeUrl} 
                  alt={`Escudo do ${team.name}`} 
                  className="w-full h-full object-cover p-2"
                />
              ) : (
                <span className="text-4xl md:text-5xl font-black text-white font-mono uppercase tracking-widest text-neon-gradient">
                  {team.shortName || team.name.substring(0, 3).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Info Details */}
          <div className="text-center md:text-left space-y-4 max-w-2xl">
            <div className="space-y-1">
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium border"
                style={{
                  backgroundColor: `rgba(var(--team-primary-rgb), 0.15)`,
                  borderColor: `rgba(var(--team-primary-rgb), 0.3)`,
                  color: `var(--team-secondary)`,
                }}
              >
                ⭐ {team.competitiveLevel ? competitiveLevelLabels[team.competitiveLevel] : "Competitivo"}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mt-2 uppercase">
                {team.name}
              </h1>
            </div>

            {team.description && (
              <p className="text-[#8fa39b] text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                {team.description}
              </p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm font-mono text-[#8fa39b] font-semibold">
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
          </div>

          {/* Decorative Team Color Flags */}
          <div className="absolute top-0 right-0 flex gap-2 p-4">
            <div className="w-4.5 h-14 rounded-b shadow" style={{ backgroundColor: themePrimary }} />
            <div className="w-4.5 h-9 rounded-b shadow" style={{ backgroundColor: themeSecondary }} />
          </div>
        </section>

        {/* CORE STATS BAR */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="app-surface p-6 text-center bg-black/40 border-[rgba(var(--team-primary-rgb),0.15)] hover:border-[rgba(var(--team-primary-rgb),0.4)] card-hover">
            <p className="text-[10px] font-bold text-[#8fa39b] uppercase tracking-wider">Partidas</p>
            <p className="text-3xl md:text-4xl font-black text-white mt-2 tracking-tight">{totalGames}</p>
          </div>
          <div 
            className="app-surface p-6 text-center bg-black/40 border-l-4 card-hover"
            style={{ borderLeftColor: themePrimary, borderColor: `rgba(var(--team-primary-rgb), 0.15)` }}
          >
            <p className="text-[10px] font-bold text-[#8fa39b] uppercase tracking-wider">Vitórias</p>
            <p className="text-3xl md:text-4xl font-black mt-2 tracking-tight text-[#34d399]">{wins}</p>
          </div>
          <div className="app-surface p-6 text-center bg-black/40 border-l-4 border-l-gray-600 border-[rgba(var(--team-primary-rgb),0.15)] hover:border-[rgba(var(--team-primary-rgb),0.4)] card-hover">
            <p className="text-[10px] font-bold text-[#8fa39b] uppercase tracking-wider">Empates</p>
            <p className="text-3xl md:text-4xl font-black mt-2 tracking-tight text-[#8fa39b]">{draws}</p>
          </div>
          <div className="app-surface p-6 text-center bg-black/40 border-l-4 border-l-red-500 border-[rgba(var(--team-primary-rgb),0.15)] hover:border-[rgba(var(--team-primary-rgb),0.4)] card-hover">
            <p className="text-[10px] font-bold text-[#8fa39b] uppercase tracking-wider">Derrotas</p>
            <p className="text-3xl md:text-4xl font-black mt-2 tracking-tight text-red-400">{losses}</p>
          </div>
          <div className="app-surface p-6 text-center col-span-2 md:col-span-1 bg-black/40 border-[rgba(var(--team-primary-rgb),0.15)] hover:border-[rgba(var(--team-primary-rgb),0.4)] card-hover flex flex-col justify-center items-center">
            <p className="text-[10px] font-bold text-[#8fa39b] uppercase tracking-wider">Aproveitamento</p>
            <div className="mt-2 flex items-baseline gap-0.5">
              <span className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: themeSecondary }}>{winRate}</span>
              <span className="text-xs font-bold text-[#8fa39b]">%</span>
            </div>
          </div>
        </section>

        {/* Goals Detail row */}
        <section id="retrospecto" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
          <div className="app-surface p-5 flex justify-between items-center bg-black/40 border-[rgba(var(--team-primary-rgb),0.15)] hover:border-[rgba(var(--team-primary-rgb),0.4)] card-hover">
            <div className="flex items-center gap-4">
              <span className="text-3xl">⚽</span>
              <div>
                <p className="text-xs font-bold text-[#8fa39b] uppercase tracking-wider">Gols Marcados</p>
                <p className="text-2xl font-black text-white tracking-tight mt-1">{goalsScored}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#8fa39b] bg-white/5 border border-white/10 px-3 py-1 rounded-full">Média {avgGoalsScored} / jogo</span>
          </div>
          <div className="app-surface p-5 flex justify-between items-center bg-black/40 border-[rgba(var(--team-primary-rgb),0.15)] hover:border-[rgba(var(--team-primary-rgb),0.4)] card-hover">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🛡️</span>
              <div>
                <p className="text-xs font-bold text-[#8fa39b] uppercase tracking-wider">Gols Sofridos</p>
                <p className="text-2xl font-black text-white tracking-tight mt-1">{goalsConceded}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#8fa39b] bg-white/5 border border-white/10 px-3 py-1 rounded-full">Média {avgGoalsConceded} / jogo</span>
          </div>
        </section>

        {/* Dynamic Highlights Panel (Hall of Fame) */}
        <section id="destaques" className="space-y-6">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">Estrelas da Temporada</h2>
              <p className="text-xs text-[#8fa39b] font-medium">Os principais atletas da nossa comissão técnica nos rankings</p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: themeSecondary }}>Hall da Fama</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Highlight 1: Artilheiro */}
            <div 
              className="app-surface relative overflow-hidden p-6 flex flex-col justify-between min-h-[220px] card-hover bg-gradient-to-br from-[rgba(10,20,24,0.7)] to-[rgba(var(--team-primary-rgb),0.02)]"
              style={{ borderColor: `rgba(var(--team-primary-rgb), 0.15)` }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">⚽ Artilheiro</span>
                  <span className="text-xs font-mono font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10" style={{ color: themeSecondary }}>GOLS</span>
                </div>
                <p className="mt-4 text-5xl font-black tracking-tight text-white">{bestScorer?.goals || 0}</p>
                <p className="mt-0.5 text-[10px] font-bold text-[#8fa39b] uppercase tracking-wider">Gols marcados</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                {bestScorer?.photoUrl ? (
                  <img src={bestScorer.photoUrl} alt="Foto" className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                    #{bestScorer?.shirtNumber ?? "—"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-white uppercase truncate tracking-tight">{bestScorer?.playerName || "Sem registro"}</p>
                  <p className="text-[10px] text-[#8fa39b] font-medium truncate mt-0.5">
                    {bestScorer ? `Camisa #${bestScorer.shirtNumber}` : "Aguardando gols"}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 2: Assistência */}
            <div 
              className="app-surface relative overflow-hidden p-6 flex flex-col justify-between min-h-[220px] card-hover bg-gradient-to-br from-[rgba(10,20,24,0.7)] to-[rgba(var(--team-primary-rgb),0.02)]"
              style={{ borderColor: `rgba(var(--team-primary-rgb), 0.15)` }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">🎯 Garçom</span>
                  <span className="text-xs font-mono font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10" style={{ color: themeSecondary }}>PASSE</span>
                </div>
                <p className="mt-4 text-5xl font-black tracking-tight text-white">{bestAssist?.assists || 0}</p>
                <p className="mt-0.5 text-[10px] font-bold text-[#8fa39b] uppercase tracking-wider">Assistências</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                {bestAssist?.photoUrl ? (
                  <img src={bestAssist.photoUrl} alt="Foto" className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                    #{bestAssist?.shirtNumber ?? "—"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-white uppercase truncate tracking-tight">{bestAssist?.playerName || "Sem registro"}</p>
                  <p className="text-[10px] text-[#8fa39b] font-medium truncate mt-0.5">
                    {bestAssist ? `Camisa #${bestAssist.shirtNumber}` : "Aguardando passes"}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 3: Presença */}
            <div 
              className="app-surface relative overflow-hidden p-6 flex flex-col justify-between min-h-[220px] card-hover bg-gradient-to-br from-[rgba(10,20,24,0.7)] to-[rgba(var(--team-primary-rgb),0.02)]"
              style={{ borderColor: `rgba(var(--team-primary-rgb), 0.15)` }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">📅 Mais Presente</span>
                  <span className="text-xs font-mono font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10" style={{ color: themeSecondary }}>JOGOS</span>
                </div>
                <p className="mt-4 text-5xl font-black tracking-tight text-white">{bestPresence?.matches || 0}</p>
                <p className="mt-0.5 text-[10px] font-bold text-[#8fa39b] uppercase tracking-wider">Presenças em campo</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                {bestPresence?.photoUrl ? (
                  <img src={bestPresence.photoUrl} alt="Foto" className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                    #{bestPresence?.shirtNumber ?? "—"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-white uppercase truncate tracking-tight">{bestPresence?.playerName || "Sem registro"}</p>
                  <p className="text-[10px] text-[#8fa39b] font-medium truncate mt-0.5">
                    {bestPresence ? `Camisa #${bestPresence.shirtNumber}` : "Aguardando partidas"}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight 4: Melhor Avaliado */}
            <div 
              className="app-surface relative overflow-hidden p-6 flex flex-col justify-between min-h-[220px] card-hover bg-gradient-to-br from-[rgba(10,20,24,0.7)] to-[rgba(var(--team-primary-rgb),0.02)]"
              style={{ borderColor: `rgba(var(--team-primary-rgb), 0.15)` }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8fa39b]">⭐ Melhor Nota</span>
                  <span className="text-xs font-mono font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10" style={{ color: themeSecondary }}>AVALIAÇÃO</span>
                </div>
                <p className="mt-4 text-5xl font-black tracking-tight text-white">{bestRated?.averageStars?.toFixed(1) || "0.0"}</p>
                <p className="mt-0.5 text-[10px] font-bold text-[#8fa39b] uppercase tracking-wider">Média de estrelas</p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                {bestRated?.photoUrl ? (
                  <img src={bestRated.photoUrl} alt="Foto" className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                    #{bestRated?.shirtNumber ?? "—"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-white uppercase truncate tracking-tight">{bestRated?.playerName || "Sem registro"}</p>
                  <p className="text-[10px] text-[#8fa39b] font-medium truncate mt-0.5">
                    {bestRated ? `${bestRated.totalRatings} avaliações` : "Aguardando votos"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MATCHES SECTION (3-LEVEL TIMELINE) */}
        <section id="retrospecto" className="space-y-6 scroll-mt-24">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">Linha do Tempo de Partidas</h2>
              <p className="text-xs text-[#8fa39b] font-medium">Os compromissos agendados e histórico recente de confrontos</p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: themeSecondary }}>Agenda & Resultados</p>
          </div>

          <div className="space-y-8">
            {/* LEVEL 1: Próximo Jogo (Highlighted at the top) */}
            {nextMatch && (
              <div className="space-y-3">
                <span className="text-xs font-extrabold font-mono tracking-widest text-[#3b82f6] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">🎯 PRÓXIMO COMPROMISSO</span>
                <div 
                  className="app-surface p-6 bg-gradient-to-r from-[rgba(10,20,24,0.85)] to-[rgba(59,130,246,0.04)] border-[rgba(var(--team-primary-rgb),0.35)] shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold bg-[#3b82f6]/10 text-blue-400 px-2 py-0.5 border border-[#3b82f6]/20 rounded">
                          {nextMatch.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                        </span>
                        <span className="text-xs font-mono text-[#8fa39b] font-semibold">
                          {new Date(nextMatch.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-2xl font-black text-white tracking-tight mt-3 uppercase flex items-center flex-wrap gap-2.5">
                        <span>{team.shortName || team.name}</span>
                        <span className="text-[#8fa39b] font-normal text-sm lowercase">vs</span>
                        <span style={{ color: themeSecondary }}>{nextMatch.opponent}</span>
                      </p>
                      <p className="text-xs text-[#8fa39b] font-mono font-semibold mt-2.5 flex items-center gap-1.5">
                        <span>📍</span>
                        <span>{nextMatch.venue}</span>
                      </p>
                    </div>
                    <span 
                      className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shrink-0 text-center w-full sm:w-auto border border-blue-500/30 text-blue-400 bg-blue-500/10"
                    >
                      Agendado
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* LEVEL 2: Partidas Finalizadas (chronological descending) */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold font-mono tracking-widest text-[#34d399] bg-[#34d399]/10 px-3 py-1 rounded-full border border-[#34d399]/20 w-fit">🏆 HISTÓRICO DE RESULTADOS</h3>
              {finishedMatches.length === 0 ? (
                <div className="app-surface p-8 text-center text-[#8fa39b] bg-black/30 border border-dashed border-[#10b981]/10">
                  Nenhum jogo disputado registrado.
                </div>
              ) : (
                <div className="grid gap-4">
                  {finishedMatches.slice(0, 8).map((match) => {
                    const isCancelled = match.status === "CANCELLED";
                    const win = match.homeScore !== null && match.awayScore !== null && (
                      match.isHome ? match.homeScore > match.awayScore : match.awayScore > match.homeScore
                    );
                    const draw = match.homeScore !== null && match.awayScore !== null && match.homeScore === match.awayScore;
                    
                    let badgeColor = "bg-gray-500/10 text-gray-400 border-gray-500/20";
                    let resultLabel = "Empate";
                    
                    if (isCancelled) {
                      resultLabel = "Cancelado";
                      badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                    } else if (win) {
                      resultLabel = "Vitória";
                      badgeColor = "bg-emerald-500/15 text-[#34d399] border-emerald-500/30";
                    } else if (!draw) {
                      resultLabel = "Derrota";
                      badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                    }

                    return (
                      <div key={match.id} className="app-surface p-5 bg-black/40 border-[rgba(var(--team-primary-rgb),0.15)] hover:border-[rgba(var(--team-primary-rgb),0.35)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[rgba(var(--team-primary-rgb),0.02)] card-hover">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-white/5 text-[#8fa39b] px-2 py-0.5 border border-white/10 rounded">
                              {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                            </span>
                            <span className="text-xs font-mono text-[#8fa39b]">
                              {new Date(match.date).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-lg font-black text-white mt-2 flex items-center gap-3 uppercase">
                            <span>{team.shortName || team.name}</span>
                            {!isCancelled && match.homeScore !== null && match.awayScore !== null ? (
                              <span className="font-black font-mono text-white bg-black/60 px-3 py-0.5 rounded border border-white/5 text-sm sm:text-base">
                                {match.isHome 
                                  ? `${match.homeScore} - ${match.awayScore}`
                                  : `${match.awayScore} - ${match.homeScore}`
                                }
                              </span>
                            ) : (
                              <span className="text-gray-500 font-normal lowercase text-xs">vs</span>
                            )}
                            <span style={{ color: themeSecondary }}>{match.opponent}</span>
                          </p>
                          <p className="text-xs text-[#8fa39b] font-mono mt-1 flex items-center gap-1">
                            <span>📍</span>
                            <span>{match.venue}</span>
                          </p>
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border shrink-0 text-center w-full sm:w-auto ${badgeColor}`}>
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
                <h3 className="text-xs font-extrabold font-mono tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">🗓️ OUTROS COMPROMISSOS FUTUROS</h3>
                <div className="grid gap-4">
                  {remainingScheduled.map((match) => (
                    <div key={match.id} className="app-surface p-5 bg-black/40 border-[rgba(var(--team-primary-rgb),0.15)] hover:border-[rgba(var(--team-primary-rgb),0.35)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[rgba(var(--team-primary-rgb),0.02)] card-hover">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-white/5 text-[#8fa39b] px-2 py-0.5 border border-white/10 rounded">
                            {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                          </span>
                          <span className="text-xs font-mono text-[#8fa39b]">
                            {new Date(match.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-lg font-black text-white mt-2 flex items-center gap-3 uppercase">
                          <span>{team.shortName || team.name}</span>
                          <span className="text-[#8fa39b] font-normal lowercase text-xs">vs</span>
                          <span style={{ color: themeSecondary }}>{match.opponent}</span>
                        </p>
                        <p className="text-xs text-[#8fa39b] font-mono mt-1 flex items-center gap-1">
                          <span>📍</span>
                          <span>{match.venue}</span>
                        </p>
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full bg-white/5 border border-white/10 shrink-0 text-center w-full sm:w-auto text-[#8fa39b]">
                        Agendado
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ELENCO OFICIAL (FUT TRADING CARDS) */}
        <section id="elenco" className="scroll-mt-24 space-y-6">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">Guerreiros do Elenco</h2>
              <p className="text-xs text-[#8fa39b] font-medium mt-1">Nossos atletas que defendem as cores do clube oficialmente</p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: themeSecondary }}>
              {team.players.length} Inscritos
            </p>
          </div>

          {team.players.length === 0 ? (
            <div className="app-surface p-8 text-center text-[#8fa39b] bg-black/30 border border-dashed border-[#10b981]/10">
              Nenhum jogador cadastrado ou ativo no elenco.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.players.map((player) => {
                const theme = positionThemes[player.position] || {
                  border: "border-white/10 hover:border-white/30",
                  text: "text-[#8fa39b]",
                  glow: "rgba(255, 255, 255, 0.05)",
                  label: player.position,
                  badge: "bg-white/5 text-[#8fa39b] border-white/10",
                };

                return (
                  <Link
                    key={player.id}
                    href={`/jogadores/${player.id}`}
                    className="group block"
                    aria-label={`Ver perfil de ${player.name}`}
                  >
                    <article 
                      className={`trading-card p-6 flex flex-col justify-between min-h-[180px] ${theme.border}`}
                      style={{
                        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px ${theme.glow}`,
                      }}
                    >
                      {/* Shirt Number Silhouette */}
                      <span className="absolute bottom-2 right-2 text-8xl font-black text-white/[0.02] pointer-events-none group-hover:text-white/[0.04] transition-all">
                        #{player.shirtNumber}
                      </span>

                      <div className="relative z-10 flex items-center gap-4">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="h-16 w-16 rounded-2xl border border-white/10 object-cover shadow-md transition group-hover:scale-105 duration-200"
                          />
                        ) : (
                          <div
                            className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-xl font-black shadow-inner transition group-hover:scale-105 duration-200 ${theme.badge}`}
                          >
                            {player.shirtNumber}
                          </div>
                        )}
                        <div>
                          <p className="text-lg font-black text-white group-hover:text-[var(--team-primary)] transition-colors duration-150 uppercase tracking-tight truncate max-w-[170px]">{player.name}</p>
                          <p className="text-xs text-[#8fa39b] font-medium mt-0.5">Camisa #{player.shirtNumber}</p>
                        </div>
                      </div>

                      <div className="relative z-10 mt-6 flex items-center justify-between">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${theme.badge}`}>
                          {theme.label}
                        </span>
                        <span 
                          className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                          style={{ color: themeSecondary }}
                        >
                          Ver Perfil &rarr;
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* FORMS SECTION (AMISTOSO / RECRUTAMENTO SPLIT) */}
        <section id="amistoso" className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-24">
          
          {/* Friendly Request Form Card */}
          <div 
            className="app-surface p-6 md:p-8 bg-black/50 space-y-6 flex flex-col"
            style={{ 
              borderColor: `rgba(var(--team-primary-rgb), 0.2)`,
              boxShadow: `0 10px 40px rgba(var(--team-primary-rgb), 0.05)` 
            }}
          >
            <div className="space-y-4">
              <span className="text-xs font-black font-mono tracking-widest text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20 w-fit">AMISTOSO</span>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight mt-2">⚔️ Desafiar para Amistoso</h2>
              <p className="text-sm text-[#8fa39b] font-medium">
                Representa outra equipe e quer agendar um confronto contra o {team.name}? Envie os detalhes do local, horário e proposta e nossa comissão responderá!
              </p>
            </div>
            
            <FriendlyRequestForm teamSlug={team.slug} />
          </div>

          {/* Recruitment Form Card */}
          <div 
            className="app-surface p-6 md:p-8 bg-black/50 space-y-6 flex flex-col"
            style={{ 
              borderColor: `rgba(var(--team-primary-rgb), 0.2)`,
              boxShadow: `0 10px 40px rgba(var(--team-primary-rgb), 0.05)` 
            }}
          >
            <div className="space-y-4">
              <span className="text-xs font-black font-mono tracking-widest text-[#06b6d4] bg-[#06b6d4]/10 px-3 py-1 rounded-full border border-[#06b6d4]/20 w-fit">RECRUTAMENTO</span>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight mt-2">Faça Parte do Time</h2>
              <p className="text-sm text-[#8fa39b] font-medium">
                {team.publicDirectoryOptIn 
                  ? `Quer vestir a camisa do ${team.name} e mostrar seu futebol? Deixe seus dados abaixo para a comissão técnica avaliar!`
                  : `O recrutamento público está atualmente fechado para esta equipe no momento.`
                }
              </p>
            </div>

            {team.publicDirectoryOptIn ? (
              <RecruitmentForm teamSlug={team.slug} />
            ) : (
              <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center text-[#8fa39b] flex flex-col justify-center items-center min-h-[300px]">
                <span className="text-4xl mb-4">🔒</span>
                <p className="text-base font-bold text-white uppercase">Recrutamento Fechado</p>
                <p className="text-xs text-[#8fa39b] mt-2 max-w-xs mx-auto">
                  Esta equipe optou por não aceitar novas candidaturas de recrutamento público no momento.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl mt-24 border-t border-white/10 px-4 pt-10 text-center text-xs font-bold text-[#8fa39b] sm:px-6 lg:px-8 space-y-2">
        <p>&copy; {new Date().getFullYear()} {team.name}. Todos os direitos reservados.</p>
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-black font-mono">Plataforma Esportiva Premium VARzea</p>
      </footer>
    </div>
  );
}
