import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { FriendlyRequestForm } from "./FriendlyRequestForm";

interface VitrinePageProps {
  params: Promise<{ slug: string }>;
}

async function getTeamBySlug(slug: string) {
  return prisma.team.findUnique({
    where: { slug },
    include: {
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
    select: { homeScore: true, awayScore: true },
  });

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;

  for (const m of completedMatches) {
    const home = m.homeScore ?? 0;
    const away = m.awayScore ?? 0;
    goalsScored += home;
    goalsConceded += away;
    if (home > away) wins++;
    else if (home < away) losses++;
    else draws++;
  }

  const totalMatches = completedMatches.length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  // Top scorers (top 5)
  const topScorers = await prisma.matchStats.groupBy({
    by: ["playerId"],
    where: { match: { teamId } },
    _sum: { goals: true },
    orderBy: { _sum: { goals: "desc" } },
    take: 5,
  });

  const scorerPlayerIds = topScorers.map((s) => s.playerId);
  const scorerPlayers = await prisma.player.findMany({
    where: { id: { in: scorerPlayerIds } },
    select: { id: true, name: true },
  });
  const scorerMap = new Map(scorerPlayers.map((p) => [p.id, p.name]));

  return {
    totalMatches,
    wins,
    draws,
    losses,
    winRate,
    goalsScored,
    goalsConceded,
    topScorers: topScorers
      .filter((s) => (s._sum.goals ?? 0) > 0)
      .map((s) => ({
        playerName: scorerMap.get(s.playerId) || "Desconhecido",
        total: s._sum.goals ?? 0,
      })),
  };
}

export async function generateMetadata({
  params,
}: VitrinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    return { title: "Time não encontrado" };
  }

  const description =
    team.description || `Conheça o ${team.name} — time de futebol amador.`;

  return {
    title: `${team.name} — Vitrine`,
    description,
    openGraph: {
      title: team.name,
      description,
      type: "website",
      url: `/vitrine/${slug}`,
      siteName: "Site Time",
      locale: "pt_BR",
      ...(team.badgeUrl && { images: [{ url: team.badgeUrl, width: 200, height: 200, alt: `Escudo ${team.name}` }] }),
    },
    twitter: {
      card: "summary",
      title: team.name,
      description,
      ...(team.badgeUrl && { images: [team.badgeUrl] }),
    },
  };
}

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  MIDFIELDER: "Meio-campista",
  FORWARD: "Atacante",
};

