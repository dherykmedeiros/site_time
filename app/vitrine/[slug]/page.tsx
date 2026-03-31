import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { FriendlyRequestForm } from "./FriendlyRequestForm";

// F-001: player cards are now links to /vitrine/[slug]/jogadores/[id]

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

  const scorerPlayerIds = topScorers.map((s: (typeof topScorers)[number]) => s.playerId);
  const scorerPlayers = await prisma.player.findMany({
    where: { id: { in: scorerPlayerIds } },
    select: { id: true, name: true },
  });
  const scorerMap = new Map(
    scorerPlayers.map((p: (typeof scorerPlayers)[number]) => [p.id, p.name])
  );

  const activeSeason = await prisma.season.findFirst({
    where: { teamId, status: "ACTIVE" },
    orderBy: { startDate: "desc" },
    select: { id: true, name: true },
  });

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
    topScorers: topScorers
      .filter((s: (typeof topScorers)[number]) => (s._sum.goals ?? 0) > 0)
      .map((s: (typeof topScorers)[number]) => ({
        playerName: scorerMap.get(s.playerId) || "Desconhecido",
        total: s._sum.goals ?? 0,
      })),
    activeSeason,
    activeSeasonStandings,
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
  LEFT_BACK: "Lateral esquerdo",
  RIGHT_BACK: "Lateral direito",
  MIDFIELDER: "Meio-campista",
  LEFT_DEFENSIVE_MIDFIELDER: "Volante esquerdo",
  RIGHT_DEFENSIVE_MIDFIELDER: "Volante direito",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta esquerda",
  RIGHT_WINGER: "Ponta direita",
};

const positionStyles: Record<string, string> = {
  GOALKEEPER: "border-amber-200 bg-amber-50 text-amber-700",
  DEFENDER: "border-emerald-200 bg-emerald-50 text-emerald-700",
  LEFT_BACK: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RIGHT_BACK: "border-emerald-200 bg-emerald-50 text-emerald-700",
  MIDFIELDER: "border-sky-200 bg-sky-50 text-sky-700",
  LEFT_DEFENSIVE_MIDFIELDER: "border-cyan-200 bg-cyan-50 text-cyan-700",
  RIGHT_DEFENSIVE_MIDFIELDER: "border-cyan-200 bg-cyan-50 text-cyan-700",
  FORWARD: "border-rose-200 bg-rose-50 text-rose-700",
  LEFT_WINGER: "border-rose-200 bg-rose-50 text-rose-700",
  RIGHT_WINGER: "border-rose-200 bg-rose-50 text-rose-700",
};

