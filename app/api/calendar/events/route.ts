import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 403 });
  }

  const teamId = session.user.teamId;
  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const now = new Date();
  const fromDate = fromParam ? new Date(fromParam) : new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const toDate = toParam ? new Date(toParam) : new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const [matches, polls, membershipPayments, fines] = await Promise.all([
    prisma.match.findMany({
      where: {
        teamId,
        date: { gte: fromDate, lte: toDate },
      },
      select: {
        id: true,
        opponent: true,
        venue: true,
        type: true,
        status: true,
        isHome: true,
        homeScore: true,
        awayScore: true,
        date: true,
      },
      orderBy: { date: "asc" },
    }),
    prisma.datePoll.findMany({
      where: {
        teamId,
        createdAt: { gte: fromDate, lte: toDate },
      },
      include: {
        options: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.membershipPayment.findMany({
      where: {
        teamId,
        paidAt: { gte: fromDate, lte: toDate },
      },
      include: {
        player: { select: { name: true } },
      },
      take: 100,
    }),
    prisma.fine.findMany({
      where: {
        teamId,
        date: { gte: fromDate, lte: toDate },
      },
      include: {
        player: { select: { name: true } },
        rule: { select: { title: true } },
      },
      take: 100,
    }),
  ]);

  const events = [
    ...matches.map((m) => ({
      id: `match-${m.id}`,
      title: `${m.isHome ? "vs" : "@"} ${m.opponent}`,
      date: m.date.toISOString(),
      type: "MATCH" as const,
      status: m.status,
      badgeColor: m.status === "COMPLETED" ? "#34d399" : m.status === "CANCELLED" ? "#f87171" : "#38bdf8",
      url: `/dashboard/matches/${m.id}`,
      details: {
        venue: m.venue,
        matchType: m.type === "CHAMPIONSHIP" ? "Campeonato" : "Amistoso",
        isHome: m.isHome,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
      },
    })),
    ...polls.map((p) => ({
      id: `poll-${p.id}`,
      title: `Enquete: ${p.title}`,
      date: p.createdAt.toISOString(),
      type: "DATE_POLL" as const,
      status: p.closedAt ? "Encerrada" : "Aberta",
      badgeColor: "#fbbf24",
      url: "/dashboard/polls",
      details: {
        optionsCount: p.options.length,
        isClosed: !!p.closedAt,
      },
    })),
    ...membershipPayments.map((p) => ({
      id: `membership-${p.id}`,
      title: `Mensalidade: ${p.player.name}`,
      date: p.paidAt.toISOString(),
      type: "MEMBERSHIP" as const,
      status: "Pago",
      badgeColor: "#10b981",
      url: "/dashboard/squad/mensalidade",
      details: {
        month: p.month,
        year: p.year,
        amount: Number(p.amount),
        playerName: p.player.name,
      },
    })),
    ...fines.map((f) => ({
      id: `fine-${f.id}`,
      title: `Multa: ${f.player.name}`,
      date: f.date.toISOString(),
      type: "FINE" as const,
      status: f.status === "SERVED" ? "Cumprida" : f.status === "CANCELLED" ? "Cancelada" : "Ativa",
      badgeColor: f.status === "SERVED" ? "#10b981" : "#ef4444",
      url: "/dashboard/fines",
      details: {
        reason: f.description || f.rule?.title || "Infração disciplinar",
        severity: f.severity,
        playerName: f.player.name,
      },
    })),
  ];

  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json({ events });
}
