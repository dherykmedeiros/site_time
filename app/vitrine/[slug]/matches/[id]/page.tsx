import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

interface PublicMatchPageProps {
  params: Promise<{ slug: string; id: string }>;
}

async function getMatchData(slug: string, matchId: string) {
  const team = await prisma.team.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      badgeUrl: true,
      primaryColor: true,
    },
  });

  if (!team) return null;

  const match = await prisma.match.findFirst({
    where: { id: matchId, teamId: team.id },
    include: {
      rsvps: {
        include: {
          player: { select: { name: true, position: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      matchStats: {
        include: {
          player: { select: { name: true, position: true } },
        },
      },
    },
  });

  if (!match) return null;

  return { team, match };
}

export async function generateMetadata({
  params,
}: PublicMatchPageProps): Promise<Metadata> {
  const { slug, id } = await params;
  const data = await getMatchData(slug, id);

  if (!data) {
    return { title: "Partida não encontrada" };
  }

  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data.match.date);

  const title = `${data.team.name} vs ${data.match.opponent} — ${dateStr}`;
  const description = `${data.match.venue} • ${dateStr}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/vitrine/${slug}/matches/${id}`,
      siteName: "Site Time",
      locale: "pt_BR",
      ...(data.team.badgeUrl && { images: [{ url: data.team.badgeUrl, width: 200, height: 200, alt: `Escudo ${data.team.name}` }] }),
    },
    twitter: {
      card: "summary",
      title,
      description,
      ...(data.team.badgeUrl && { images: [data.team.badgeUrl] }),
    },
  };
}

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  MIDFIELDER: "Meio-campista",
  FORWARD: "Atacante",
};

const statusLabels: Record<string, string> = {
  SCHEDULED: "Agendada",
  COMPLETED: "Finalizada",
  CANCELLED: "Cancelada",
};

const rsvpStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "✅ Confirmado",
  DECLINED: "❌ Recusado",
};

export default async function PublicMatchPage({
  params,
}: PublicMatchPageProps) {
  const { slug, id } = await params;
  const data = await getMatchData(slug, id);

  if (!data) {
    notFound();
  }

  const { team, match } = data;

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(match.date);

  const confirmed = match.rsvps.filter((r) => r.status === "CONFIRMED").length;
  const declined = match.rsvps.filter((r) => r.status === "DECLINED").length;
  const pending = match.rsvps.filter((r) => r.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="py-12 text-white"
        style={{ backgroundColor: team.primaryColor || "#1e40af" }}
      >
        <div className="mx-auto max-w-3xl px-4 text-center">
          {team.badgeUrl && (
            <img
              src={team.badgeUrl}
              alt={team.name}
              className="mx-auto mb-4 h-16 w-16 rounded-full object-cover"
            />
          )}
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="mt-2 text-lg opacity-90">vs {match.opponent}</p>
          <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm">
            {statusLabels[match.status]}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Match Info */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Informações da Partida
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm text-gray-500">Data</span>
              <p className="font-medium">{formattedDate}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Local</span>
              <p className="font-medium">{match.venue}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Adversário</span>
              <p className="font-medium">{match.opponent}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Tipo</span>
              <p className="font-medium">
                {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
              </p>
            </div>
          </div>
        </div>

        {/* Score (if COMPLETED) */}
        {match.status === "COMPLETED" &&
          match.homeScore !== null &&
          match.awayScore !== null && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 text-center">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Placar Final
              </h2>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">{team.name}</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {match.homeScore}
                  </p>
                </div>
                <span className="text-2xl font-bold text-gray-400">x</span>
                <div className="text-center">
                  <p className="text-sm text-gray-500">{match.opponent}</p>
                  <p className="text-4xl font-bold text-red-600">
                    {match.awayScore}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* RSVP Summary */}
        {match.status === "SCHEDULED" && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Confirmações de Presença
            </h2>
            <div className="mb-4 flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{confirmed}</p>
                <p className="text-sm text-gray-500">Confirmados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{declined}</p>
                <p className="text-sm text-gray-500">Recusados</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                <p className="text-sm text-gray-500">Pendentes</p>
              </div>
            </div>
            <div className="space-y-2">
              {match.rsvps.map((rsvp) => (
                <div
                  key={rsvp.playerId}
                  className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-2"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {rsvp.player.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {rsvpStatusLabels[rsvp.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual Stats (T043 - if COMPLETED and has stats) */}
        {match.status === "COMPLETED" && match.matchStats.length > 0 && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Estatísticas Individuais
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 font-medium text-gray-500">Jogador</th>
                    <th className="pb-2 font-medium text-gray-500">Posição</th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      Gols
                    </th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      Assist.
                    </th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      🟨
                    </th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      🟥
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {match.matchStats.map((stat) => (
                    <tr
                      key={stat.playerId}
                      className="border-b border-gray-100"
                    >
                      <td className="py-2 font-medium">{stat.player.name}</td>
                      <td className="py-2 text-gray-500">
                        {positionLabels[stat.player.position] ||
                          stat.player.position}
                      </td>
                      <td className="py-2 text-center">{stat.goals}</td>
                      <td className="py-2 text-center">{stat.assists}</td>
                      <td className="py-2 text-center">{stat.yellowCards}</td>
                      <td className="py-2 text-center">{stat.redCards}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back to vitrine link */}
        <div className="text-center">
          <a
            href={`/vitrine/${team.slug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Ver perfil do {team.name}
          </a>
        </div>
      </main>
    </div>
  );
}
