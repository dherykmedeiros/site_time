import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { FriendlyRequestForm } from "./FriendlyRequestForm";
import { PublicNavbar } from "@/components/PublicNavbar";

const fieldTypeLabels: Record<string, string> = {
  GRASS: "Grama",
  SYNTHETIC: "Sintético",
  FUTSAL: "Futsal",
  SOCIETY: "Society",
  OTHER: "Outro",
};

const competitiveLevelLabels: Record<string, string> = {
  CASUAL: "Casual",
  INTERMEDIATE: "Intermediário",
  COMPETITIVE: "Competitivo",
};

const positionLabels: Record<string, string> = {
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

const positionStyles: Record<string, string> = {
  GOALKEEPER: "border-amber-200 bg-amber-50 text-amber-700",
  DEFENDER: "border-emerald-200 bg-emerald-50 text-emerald-700",
  LEFT_BACK: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RIGHT_BACK: "border-emerald-200 bg-emerald-50 text-emerald-700",
  MIDFIELDER: "border-sky-200 bg-sky-50 text-sky-700",
  DEFENSIVE_MIDFIELDER: "border-cyan-200 bg-cyan-50 text-cyan-700",
  FORWARD: "border-rose-200 bg-rose-50 text-rose-700",
  LEFT_WINGER: "border-rose-200 bg-rose-50 text-rose-700",
  RIGHT_WINGER: "border-rose-200 bg-rose-50 text-rose-700",
};

async function getTeamData() {
  return prisma.team.findFirst({
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
      .filter((s) => (s._sum.goals ?? 0) > 0)
      .map((s) => ({
        playerName: scorerMap.get(s.playerId) || "Desconhecido",
        total: s._sum.goals ?? 0,
      })),
    activeSeason,
    activeSeasonStandings,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const team = await prisma.team.findFirst();
  if (!team) {
    return { title: "Portal Esportivo" };
  }
  const description = team.description || `Site oficial do ${team.name}. Acompanhe elenco, partidas e resultados.`;
  return {
    title: `${team.name} — Portal Oficial`,
    description,
    openGraph: {
      title: team.name,
      description,
      type: "website",
      url: `/`,
      siteName: "Portal Oficial",
      locale: "pt_BR",
      ...(team.badgeUrl && { images: [{ url: team.badgeUrl, width: 200, height: 200, alt: `Escudo ${team.name}` }] }),
    },
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ slot?: string }>;
}) {
  const session = await getSession();
  const team = await getTeamData();

  if (!team) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_12%_18%,rgba(58,120,99,0.17),transparent_35%),radial-gradient(circle_at_88%_0%,rgba(232,163,82,0.2),transparent_34%),linear-gradient(180deg,#f5f7f6_0%,#eef4f0_100%)]">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-[#145045]">Bem-vindo ao Portal de Time</h1>
          <p className="mt-4 text-[#355249]">
            Nenhuma equipe cadastrada no sistema. Acesse o painel administrativo para configurar.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-[#0a584b] px-6 text-sm font-semibold text-white transition hover:bg-[#084a3f] shadow-md"
          >
            Entrar no Painel Administrativo
          </Link>
        </div>
      </main>
    );
  }

  const { slot: selectedSlotId } = await searchParams;
  const stats = await getTeamStats(team.id);
  const goalBalance = stats.goalsScored - stats.goalsConceded;
  const avgGoalsScored = stats.totalMatches > 0 ? (stats.goalsScored / stats.totalMatches).toFixed(1) : "0.0";
  const avgGoalsConceded = stats.totalMatches > 0 ? (stats.goalsConceded / stats.totalMatches).toFixed(1) : "0.0";
  const topScorer = stats.topScorers[0];
  const summaryLine = stats.totalMatches > 0 ? `${stats.wins}V · ${stats.draws}E · ${stats.losses}D` : "Temporada em construção";
  const hasDiscoveryInfo = Boolean(team.city || team.region || team.fieldType || team.competitiveLevel);

  const selectedSlot = selectedSlotId
    ? team.openMatchSlots.find((slot) => slot.id === selectedSlotId) ?? null
    : null;
  const selectedSlotDateText = selectedSlot
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" }).format(selectedSlot.date)
    : null;
  const selectedSlotTimeLabel = selectedSlot?.timeLabel || "";
  const suggestedDatesInitialValue = selectedSlotDateText
    ? `Preferencia pelo horario aberto em ${selectedSlotDateText}${selectedSlotTimeLabel ? ` (${selectedSlotTimeLabel})` : ""}`
    : "";
  const suggestedVenueInitialValue = selectedSlot?.venueLabel || "";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(12,111,93,0.03),transparent_40%),linear-gradient(180deg,var(--bg)_0%,var(--bg)_100%)] pb-16 font-sans antialiased text-[var(--text)] transition-colors duration-300">
      {/* Admin Quick Link Banner */}
      {session && (
        <div className="bg-[var(--brand)] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
          Você está autenticado no painel.{" "}
          <Link href="/dashboard" className="underline hover:text-emerald-100 transition-colors">
            Acessar o Painel Administrativo do Time &rarr;
          </Link>
        </div>
      )}

      {/* Reusable Public Glassmorphic Navbar */}
      <PublicNavbar teamName={team.name} badgeUrl={team.badgeUrl} />

      {/* Premium Hero Section */}
      <header
        className="relative overflow-hidden px-4 pb-28 pt-20 text-white lg:pb-36 lg:pt-24"
        style={{
          backgroundColor: team.primaryColor || "#0a584b",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_84%_6%,rgba(244,221,183,0.18),transparent_35%),linear-gradient(140deg,rgba(0,0,0,0.48),rgba(0,0,0,0.72)_60%,rgba(0,0,0,0.48))]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--bg)] opacity-90" />

        <div className="relative mx-auto mt-4 grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-inner backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">Portal Oficial do Time</span>
            </div>

            <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl tracking-tight drop-shadow-sm">
              {team.name}
            </h1>
            <p className="max-w-2xl text-base text-white/80 sm:text-lg leading-relaxed font-medium">
              {team.description || `Seja bem-vindo ao portal oficial do ${team.name}. Acompanhe nossos resultados, estatísticas, elenco de atletas e envie propostas para amistosos.`}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#elenco"
                className="rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0a584b] shadow-lg transition-all hover:bg-emerald-50 hover:scale-105 transform active:scale-95 duration-150"
              >
                Ver Elenco Ativo
              </a>
              <a
                href="#amistoso"
                className="rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-white/20 active:scale-95 transform"
              >
                Agendar Amistoso
              </a>
            </div>
          </div>

          <aside className="max-w-md rounded-3xl border border-white/15 bg-white/5 p-7 shadow-2xl backdrop-blur-xl lg:ml-auto lg:w-full space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Resumo da Temporada</p>
              <p className="mt-2.5 text-xl font-bold text-white tracking-wide">{summaryLine}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-sm">
                <p className="text-xs text-white/60 font-semibold">Aproveitamento Geral</p>
                <p className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">{stats.winRate}%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-sm">
                <p className="text-xs text-white/60 font-semibold">Força Ofensiva</p>
                <p className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">{avgGoalsScored} / jogo</p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Core Stats Bar */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 -mt-20 relative z-10">
          <div className="app-surface p-6 shadow-md card-hover">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Elenco</p>
            <p className="mt-2.5 text-4xl font-extrabold text-[var(--text)] tracking-tight">{team._count.players}</p>
            <p className="mt-1.5 text-xs font-semibold text-[var(--text-muted)]">Atletas oficiais integrados</p>
          </div>

          <div className="app-surface p-6 shadow-md card-hover">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Partidas Disputadas</p>
            <p className="mt-2.5 text-4xl font-extrabold text-[var(--text)] tracking-tight">{stats.totalMatches}</p>
            <p className="mt-1.5 text-xs font-semibold text-[var(--text-muted)]">Jogos válidos computados</p>
          </div>

          <div className="app-surface p-6 shadow-md card-hover">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Saldo de Gols</p>
            <p className="mt-2.5 text-4xl font-extrabold text-[var(--text)] tracking-tight">{goalBalance >= 0 ? `+${goalBalance}` : goalBalance}</p>
            <p className="mt-1.5 text-xs font-semibold text-[var(--text-muted)]">
              {stats.goalsScored} pró · {stats.goalsConceded} contra
            </p>
          </div>

          <div className="app-surface p-6 shadow-md card-hover">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Principal Artilheiro</p>
            <p className="mt-2.5 line-clamp-1 text-lg font-extrabold text-[var(--brand)] tracking-tight">
              {topScorer?.playerName || "Ainda sem gols"}
            </p>
            <p className="mt-1.5 text-xs font-semibold text-[var(--text-muted)]">
              {topScorer ? `${topScorer.total} gols anotados` : "Aguardando gols na temporada"}
            </p>
          </div>
        </section>

        {/* Retrospect Section */}
        {stats.totalMatches > 0 && (
          <section id="retrospecto" className="scroll-mt-24 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="app-surface p-6 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">Retrospecto Geral</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Histórico quantitativo de partidas oficiais disputadas e aproveitamento de vitórias.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-500/10 p-5 text-center transition hover:bg-emerald-500/15 duration-200">
                  <p className="text-4xl font-black text-emerald-600">{stats.wins}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-emerald-700 mt-1">Vitórias</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-500/10 p-5 text-center transition hover:bg-amber-500/15 duration-200">
                  <p className="text-4xl font-black text-amber-500">{stats.draws}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-amber-600 mt-1">Empates</p>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-500/10 p-5 text-center transition hover:bg-rose-500/15 duration-200">
                  <p className="text-4xl font-black text-rose-600">{stats.losses}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-rose-600 mt-1">Derrotas</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
                <div className="mb-2.5 flex items-center justify-between text-sm font-bold text-[var(--text)]">
                  <span>Aproveitamento do Time</span>
                  <span>{stats.winRate}%</span>
                </div>
                <div className="h-3.5 overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand)] transition-all duration-500"
                    style={{ width: `${stats.winRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="app-surface p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--text)]">Produtividade Técnica</h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Médias estatísticas de performance ofensiva e defensiva nas rodadas oficiais da temporada.
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 flex justify-between items-center card-hover">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">Média Gols Feitos</p>
                    <p className="mt-1.5 text-3xl font-extrabold text-[var(--brand)]">{avgGoalsScored}</p>
                  </div>
                  <span className="text-3xl">⚽</span>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 flex justify-between items-center card-hover">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">Média Gols Sofridos</p>
                    <p className="mt-1.5 text-3xl font-extrabold text-rose-500">{avgGoalsConceded}</p>
                  </div>
                  <span className="text-3xl">🛡️</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Top Scorers Gallery */}
        {stats.topScorers.length > 0 && (
          <section className="scroll-mt-24">
            <div className="mb-6 flex items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">Artilheiros em Destaque</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">Nossos goleadores oficiais na temporada</p>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Top Goleadores</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {stats.topScorers.map((scorer, i) => (
                <article
                  key={`${scorer.playerName}-${i}`}
                  className="app-surface p-5 text-center card-hover flex flex-col justify-between"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">#{i + 1} Artilheiro</p>
                  <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-bold text-[var(--text)]">{scorer.playerName}</p>
                  <div>
                    <p className="mt-2.5 text-4xl font-black text-[var(--brand)]">{scorer.total}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] mt-1">gols anotados</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Active Season Standings */}
        {stats.activeSeason && (
          <section id="classificacao" className="scroll-mt-24">
            <div className="mb-6 flex items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">Tabela Individual da Temporada</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">{stats.activeSeason.name}</p>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Campeonato Ativo</p>
            </div>

            {stats.activeSeasonStandings.length > 0 ? (
              <div className="app-surface overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm divide-y divide-[var(--border)]">
                    <thead>
                      <tr className="bg-[var(--bg)]">
                        <th className="px-5 py-4 font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Pos</th>
                        <th className="px-5 py-4 font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Atleta</th>
                        <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Jogos</th>
                        <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Vitórias</th>
                        <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Empates</th>
                        <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Derrotas</th>
                        <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">SG</th>
                        <th className="px-5 py-4 text-center font-extrabold text-[var(--text)] text-xs uppercase tracking-[0.12em]">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-elevated)]">
                      {stats.activeSeasonStandings.map((row, idx) => (
                        <tr
                          key={row.playerId}
                          className="hover:bg-[var(--bg)] transition-colors duration-150"
                        >
                          <td className="px-5 py-4 font-extrabold text-[var(--text-muted)]">{idx + 1}</td>
                          <td className="px-5 py-4">
                            <p className="font-bold text-[var(--text)]">{row.playerName}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">Camisa #{row.shirtNumber ?? "—"}</p>
                          </td>
                          <td className="px-4 py-4 text-center font-semibold text-[var(--text)]">{row.played}</td>
                          <td className="px-4 py-4 text-center font-semibold text-emerald-600">{row.won}</td>
                          <td className="px-4 py-4 text-center font-semibold text-[var(--text-muted)]">{row.drawn}</td>
                          <td className="px-4 py-4 text-center font-semibold text-rose-500">{row.lost}</td>
                          <td className="px-4 py-4 text-center font-semibold text-[var(--text)]">
                            {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                          </td>
                          <td className="px-5 py-4 text-center text-base font-black text-[var(--brand)]">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="app-surface p-12 text-center text-[var(--text-muted)] border-dashed">
                Estatísticas individuais de campeonato serão exibidas assim que partidas oficiais forem disputadas.
              </div>
            )}
          </section>
        )}

        {/* Squad Section */}
        <section id="elenco" className="scroll-mt-24">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">Nosso Elenco</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Conheça os guerreiros do manto oficial</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {team.players.length} Atletas Ativos
            </p>
          </div>

          {team.players.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.players.map((player) => (
                <Link
                  key={player.id}
                  href={`/jogadores/${player.id}`}
                  className="group block"
                  aria-label={`Ver perfil de ${player.name}`}
                >
                  <article className="app-surface p-5 card-hover">
                    <div className="flex items-center gap-4">
                      {player.photoUrl ? (
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="h-14 w-14 rounded-2xl border border-[var(--border)] object-cover shadow-sm transition group-hover:scale-105 duration-200"
                        />
                      ) : (
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 text-lg font-black text-white shadow-sm transition group-hover:scale-105 duration-200"
                          style={{ backgroundColor: team.primaryColor || "#0c6f5d" }}
                        >
                          {player.shirtNumber}
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors duration-150">{player.name}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Camisa #{player.shirtNumber}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <span className={`inline-flex rounded-full border px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] ${positionStyles[player.position] || "border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)]"}`}>
                        {positionLabels[player.position] || player.position}
                      </span>
                      <span className="text-xs font-bold text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                        Ver Perfil &rarr;
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="app-surface p-12 text-center text-[var(--text-muted)] border-dashed">
              Nenhum jogador ativo cadastrado no momento.
            </div>
          )}
        </section>

        {/* Match Availability & Open Slots */}
        {(team.openMatchSlots.length > 0 || hasDiscoveryInfo) && (
          <section id="agenda-aberta" className="scroll-mt-24 app-surface p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Disponibilidade de Agenda</p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[var(--text)]">Datas Disponíveis para Amistoso</h2>
              </div>
              {team.openMatchSlots.length > 0 && (
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-emerald-600">
                  {team.openMatchSlots.length} Horário(s) Aberto(s)
                </span>
              )}
            </div>

            {hasDiscoveryInfo && (
              <div className="flex flex-wrap gap-2.5 text-xs font-semibold text-[var(--text-muted)]">
                {team.city && <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2">Cidade: {team.city}</span>}
                {team.region && <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2">Região: {team.region}</span>}
                {team.fieldType && <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2">Campo: {fieldTypeLabels[team.fieldType]}</span>}
                {team.competitiveLevel && (
                  <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2">Nível: {competitiveLevelLabels[team.competitiveLevel]}</span>
                )}
              </div>
            )}

            {team.openMatchSlots.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 pt-2">
                {team.openMatchSlots.map((slot) => (
                  <article key={slot.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 flex flex-col justify-between shadow-sm card-hover">
                    <div className="space-y-2">
                      <p className="text-base font-extrabold text-[var(--text)]">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" }).format(slot.date)}
                      </p>
                      <p className="text-xs font-semibold text-[var(--text-muted)]">
                        {(slot.timeLabel || "Horário a definir") + " • " + (slot.venueLabel || "Local a definir")}
                      </p>
                      {slot.notes && <p className="text-[11px] text-[var(--text-muted)] italic pt-1">Nota: {slot.notes}</p>}
                    </div>
                    <Link
                      href={`/?slot=${slot.id}#amistoso`}
                      className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--brand)] bg-[var(--bg-elevated)] px-5 text-xs font-bold text-[var(--brand)] transition-all hover:bg-[var(--brand)] hover:text-white hover:scale-105 active:scale-95 transform duration-150 shadow-sm"
                    >
                      Propor jogo neste horário
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)] pt-2">
                No momento não temos datas abertas cadastradas, mas você pode sugerir um dia e local no formulário abaixo!
              </p>
            )}
          </section>
        )}

        {/* Challenging Form Section */}
        <section id="amistoso" className="scroll-mt-24 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="app-surface p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Agendamento Externo</p>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-[var(--text)]">
                Desafie o {team.name}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)] font-medium">
                Quer marcar um jogo amistoso contra nós? Preencha o formulário ao lado sugerindo datas, locais e valores de cota de arbitragem se houver.
              </p>
              <p className="text-sm leading-relaxed text-[var(--text-muted)] font-medium">
                Nossa comissão administrativa avaliará sua proposta e entrará em contato via e-mail o mais rápido possível!
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-xs text-emerald-700 leading-relaxed font-semibold">
              💡 <strong>Dica de Sucesso:</strong> Fornecer opções adicionais de data e informar se o local tem estrutura (vestiário, iluminação, arbitragem paga) facilita o aceite do desafio!
            </div>
          </div>

          <div className="app-surface p-6 sm:p-8 shadow-md">
            {selectedSlot && (
              <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 font-bold animate-fade-in">
                🎯 Proposta personalizada para a data: {selectedSlotDateText}.
              </div>
            )}
            <FriendlyRequestForm
              teamSlug={team.slug}
              initialSuggestedDates={suggestedDatesInitialValue}
              initialSuggestedVenue={suggestedVenueInitialValue}
            />
          </div>
        </section>

        {/* Identity Details */}
        {(team.primaryColor || team.secondaryColor) && (
          <section className="text-center pt-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-5">Manto & Cores Oficiais</h2>
            <div className="flex justify-center gap-6">
              {team.primaryColor && (
                <div className="flex items-center gap-3 bg-[var(--bg-elevated)] rounded-full border border-[var(--border)] px-5 py-2.5 shadow-sm card-hover">
                  <div className="h-6 w-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: team.primaryColor }} />
                  <span className="text-xs font-extrabold text-[var(--text)]">Cor Principal</span>
                </div>
              )}
              {team.secondaryColor && (
                <div className="flex items-center gap-3 bg-[var(--bg-elevated)] rounded-full border border-[var(--border)] px-5 py-2.5 shadow-sm card-hover">
                  <div className="h-6 w-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: team.secondaryColor }} />
                  <span className="text-xs font-extrabold text-[var(--text)]">Cor Secundária</span>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mx-auto max-w-6xl mt-24 border-t border-[var(--border)] px-4 pt-8 text-center text-xs font-semibold text-[var(--text-muted)] sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} {team.name}. Todos os direitos reservados.</p>
        <p className="mt-1.5 text-[var(--text-muted)] font-medium">Desenvolvido profissionalmente sob a plataforma oficial de times esportivos.</p>
      </footer>
    </div>
  );
}
}
