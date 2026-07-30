import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CoachDashboard from "@/components/dashboard/CoachDashboard";
import PlayerDashboard from "@/components/dashboard/PlayerDashboard";
import MaterialDirectorDashboard from "@/components/dashboard/MaterialDirectorDashboard";

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session?.user?.teamId) {
    redirect("/login");
  }

  const teamId = session.user.teamId;
  const role = session.user.role;
  const playerId = session.user.playerId;

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

  if (role === "ADMIN") {
    const [balanceAgg, overdue, activePlayersCount, pendingAmistososCount, transactionsRaw, friendlyRequests] = await Promise.all([
      prisma.transaction.groupBy({
        by: ["type"],
        where: { teamId },
        _sum: { amount: true },
      }),
      prisma.membershipPayment.findMany({
        where: { teamId, transactionId: null },
        include: { player: { select: { name: true } } }
      }),
      prisma.player.count({ where: { teamId, status: "ACTIVE" } }),
      prisma.friendlyRequest.count({ where: { teamId, status: "PENDING" } }),
      prisma.transaction.findMany({
        where: { teamId },
        orderBy: { date: "desc" },
        take: 5
      }),
      prisma.friendlyRequest.findMany({
        where: { teamId, status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    for (const entry of balanceAgg) {
      if (entry.type === "INCOME") totalIncome = Number(entry._sum.amount || 0);
      else if (entry.type === "EXPENSE") totalExpense = Number(entry._sum.amount || 0);
    }
    const balance = totalIncome - totalExpense;

    let overdueAmount = 0;
    const overduePlayersMap = new Map<string, { name: string; amount: number; months: number }>();
    for (const p of overdue) {
      const amt = Number(p.amount);
      overdueAmount += amt;
      const existing = overduePlayersMap.get(p.playerId);
      if (existing) {
        existing.amount += amt;
        existing.months += 1;
      } else {
        overduePlayersMap.set(p.playerId, { name: p.player.name, amount: amt, months: 1 });
      }
    }

    const overduePayments = Array.from(overduePlayersMap.entries()).map(([id, data]) => ({
      playerId: id,
      playerName: data.name,
      amount: data.amount,
      monthsOverdue: data.months
    }));

    return (
      <AdminDashboard 
        team={team}
        metrics={{ balance, overdueAmount, activePlayersCount, pendingAmistososCount }}
        transactions={transactionsRaw.map(t => ({
          id: t.id,
          date: t.date,
          description: t.description,
          amount: Number(t.amount),
          type: t.type
        }))}
        friendlyRequests={friendlyRequests.map(r => ({
          id: r.id,
          opponentName: r.requesterTeamName,
          date: new Date(r.suggestedDates.split(",")[0] || Date.now()), // Simplification
          status: r.status
        }))}
        overduePayments={overduePayments}
      />
    );
  }

  if (role === "COACH") {
    const limit = 5;
    const [completedMatches, nextMatchData, topScorersRaw, topAssistersRaw, pendingEvaluationsCount] = await Promise.all([
      prisma.match.findMany({
        where: { teamId, status: "COMPLETED" },
        select: { homeScore: true, awayScore: true, isHome: true },
        orderBy: { date: "desc" },
        take: 5
      }),
      prisma.match.findFirst({
        where: { teamId, status: "SCHEDULED", date: { gte: new Date() } },
        orderBy: { date: "asc" },
        include: { rsvps: true }
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
      prisma.player.count({ where: { teamId, evaluations: { none: {} } } }) // Simplification for pending evaluations
    ]);

    let wins = 0;
    let goalsScored = 0;
    let goalsConceded = 0;
    const performanceHistory: ("W" | "D" | "L")[] = [];

    for (const m of completedMatches.reverse()) {
      const teamGoalsFor = m.isHome ? m.homeScore ?? 0 : m.awayScore ?? 0;
      const teamGoalsAgainst = m.isHome ? m.awayScore ?? 0 : m.homeScore ?? 0;
      goalsScored += teamGoalsFor;
      goalsConceded += teamGoalsAgainst;
      if (teamGoalsFor > teamGoalsAgainst) {
        wins++;
        performanceHistory.push("W");
      }
      else if (teamGoalsFor < teamGoalsAgainst) {
        performanceHistory.push("L");
      }
      else {
        performanceHistory.push("D");
      }
    }

    const winRate = completedMatches.length > 0 ? Math.round((wins / completedMatches.length) * 100) : 0;
    const avgGoalsScored = completedMatches.length > 0 ? goalsScored / completedMatches.length : 0;
    const avgGoalsConceded = completedMatches.length > 0 ? goalsConceded / completedMatches.length : 0;

    const rsvpSummary = { confirmed: 0, declined: 0, tentative: 0, noResponse: 0, list: [] };
    if (nextMatchData) {
      const totalPlayers = await prisma.player.count({ where: { teamId, status: "ACTIVE" } });
      let responded = 0;
      for (const r of nextMatchData.rsvps) {
        if (r.status === "CONFIRMED") rsvpSummary.confirmed++;
        else if (r.status === "DECLINED") rsvpSummary.declined++;
        else if (r.status === "PENDING") rsvpSummary.tentative++;
        responded++;
      }
      rsvpSummary.noResponse = Math.max(0, totalPlayers - responded);
    }

    const scorerPlayerIds = topScorersRaw.map((s) => s.playerId).filter(Boolean) as string[];
    const scorerPlayers = await prisma.player.findMany({ where: { id: { in: scorerPlayerIds } }, select: { id: true, name: true } });
    const scorerMap = new Map(scorerPlayers.map((p) => [p.id, p.name]));
    const topScorers = topScorersRaw.filter((s) => (s._sum.goals ?? 0) > 0).map((s) => ({
      playerName: scorerMap.get(s.playerId as string) || "Desconhecido",
      total: s._sum.goals ?? 0,
    }));

    const assisterPlayerIds = topAssistersRaw.map((s) => s.playerId).filter(Boolean) as string[];
    const assisterPlayers = await prisma.player.findMany({ where: { id: { in: assisterPlayerIds } }, select: { id: true, name: true } });
    const assisterMap = new Map(assisterPlayers.map((p) => [p.id, p.name]));
    const topAssisters = topAssistersRaw.filter((s) => (s._sum.assists ?? 0) > 0).map((s) => ({
      playerName: assisterMap.get(s.playerId as string) || "Desconhecido",
      total: s._sum.assists ?? 0,
    }));

    return (
      <CoachDashboard 
        team={team}
        metrics={{ winRate, avgGoalsScored, avgGoalsConceded, pendingEvaluationsCount }}
        nextMatch={nextMatchData ? { id: nextMatchData.id, date: nextMatchData.date, opponentName: nextMatchData.opponent, venue: nextMatchData.venue, type: nextMatchData.type } : null}
        rsvpSummary={rsvpSummary}
        performanceHistory={performanceHistory}
        topScorers={topScorers}
        topAssisters={topAssisters}
      />
    );
  }

  if (role === "PLAYER") {
    if (!playerId) {
      return <div>Jogador não associado à conta.</div>;
    }

    const [statsRaw, rsvps, nextMatchData, recentEvaluations, fines] = await Promise.all([
      prisma.matchStats.aggregate({
        where: { playerId },
        _sum: { goals: true, assists: true }
      }),
      prisma.rSVP.findMany({ where: { playerId } }),
      prisma.match.findFirst({
        where: { teamId, status: "SCHEDULED", date: { gte: new Date() } },
        orderBy: { date: "asc" },
        include: { rsvps: { where: { playerId } } }
      }),
      prisma.playerEvaluation.findMany({
        where: { playerId },
        orderBy: { date: "desc" },
        take: 3
      }),
      prisma.fine.findMany({
        where: { playerId, status: "ACTIVE" }
      })
    ]);

    let rsvpRate = 0;
    if (rsvps.length > 0) {
      const confirmed = rsvps.filter(r => r.status === "CONFIRMED").length;
      rsvpRate = Math.round((confirmed / rsvps.length) * 100);
    }

    let avgRating = 0;
    if (recentEvaluations.length > 0) {
      const sum = recentEvaluations.reduce((acc, curr) => acc + curr.technical + curr.tactical + curr.physical + curr.discipline, 0);
      avgRating = sum / (recentEvaluations.length * 4);
    }

    const pendingPaymentsAmount = fines.length * 50; // Stub, adapt to your business logic

    return (
      <PlayerDashboard 
        team={team}
        metrics={{ rsvpRate, goals: statsRaw._sum.goals ?? 0, assists: statsRaw._sum.assists ?? 0, avgRating, pendingPaymentsAmount }}
        nextMatch={nextMatchData ? { id: nextMatchData.id, date: nextMatchData.date, opponentName: nextMatchData.opponent, venue: nextMatchData.venue } : null}
        myRsvpStatus={nextMatchData?.rsvps[0]?.status || null}
        recentEvaluations={recentEvaluations}
        pendingFinesAndFees={fines.map(f => ({ id: f.id, description: f.description, amount: 50, dueDate: f.date }))}
      />
    );
  }

  if (role === "MATERIAL_DIRECTOR") {
    const [equipments, matchEquipments, pendingOrdersRaw] = await Promise.all([
      prisma.equipment.findMany({ where: { teamId } }),
      prisma.matchEquipment.findMany({
        where: { match: { teamId } },
        include: { match: { select: { date: true, opponent: true } } },
        orderBy: { createdAt: "desc" },
        take: 10
      }),
      prisma.equipmentOrder.findMany({
        where: { teamId, status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 10
      })
    ]);

    const totalItems = equipments.reduce((acc, eq) => acc + eq.totalQty, 0);
    const lowStockItems = equipments.filter(eq => eq.availableQty < eq.minQty).map(eq => ({
      id: eq.id,
      name: eq.name,
      availableQty: eq.availableQty,
      minQty: eq.minQty
    }));
    
    const activeLoansCount = matchEquipments.filter(mq => !mq.returned).length;
    
    const recentMovements = matchEquipments.map(mq => ({
      id: mq.id,
      playerName: `Partida vs ${mq.match.opponent}`,
      equipmentName: mq.name,
      date: mq.match.date,
      status: (mq.returned ? "RETURNED" : "BORROWED") as "BORROWED" | "RETURNED"
    }));

    return (
      <MaterialDirectorDashboard 
        team={team}
        metrics={{ totalItems, lowStockCount: lowStockItems.length, activeLoansCount, pendingOrdersCount: pendingOrdersRaw.length }}
        lowStockItems={lowStockItems}
        recentMovements={recentMovements}
        pendingOrders={pendingOrdersRaw.map(po => ({
          id: po.id,
          equipmentName: po.name,
          requestedBy: "Equipe",
          date: po.createdAt
        }))}
      />
    );
  }

  // Fallback to overview if role doesn't match above or isn't specific
  return <div>Role not recognized or not implemented for dashboard.</div>;
}
