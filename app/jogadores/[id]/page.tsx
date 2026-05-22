import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { PlayerRecapWidget } from "@/components/dashboard/PlayerRecapWidget";
import { PublicNavbar } from "@/components/PublicNavbar";

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral esquerdo",
  RIGHT_BACK: "Lateral direito",
  MIDFIELDER: "Meio-campista",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta esquerda",
  RIGHT_WINGER: "Ponta direita",
};

async function getPlayerProfile(playerId: string) {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
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

  if (!player) return null;

  const [statsAggregate, recentStats, achievements] = await Promise.all([
    prisma.matchStats.aggregate({
      where: { playerId: player.id },
      _sum: { goals: true, assists: true, yellowCards: true, redCards: true },
      _count: { id: true },
    }),
    prisma.matchStats.findMany({
      where: { playerId: player.id },
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
    prisma.achievement.findMany({
      where: { playerId: player.id },
      orderBy: { awardedAt: "desc" },
      select: { id: true, type: true, awardedAt: true },
    }),
  ]);

  return {
    ...player,
    career: {
      totalMatches: statsAggregate._count.id,
      totalGoals: statsAggregate._sum.goals ?? 0,
      totalAssists: statsAggregate._sum.assists ?? 0,
      totalYellowCards: statsAggregate._sum.yellowCards ?? 0,
      totalRedCards: statsAggregate._sum.redCards ?? 0,
    },
    recentMatches: recentStats.map((s) => ({
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
    achievements,
  };
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayerProfile(id);

  if (!player) return { title: "Jogador não encontrado" };

  const description = `${positionLabels[player.position] || player.position} · ${player.career.totalGoals} gols · ${player.career.totalAssists} assistências pelo ${player.team.name}`;
  const recapImageUrl = `/api/og/player-recap/${id}`;

  return {
    title: `${player.name} — ${player.team.name}`,
    description,
    openGraph: {
      title: `${player.name} — ${player.team.name}`,
      description,
      type: "profile",
      siteName: "Portal Oficial",
      locale: "pt_BR",
      images: [{ url: recapImageUrl, width: 1200, height: 630, alt: `Recap de ${player.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${player.name} — ${player.team.name}`,
      description,
      images: [recapImageUrl],
    },
  };
}

function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "16, 185, 129"; // fallback
}

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

export default async function PlayerProfilePage({ params }: PlayerPageProps) {
  const { id } = await params;
  const player = await getPlayerProfile(id);

  if (!player) notFound();

  const themePrimary = player.team.primaryColor || "#10b981";
  const themeSecondary = player.team.secondaryColor || "#34d399";
  const primaryRgb = hexToRgb(themePrimary);
  const secondaryRgb = hexToRgb(themeSecondary);

  const stats = [
    { label: "Partidas", value: player.career.totalMatches },
    { label: "Gols", value: player.career.totalGoals },
    { label: "Assistências", value: player.career.totalAssists },
    { label: "Amarelos", value: player.career.totalYellowCards },
    { label: "Vermelhos", value: player.career.totalRedCards },
  ];

  const achievementMeta: Record<string, { emoji: string; label: string }> = {
    HAT_TRICK: { emoji: "⚽⚽⚽", label: "Hat-trick" },
    TOP_SCORER_ROUND: { emoji: "🥇", label: "Artilheiro da Rodada" },
    VETERAN: { emoji: "👑", label: "Veterano" },
    ASSIST_MASTER: { emoji: "🎯", label: "Mestre das Assistências" },
    FULL_ATTENDANCE_MONTH: { emoji: "🛡️", label: "Presença 100%" },
  };

  const achievementCounts: Record<string, number> = {};
  for (const a of player.achievements) {
    achievementCounts[a.type] = (achievementCounts[a.type] || 0) + 1;
  }
  const uniqueAchievements = Object.entries(achievementCounts);

  const theme = positionThemes[player.position] || {
    border: "border-white/10 hover:border-white/30",
    text: "text-[#94a3b8]",
    glow: "rgba(255, 255, 255, 0.05)",
    label: player.position,
    badge: "bg-white/5 text-[#94a3b8] border-white/10",
  };

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
        "--border": "rgba(255, 255, 255, 0.08)",
      } as React.CSSProperties}
    >
      {/* Background Accent Gradients */}
      <div 
        className="absolute top-0 left-0 w-full h-[500px] pointer-events-none opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 20%, rgba(var(--team-primary-rgb), 0.7) 0%, transparent 60%)`,
        }}
      />
      <div className="absolute top-[400px] right-[-10%] w-[400px] h-[400px] pointer-events-none opacity-5 rounded-full filter blur-[100px] bg-cyan-500" />
      
      <PublicNavbar teamName={player.team.name} badgeUrl={player.team.badgeUrl} slug={player.team.slug || undefined} />

      {/* Athlete Premium Editorial Profile Header */}
      <header className="relative overflow-hidden px-4 pb-20 pt-12 lg:pb-24 lg:pt-16">
        <div className="relative mx-auto mt-4 max-w-4xl grid gap-8 md:grid-cols-[240px_1fr] items-end">
          
          {/* Technical Image Dossier Display */}
          <div className="relative w-[240px] h-[300px] bg-[#0b0f11] border border-[var(--border)] rounded-md overflow-hidden shadow-2xl shrink-0 group mx-auto md:mx-0">
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-b from-[#13191c] to-[#090d0f] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--team-primary-rgb),0.08),transparent_80%)] pointer-events-none" />
                <span className="font-mono text-[9rem] font-black text-white/5 tracking-tighter select-none">
                  {player.shirtNumber}
                </span>
                <span className="absolute bottom-6 font-mono text-[10px] font-black uppercase tracking-widest text-[#94a3b8] border border-[var(--border)] bg-[#0f1418]/80 px-3 py-1 rounded">
                  Ficha Oficial
                </span>
              </div>
            )}
            
            {/* Jersey Badge over Photo */}
            <div className="absolute top-4 right-4 h-10 w-10 bg-[#090d0f]/95 border border-[var(--border)] rounded-md flex items-center justify-center font-mono font-black text-white shadow-lg">
              #{player.shirtNumber}
            </div>
          </div>

          {/* Dossier Text Info */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className={`inline-flex rounded border px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest ${theme.badge}`}>
                {theme.label}
              </span>
              {player.status === "INACTIVE" && (
                <span className="inline-flex rounded border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-red-400">
                  Inativo
                </span>
              )}
              <span className="font-mono text-[9px] text-[#64748b] font-black uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded border border-white/5">
                DOSSIÊ TÉCNICO
              </span>
            </div>

            <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-black leading-none uppercase tracking-tight font-mono text-white">
              {player.name}
            </h1>
            
            {player.fullName && (
              <p className="text-sm font-semibold text-[#94a3b8] font-mono tracking-wide uppercase">
                Nome completo: {player.fullName}
              </p>
            )}

            <div className="flex items-center justify-center md:justify-start gap-2.5 pt-2">
              <Link 
                href={player.team.slug ? `/${player.team.slug}` : "/"}
                className="flex items-center gap-2 bg-[#0f1418] border border-[var(--border)] rounded px-4 py-2 hover:border-[#ffffff/15] transition-all group"
              >
                {player.team.badgeUrl ? (
                  <img
                    src={player.team.badgeUrl}
                    alt=""
                    className="h-5 w-5 rounded object-cover p-0.5 bg-black/60"
                  />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center font-mono font-black text-white text-[9px] bg-black/60 border border-white/10 rounded uppercase">
                    {player.team.name.substring(0, 3)}
                  </span>
                )}
                <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest group-hover:text-[var(--team-primary)] transition-colors">
                  {player.team.name}
                </span>
              </Link>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto mt-2 max-w-4xl px-4 space-y-12">
        
        {/* Career Stats Grid */}
        <section aria-label="Estatísticas de carreira" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ label, value }) => (
            <article
              key={label}
              className="app-surface p-5 text-center shadow-lg hover:border-[var(--brand)] card-hover"
            >
              <p className="text-4xl sm:text-5xl font-black text-white font-mono">{value}</p>
              <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">
                {label}
              </p>
            </article>
          ))}
        </section>

        {/* Player Description */}
        {player.description && (
          <section aria-label="Descrição do jogador" className="app-surface p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--brand)]" />
            <h2 className="font-mono text-xs font-black uppercase text-[#94a3b8] tracking-widest">Sobre o Atleta</h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#d1d5db] font-medium whitespace-pre-wrap">
              {player.description}
            </p>
          </section>
        )}

        {/* Shareable Player Recap Widget */}
        <section aria-label="Recap compartilhavel" className="app-surface p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500" />
          <h2 className="font-mono text-xs font-black uppercase text-[#94a3b8] tracking-widest mb-6">Vitrine Digital de Desempenho</h2>
          <PlayerRecapWidget playerId={player.id} playerName={player.name} vitrineUrl={`/jogadores/${player.id}`} />
        </section>

        {/* Achievements Section */}
        {uniqueAchievements.length > 0 && (
          <section aria-label="Conquistas oficiais" className="space-y-4">
            <h2 className="font-mono text-lg font-black uppercase text-white tracking-tight">Conquistas Oficiais</h2>
            <div className="flex flex-wrap gap-3">
              {uniqueAchievements.map(([type, count]) => {
                const meta = achievementMeta[type];
                if (!meta) return null;
                return (
                  <div
                    key={type}
                    className="app-surface flex items-center gap-3 px-5 py-3 hover:border-violet-500/30 card-hover"
                    title={`Conquistado ${count}x`}
                  >
                    <span className="text-xl shrink-0">{meta.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{meta.label}</span>
                      {count > 1 && (
                        <span className="mt-1 font-mono text-[9px] font-black bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/20 w-fit">
                          ×{count} Conquistado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent Matches Section */}
        <section aria-label="Últimas partidas" className="space-y-4">
          <div className="flex items-end justify-between gap-3 border-b border-[var(--border)] pb-3">
            <h2 className="font-mono text-lg font-black uppercase text-white tracking-tight">Registro de Partidas Recentes</h2>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#94a3b8] font-black">
              Histórico Técnico
            </p>
          </div>

          {player.recentMatches.length > 0 ? (
            <div className="app-surface overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm divide-y divide-[var(--border)]">
                  <thead>
                    <tr className="bg-[#0b0f11]">
                      <th className="px-5 py-4 font-mono font-black text-[#94a3b8] text-[9px] uppercase tracking-widest">
                        Confronto / Data
                      </th>
                      <th className="px-5 py-4 font-mono font-black text-[#94a3b8] text-[9px] uppercase tracking-widest">
                        Placar Final
                      </th>
                      <th className="px-4 py-4 text-center font-mono font-black text-[#94a3b8] text-[9px] uppercase tracking-widest">
                        ⚽ Gols
                      </th>
                      <th className="px-4 py-4 text-center font-mono font-black text-[#94a3b8] text-[9px] uppercase tracking-widest">
                        🎯 Passes
                      </th>
                      <th className="px-4 py-4 text-center font-mono font-black text-[#94a3b8] text-[9px] uppercase tracking-widest">
                        🟨 Cartão
                      </th>
                      <th className="px-4 py-4 text-center font-mono font-black text-[#94a3b8] text-[9px] uppercase tracking-widest">
                        🟥 Vermelho
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] bg-[#0f1418]">
                    {player.recentMatches.map((m) => {
                      const dateStr = new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                      }).format(new Date(m.date));
                      return (
                        <tr
                          key={m.matchId}
                          className="hover:bg-[#13191c] transition-colors duration-150"
                        >
                          <td className="px-5 py-4">
                            <p className="font-mono font-black text-white uppercase text-xs">vs {m.opponent}</p>
                            <p className="font-mono text-[9px] text-[#64748b] uppercase tracking-wider mt-0.5">{dateStr}</p>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold text-white text-xs">
                            {m.homeScore !== null && m.awayScore !== null
                              ? `${m.homeScore} - ${m.awayScore}`
                              : "—"}
                          </td>
                          <td className="px-4 py-4 text-center font-mono font-black text-white text-xs">
                            {m.goals > 0 ? (
                              <span className="inline-block bg-[var(--brand-soft)] text-[var(--brand)] px-2 py-0.5 rounded border border-[var(--brand-soft)]">
                                {m.goals}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-4 text-center font-mono font-black text-white text-xs">
                            {m.assists > 0 ? (
                              <span className="inline-block bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/25">
                                {m.assists}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-4 text-center font-mono font-black text-amber-500 text-xs">
                            {m.yellowCards > 0 ? (
                              <span className="inline-block bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/25">
                                {m.yellowCards}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-4 text-center font-mono font-black text-rose-500 text-xs">
                            {m.redCards > 0 ? (
                              <span className="inline-block bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded border border-rose-500/25">
                                {m.redCards}
                              </span>
                            ) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="app-surface p-12 text-center text-[#94a3b8] font-mono text-xs uppercase font-bold bg-black/20 border-dashed">
              Nenhuma estatística registrada em partidas recentes.
            </div>
          )}
        </section>

        {/* Back Link Button */}
        <div className="text-center pt-8">
          <Link
            href={player.team.slug ? `/${player.team.slug}` : "/"}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--brand)] hover:bg-[var(--brand)] text-[var(--brand)] hover:text-[#090d0f] font-mono text-[10px] font-black uppercase tracking-widest px-8 transition-all duration-150 shadow-md"
          >
            &larr; Retornar ao Portal do {player.team.name}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-4xl mt-24 border-t border-[rgba(255,255,255,0.08)] px-4 pt-10 text-center text-xs font-semibold text-[#64748b] space-y-2">
        <p>&copy; {new Date().getFullYear()} {player.team.name}. Todos os direitos reservados.</p>
        <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-black font-mono">Plataforma Esportiva Premium VARzea</p>
      </footer>
    </div>
  );
}
