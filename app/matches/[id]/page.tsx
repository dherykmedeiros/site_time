import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { RecapShareActions } from "@/components/dashboard/RecapShareActions";
import { TeamRecapWidget } from "@/components/dashboard/TeamRecapWidget";
import { PublicNavbar } from "@/components/PublicNavbar";
import { LiveMatchView } from "@/components/portal/LiveMatchView";

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
      guestPlayers: {
        select: {
          id: true,
        },
      },
      matchStats: {
        include: {
          player: { select: { name: true, position: true } },
          guestPlayer: { select: { name: true, position: true } },
        },
      },
      matchLive: {
        include: {
          events: {
            orderBy: [
              { half: "asc" },
              { minute: "asc" },
              { createdAt: "asc" },
            ],
            include: {
              player: {
                select: {
                  id: true,
                  name: true,
                  position: true,
                  shirtNumber: true,
                },
              },
              guestPlayer: {
                select: {
                  id: true,
                  name: true,
                  position: true,
                  shirtNumber: true,
                },
              },
            },
          },
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
    timeZone: "America/Sao_Paulo",
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
  LEFT_WINGBACK: "Ala esquerdo",
  RIGHT_WINGBACK: "Ala direito",
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

function isColorLight(hexColor: string | null): boolean {
  if (!hexColor) return false;
  const cleanHex = hexColor.replace("#", "").trim();
  if (cleanHex.length !== 6 && cleanHex.length !== 3) return false;
  
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    r = parseInt(cleanHex.substring(0, 1) + cleanHex.substring(0, 1), 16);
    g = parseInt(cleanHex.substring(1, 2) + cleanHex.substring(1, 2), 16);
    b = parseInt(cleanHex.substring(2, 3) + cleanHex.substring(2, 3), 16);
  }
  
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
}

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
    timeZone: "America/Sao_Paulo",
  }).format(match.date);

  const confirmed = match.rsvps.filter((r) => r.status === "CONFIRMED").length + (match.guestPlayers?.length || 0);
  const declined = match.rsvps.filter((r) => r.status === "DECLINED").length;
  const pending = match.rsvps.filter((r) => r.status === "PENDING").length;

  const isLightBackground = isColorLight(team.primaryColor);

  const statusBadgeClass = isLightBackground
    ? match.status === "COMPLETED"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800"
      : match.status === "CANCELLED"
        ? "border-rose-500/30 bg-rose-500/10 text-rose-800"
        : "border-amber-500/30 bg-amber-500/10 text-amber-800"
    : match.status === "COMPLETED"
      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-200"
      : match.status === "CANCELLED"
        ? "border-rose-500/30 bg-rose-500/20 text-rose-200"
        : "border-amber-500/30 bg-amber-500/20 text-amber-200";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_18%,rgba(12,111,93,0.03),transparent_40%),linear-gradient(180deg,var(--bg)_0%,var(--bg)_100%)] pb-16 font-sans antialiased text-[var(--text)] transition-colors duration-300">
      <PublicNavbar teamName={team.name} badgeUrl={team.badgeUrl} />

      <header
        className={`relative overflow-hidden px-4 pb-20 pt-14 transition-colors duration-300 ${isLightBackground ? "text-slate-900" : "text-white"}`}
        style={{ 
          backgroundColor: team.primaryColor || "#0a584b",
          backgroundImage: isLightBackground
            ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.08))"
            : "linear-gradient(to bottom, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.55))"
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(244,221,183,0.22),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[var(--bg)] opacity-90" />

        <div className="relative mx-auto mt-7 max-w-5xl text-center space-y-3">
          {team.badgeUrl && (
            <img
              src={team.badgeUrl}
              alt={team.name}
              className={`mx-auto h-20 w-20 rounded-2xl border object-cover shadow-[0_18px_38px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-200 ${isLightBackground ? "border-slate-900/10" : "border-white/20"}`}
            />
          )}
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] pt-2 ${isLightBackground ? "text-slate-500" : "text-white/80"}`}>
            Resumo de Partida Oficial
          </p>
          <h1 className="text-balance font-display text-4xl font-extrabold sm:text-5xl drop-shadow-sm leading-none pt-1">
            {team.name} <span className={isLightBackground ? "text-slate-400 font-medium" : "text-white/60 font-medium"}>x</span> {match.opponent}
          </h1>
          <p className={`text-sm sm:text-base font-semibold ${isLightBackground ? "text-slate-700" : "text-white/85"}`}>{formattedDate}</p>
          <span
            className={`inline-flex rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm backdrop-blur-sm ${statusBadgeClass}`}
          >
            {statusLabels[match.status]}
          </span>
        </div>
      </header>

      <main className="mx-auto -mt-9 max-w-5xl space-y-6 px-4">
        {match.status === "SCHEDULED" && match.matchLive && (
          <LiveMatchView
            matchId={match.id}
            initialMatch={match as any}
            initialLive={match.matchLive as any}
          />
        )}

        <section className="app-surface p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[var(--text)]">
            Informações da Partida
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="p-3 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Data / Horário
              </span>
              <p className="mt-1 font-extrabold text-[var(--text)] text-sm">{formattedDate}</p>
            </div>
            <div className="p-3 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Local
              </span>
              <p className="mt-1 font-extrabold text-[var(--text)] text-sm flex flex-wrap items-center gap-2">
                {match.venue}
                {match.latitude && match.longitude && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${match.latitude},${match.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-[#34d399] hover:underline font-semibold"
                  >
                    🗺️ Ver no mapa
                  </a>
                )}
              </p>
            </div>
            <div className="p-3 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Adversário
              </span>
              <p className="mt-1 font-extrabold text-[var(--text)] text-sm">{match.opponent}</p>
            </div>
            <div className="p-3 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Tipo de Partida
              </span>
              <p className="mt-1 font-extrabold text-[var(--text)] text-sm">
                {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
              </p>
            </div>
          </div>
        </section>

        {match.status === "COMPLETED" &&
          match.homeScore !== null &&
          match.awayScore !== null && (
            <section className="app-surface p-6 text-center shadow-sm sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-[var(--text)]">
                Placar Final
              </h2>
              <div className="flex items-center justify-center gap-6 sm:gap-10">
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {team.name}
                  </p>
                  <p className="text-5xl font-black text-[var(--brand)] sm:text-6.5xl">
                    {match.isHome ? match.homeScore : match.awayScore}
                  </p>
                </div>
                <span className="text-3xl font-black text-[var(--text-muted)]">x</span>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {match.opponent}
                  </p>
                  <p className="text-5xl font-black text-rose-500 sm:text-6.5xl">
                    {match.isHome ? match.awayScore : match.homeScore}
                  </p>
                </div>
              </div>
            </section>
          )}

        {match.status === "COMPLETED" && (
          <section className="app-surface p-6 shadow-sm sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-[var(--text)]">Recap da Rodada</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-1">
              <TeamRecapWidget matchId={match.id} />
            </div>
            <div className="pt-2">
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

        {match.status === "SCHEDULED" && !match.matchLive && (
          <section className="app-surface p-6 shadow-sm sm:p-8 space-y-5">
            <h2 className="text-xl font-bold text-[var(--text)]">
              Confirmações de Presença
            </h2>
            <div className="grid gap-4 text-center sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 card-hover">
                <p className="text-4xl font-black text-emerald-600">{confirmed}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-700">Confirmados</p>
              </div>
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 card-hover">
                <p className="text-4xl font-black text-rose-500">{declined}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-rose-600">Recusados</p>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 card-hover">
                <p className="text-4xl font-black text-amber-500">{pending}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-amber-600">Pendentes</p>
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] italic font-semibold">
              Nota: Por questões de privacidade, a comissão técnica não exibe a lista nominal publicamente.
            </p>
          </section>
        )}

        {match.status === "COMPLETED" && match.matchStats.length > 0 && (
          <section className="app-surface overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--text)]">
                Estatísticas Individuais
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm divide-y divide-[var(--border)]">
                <thead>
                  <tr className="bg-[var(--bg)]">
                    <th className="px-5 py-4 font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Jogador</th>
                    <th className="px-5 py-4 font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Posição</th>
                    <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Gols</th>
                    <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Assist.</th>
                    <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Amarelos</th>
                    <th className="px-4 py-4 text-center font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.12em]">Vermelhos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-elevated)]">
                  {match.matchStats.map((stat) => {
                    const playerName = stat.player?.name ?? stat.guestPlayer?.name ?? "Convidado";
                    const playerPosition = stat.player?.position ?? stat.guestPlayer?.position ?? null;
                    return (
                      <tr key={stat.id} className="hover:bg-[var(--bg)] transition-colors duration-150">
                        <td className="px-5 py-4 font-bold text-[var(--text)]">{playerName}</td>
                        <td className="px-5 py-4 text-[var(--text-muted)] font-medium">
                          {playerPosition ? (positionLabels[playerPosition] || playerPosition) : "-"}
                        </td>
                        <td className="px-4 py-4 text-center font-black text-[var(--text)]">{stat.goals}</td>
                        <td className="px-4 py-4 text-center font-black text-[var(--text)]">{stat.assists}</td>
                        <td className="px-4 py-4 text-center font-black text-amber-600">{stat.yellowCards}</td>
                        <td className="px-4 py-4 text-center font-black text-rose-500">{stat.redCards}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {match.status === "SCHEDULED" && (
          <section className="app-surface p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[var(--text)]">Confirmar Presença</h2>
                <p className="text-sm text-[var(--text-muted)] font-medium">
                  Se você é atleta integrado do {team.name}, acesse o painel interno para confirmar sua escalação nesta partida.
                </p>
              </div>
              <Link
                href="/dashboard/matches"
                className="inline-flex shrink-0 min-h-11 items-center justify-center rounded-full bg-[var(--brand)] px-8 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--brand-strong)] hover:scale-105 active:scale-95 transform shadow-sm"
              >
                Confirmar Convocação &rarr;
              </Link>
            </div>
          </section>
        )}

        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--brand)] bg-[var(--bg-elevated)] px-8 text-xs font-bold uppercase tracking-wider text-[var(--brand)] transition-all hover:bg-[var(--brand)] hover:text-white hover:scale-105 active:scale-95 transform shadow-sm"
          >
            Ver Portal do {team.name}
          </Link>
        </div>
      </main>
    </div>
  );
}
