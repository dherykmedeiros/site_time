import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { FriendlyRequestForm } from "./FriendlyRequestForm";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(12,111,93,0.05),transparent_40%),linear-gradient(180deg,#f8fbf9_0%,#f0f5f2_100%)] pb-16 font-sans antialiased text-[#1d2724]">
      {/* Admin Quick Link Banner */}
      {session && (
        <div className="bg-[#0c6f5d] px-4 py-2 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-[#0a5c4d]">
          Você está autenticado no painel.{" "}
          <Link href="/dashboard" className="underline hover:text-[#f3f9f7]">
            Acessar o Painel Administrativo do Time &rarr;
          </Link>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {team.badgeUrl ? (
            <img src={team.badgeUrl} alt="Escudo" className="h-10 w-10 rounded-xl object-cover" />
          ) : (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c6f5d] text-white">⚽</span>
          )}
          <span className="font-display text-xl font-bold tracking-tight text-[#0f3a30]">{team.name}</span>
        </Link>
        <div className="flex items-center gap-4">
          <a href="#elenco" className="hidden text-sm font-semibold text-[#355249] hover:text-[#0c6f5d] sm:block">Elenco</a>
          <a href="#retrospecto" className="hidden text-sm font-semibold text-[#355249] hover:text-[#0c6f5d] sm:block">Desempenho</a>
          <a href="#amistoso" className="hidden text-sm font-semibold text-[#355249] hover:text-[#0c6f5d] sm:block">Solicitar Amistoso</a>
          <Link
            href="/login"
            className="inline-flex min-h-9 items-center justify-center rounded-full bg-[#0c6f5d] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#0a5c4d]"
          >
            Acesso Restrito
          </Link>
        </div>
      </nav>

      {/* Premium Hero Section */}
      <header
        className="relative overflow-hidden px-4 pb-24 pt-16 text-white lg:pb-32 lg:pt-20"
        style={{
          backgroundColor: team.primaryColor || "#0a584b",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_84%_6%,rgba(244,221,183,0.22),transparent_35%),linear-gradient(140deg,rgba(0,0,0,0.4),rgba(0,0,0,0.65)_60%,rgba(0,0,0,0.4))]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#f8fbf9]/15" />

        <div className="relative mx-auto mt-4 grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">Portal Oficial do Time</span>
            </div>

            <h1 className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl tracking-tight">
              {team.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/86 sm:text-lg leading-relaxed">
              {team.description || `Seja bem-vindo ao portal oficial do ${team.name}. Acompanhe nossos resultados, estatísticas, plantel de atletas e envie propostas para amistosos.`}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#elenco"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#0a584b] shadow-md transition hover:bg-[#f1faf6] hover:scale-105 transform duration-150"
              >
                Ver Elenco Ativo
              </a>
              <a
                href="#amistoso"
                className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/20"
              >
                Agendar Amistoso
              </a>
            </div>
          </div>

          <aside className="max-w-md rounded-3xl border border-white/20 bg-white/12 p-6 shadow-2xl backdrop-blur-md lg:ml-auto lg:w-full">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Resumo da Temporada</p>
            <p className="mt-2 text-base font-bold text-white">{summaryLine}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3.5">
                <p className="text-xs text-white/70">Aproveitamento Geral</p>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.winRate}%</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3.5">
                <p className="text-xs text-white/70">Força Ofensiva (Gols Pró)</p>
                <p className="text-3xl font-extrabold text-white mt-1">{avgGoalsScored} / jogo</p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Core Stats Bar */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 -mt-14 relative z-10">
          <div className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-[0_12px_30px_rgba(15,58,48,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b857c]">Elenco</p>
            <p className="mt-2 text-4xl font-extrabold text-[#0f3a30]">{team._count.players}</p>
            <p className="mt-1 text-sm text-[#4f746b]">Jogadores integrados</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-[0_12px_30px_rgba(15,58,48,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b857c]">Partidas Disputadas</p>
            <p className="mt-2 text-4xl font-extrabold text-[#0f3a30]">{stats.totalMatches}</p>
            <p className="mt-1 text-sm text-[#4f746b]">Jogos computados</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-[0_12px_30px_rgba(15,58,48,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b857c]">Saldo de Gols</p>
            <p className="mt-2 text-4xl font-extrabold text-[#0f3a30]">{goalBalance >= 0 ? `+${goalBalance}` : goalBalance}</p>
            <p className="mt-1 text-sm text-[#4f746b]">
              {stats.goalsScored} pró · {stats.goalsConceded} contra
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-[0_12px_30px_rgba(15,58,48,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b857c]">Principal Artilheiro</p>
            <p className="mt-2 line-clamp-1 text-xl font-bold text-[#0c6f5d]">
              {topScorer?.playerName || "Ainda sem gols"}
            </p>
            <p className="mt-1 text-sm text-[#4f746b]">
              {topScorer ? `${topScorer.total} gols anotados` : "Aguardando início dos campeonatos"}
            </p>
          </div>
        </section>

        {/* Retrospect Section */}
        {stats.totalMatches > 0 && (
          <section id="retrospecto" className="scroll-mt-24 mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-[0_12px_30px_rgba(15,58,48,0.04)] sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#0f3a30]">Retrospecto de Partidas</h2>
              <p className="mt-2 text-sm text-[#4f746b]">
                Histórico quantitativo de partidas oficiais disputadas e aproveitamento de vitórias.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-center">
                  <p className="text-4xl font-extrabold text-emerald-800">{stats.wins}</p>
                  <p className="text-sm font-semibold text-emerald-800/80 mt-1">Vitórias</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 text-center">
                  <p className="text-4xl font-extrabold text-amber-800">{stats.draws}</p>
                  <p className="text-sm font-semibold text-amber-800/80 mt-1">Empates</p>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-5 text-center">
                  <p className="text-4xl font-extrabold text-rose-800">{stats.losses}</p>
                  <p className="text-sm font-semibold text-rose-800/80 mt-1">Derrotas</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-[#e5ece8] bg-[#f8fbf9] p-5">
                <div className="mb-2.5 flex items-center justify-between text-sm font-bold text-[#355249]">
                  <span>Aproveitamento do Time</span>
                  <span>{stats.winRate}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#e5ece8]">
                  <div
                    className="h-full rounded-full bg-[#0c6f5d]"
                    style={{ width: `${stats.winRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-[0_12px_30px_rgba(15,58,48,0.04)] sm:p-8">
              <h3 className="text-lg font-bold text-[#0f3a30]">Produtividade Técnica</h3>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-[#e5ece8] bg-[#f8fbf9] p-4.5 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b857c]">Média Gols Feitos</p>
                    <p className="mt-1 text-3xl font-extrabold text-[#0c6f5d]">{avgGoalsScored}</p>
                  </div>
                  <span className="text-2xl">⚽</span>
                </div>
                <div className="rounded-2xl border border-[#e5ece8] bg-[#f8fbf9] p-4.5 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b857c]">Média Gols Sofridos</p>
                    <p className="mt-1 text-3xl font-extrabold text-rose-700">{avgGoalsConceded}</p>
                  </div>
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Top Scorers Gallery */}
        {stats.topScorers.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-3 border-b border-[#e5ece8] pb-4">
              <h2 className="text-2xl font-bold tracking-tight text-[#0f3a30]">Artilheiros em Destaque</h2>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b857c]">Top Artilharia</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {stats.topScorers.map((scorer, i) => (
                <article
                  key={`${scorer.playerName}-${i}`}
                  className="bg-white rounded-2xl border border-[#e5ece8] p-5 text-center shadow-[0_4px_20px_rgba(15,58,48,0.02)] transition hover:shadow-md hover:border-[#b7d8ce]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8ea49c]">#{i + 1} Artilheiro</p>
                  <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-bold text-[#0f3a30]">{scorer.playerName}</p>
                  <p className="mt-2 text-4xl font-black text-[#0c6f5d]">{scorer.total}</p>
                  <p className="text-xs font-semibold text-[#4f746b]">gols marcados</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Active Season Standings */}
        {stats.activeSeason && (
          <section id="classificacao" className="scroll-mt-24 mt-16">
            <div className="mb-6 flex items-end justify-between gap-3 border-b border-[#e5ece8] pb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0f3a30]">Desempenho no Campeonato</h2>
                <p className="text-sm text-[#4f746b] mt-1">{stats.activeSeason.name}</p>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0c6f5d]">Tabela Ativa</p>
            </div>

            {stats.activeSeasonStandings.length > 0 ? (
              <div className="bg-white overflow-hidden rounded-3xl border border-[#e5ece8] shadow-[0_12px_30px_rgba(15,58,48,0.03)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#e5ece8] bg-[#f8fbf9]">
                        <th className="px-5 py-4 font-bold text-[#4f746b]">Pos</th>
                        <th className="px-5 py-4 font-bold text-[#4f746b]">Atleta</th>
                        <th className="px-4 py-4 text-center font-bold text-[#4f746b]">J</th>
                        <th className="px-4 py-4 text-center font-bold text-[#4f746b]">V</th>
                        <th className="px-4 py-4 text-center font-bold text-[#4f746b]">E</th>
                        <th className="px-4 py-4 text-center font-bold text-[#4f746b]">D</th>
                        <th className="px-4 py-4 text-center font-bold text-[#4f746b]">SG</th>
                        <th className="px-5 py-4 text-center font-extrabold text-[#0f3a30]">PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.activeSeasonStandings.map((row, idx) => (
                        <tr
                          key={row.playerId}
                          className="border-b border-[#e5ece8] last:border-0 hover:bg-[#f8fbf9]/60 transition-colors"
                        >
                          <td className="px-5 py-4 font-extrabold text-[#6b857c]">{idx + 1}</td>
                          <td className="px-5 py-4">
                            <p className="font-bold text-[#0f3a30]">{row.playerName}</p>
                            <p className="text-xs text-[#6b857c]">Camisa #{row.shirtNumber ?? "—"}</p>
                          </td>
                          <td className="px-4 py-4 text-center font-semibold text-[#0f3a30]">{row.played}</td>
                          <td className="px-4 py-4 text-center font-semibold text-emerald-700">{row.won}</td>
                          <td className="px-4 py-4 text-center font-semibold text-[#6b857c]">{row.drawn}</td>
                          <td className="px-4 py-4 text-center font-semibold text-rose-700">{row.lost}</td>
                          <td className="px-4 py-4 text-center font-semibold text-[#0f3a30]">
                            {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                          </td>
                          <td className="px-5 py-4 text-center text-base font-black text-[#0c6f5d]">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-[#b7d8ce] p-8 text-center text-[#4f746b]">
                Estatísticas individuais de campeonato serão exibidas assim que partidas oficiais forem computadas.
              </div>
            )}
          </section>
        )}

        {/* Squad Section */}
        <section id="elenco" className="scroll-mt-24 mt-16">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-[#e5ece8] pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#0f3a30]">Nosso Elenco</h2>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b857c]">
              {team.players.length} Atletas Inscritos
            </p>
          </div>

          {team.players.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {team.players.map((player) => (
                <Link
                  key={player.id}
                  href={`/jogadores/${player.id}`}
                  className="group block"
                  aria-label={`Ver perfil de ${player.name}`}
                >
                  <article className="bg-white rounded-3xl border border-[#e5ece8] p-5 shadow-[0_4px_25px_rgba(15,58,48,0.01)] transition hover:border-[#0c6f5d] hover:shadow-md hover:-translate-y-0.5 transform duration-150">
                    <div className="flex items-center gap-4">
                      {player.photoUrl ? (
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="h-14 w-14 rounded-2xl border border-[#e5ece8] object-cover shadow-sm"
                        />
                      ) : (
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 text-lg font-black text-white shadow-sm"
                          style={{ backgroundColor: team.primaryColor || "#0c6f5d" }}
                        >
                          {player.shirtNumber}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-[#0f3a30] group-hover:text-[#0c6f5d] transition-colors">{player.name}</p>
                        <p className="text-xs text-[#6b857c]">Camisa #{player.shirtNumber}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] ${positionStyles[player.position] || "border-[#e5ece8] bg-white/60 text-[#6b857c]"}`}>
                        {positionLabels[player.position] || player.position}
                      </span>
                      <span className="text-xs font-bold text-[#0c6f5d] opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver Perfil &rarr;
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-[#b7d8ce] p-8 text-center text-[#4f746b]">
              Nenhum jogador ativo cadastrado no momento.
            </div>
          )}
        </section>

        {/* Match Availability & Open Slots */}
        {(team.openMatchSlots.length > 0 || hasDiscoveryInfo) && (
          <section id="agenda-aberta" className="scroll-mt-24 mt-16 bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-[0_12px_30px_rgba(15,58,48,0.03)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5ece8] pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b857c]">Disponibilidade de Agenda</p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0f3a30]">Datas Disponíveis para Amistoso</h2>
              </div>
              {team.openMatchSlots.length > 0 && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-800">
                  {team.openMatchSlots.length} Horário(s) Aberto(s)
                </span>
              )}
            </div>

            {hasDiscoveryInfo && (
              <div className="mt-5 flex flex-wrap gap-2.5 text-xs font-semibold text-[#4f746b]">
                {team.city && <span className="rounded-full border border-[#e5ece8] bg-[#f8fbf9] px-3 py-1.5">Cidade: {team.city}</span>}
                {team.region && <span className="rounded-full border border-[#e5ece8] bg-[#f8fbf9] px-3 py-1.5">Região: {team.region}</span>}
                {team.fieldType && <span className="rounded-full border border-[#e5ece8] bg-[#f8fbf9] px-3 py-1.5">Campo: {fieldTypeLabels[team.fieldType]}</span>}
                {team.competitiveLevel && (
                  <span className="rounded-full border border-[#e5ece8] bg-[#f8fbf9] px-3 py-1.5">Nível: {competitiveLevelLabels[team.competitiveLevel]}</span>
                )}
              </div>
            )}

            {team.openMatchSlots.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {team.openMatchSlots.map((slot) => (
                  <article key={slot.id} className="rounded-2xl border border-[#e5ece8] bg-[#f8fbf9]/60 p-5 flex flex-col justify-between">
                    <div>
                      <p className="text-base font-bold text-[#0f3a30]">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" }).format(slot.date)}
                      </p>
                      <p className="mt-1 text-sm text-[#4f746b]">
                        {(slot.timeLabel || "Horário a definir") + " • " + (slot.venueLabel || "Local a definir")}
                      </p>
                      {slot.notes && <p className="mt-2 text-xs text-[#6b857c] italic">Nota: {slot.notes}</p>}
                    </div>
                    <Link
                      href={`/?slot=${slot.id}#amistoso`}
                      className="mt-4 inline-flex min-h-9 items-center justify-center rounded-full border border-[#0c6f5d] bg-white px-4 text-xs font-bold text-[#0c6f5d] transition hover:bg-[#0c6f5d] hover:text-white"
                    >
                      Propor jogo neste horário
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-[#4f746b]">
                No momento não temos datas abertas cadastradas, mas você pode sugerir um dia e local no formulário abaixo!
              </p>
            )}
          </section>
        )}

        {/* Challenging Form Section */}
        <section id="amistoso" className="scroll-mt-24 mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-[0_12px_30px_rgba(15,58,48,0.03)] sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b857c]">Agendamento Externo</p>
              <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-[#0f3a30]">
                Desafie o {team.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#4f746b]">
                Quer marcar um jogo amistoso contra nós? Preencha o formulário ao lado sugerindo datas, locais e valores de cota de arbitragem se houver.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#4f746b]">
                Nossa comissão administrativa avaliará sua proposta e entrará em contato via e-mail o mais rápido possível!
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4.5 text-xs text-emerald-800 leading-relaxed">
              💡 <strong>Dica de Sucesso:</strong> Fornecer opções adicionais de data e informar se o local tem estrutura (vestiário, iluminação, arbitragem paga) facilita o aceite do desafio!
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-[0_12px_30px_rgba(15,58,48,0.03)] sm:p-8">
            {selectedSlot && (
              <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800 font-semibold animate-fade-in">
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
          <section className="mt-16 text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6b857c] mb-4">Manto & Cores Oficiais</h2>
            <div className="flex justify-center gap-6">
              {team.primaryColor && (
                <div className="flex items-center gap-2.5 bg-white rounded-full border border-[#e5ece8] px-4 py-2 shadow-sm">
                  <div className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: team.primaryColor }} />
                  <span className="text-xs font-bold text-[#355249]">Cor Principal</span>
                </div>
              )}
              {team.secondaryColor && (
                <div className="flex items-center gap-2.5 bg-white rounded-full border border-[#e5ece8] px-4 py-2 shadow-sm">
                  <div className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: team.secondaryColor }} />
                  <span className="text-xs font-bold text-[#355249]">Cor Secundária</span>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mx-auto max-w-6xl mt-24 border-t border-[#e5ece8] px-4 pt-8 text-center text-xs font-semibold text-[#8ea49c] sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} {team.name}. Todos os direitos reservados.</p>
        <p className="mt-1 text-[#b5c7c0]">Desenvolvido profissionalmente sob a plataforma de times esportivos.</p>
      </footer>
    </div>
  );
}
