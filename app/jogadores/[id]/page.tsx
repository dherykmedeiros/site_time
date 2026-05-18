import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { PlayerRecapWidget } from "@/components/dashboard/PlayerRecapWidget";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(12,111,93,0.05),transparent_40%),linear-gradient(180deg,#f8fbf9_0%,#f0f5f2_100%)] pb-16">
      {/* Hero */}
      <header
        className="relative overflow-hidden px-4 pb-20 pt-10 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(255,255,255,0.25),transparent_35%),linear-gradient(140deg,rgba(0,0,0,0.38),rgba(0,0,0,0.62)_55%,rgba(0,0,0,0.38))]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#f8fbf9]/15" />

        <div className="relative mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
          >
            ← Voltar para o Portal
          </Link>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end">
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                className="h-24 w-24 rounded-2xl border border-white/35 object-cover shadow-[0_14px_28px_rgba(0,0,0,0.35)]"
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/35 text-3xl font-bold text-white shadow-[0_14px_28px_rgba(0,0,0,0.35)]"
                style={{ backgroundColor: player.team.secondaryColor || "#3b82f6" }}
                aria-label={`Camisa ${player.shirtNumber}`}
              >
                {player.shirtNumber}
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                #{player.shirtNumber} · {positionLabels[player.position] || player.position}
                {player.status === "INACTIVE" && " · Inativo"}
              </p>
              <h1 className="mt-1.5 text-3xl font-bold leading-none sm:text-4xl">
                {player.name}
              </h1>
              {player.fullName && (
                <p className="mt-2 text-sm font-medium text-white/80">{player.fullName}</p>
              )}
              <div className="mt-2.5 flex items-center gap-2 text-sm text-white/75">
                {player.team.badgeUrl && (
                  <img
                    src={player.team.badgeUrl}
                    alt=""
                    className="h-4 w-4 rounded-sm object-cover"
                  />
                )}
                <span>{player.team.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-5 max-w-4xl px-4">
        {player.description && (
          <section className="mb-6" aria-label="Descricao do jogador">
            <article className="bg-white rounded-3xl border border-[#e5ece8] p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#0f3a30]">Sobre o Atleta</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#4f746b]">
                {player.description}
              </p>
            </article>
          </section>
        )}

        {/* Career stats */}
        <section
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          aria-label="Estatísticas de carreira"
        >
          {stats.map(({ label, value }) => (
            <article
              key={label}
              className="bg-white rounded-2xl border border-[#e5ece8] p-5 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-[#0f3a30]">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b857c]">
                {label}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8" aria-label="Recap compartilhavel">
          <PlayerRecapWidget playerId={player.id} playerName={player.name} vitrineUrl={`/jogadores/${player.id}`} />
        </section>

        {/* Achievements */}
        {uniqueAchievements.length > 0 && (
          <section className="mt-10" aria-label="Conquistas">
            <h2 className="mb-4 text-2xl font-bold text-[#0f3a30]">Conquistas Oficiais</h2>
            <div className="flex flex-wrap gap-3">
              {uniqueAchievements.map(([type, count]) => {
                const meta = achievementMeta[type];
                if (!meta) return null;
                return (
                  <div
                    key={type}
                    className="bg-white flex items-center gap-2 rounded-full border border-[#e5ece8] px-4 py-2 shadow-sm"
                    title={`Conquistado ${count}x`}
                  >
                    <span className="text-xl">{meta.emoji}</span>
                    <span className="text-sm font-semibold text-[#355249]">{meta.label}</span>
                    {count > 1 && (
                      <span className="rounded-full bg-[#f0f5f2] px-1.5 py-0.5 text-xs font-bold text-[#6b857c]">
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
        <section className="mt-10" aria-label="Últimas partidas">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#0f3a30]">Últimas Partidas</h2>
            <p className="text-xs uppercase tracking-[0.12em] text-[#6b857c]">
              Histórico recente
            </p>
          </div>

          {player.recentMatches.length > 0 ? (
            <div className="bg-white overflow-hidden rounded-3xl border border-[#e5ece8] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e5ece8] bg-[#f8fbf9]">
                      <th className="px-4 py-3 font-semibold text-[#6b857c]">
                        Adversário
                      </th>
                      <th className="px-4 py-3 font-semibold text-[#6b857c]">
                        Placar
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-[#6b857c]">
                        ⚽
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-[#6b857c]">
                        🎯
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-[#6b857c]">
                        🟨
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-[#6b857c]">
                        🟥
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {player.recentMatches.map((m) => {
                      const dateStr = new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                      }).format(new Date(m.date));
                      return (
                        <tr
                          key={m.matchId}
                          className="border-b border-[#e5ece8] last:border-0 hover:bg-[#f8fbf9]/60"
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#0f3a30]">vs {m.opponent}</p>
                            <p className="text-xs text-[#6b857c]">{dateStr}</p>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-[#0f3a30]">
                            {m.homeScore !== null && m.awayScore !== null
                              ? `${m.homeScore} × ${m.awayScore}`
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-center text-[#0f3a30]">{m.goals}</td>
                          <td className="px-4 py-3 text-center text-[#0f3a30]">{m.assists}</td>
                          <td className="px-4 py-3 text-center text-[#0f3a30]">
                            {m.yellowCards || "—"}
                          </td>
                          <td className="px-4 py-3 text-center text-[#0f3a30]">
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
            <div className="bg-white rounded-3xl border border-dashed border-[#b7d8ce] p-10 text-center text-[#6b857c]">
              Nenhuma estatística registrada em partidas recentes.
            </div>
          )}
        </section>

        {/* Back to team */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#0c6f5d] bg-white px-6 py-2 text-sm font-bold text-[#0c6f5d] transition hover:bg-[#0c6f5d] hover:text-white"
          >
            Ver Portal do {player.team.name}
          </Link>
        </div>
      </main>

      <footer className="mt-14 border-t border-[#e5ece8] py-8 text-center text-xs font-semibold text-[#8ea49c]">
        <p>&copy; {new Date().getFullYear()} {player.team.name}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
