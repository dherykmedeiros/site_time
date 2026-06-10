import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.user?.teamId) {
    redirect("/login");
  }

  const teamId = session.user.teamId;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true,
      name: true,
      slug: true,
      badgeUrl: true,
      primaryColor: true,
      _count: {
        select: {
          players: true,
          matches: true,
        },
      },
    },
  });

  if (!team) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/90 px-8 py-14 text-center shadow-xl backdrop-blur-xl space-y-6">
        <span className="text-4xl animate-bounce inline-block">⚽</span>
        <h1 className="text-3xl font-bold uppercase text-[var(--text)] tracking-tight font-serif">Bem-vindo à VARzea</h1>
        <p className="max-w-md mx-auto text-sm text-[var(--text-muted)] leading-relaxed">
          Você ainda não possui um time vinculado. Crie a identidade e as cores oficiais do seu primeiro time para acessar todos os recursos do painel administrativo.
        </p>
        <Link href="/dashboard/team/settings" className="inline-block pt-2">
          <Button className="min-h-11 rounded-xl px-8 uppercase tracking-wider font-bold text-xs">
            Configurar Primeiro Time
          </Button>
        </Link>
      </div>
    );
  }

  const limit = 5;

  const [balanceAgg, topScorersRaw, topAssistersRaw, mostCardsRaw, completedMatches] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["type"],
      where: { teamId },
      _sum: { amount: true },
    }),
    prisma.matchStats.groupBy({
      by: ["playerId"],
      where: { match: { teamId }, playerId: { not: null } },
      _sum: { goals: true },
      orderBy: { _sum: { goals: "desc" } },
      take: limit,
    }),
    prisma.matchStats.groupBy({
      by: ["playerId"],
      where: { match: { teamId }, playerId: { not: null } },
      _sum: { assists: true },
      orderBy: { _sum: { assists: "desc" } },
      take: limit,
    }),
    prisma.matchStats.groupBy({
      by: ["playerId"],
      where: { match: { teamId }, playerId: { not: null } },
      _sum: { yellowCards: true, redCards: true },
      orderBy: [{ _sum: { redCards: "desc" } }, { _sum: { yellowCards: "desc" } }],
      take: limit,
    }),
    prisma.match.findMany({
      where: { teamId, status: "COMPLETED" },
      select: { homeScore: true, awayScore: true, isHome: true },
    }),
  ]);

  let totalIncome = 0;
  let totalExpense = 0;
  for (const entry of balanceAgg) {
    if (entry.type === "INCOME") {
      totalIncome = entry._sum.amount ? Number(entry._sum.amount) : 0;
    } else if (entry.type === "EXPENSE") {
      totalExpense = entry._sum.amount ? Number(entry._sum.amount) : 0;
    }
  }
  const balance = totalIncome - totalExpense;

  const scorerPlayerIds = topScorersRaw.map((s) => s.playerId).filter(Boolean) as string[];
  const scorerPlayers = await prisma.player.findMany({
    where: { id: { in: scorerPlayerIds } },
    select: { id: true, name: true },
  });
  const scorerMap = new Map(scorerPlayers.map((p) => [p.id, p.name]));
  const topScorers = topScorersRaw
    .filter((s) => (s._sum.goals ?? 0) > 0)
    .map((s) => ({
      playerId: s.playerId as string,
      playerName: scorerMap.get(s.playerId as string) || "Desconhecido",
      total: s._sum.goals ?? 0,
    }));

  const assisterPlayerIds = topAssistersRaw.map((s) => s.playerId).filter(Boolean) as string[];
  const assisterPlayers = await prisma.player.findMany({
    where: { id: { in: assisterPlayerIds } },
    select: { id: true, name: true },
  });
  const assisterMap = new Map(assisterPlayers.map((p) => [p.id, p.name]));
  const topAssisters = topAssistersRaw
    .filter((s) => (s._sum.assists ?? 0) > 0)
    .map((s) => ({
      playerId: s.playerId as string,
      playerName: assisterMap.get(s.playerId as string) || "Desconhecido",
      total: s._sum.assists ?? 0,
    }));

  const cardPlayerIds = mostCardsRaw.map((s) => s.playerId).filter(Boolean) as string[];
  const cardPlayers = await prisma.player.findMany({
    where: { id: { in: cardPlayerIds } },
    select: { id: true, name: true },
  });
  const cardMap = new Map(cardPlayers.map((p) => [p.id, p.name]));
  const mostCards = mostCardsRaw
    .filter((s) => (s._sum.yellowCards ?? 0) > 0 || (s._sum.redCards ?? 0) > 0)
    .map((s) => ({
      playerId: s.playerId as string,
      playerName: cardMap.get(s.playerId as string) || "Desconhecido",
      yellowCards: s._sum.yellowCards ?? 0,
      redCards: s._sum.redCards ?? 0,
    }));

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

  const teamRecord = {
    totalMatches,
    wins,
    draws,
    losses,
    winRate,
    goalsScored,
    goalsConceded,
  };

  return (
    <DashboardOverview
      team={team}
      balance={balance}
      teamRecord={teamRecord}
      topScorers={topScorers}
      topAssisters={topAssisters}
      mostCards={mostCards}
    />
  );
}
