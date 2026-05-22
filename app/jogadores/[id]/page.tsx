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

export default async function PlayerProfilePage({ params }: PlayerPageProps) {
  const { id } = await params;
  const player = await getPlayerProfile(id);

  if (!player) notFound();

  const primaryColor = player.team.primaryColor || "#1e40af";

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

  // Deduplicate by type for display (show count if earned multiple times)
  const achievementCounts: Record<string, number> = {};
  for (const a of player.achievements) {
    achievementCounts[a.type] = (achievementCounts[a.type] || 0) + 1;
  }
  const uniqueAchievements = Object.entries(achievementCounts);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(12,111,93,0.03),transparent_40%),linear-gradient(180deg,var(--bg)_0%,var(--bg)_100%)] pb-16 font-sans antialiased text-[var(--text)] transition-colors duration-300">
      <PublicNavbar teamName={player.team.name} badgeUrl={player.team.badgeUrl} />

      {/* Hero */}
      <header
        className="relative overflow-hidden px-4 pb-20 pt-12 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(255,255,255,0.2),transparent_35%),linear-gradient(140deg,rgba(0,0,0,0.48),rgba(0,0,0,0.72)_55%,rgba(0,0,0,0.48))]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[var(--bg)] opacity-90" />

        <div className="relative mx-auto max-w-4xl">
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end">
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                className="h-28 w-28 rounded-2xl border border-white/20 object-cover shadow-[0_14px_28px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div
                className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/20 text-3xl font-black text-white shadow-[0_14px_28px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-200"
                style={{ backgroundColor: player.team.secondaryColor || "#3b82f6" }}
                aria-label={`Camisa ${player.shirtNumber}`}
              >
                {player.shirtNumber}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                #{player.shirtNumber} · {positionLabels[player.position] || player.position}
                {player.status === "INACTIVE" && " · Inativo"}
              </p>
              <h1 className="text-3xl font-extrabold leading-none sm:text-4xl drop-shadow-sm">
                {player.name}
              </h1>
              {player.fullName && (
                <p className="text-sm font-medium text-white/80">{player.fullName}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-white/75 font-semibold pt-1">
                {player.team.badgeUrl && (
                  <img
                    src={player.team.badgeUrl}
                    alt=""
                    className="h-5 w-5 rounded-md object-cover border border-white/10"
                  />
                )}
                <span>{player.team.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-4xl px-4 space-y-10">
        {player.description && (
          <section aria-label="Descricao do jogador">
            <article className="app-surface p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--text)]">Sobre o Atleta</h2>
              <p className="mt-2.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)] font-medium">
                {player.description}
              </p>
            </article>
          </section>
        )}

        {/* Career stats */}
        <section
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          aria-label="Estatísticas de carreira"
        >
          {stats.map(({ label, value }) => (
            <article
              key={label}
              className="app-surface p-5 text-center shadow-sm card-hover"
            >
              <p className="text-3.5xl font-black text-[var(--brand)]">{value}</p>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {label}
              </p>
            </article>
          ))}
        </section>

        <section aria-label="Recap compartilhavel">
          <PlayerRecapWidget playerId={player.id} playerName={player.name} vitrineUrl={`/jogadores/${player.id}`} />
        </section>

        {/* Achievements */}
        {uniqueAchievements.length > 0 && (
          <section aria-label="Conquistas" className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text)]">Conquistas Oficiais</h2>
            <div className="flex flex-wrap gap-3">
              {uniqueAchievements.map(([type, count]) => {
                const meta = achievementMeta[type];
                if (!meta) return null;
                return (
                  <div
                    key={type}
                    className="app-surface flex items-center gap-2.5 rounded-full px-5 py-2.5 shadow-sm card-hover"
                    title={`Conquistado ${count}x`}
                  >
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="text-xs font-extrabold text-[var(--text)] uppercase tracking-wider">{meta.label}</span>
                    {count > 1 && (
                      <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-[10px] font-black text-[var(--brand)]">
                        ×{count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent matches */}
        <section aria-label="Últimas partidas" className="space-y-4">
          <div className="flex items-end justify-between gap-3 border-b border-[var(--border)] pb-3">
            <h2 className="text-2xl font-bold text-[var(--text)]">Últimas Partidas</h2>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] font-bold">
              Histórico recente
            </p>
          </div>

          {player.recentMatches.length > 0 ? (
            <div className="app-surface overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm divide-y divide-[var(--border)]">
                  <thead>
                    <tr className="bg-[var(--bg)]">
                      <th className="px-5 py-4 font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">
                        Adversário
                      </th>
                      <th className="px-5 py-4 font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">
                        Placar
                      </th>
                      <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">
                        ⚽
                      </th>
                      <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">
                        🎯
                      </th>
                      <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">
                        🟨
                      </th>
                      <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">
                        🟥
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-elevated)]">
                    {player.recentMatches.map((m) => {
                      const dateStr = new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                      }).format(new Date(m.date));
                      return (
                        <tr
                          key={m.matchId}
                          className="hover:bg-[var(--bg)] transition-colors duration-150"
                        >
                          <td className="px-5 py-4">
                            <p className="font-extrabold text-[var(--text)]">vs {m.opponent}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{dateStr}</p>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold text-[var(--text)]">
                            {m.homeScore !== null && m.awayScore !== null
                              ? `${m.homeScore} × ${m.awayScore}`
                              : "—"}
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-[var(--text)]">{m.goals}</td>
                          <td className="px-4 py-4 text-center font-bold text-[var(--text)]">{m.assists}</td>
                          <td className="px-4 py-4 text-center font-bold text-amber-600">
                            {m.yellowCards || "—"}
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-rose-500">
                            {m.redCards || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="app-surface p-12 text-center text-[var(--text-muted)] border-dashed">
              Nenhuma estatística registrada em partidas recentes.
            </div>
          )}
        </section>

        {/* Back to team */}
        <div className="text-center pt-4">
          <Link
            href={player.team.slug ? `/${player.team.slug}` : "/"}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--brand)] bg-[var(--bg-elevated)] px-8 text-xs font-bold uppercase tracking-wider text-[var(--brand)] transition-all hover:bg-[var(--brand)] hover:text-white hover:scale-105 active:scale-95 transform shadow-sm"
          >
            Ver Portal do {player.team.name}
          </Link>
        </div>
      </main>

      <footer className="mt-16 border-t border-[var(--border)] py-8 text-center text-xs font-semibold text-[var(--text-muted)]">
        <p>&copy; {new Date().getFullYear()} {player.team.name}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