export default async function VitrinePage({ params }: VitrinePageProps) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  const stats = await getTeamStats(team.id);
  const goalBalance = stats.goalsScored - stats.goalsConceded;
  const avgGoalsScored =
    stats.totalMatches > 0 ? (stats.goalsScored / stats.totalMatches).toFixed(1) : "0.0";
  const avgGoalsConceded =
    stats.totalMatches > 0 ? (stats.goalsConceded / stats.totalMatches).toFixed(1) : "0.0";
  const topScorer = stats.topScorers[0];
  const summaryLine =
    stats.totalMatches > 0
      ? `${stats.wins}V · ${stats.draws}E · ${stats.losses}D`
      : "Temporada em construção";

  return (
    <div className="min-h-screen bg-transparent pb-16">
      <header
        className="relative overflow-hidden px-4 pb-20 pt-10 text-white lg:pb-24"
        style={{
          backgroundColor: team.primaryColor || "#1e40af",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_84%_6%,rgba(255,214,163,0.33),transparent_30%),linear-gradient(140deg,rgba(0,0,0,0.38),rgba(0,0,0,0.62)_55%,rgba(0,0,0,0.38))]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[rgba(17,20,18,0.35)]" />

        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/vitrine"
            className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
          >
            Ver outros times
          </Link>
        </div>

        <div className="relative mx-auto mt-7 grid max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="flex items-center gap-4">
              {team.badgeUrl ? (
                <img
                  src={team.badgeUrl}
                  alt={`Escudo ${team.name}`}
                  className="h-16 w-16 rounded-2xl border border-white/35 bg-black/10 object-cover shadow-[0_14px_28px_rgba(0,0,0,0.26)]"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/35 text-2xl shadow-[0_14px_28px_rgba(0,0,0,0.26)]"
                  style={{ backgroundColor: team.secondaryColor || "#3b82f6" }}
                >
                  ⚽
                </div>
              )}

              <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                  Perfil Oficial
                </span>
              </div>
            </div>

            <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.04] sm:text-5xl lg:text-6xl">
              {team.name}
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-white/86 sm:text-base">
              {team.description ||
                `Acompanhe o momento do ${team.name}, conheça o elenco e envie proposta de amistoso.`}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <a
                href="#retrospecto"
                className="rounded-full border border-white/35 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/22"
              >
                Retrospecto
              </a>
              <a
                href="#elenco"
                className="rounded-full border border-white/35 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/22"
              >
                Elenco
              </a>
              {stats.activeSeason && (
                <a
                  href="#classificacao"
                  className="rounded-full border border-white/35 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/22"
                >
                  Classificação
                </a>
              )}
              <a
                href="#amistoso"
                className="rounded-full border border-white/35 bg-white/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/22"
              >
                Solicitar amistoso
              </a>
            </div>
          </div>

          <aside className="max-w-md rounded-[24px] border border-white/30 bg-white/14 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.28)] backdrop-blur-sm lg:ml-auto lg:w-full">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
              Resumo da equipe
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{summaryLine}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/25 bg-white/10 px-3 py-2.5">
                <p className="text-xs text-white/75">Aproveitamento</p>
                <p className="text-2xl font-bold text-white">{stats.winRate}%</p>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/10 px-3 py-2.5">
                <p className="text-xs text-white/75">Média de gols pró</p>
                <p className="text-2xl font-bold text-white">{avgGoalsScored}</p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-5xl px-4">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="app-surface rounded-[22px] border border-[var(--border)] p-5 shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              Elenco
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--text)]">{team._count.players}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Jogadores ativos</p>
          </article>

          <article className="app-surface rounded-[22px] border border-[var(--border)] p-5 shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              Temporada
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--text)]">{stats.totalMatches}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Partidas disputadas</p>
          </article>

          <article className="app-surface rounded-[22px] border border-[var(--border)] p-5 shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              Saldo de gols
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--text)]">{goalBalance >= 0 ? `+${goalBalance}` : goalBalance}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {stats.goalsScored} pró · {stats.goalsConceded} contra
            </p>
          </article>

          <article className="app-surface rounded-[22px] border border-[var(--border)] p-5 shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              Artilheiro
            </p>
            <p className="mt-2 line-clamp-1 text-lg font-bold text-[var(--text)]">
              {topScorer?.playerName || "Sem registro"}
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {topScorer ? `${topScorer.total} gols` : "Ainda sem gols computados"}
            </p>
          </article>
        </section>

        {stats.totalMatches > 0 && (
          <section id="retrospecto" className="scroll-mt-40 mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="app-surface rounded-[24px] p-6 shadow-[var(--shadow-md)] sm:p-7">
              <h2 className="text-2xl font-bold text-[var(--text)]">Retrospecto da temporada</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Panorama de resultados e força ofensiva/defensiva da equipe.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-700">{stats.wins}</p>
                  <p className="text-sm text-emerald-700/80">Vitórias</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-center">
                  <p className="text-3xl font-bold text-amber-700">{stats.draws}</p>
                  <p className="text-sm text-amber-700/80">Empates</p>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-center">
                  <p className="text-3xl font-bold text-rose-700">{stats.losses}</p>
                  <p className="text-sm text-rose-700/80">Derrotas</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-[var(--border)] bg-white/60 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-[var(--text-muted)]">
                  <span>Aproveitamento</span>
                  <span>{stats.winRate}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--surface-soft)_70%,white_30%)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand)]"
                    style={{ width: `${stats.winRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="app-surface rounded-[24px] p-6 shadow-[var(--shadow-md)] sm:p-7">
              <h3 className="text-lg font-semibold text-[var(--text)]">Números por partida</h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-subtle)]">Média gols pró</p>
                  <p className="mt-1 text-3xl font-bold text-[var(--brand)]">{avgGoalsScored}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-subtle)]">Média gols contra</p>
                  <p className="mt-1 text-3xl font-bold text-rose-600">{avgGoalsConceded}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-subtle)]">Saldo da temporada</p>
                  <p className="mt-1 text-3xl font-bold text-[var(--text)]">
                    {goalBalance >= 0 ? `+${goalBalance}` : goalBalance}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {stats.topScorers.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-bold text-[var(--text)]">Artilheiros em destaque</h2>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-subtle)]">Top 5</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {stats.topScorers.map((scorer, i) => (
                <article
                  key={`${scorer.playerName}-${i}`}
                  className="app-surface rounded-[18px] border border-[var(--border)] p-4 text-center shadow-[var(--shadow-sm)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    #{i + 1}
                  </p>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold text-[var(--text)]">
                    {scorer.playerName}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[var(--brand)]">{scorer.total}</p>
                  <p className="text-xs text-[var(--text-muted)]">gols</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {stats.activeSeason && (
          <section id="classificacao" className="scroll-mt-40 mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text)]">Classificação</h2>
                <p className="text-sm text-[var(--text-muted)]">{stats.activeSeason.name}</p>
              </div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                Temporada ativa
              </p>
            </div>

            {stats.activeSeasonStandings.length > 0 ? (
              <div className="app-surface overflow-hidden rounded-[22px] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--surface-soft)]">
                        <th className="px-4 py-3 font-semibold text-[var(--text-subtle)]">#</th>
                        <th className="px-4 py-3 font-semibold text-[var(--text-subtle)]">Jogador</th>
                        <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">J</th>
                        <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">V</th>
                        <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">E</th>
                        <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">D</th>
                        <th className="px-3 py-3 text-center font-semibold text-[var(--text-subtle)]">SG</th>
                        <th className="px-4 py-3 text-center font-bold text-[var(--text)]">PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.activeSeasonStandings.map((row, idx) => (
                        <tr
                          key={row.playerId}
                          className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-soft)]"
                        >
                          <td className="px-4 py-3 font-bold text-[var(--text-subtle)]">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[var(--text)]">{row.playerName}</p>
                            <p className="text-xs text-[var(--text-muted)]">#{row.shirtNumber ?? "—"}</p>
                          </td>
                          <td className="px-3 py-3 text-center text-[var(--text)]">{row.played}</td>
                          <td className="px-3 py-3 text-center text-emerald-700">{row.won}</td>
                          <td className="px-3 py-3 text-center text-[var(--text-subtle)]">{row.drawn}</td>
                          <td className="px-3 py-3 text-center text-rose-700">{row.lost}</td>
                          <td className="px-3 py-3 text-center text-[var(--text)]">
                            {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                          </td>
                          <td className="px-4 py-3 text-center text-lg font-bold text-[var(--text)]">
                            {row.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="app-surface rounded-[22px] border border-dashed border-[var(--border-strong)] p-8 text-center text-[var(--text-muted)]">
                A classificação será exibida quando houver partidas de campeonato concluídas nesta temporada.
              </div>
            )}
          </section>
        )}

        {team.players.length > 0 ? (
          <section id="elenco" className="scroll-mt-40 mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-bold text-[var(--text)]">Elenco</h2>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                {team.players.length} atletas ativos
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.players.map((player) => (
                <Link
                  key={player.id}
                  href={`/vitrine/${slug}/jogadores/${player.id}`}
                  className="block"
                  aria-label={`Ver perfil de ${player.name}`}
                >
                <article
                  className="app-surface rounded-[20px] border border-[var(--border)] p-4 shadow-[var(--shadow-sm)] transition hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
                >
                  <div className="flex items-center gap-3">
                    {player.photoUrl ? (
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="h-12 w-12 rounded-full border border-[var(--border)] object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-lg font-bold text-white"
                        style={{ backgroundColor: team.primaryColor || "#1e40af" }}
                      >
                        {player.shirtNumber}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[var(--text)]">{player.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">#{player.shirtNumber}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${positionStyles[player.position] || "border-[var(--border)] bg-white/60 text-[var(--text-muted)]"}`}
                    >
                      {positionLabels[player.position] || player.position}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100">
                      Ver perfil →
                    </span>
                  </div>
                </article>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section id="elenco" className="scroll-mt-40 mt-10">
            <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">Elenco</h2>
            <div className="app-surface rounded-[22px] border border-dashed border-[var(--border-strong)] p-8 text-center text-[var(--text-muted)]">
              Este time ainda nao publicou jogadores ativos na vitrine.
            </div>
          </section>
        )}

        <section id="amistoso" className="scroll-mt-40 mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="app-surface rounded-[24px] p-6 shadow-[var(--shadow-md)] sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">
              Agendar partida
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold text-[var(--text)]">
              Solicitar amistoso com o {team.name}
            </h2>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Compartilhe sua proposta com datas, local e contato para acelerar a resposta da equipe.
            </p>
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-white/55 p-4 text-sm text-[var(--text-muted)]">
              Dica: inclua opcoes de horario e informacoes de estrutura do campo para facilitar a negociacao.
            </div>
          </div>

          <div className="app-surface rounded-[24px] p-6 shadow-[var(--shadow-md)] sm:p-7">
            <FriendlyRequestForm teamSlug={slug} />
          </div>
        </section>

        {(team.primaryColor || team.secondaryColor) && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">Identidade visual</h2>
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

        <section className="mt-10 rounded-[24px] border border-dashed border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-soft)_75%,white_25%)] px-6 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Quer conhecer mais equipes?
          </p>
          <h3 className="mt-2 text-2xl font-bold text-[var(--text)]">
            Explore outras vitrines publicas da plataforma
          </h3>
          <Link
            href="/vitrine"
            className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
          >
            Voltar para a vitrine
          </Link>
        </section>
      </main>

      <footer className="mt-14 border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)]">
        <p>Powered by Site Time</p>
      </footer>
    </div>
  );
}
