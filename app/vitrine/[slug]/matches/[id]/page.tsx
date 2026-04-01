import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { RecapShareActions } from "@/components/dashboard/RecapShareActions";
import { TeamRecapWidget } from "@/components/dashboard/TeamRecapWidget";

interface PublicMatchPageProps {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{ t?: string }>;
}

async function getMatchData(slug: string, matchId: string, token?: string) {
  if (!token) return null;

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
    where: { id: matchId, teamId: team.id, shareToken: token },
    include: {
      rsvps: {
        select: {
          status: true,
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
  searchParams,
  params,
}: PublicMatchPageProps): Promise<Metadata> {
  const { slug, id } = await params;
  const { t } = await searchParams;
  const data = await getMatchData(slug, id, t);

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
      url: `/vitrine/${slug}/matches/${id}?t=${t}`,
      siteName: "VARzea",
      locale: "pt_BR",
      images:
        data.match.status === "COMPLETED"
          ? [{ url: `/api/og/team-recap/${id}`, width: 1200, height: 630, alt: `${data.team.name} vs ${data.match.opponent}` }]
          : data.team.badgeUrl
          ? [{ url: data.team.badgeUrl, width: 200, height: 200, alt: `Escudo ${data.team.name}` }]
          : [],
    },
    twitter: {
      card: data.match.status === "COMPLETED" ? "summary_large_image" : "summary",
      title,
      description,
      images:
        data.match.status === "COMPLETED"
          ? [`/api/og/team-recap/${id}`]
          : data.team.badgeUrl
          ? [data.team.badgeUrl]
          : [],
    },
  };
}

const positionLabels: Record<string, string> = {
  GOALKEEPER: "Goleiro",
  DEFENDER: "Zagueiro",
  LEFT_BACK: "Lateral esquerdo",
  RIGHT_BACK: "Lateral direito",
  MIDFIELDER: "Meio-campista",
  DEFENSIVE_MIDFIELDER: "Volante",
  FORWARD: "Atacante",
  LEFT_WINGER: "Ponta esquerda",
  RIGHT_WINGER: "Ponta direita",
};

const statusLabels: Record<string, string> = {
  SCHEDULED: "Agendada",
  COMPLETED: "Finalizada",
  CANCELLED: "Cancelada",
};

