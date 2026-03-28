import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="relative py-16 text-white"
        style={{
          backgroundColor: team.primaryColor || "#1e40af",
        }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center">
          {team.badgeUrl ? (
            <img
              src={team.badgeUrl}
              alt={`Escudo ${team.name}`}
              className="mx-auto mb-4 h-28 w-28 rounded-full border-4 border-white/30 object-cover shadow-lg"
            />
          ) : (
            <div
              className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/30 text-5xl shadow-lg"
              style={{ backgroundColor: team.secondaryColor || "#3b82f6" }}
            >
              ⚽
            </div>
          )}
          <h1 className="text-4xl font-bold">{team.name}</h1>
          {team.description && (
            <p className="mt-3 text-lg text-white/80">{team.description}</p>
          )}
        </div>
      </header>

      {/* Info Cards */}
      <main className="mx-auto -mt-8 max-w-4xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <p className="text-3xl font-bold text-gray-900">
              {team._count.players}
            </p>
            <p className="mt-1 text-sm text-gray-500">Jogadores</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalMatches}
            </p>
            <p className="mt-1 text-sm text-gray-500">Partidas Disputadas</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-center shadow-md">
            <p className="text-3xl font-bold text-gray-900">
              {stats.winRate}%
            </p>
            <p className="mt-1 text-sm text-gray-500">Aproveitamento</p>
          </div>
        </div>

        {/* Team Record */}
        {stats.totalMatches > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Retrospecto</h2>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-white p-4 text-center shadow-md">
                <p className="text-2xl font-bold text-green-600">{stats.wins}</p>
                <p className="text-sm text-gray-500">Vitórias</p>
              </div>
              <div className="rounded-lg bg-white p-4 text-center shadow-md">
                <p className="text-2xl font-bold text-yellow-600">{stats.draws}</p>
                <p className="text-sm text-gray-500">Empates</p>
              </div>
              <div className="rounded-lg bg-white p-4 text-center shadow-md">
                <p className="text-2xl font-bold text-red-600">{stats.losses}</p>
                <p className="text-sm text-gray-500">Derrotas</p>
              </div>
              <div className="rounded-lg bg-white p-4 text-center shadow-md">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.goalsScored} : {stats.goalsConceded}
                </p>
                <p className="text-sm text-gray-500">Gols (Pró : Contra)</p>
              </div>
            </div>
          </section>
        )}

        {/* Top Scorers */}
        {stats.topScorers.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Artilheiros</h2>
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Jogador</th>
                    <th className="px-4 py-3 text-right">Gols</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.topScorers.map((scorer, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 font-medium text-gray-500">{i + 1}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {scorer.playerName}
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-gray-900">
                        {scorer.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Squad */}
        {team.players.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Elenco</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md"
                >
                  {player.photoUrl ? (
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                      style={{
                        backgroundColor: team.primaryColor || "#1e40af",
                      }}
                    >
                      {player.shirtNumber}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{player.name}</p>
                    <p className="text-sm text-gray-500">
                      {positionLabels[player.position] || player.position} •{" "}
                      #{player.shirtNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Friendly Request Form */}
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Solicitar Amistoso
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <p className="mb-4 text-sm text-gray-600">
              Quer marcar um amistoso com o {team.name}? Preencha o formulário abaixo.
            </p>
            <FriendlyRequestForm teamSlug={slug} />
          </div>
        </section>

        {/* Colors */}
        {(team.primaryColor || team.secondaryColor) && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Cores</h2>
            <div className="flex gap-4">
              {team.primaryColor && (
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: team.primaryColor }}
                  />
                  <span className="text-sm text-gray-600">Primária</span>
                </div>
              )}
              {team.secondaryColor && (
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: team.secondaryColor }}
                  />
                  <span className="text-sm text-gray-600">Secundária</span>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>Powered by Site Time</p>
      </footer>
    </div>
  );
}