export default async function VitrinePage({ params }: VitrinePageProps) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  const stats = await getTeamStats(team.id);

  return (
    <div className="min-h-screen bg-transparent pb-16">
      <header
        className="relative overflow-hidden px-4 pb-20 pt-14 text-white"
        style={{
          backgroundColor: team.primaryColor || "#1e40af",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(255,219,178,0.35),transparent_30%)]" />
        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/vitrine"
            className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
          >
            Ver outros times
          </Link>
        </div>
        <div className="relative mx-auto mt-8 max-w-4xl text-center">
          {team.badgeUrl ? (
            <img
              src={team.badgeUrl}
              alt={`Escudo ${team.name}`}
              className="mx-auto mb-4 h-28 w-28 rounded-full border-4 border-white/35 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
            />
          ) : (
            <div
              className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/35 text-5xl shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
              style={{ backgroundColor: team.secondaryColor || "#3b82f6" }}
            >
              ⚽
            </div>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Perfil Oficial
          </p>
          <h1 className="mt-2 text-balance font-display text-4xl font-bold sm:text-5xl">{team.name}</h1>
          {team.description && (
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">{team.description}</p>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <a
              href="#retrospecto"
              className="rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/25"
            >
              Retrospecto
            </a>
            <a
              href="#elenco"
              className="rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/25"
            >
              Elenco
            </a>
            <a
              href="#amistoso"
              className="rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/25"
            >
              Solicitar jogo
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-10 max-w-5xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="app-surface rounded-[22px] p-6 text-center shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              Elenco
            </p>
            <p className="text-3xl font-bold text-[var(--text)]">
              {team._count.players}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Jogadores</p>
          </div>
          <div className="app-surface rounded-[22px] p-6 text-center shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              Temporada
            </p>
            <p className="text-3xl font-bold text-[var(--text)]">
              {stats.totalMatches}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Partidas Disputadas</p>
          </div>
          <div className="app-surface rounded-[22px] p-6 text-center shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              Performance
            </p>
            <p className="text-3xl font-bold text-[var(--text)]">
              {stats.winRate}%
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Aproveitamento</p>
          </div>
        </div>

        {stats.totalMatches > 0 && (
          <section id="retrospecto" className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">Retrospecto</h2>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="app-surface rounded-[18px] border border-emerald-100 p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.wins}</p>
                <p className="text-sm text-[var(--text-muted)]">Vitórias</p>
              </div>
              <div className="app-surface rounded-[18px] border border-amber-100 p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.draws}</p>
                <p className="text-sm text-[var(--text-muted)]">Empates</p>
              </div>
              <div className="app-surface rounded-[18px] border border-rose-100 p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{stats.losses}</p>
                <p className="text-sm text-[var(--text-muted)]">Derrotas</p>
              </div>
              <div className="app-surface rounded-[18px] p-4 text-center">
                <p className="text-2xl font-bold text-[var(--text)]">
                  {stats.goalsScored} : {stats.goalsConceded}
                </p>
                <p className="text-sm text-[var(--text-muted)]">Gols (Pró : Contra)</p>
              </div>
            </div>
          </section>
        )}

        {stats.topScorers.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">Artilheiros</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {stats.topScorers.map((scorer, i) => (
                <article
                  key={scorer.playerName}
                  className="app-surface rounded-[18px] p-4 text-center shadow-[var(--shadow-sm)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    #{i + 1}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold text-[var(--text)]">
                    {scorer.playerName}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[var(--brand)]">{scorer.total}</p>
                  <p className="text-xs text-[var(--text-muted)]">gols</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {team.players.length > 0 ? (
          <section id="elenco" className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">Elenco</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.players.map((player) => (
                <div
                  key={player.id}
                  className="app-surface flex items-center gap-4 rounded-[18px] p-4 shadow-[var(--shadow-sm)]"
                >
                  {player.photoUrl ? (
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="h-12 w-12 rounded-full border border-[var(--border)] object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-lg font-bold text-white"
                      style={{
                        backgroundColor: team.primaryColor || "#1e40af",
                      }}
                    >
                      {player.shirtNumber}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[var(--text)]">{player.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {positionLabels[player.position] || player.position} •{" "}
                      #{player.shirtNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section id="elenco" className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">Elenco</h2>
            <div className="app-surface rounded-[22px] border border-dashed border-[var(--border-strong)] p-8 text-center text-[var(--text-muted)]">
              Este time ainda nao publicou jogadores ativos na vitrine.
            </div>
          </section>
        )}

        <section id="amistoso" className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">
            Solicitar Amistoso
          </h2>
          <div className="app-surface rounded-[24px] p-6 shadow-[var(--shadow-md)] sm:p-7">
            <p className="mb-4 text-sm text-[var(--text-muted)]">
              Quer marcar um amistoso com o {team.name}? Preencha o formulário abaixo.
            </p>
            <FriendlyRequestForm teamSlug={slug} />
          </div>
        </section>

        {(team.primaryColor || team.secondaryColor) && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">Cores</h2>
            <div className="flex flex-wrap gap-3">
              {team.primaryColor && (
                <div className="app-surface flex items-center gap-2 rounded-full px-4 py-2 shadow-[var(--shadow-sm)]">
                  <div
                    className="h-8 w-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: team.primaryColor }}
                  />
                  <span className="text-sm text-[var(--text-muted)]">Primária</span>
                </div>
              )}
              {team.secondaryColor && (
                <div className="app-surface flex items-center gap-2 rounded-full px-4 py-2 shadow-[var(--shadow-sm)]">
                  <div
                    className="h-8 w-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: team.secondaryColor }}
                  />
                  <span className="text-sm text-[var(--text-muted)]">Secundária</span>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-14 border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)]">
        <p>Powered by Site Time</p>
      </footer>
    </div>
  );
}