export default async function PublicMatchPage({
  searchParams,
  params,
}: PublicMatchPageProps) {
  const { slug, id } = await params;
  const { t } = await searchParams;
  const data = await getMatchData(slug, id, t);

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
  const statusBadgeClass =
    match.status === "COMPLETED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : match.status === "CANCELLED"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className="min-h-screen bg-transparent pb-16">
      <header
        className="relative overflow-hidden px-4 pb-20 pt-14 text-white"
        style={{ backgroundColor: team.primaryColor || "#1e40af" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.28),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(255,225,185,0.32),transparent_32%)]" />
        <div className="relative mx-auto max-w-5xl">
          <a
            href={`/vitrine/${team.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
          >
            Voltar para a vitrine
          </a>
        </div>
        <div className="relative mx-auto mt-7 max-w-5xl text-center">
          {team.badgeUrl && (
            <img
              src={team.badgeUrl}
              alt={team.name}
              className="mx-auto mb-4 h-20 w-20 rounded-full border-4 border-white/35 object-cover shadow-[0_18px_38px_rgba(0,0,0,0.25)]"
            />
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Partida Compartilhada
          </p>
          <h1 className="mt-2 text-balance font-display text-4xl font-bold sm:text-5xl">
            {team.name} x {match.opponent}
          </h1>
          <p className="mt-3 text-sm text-white/85 sm:text-base">{formattedDate}</p>
          <span
            className={`mt-5 inline-flex rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusBadgeClass}`}
          >
            {statusLabels[match.status]}
          </span>
        </div>
      </header>

      <main className="mx-auto -mt-9 max-w-5xl space-y-6 px-4">
        <section className="app-surface rounded-[28px] p-6 shadow-[var(--shadow-lg)] sm:p-8">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Informações da Partida
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                Data
              </span>
              <p className="mt-1 font-semibold text-[var(--text)]">{formattedDate}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                Local
              </span>
              <p className="mt-1 font-semibold text-[var(--text)]">{match.venue}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                Adversário
              </span>
              <p className="mt-1 font-semibold text-[var(--text)]">{match.opponent}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                Tipo
              </span>
              <p className="mt-1 font-semibold text-[var(--text)]">
                {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
              </p>
            </div>
          </div>
        </section>

        {match.status === "COMPLETED" &&
          match.homeScore !== null &&
          match.awayScore !== null && (
            <section className="app-surface rounded-[28px] p-6 text-center shadow-[var(--shadow-md)] sm:p-8">
              <h2 className="text-xl font-semibold text-[var(--text)]">
                Placar Final
              </h2>
              <div className="mt-6 flex items-center justify-center gap-5 sm:gap-8">
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    {team.name}
                  </p>
                  <p className="mt-1 text-5xl font-bold text-[var(--brand)] sm:text-6xl">
                    {match.homeScore}
                  </p>
                </div>
                <span className="text-3xl font-semibold text-[var(--text-subtle)]">x</span>
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    {match.opponent}
                  </p>
                  <p className="mt-1 text-5xl font-bold text-rose-600 sm:text-6xl">
                    {match.awayScore}
                  </p>
                </div>
              </div>
            </section>
          )}

        {match.status === "COMPLETED" && (
          <section className="app-surface rounded-[28px] p-6 shadow-[var(--shadow-md)] sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text)]">Recap da Rodada</h2>
            <div className="mt-5">
              <TeamRecapWidget matchId={match.id} />
            </div>
            <div className="mt-4">
              <RecapShareActions
                entityId={match.id}
                entityType="match"
                context="public_match"
                labelPrefix="Confira o recap da partida no VARzea"
              />
            </div>
          </section>
        )}

        {match.status === "SCHEDULED" && (
          <section className="app-surface rounded-[28px] p-6 shadow-[var(--shadow-md)] sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Confirmações de Presença
            </h2>
            <div className="mt-5 grid gap-4 text-center sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/65 p-4">
                <p className="text-3xl font-bold text-emerald-700">{confirmed}</p>
                <p className="mt-1 text-sm text-emerald-700/85">Confirmados</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/65 p-4">
                <p className="text-3xl font-bold text-rose-700">{declined}</p>
                <p className="mt-1 text-sm text-rose-700/85">Recusados</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/65 p-4">
                <p className="text-3xl font-bold text-amber-700">{pending}</p>
                <p className="mt-1 text-sm text-amber-700/85">Pendentes</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              Por privacidade, os nomes e respostas individuais não são exibidos publicamente.
            </p>
          </section>
        )}

        {match.status === "COMPLETED" && match.matchStats.length > 0 && (
          <section className="app-surface overflow-hidden rounded-[28px] p-6 shadow-[var(--shadow-md)] sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Estatísticas Individuais
            </h2>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[color-mix(in_oklab,var(--surface-soft)_78%,white_22%)]">
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-3 font-semibold text-[var(--text-subtle)]">Jogador</th>
                    <th className="px-4 py-3 font-semibold text-[var(--text-subtle)]">Posição</th>
                    <th className="px-4 py-3 text-center font-semibold text-[var(--text-subtle)]">
                      Gols
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-[var(--text-subtle)]">
                      Assist.
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-[var(--text-subtle)]">
                      Amarelos
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-[var(--text-subtle)]">
                      Vermelhos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-white/30">
                  {match.matchStats.map((stat) => (
                    <tr key={stat.playerId} className="transition hover:bg-white/65">
                      <td className="px-4 py-3 font-semibold text-[var(--text)]">{stat.player.name}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)]">
                        {positionLabels[stat.player.position] ||
                          stat.player.position}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-[var(--text)]">{stat.goals}</td>
                      <td className="px-4 py-3 text-center font-semibold text-[var(--text)]">{stat.assists}</td>
                      <td className="px-4 py-3 text-center font-semibold text-amber-700">{stat.yellowCards}</td>
                      <td className="px-4 py-3 text-center font-semibold text-rose-700">{stat.redCards}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {match.status === "SCHEDULED" && (
          <section className="app-surface rounded-[28px] p-6 shadow-[var(--shadow-md)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text)]">Confirmar Presença</h2>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">
                  Você é jogador do {team.name}? Acesse o app para confirmar ou recusar sua presença nesta partida.
                </p>
              </div>
              <a
                href={`/matches/${match.id}`}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
              >
                Confirmar no app →
              </a>
            </div>
          </section>
        )}

        <div className="pt-2 text-center">
          <a
            href={`/vitrine/${team.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] bg-white/70 px-5 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            Ver perfil do {team.name}
          </a>
        </div>
      </main>
    </div>
  );
}
