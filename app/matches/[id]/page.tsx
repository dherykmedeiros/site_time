import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { RecapShareActions } from "@/components/dashboard/RecapShareActions";
import { TeamRecapWidget } from "@/components/dashboard/TeamRecapWidget";

interface PublicMatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}

async function getMatchData(matchId: string, token?: string) {
  if (!token) return null;

  const match = await prisma.match.findFirst({
    where: { id: matchId, shareToken: token },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          slug: true,
          badgeUrl: true,
          primaryColor: true,
        },
      },
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

  return { team: match.team, match };
}

export async function generateMetadata({
  searchParams,
  params,
}: PublicMatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const { t } = await searchParams;
  const data = await getMatchData(id, t);

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
      url: `/matches/${id}?t=${t}`,
      siteName: "Portal Oficial",
      locale: "pt_BR",
      images:
        data.match.status === "COMPLETED"
          ? [{ url: `/api/og/team-recap/${id}`, width: 1200, height: 630, alt: `${data.team.name} vs ${data.match.opponent}` }]
          : [{ url: `/api/og/match/${id}`, width: 1200, height: 630, alt: `${data.team.name} vs ${data.match.opponent}` }],
    },
    twitter: {
      card: data.match.status === "COMPLETED" ? "summary_large_image" : "summary",
      title,
      description,
      images:
        data.match.status === "COMPLETED"
          ? [`/api/og/team-recap/${id}`]
          : [`/api/og/match/${id}`],
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
  const { id } = await params;
  const { t } = await searchParams;
  const data = await getMatchData(id, t);

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(12,111,93,0.05),transparent_40%),linear-gradient(180deg,#f8fbf9_0%,#f0f5f2_100%)] pb-16">
      <header
        className="relative overflow-hidden px-4 pb-20 pt-14 text-white"
        style={{ backgroundColor: team.primaryColor || "#0a584b" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(244,221,183,0.22),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#f8fbf9]/15" />

        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/25"
          >
            ← Voltar para o Portal
          </Link>
        </div>
        <div className="relative mx-auto mt-7 max-w-5xl text-center">
          {team.badgeUrl && (
            <img
              src={team.badgeUrl}
              alt={team.name}
              className="mx-auto mb-4 h-20 w-20 rounded-2xl border border-white/35 object-cover shadow-[0_18px_38px_rgba(0,0,0,0.25)]"
            />
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Resumo de Partida Oferecido Pelo Portal
          </p>
          <h1 className="mt-2 text-balance font-display text-4xl font-extrabold sm:text-5xl">
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
        <section className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[#0f3a30]">
            Informações da Partida
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b857c]">
                Data / Horário
              </span>
              <p className="mt-1 font-bold text-[#0f3a30]">{formattedDate}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b857c]">
                Local
              </span>
              <p className="mt-1 font-bold text-[#0f3a30]">{match.venue}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b857c]">
                Adversário
              </span>
              <p className="mt-1 font-bold text-[#0f3a30]">{match.opponent}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b857c]">
                Tipo de Partida
              </span>
              <p className="mt-1 font-bold text-[#0f3a30]">
                {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
              </p>
            </div>
          </div>
        </section>

        {match.status === "COMPLETED" &&
          match.homeScore !== null &&
          match.awayScore !== null && (
            <section className="bg-white rounded-3xl border border-[#e5ece8] p-6 text-center shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-[#0f3a30]">
                Placar Final
              </h2>
              <div className="mt-6 flex items-center justify-center gap-5 sm:gap-8">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6b857c]">
                    {team.name}
                  </p>
                  <p className="mt-1 text-5xl font-black text-[#0c6f5d] sm:text-6xl">
                    {match.homeScore}
                  </p>
                </div>
                <span className="text-3xl font-bold text-[#6b857c]">x</span>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6b857c]">
                    {match.opponent}
                  </p>
                  <p className="mt-1 text-5xl font-black text-rose-700 sm:text-6xl">
                    {match.awayScore}
                  </p>
                </div>
              </div>
            </section>
          )}

        {match.status === "COMPLETED" && (
          <section className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#0f3a30]">Recap da Rodada</h2>
            <div className="mt-5">
              <TeamRecapWidget matchId={match.id} />
            </div>
            <div className="mt-4">
              <RecapShareActions
                entityId={match.id}
                entityType="match"
                context="public_match"
                labelPrefix="Confira o recap da partida no nosso portal"
                vitrineUrl={`/matches/${match.id}`}
              />
            </div>
          </section>
        )}

        {match.status === "SCHEDULED" && (
          <section className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#0f3a30]">
              Confirmações de Presença
            </h2>
            <div className="mt-5 grid gap-4 text-center sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/65 p-4">
                <p className="text-3xl font-extrabold text-emerald-800">{confirmed}</p>
                <p className="mt-1 text-sm font-semibold text-emerald-800/85">Confirmados</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/65 p-4">
                <p className="text-3xl font-extrabold text-rose-700">{declined}</p>
                <p className="mt-1 text-sm font-semibold text-rose-700/85">Recusados</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/65 p-4">
                <p className="text-3xl font-extrabold text-amber-800">{pending}</p>
                <p className="mt-1 text-sm font-semibold text-amber-800/85">Pendentes</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#6b857c]">
              Nota: Por questões de privacidade, a comissão técnica não exibe a lista nominal publicamente.
            </p>
          </section>
        )}

        {match.status === "COMPLETED" && match.matchStats.length > 0 && (
          <section className="bg-white overflow-hidden rounded-3xl border border-[#e5ece8] p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#0f3a30]">
              Estatísticas Individuais
            </h2>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-[#e5ece8]">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[#f8fbf9]">
                  <tr className="border-b border-[#e5ece8]">
                    <th className="px-4 py-3 font-semibold text-[#6b857c]">Jogador</th>
                    <th className="px-4 py-3 font-semibold text-[#6b857c]">Posição</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#6b857c]">Gols</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#6b857c]">Assist.</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#6b857c]">Amarelos</th>
                    <th className="px-4 py-3 text-center font-semibold text-[#6b857c]">Vermelhos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5ece8] bg-white">
                  {match.matchStats.map((stat) => (
                    <tr key={stat.playerId} className="transition hover:bg-[#f8fbf9]/60">
                      <td className="px-4 py-3 font-bold text-[#0f3a30]">{stat.player.name}</td>
                      <td className="px-4 py-3 text-[#4f746b]">
                        {positionLabels[stat.player.position] ||
                          stat.player.position}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-[#0f3a30]">{stat.goals}</td>
                      <td className="px-4 py-3 text-center font-bold text-[#0f3a30]">{stat.assists}</td>
                      <td className="px-4 py-3 text-center font-bold text-amber-700">{stat.yellowCards}</td>
                      <td className="px-4 py-3 text-center font-bold text-rose-700">{stat.redCards}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {match.status === "SCHEDULED" && (
          <section className="bg-white rounded-3xl border border-[#e5ece8] p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0f3a30]">Confirmar Presença</h2>
                <p className="mt-1 text-sm text-[#4f746b]">
                  Se você é atleta integrado do {team.name}, acesse a área administrativa para confirmar sua escalação nesta partida.
                </p>
              </div>
              <Link
                href="/dashboard/matches"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#0c6f5d] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#0a5c4d] shadow-sm"
              >
                Confirmar Convocação &rarr;
              </Link>
            </div>
          </section>
        )}

        <div className="pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#0c6f5d] bg-white px-5 py-2 text-sm font-bold text-[#0c6f5d] transition hover:bg-[#0c6f5d] hover:text-white"
          >
            Ver Portal do {team.name}
          </Link>
        </div>
      </main>
    </div>
  );
}
