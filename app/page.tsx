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
  GOALKEEPER: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  DEFENDER: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  LEFT_BACK: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  RIGHT_BACK: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  MIDFIELDER: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  DEFENSIVE_MIDFIELDER: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  FORWARD: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  LEFT_WINGER: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  RIGHT_WINGER: "border-rose-500/30 bg-rose-500/10 text-rose-400",
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
    title: `${team.name} — Arena Oficial`,
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030708] px-6 py-20 text-center">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#10b981] opacity-10 rounded-full blur-[110px]" />
        
        <div className="relative mx-auto max-w-xl rounded-3xl border border-[rgba(16,185,129,0.18)] bg-[rgba(10,20,18,0.6)] p-10 shadow-2xl backdrop-blur-xl">
          <span className="text-4xl">🏆</span>
          <h1 className="mt-6 text-3xl font-black text-white tracking-tight uppercase">Portal de Time Esportivo</h1>
          <p className="mt-3.5 text-[#8fa39b] text-sm leading-relaxed">
            Nenhuma equipe foi configurada no sistema. Acesse as configurações de diretoria para cadastrar as cores, escudo e elenco da sua equipe.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#10b981] px-8 text-xs font-bold uppercase tracking-[0.15em] text-[#010403] shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:bg-[#34d399] hover:scale-105"
          >
            Acessar Diretoria
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
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(selectedSlot.date)
    : null;
  const selectedSlotTimeLabel = selectedSlot?.timeLabel || "";
  const suggestedDatesInitialValue = selectedSlotDateText
    ? `Preferencia pelo horario aberto em ${selectedSlotDateText}${selectedSlotTimeLabel ? ` (${selectedSlotTimeLabel})` : ""}`
    : "";
  const suggestedVenueInitialValue = selectedSlot?.venueLabel || "";

  return (
    <div className="relative min-h-screen bg-[#030708] pb-24 text-[#f0f7f4] font-sans antialiased overflow-x-hidden selection:bg-[#10b981] selection:text-[#020506]">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#10b981] opacity-5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[1200px] right-10 w-[400px] h-[400px] bg-[#06b6d4] opacity-5 rounded-full blur-[130px] pointer-events-none" />

      {/* Admin Quick Link Banner */}
      {session && (
        <div className="relative z-50 bg-gradient-to-r from-[#0f9e77] to-[#046f5b] px-4 py-2 text-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow-md">
          Acesso Administrativo Habilitado —{" "}
          <Link href="/dashboard" className="underline hover:text-emerald-200 transition-colors">
            Ir para Painel de Controle &rarr;
          </Link>
        </div>
      )}

      {/* Public Glassmorphic Navbar */}
      <PublicNavbar teamName={team.name} badgeUrl={team.badgeUrl} />

      {/* Premium Cyber-Athletic Hero */}
      <header className="relative overflow-hidden px-4 pb-28 pt-20 lg:pb-36 lg:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_80%_65%,rgba(6,182,212,0.08),transparent_45%)]" />
        
        <div className="relative mx-auto mt-4 grid max-w-6xl gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.06)] px-4 py-2 shadow-inner backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#34d399]">Liga Oficial VARzea</span>
            </div>

            <h1 className="text-balance text-5xl font-black leading-[1.05] sm:text-6xl lg:text-7xl uppercase tracking-tight">
              <span className="block text-white">ARENA OFICIAL</span>
              <span className="block text-neon-gradient">{team.name}</span>
            </h1>
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[#8fa39b] font-semibold">
              {team.description || `Seja bem-vindo ao portal oficial do ${team.name}. Acompanhe nossos resultados, estatísticas, elenco de atletas e envie propostas para amistosos.`}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#elenco"
                className="rounded-full bg-[#10b981] px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#010403] shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:bg-[#34d399] hover:scale-105 transform active:scale-95 duration-150"
              >
                Conhecer Elenco
              </a>
              <a
                href="#amistoso"
                className="rounded-full border border-[rgba(255,255,255,0.15)] bg-white/5 px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-white/10 active:scale-95 transform transition-all"
              >
                Desafiar Equipe
              </a>
            </div>
          </div>

          <aside className="relative overflow-hidden max-w-md rounded-3xl border border-[rgba(16,185,129,0.25)] bg-[rgba(10,20,18,0.7)] p-8 shadow-2xl backdrop-blur-xl lg:ml-auto lg:w-full space-y-6">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#34d399] to-transparent opacity-50 animate-pulse" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8fa39b]">Status da Temporada</p>
              <p className="mt-2.5 text-2xl font-black tracking-wide text-white">{summaryLine}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4.5">
                <p className="text-[11px] text-[#8fa39b] font-bold uppercase tracking-wider">Aproveitamento Geral</p>
                <p className="text-4xl font-black text-[#10b981] mt-1 tracking-tight">{stats.winRate}%</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4.5">
                <p className="text-[11px] text-[#8fa39b] font-bold uppercase tracking-wider">Ataque Produtivo</p>
                <p className="text-4xl font-black text-white mt-1 tracking-tight">{avgGoalsScored} <span className="text-xs font-semibold text-[#8fa39b]">/ jogo</span></p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Core Stats Bar */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 -mt-24 relative z-10">
          <div className="app-surface p-6 hover:border-[#10b981] shadow-lg card-hover">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa39b]">Atletas Ativos</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-white">{team._count.players}</p>
            <p className="mt-1 text-xs text-[#8fa39b] font-semibold">Integrados ao elenco principal</p>
          </div>

          <div className="app-surface p-6 hover:border-[#10b981] shadow-lg card-hover">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa39b]">Jogos Efetuados</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-white">{stats.totalMatches}</p>
            <p className="mt-1 text-xs text-[#8fa39b] font-semibold">Partidas oficiais computadas</p>
          </div>

          <div className="app-surface p-6 hover:border-[#10b981] shadow-lg card-hover">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa39b]">Saldo de Gols</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-white">{goalBalance >= 0 ? `+${goalBalance}` : goalBalance}</p>
            <p className="mt-1 text-xs text-[#8fa39b] font-semibold">
              {stats.goalsScored} pró · {stats.goalsConceded} contra
            </p>
          </div>

          <div className="app-surface p-6 hover:border-[#10b981] shadow-lg card-hover">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fa39b]">Principal Artilheiro</p>
            <p className="mt-2 line-clamp-1 text-lg font-black text-[#10b981] tracking-tight uppercase">
              {topScorer?.playerName || "Aguardando gols"}
            </p>
            <p className="mt-1 text-xs text-[#8fa39b] font-semibold">
              {topScorer ? `${topScorer.total} gols marcados` : "Sem registro de artilharia"}
            </p>
          </div>
        </section>

        {/* Retrospect Section */}
        {stats.totalMatches > 0 && (
          <section id="retrospecto" className="scroll-mt-24 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="app-surface p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">Retrospecto Geral</h2>
                <p className="mt-1.5 text-xs text-[#8fa39b] font-semibold">
                  Histórico geral acumulado de resultados em confrontos oficiais.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.06)] p-5 text-center">
                  <p className="text-4xl font-black text-[#34d399]">{stats.wins}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#34d399] mt-1.5">Vitórias</p>
                </div>
                <div className="rounded-2xl border border-[rgba(245,158,11,0.15)] bg-[rgba(245,158,11,0.06)] p-5 text-center">
                  <p className="text-4xl font-black text-[#fbbf24]">{stats.draws}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] mt-1.5">Empates</p>
                </div>
                <div className="rounded-2xl border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.06)] p-5 text-center">
                  <p className="text-4xl font-black text-[#f87171]">{stats.losses}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f87171] mt-1.5">Derrotas</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="mb-2.5 flex items-center justify-between text-xs font-black uppercase text-white">
                  <span>Aproveitamento da Equipe</span>
                  <span className="text-[#10b981]">{stats.winRate}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10 p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#10b981] to-[#34d399] transition-all duration-700"
                    style={{ width: `${stats.winRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="app-surface p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xl font-black uppercase text-white tracking-tight">Produtividade de Jogo</h3>
                <p className="mt-1 text-xs text-[#8fa39b] font-semibold">
                  Médias estatísticas ofensivas e defensivas por partida.
                </p>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex justify-between items-center card-hover">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8fa39b]">Média Gols Feitos</p>
                    <p className="mt-1 text-3xl font-black text-[#10b981]">{avgGoalsScored}</p>
                  </div>
                  <span className="text-3xl">⚽</span>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 flex justify-between items-center card-hover">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8fa39b]">Média Gols Sofridos</p>
                    <p className="mt-1 text-3xl font-black text-[#f87171]">{avgGoalsConceded}</p>
                  </div>
                  <span className="text-3xl">🛡️</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Top Scorers Gallery */}
        {stats.topScorers.length > 0 && (
          <section className="scroll-mt-24 space-y-6">
            <div className="mb-6 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">Artilharia em Destaque</h2>
                <p className="text-xs text-[#8fa39b] font-semibold">Os maiores artilheiros da VARzea na temporada</p>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#10b981]">Ranking Oficial</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {stats.topScorers.map((scorer, i) => (
                <article
                  key={`${scorer.playerName}-${i}`}
                  className="app-surface p-5 text-center flex flex-col justify-between space-y-4 card-hover"
                >
                  <p className="text-[9px] font-black uppercase tracking-wider text-[#8fa39b]">#{i + 1} Artilheiro</p>
                  <p className="line-clamp-2 min-h-[2.2rem] text-sm font-bold text-white uppercase tracking-tight">{scorer.playerName}</p>
                  <div>
                    <p className="text-4xl font-black text-[#10b981]">{scorer.total}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#8fa39b] mt-1">Gols Marcados</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Active Season Standings */}
        {stats.activeSeason && (
          <section id="classificacao" className="scroll-mt-24 space-y-6">
            <div className="mb-6 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">Tabela Individual da Temporada</h2>
                <p className="text-xs text-[#8fa39b] font-semibold mt-1">Campeonato ativo: {stats.activeSeason.name}</p>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#10b981]">Classificação</p>
            </div>

            {stats.activeSeasonStandings.length > 0 ? (
              <div className="app-surface overflow-hidden shadow-xl border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm divide-y divide-white/5">
                    <thead>
                      <tr className="bg-white/[0.02]">
                        <th className="px-5 py-4 font-black text-[#8fa39b] text-[10px] uppercase tracking-[0.15em]">Pos</th>
                        <th className="px-5 py-4 font-black text-[#8fa39b] text-[10px] uppercase tracking-[0.15em]">Atleta</th>
                        <th className="px-4 py-4 text-center font-black text-[#8fa39b] text-[10px] uppercase tracking-[0.15em]">Jogos</th>
                        <th className="px-4 py-4 text-center font-black text-[#8fa39b] text-[10px] uppercase tracking-[0.15em]">Vitórias</th>
                        <th className="px-4 py-4 text-center font-black text-[#8fa39b] text-[10px] uppercase tracking-[0.15em]">Empates</th>
                        <th className="px-4 py-4 text-center font-black text-[#8fa39b] text-[10px] uppercase tracking-[0.15em]">Derrotas</th>
                        <th className="px-4 py-4 text-center font-black text-[#8fa39b] text-[10px] uppercase tracking-[0.15em]">SG</th>
                        <th className="px-5 py-4 text-center font-black text-white text-[10px] uppercase tracking-[0.15em]">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                      {stats.activeSeasonStandings.map((row, idx) => (
                        <tr
                          key={row.playerId}
                          className="hover:bg-white/[0.02] transition-colors duration-150"
                        >
                          <td className="px-5 py-4 font-black text-[#8fa39b]">{idx + 1}</td>
                          <td className="px-5 py-4">
                            <p className="font-extrabold text-white">{row.playerName}</p>
                            <p className="text-[11px] text-[#8fa39b] mt-0.5">Camisa #{row.shirtNumber ?? "—"}</p>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-white">{row.played}</td>
                          <td className="px-4 py-4 text-center font-bold text-[#34d399]">{row.won}</td>
                          <td className="px-4 py-4 text-center font-bold text-[#8fa39b]">{row.drawn}</td>
                          <td className="px-4 py-4 text-center font-bold text-[#f87171]">{row.lost}</td>
                          <td className="px-4 py-4 text-center font-bold text-white">
                            {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                          </td>
                          <td className="px-5 py-4 text-center text-lg font-black text-[#10b981]">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="app-surface p-12 text-center text-[#8fa39b] text-sm border-dashed">
                Estatísticas individuais de campeonato serão exibidas assim que partidas oficiais forem disputadas.
              </div>
            )}
          </section>
        )}

        {/* Squad Section (Trading Cards Style!) */}
        <section id="elenco" className="scroll-mt-24 space-y-6">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">Guerreiros do Elenco</h2>
              <p className="text-xs text-[#8fa39b] font-semibold mt-1">Conheça os titulares e reservas da nossa equipe oficial</p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8fa39b]">
              {team.players.length} Atletas Inscritos
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
                  <article className="trading-card p-6 flex flex-col justify-between min-h-[170px]">
                    {/* Golden Camiseta Background styling */}
                    <span className="absolute bottom-2 right-2 text-8xl font-black text-white/[0.02] pointer-events-none group-hover:text-white/[0.04] transition-all">
                      #{player.shirtNumber}
                    </span>

                    <div className="relative z-10 flex items-center gap-4">
                      {player.photoUrl ? (
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="h-16 w-16 rounded-2xl border border-[rgba(16,185,129,0.25)] object-cover shadow-md transition group-hover:scale-105 duration-200"
                        />
                      ) : (
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(16,185,129,0.25)] text-xl font-black text-[#10b981] bg-[rgba(16,185,129,0.06)] shadow-inner transition group-hover:scale-105 duration-200"
                        >
                          {player.shirtNumber}
                        </div>
                      )}
                      <div>
                        <p className="text-lg font-black text-white group-hover:text-[#10b981] transition-colors duration-150 uppercase tracking-tight">{player.name}</p>
                        <p className="text-xs text-[#8fa39b] font-semibold mt-0.5">Camisa #{player.shirtNumber}</p>
                      </div>
                    </div>

                    <div className="relative z-10 mt-6 flex items-center justify-between">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${positionStyles[player.position] || "border-white/10 bg-white/5 text-[#8fa39b]"}`}>
                        {positionLabels[player.position] || player.position}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#10b981] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        Ver Perfil &rarr;
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="app-surface p-12 text-center text-[#8fa39b] text-sm border-dashed">
              Nenhum jogador ativo cadastrado no momento.
            </div>
          )}
        </section>

        {/* Match Availability & Open Slots */}
        {(team.openMatchSlots.length > 0 || hasDiscoveryInfo) && (
          <section id="agenda-aberta" className="scroll-mt-24 app-surface p-6 sm:p-8 space-y-6 border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8fa39b]">Disponibilidade de Arena</p>
                <h2 className="mt-1.5 text-2xl font-black uppercase text-white tracking-tight">Datas Disponíveis para Amistoso</h2>
              </div>
              {team.openMatchSlots.length > 0 && (
                <span className="rounded-full border border-[#10b981]/20 bg-[#10b981]/10 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#34d399]">
                  {team.openMatchSlots.length} Horário(s) Aberto(s)
                </span>
              )}
            </div>

            {hasDiscoveryInfo && (
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#8fa39b]">
                {team.city && <span className="rounded-full border border-white/5 bg-white/[0.02] px-3.5 py-2">Cidade: {team.city}</span>}
                {team.region && <span className="rounded-full border border-white/5 bg-white/[0.02] px-3.5 py-2">Região: {team.region}</span>}
                {team.fieldType && <span className="rounded-full border border-white/5 bg-white/[0.02] px-3.5 py-2">Campo: {fieldTypeLabels[team.fieldType]}</span>}
                {team.competitiveLevel && (
                  <span className="rounded-full border border-white/5 bg-white/[0.02] px-3.5 py-2">Nível: {competitiveLevelLabels[team.competitiveLevel]}</span>
                )}
              </div>
            )}

            {team.openMatchSlots.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 pt-2">
                {team.openMatchSlots.map((slot) => (
                  <article key={slot.id} className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between shadow-lg card-hover">
                    <div className="space-y-2">
                      <p className="text-base font-black text-white">
                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(slot.date)}
                      </p>
                      <p className="text-xs font-semibold text-[#8fa39b]">
                        {(slot.timeLabel || "Horário a definir") + " • " + (slot.venueLabel || "Local a definir")}
                      </p>
                      {slot.notes && <p className="text-[11px] text-[#8fa39b] italic pt-1">Nota: {slot.notes}</p>}
                    </div>
                    <Link
                      href={`/?slot=${slot.id}#amistoso`}
                      className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full border border-[#10b981] bg-[rgba(16,185,129,0.05)] px-6 text-xs font-bold uppercase tracking-wider text-[#10b981] transition-all hover:bg-[#10b981] hover:text-[#010403] hover:scale-105 active:scale-95 shadow-md"
                    >
                      Propor jogo neste horário
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#8fa39b] pt-2 font-medium">
                No momento não temos datas abertas cadastradas, mas você pode sugerir um dia e local no formulário abaixo!
              </p>
            )}
          </section>
        )}

        {/* Challenging Form Section */}
        <section id="amistoso" className="scroll-mt-24 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="app-surface p-6 sm:p-8 flex flex-col justify-between space-y-6 border-white/5">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8fa39b]">Agendamento de Amistoso</p>
              <h2 className="text-balance text-3xl font-black uppercase text-white tracking-tight">
                Desafie o {team.name}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#8fa39b] font-medium">
                Sua equipe tem o que é preciso para encarar o nosso esquadrão? Preencha as informações ao lado propondo a data, localidade e cota de arbitragem se aplicável.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[#8fa39b] font-medium">
                A comissão administradora receberá sua solicitação em tempo real no painel de controle e responderá diretamente via e-mail!
              </p>
            </div>
            <div className="rounded-2xl border border-[#10b981]/10 bg-[#10b981]/5 p-5 text-xs text-[#34d399] leading-relaxed font-semibold">
              💡 <strong>Dica de Sucesso:</strong> Informar se o campo sugerido possui vestiário e arbitragem paga agiliza bastante o aceite da comissão!
            </div>
          </div>

          <div className="app-surface p-6 sm:p-8 shadow-xl border-white/5">
            {selectedSlot && (
              <div className="mb-5 rounded-xl border border-[#10b981]/20 bg-[#10b981]/5 px-4 py-3 text-xs text-[#34d399] font-bold animate-fade-in uppercase tracking-wider">
                🎯 Agendando proposta com base no horário aberto de {selectedSlotDateText}.
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
          <section className="text-center pt-4 space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8fa39b]">Cores e Manto Oficial</h2>
            <div className="flex justify-center gap-6">
              {team.primaryColor && (
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-full px-5 py-2.5 shadow-md">
                  <div className="h-6 w-6 rounded-full border border-white/10 shadow-sm animate-pulse" style={{ backgroundColor: team.primaryColor }} />
                  <span className="text-xs font-black uppercase text-white tracking-wider">Manto Principal</span>
                </div>
              )}
              {team.secondaryColor && (
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-full px-5 py-2.5 shadow-md">
                  <div className="h-6 w-6 rounded-full border border-white/10 shadow-sm animate-pulse" style={{ backgroundColor: team.secondaryColor }} />
                  <span className="text-xs font-black uppercase text-white tracking-wider">Manto Reserva</span>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="mx-auto max-w-6xl mt-24 border-t border-white/10 px-4 pt-10 text-center text-xs font-bold text-[#8fa39b] sm:px-6 lg:px-8 space-y-2">
        <p>&copy; {new Date().getFullYear()} {team.name}. Todos os direitos reservados.</p>
        <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Plataforma Esportiva Premium VARzea</p>
      </footer>
    </div>
  );
}
