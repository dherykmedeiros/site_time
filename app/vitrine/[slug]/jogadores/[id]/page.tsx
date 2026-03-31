import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";

interface PlayerPageProps {
  params: Promise<{ slug: string; id: string }>;
}

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  MIDFIELDER: "Meio-campista",
  FORWARD: "Atacante",
};

async function getPlayerProfile(slug: string, playerId: string) {
  const player = await prisma.player.findFirst({
    where: { id: playerId, team: { slug } },
    select: {
      id: true,
      name: true,
      position: true,
      shirtNumber: true,
      photoUrl: true,
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

  const [statsAggregate, recentStats] = await Promise.all([
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
  };
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const { slug, id } = await params;
  const player = await getPlayerProfile(slug, id);

  if (!player) return { title: "Jogador não encontrado" };

  const description = `${positionLabels[player.position] || player.position} · ${player.career.totalGoals} gols · ${player.career.totalAssists} assistências pelo ${player.team.name}`;

  return {
    title: `${player.name} — ${player.team.name}`,
    description,
    openGraph: {
      title: `${player.name} — ${player.team.name}`,
      description,
      type: "profile",
      siteName: "Site Time",
      locale: "pt_BR",
      ...(player.photoUrl && {
        images: [{ url: player.photoUrl, width: 400, height: 400, alt: player.name }],
      }),
    },
    twitter: {
      card: "summary",
      title: `${player.name} — ${player.team.name}`,
      description,
      ...(player.photoUrl && { images: [player.photoUrl] }),
    },
  };
}

export default async function PlayerProfilePage({ params }: PlayerPageProps) {
  const { slug, id } = await params;
  const player = await getPlayerProfile(slug, id);

  if (!player) notFound();

  const primaryColor = player.team.primaryColor || "#1e40af";

  const stats = [
    { label: "Partidas", value: player.career.totalMatches },
    { label: "Gols", value: player.career.totalGoals },
    { label: "Assistências", value: player.career.totalAssists },
    { label: "Amarelos", value: player.career.totalYellowCards },
    { label: "Vermelhos", value: player.career.totalRedCards },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-16">
      {/* Hero */}
      <header
        className="relative overflow-hidden px-4 pb-20 pt-10 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(255,255,255,0.25),transparent_35%),linear-gradient(140deg,rgba(0,0,0,0.38),rgba(0,0,0,0.62)_55%,rgba(0,0,0,0.38))]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[rgba(17,20,18,0.35)]" />

        <div className="relative mx-auto max-w-4xl">
          <Link
            href={`/vitrine/${slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
          >
            ← {player.team.name}
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
        {/* Career stats */}
        <section
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          aria-label="Estatísticas de carreira"
        >
          {stats.map(({ label, value }) => (
            <article
              key={label}
              className="app-surface rounded-[20px] border border-[var(--border)] p-5 text-center shadow-[var(--shadow-md)]"
            >
              <p className="text-3xl font-bold text-[var(--text)]">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                {label}
              </p>
            </article>
          ))}
        </section>

        {/* Recent matches */}
        <section className="mt-10" aria-label="Últimas partidas">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-[var(--text)]">Últimas partidas</h2>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-subtle)]">
              Últimas {Math.min(player.recentMatches.length, 5)}
            </p>
          </div>

          {player.recentMatches.length > 0 ? (
            <div className="app-surface overflow-hidden rounded-[20px] border border-[var(--border)] shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-soft)]">
                      <th className="px-4 py-3 font-semibold text-[var(--text-subtle)]">
                        Adversário
                      </th>
                      <th className="px-4 py-3 font-semibold text-[var(--text-subtle)]">
                        Placar
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-[var(--text-subtle)]">
                        ⚽
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-[var(--text-subtle)]">
                        🎯
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-[var(--text-subtle)]">
                        🟨
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-[var(--text-subtle)]">
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
                          className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-soft)]"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-[var(--text)]">vs {m.opponent}</p>
                            <p className="text-xs text-[var(--text-muted)]">{dateStr}</p>
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-[var(--text)]">
                            {m.homeScore !== null && m.awayScore !== null
                              ? `${m.homeScore} × ${m.awayScore}`
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-center text-[var(--text)]">{m.goals}</td>
                          <td className="px-4 py-3 text-center text-[var(--text)]">{m.assists}</td>
                          <td className="px-4 py-3 text-center text-[var(--text)]">
                            {m.yellowCards || "—"}
                          </td>
                          <td className="px-4 py-3 text-center text-[var(--text)]">
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
            <div className="app-surface rounded-[20px] border border-dashed border-[var(--border-strong)] p-10 text-center text-[var(--text-muted)]">
              Nenhuma estatística registrada ainda.
            </div>
          )}
        </section>

        {/* Back to team */}
        <div className="mt-10 text-center">
          <Link
            href={`/vitrine/${slug}`}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-6 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]"
          >
            Ver vitrine do {player.team.name}
          </Link>
        </div>
      </main>

      <footer className="mt-14 border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)]">
        <p>Powered by Site Time</p>
      </footer>
    </div>
  );
}
