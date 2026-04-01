import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

interface VitrineIndexPageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    region?: string;
    fieldType?: "GRASS" | "SYNTHETIC" | "FUTSAL" | "SOCIETY" | "OTHER";
    weekday?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
  }>;
}

const weekdayOptions = [
  { value: "", label: "Qualquer dia" },
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda" },
  { value: "2", label: "Terca" },
  { value: "3", label: "Quarta" },
  { value: "4", label: "Quinta" },
  { value: "5", label: "Sexta" },
  { value: "6", label: "Sabado" },
];

const fieldTypeOptions = [
  { value: "", label: "Qualquer campo" },
  { value: "GRASS", label: "Grama" },
  { value: "SYNTHETIC", label: "Sintetico" },
  { value: "FUTSAL", label: "Futsal" },
  { value: "SOCIETY", label: "Society" },
  { value: "OTHER", label: "Outro" },
];

export const metadata: Metadata = {
  title: "Diretorio VARzea",
  description:
    "Encontre times com agenda aberta para amistosos por cidade, regiao, dia e tipo de campo.",
};

async function getTeams(filters: {
  q?: string;
  city?: string;
  region?: string;
  fieldType?: "GRASS" | "SYNTHETIC" | "FUTSAL" | "SOCIETY" | "OTHER";
  weekday?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
}) {
  const normalizedQuery = filters.q?.trim();
  const normalizedCity = filters.city?.trim();
  const normalizedRegion = filters.region?.trim();
  const weekday = filters.weekday !== undefined ? Number(filters.weekday) : null;

  const teams = await prisma.team.findMany({
    where: {
      publicDirectoryOptIn: true,
      OR: [{ city: { not: null } }, { region: { not: null } }],
      ...(normalizedQuery
        ? {
            OR: [
              { name: { contains: normalizedQuery, mode: "insensitive" } },
              { description: { contains: normalizedQuery, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(normalizedCity ? { city: { contains: normalizedCity, mode: "insensitive" } } : {}),
      ...(normalizedRegion ? { region: { contains: normalizedRegion, mode: "insensitive" } } : {}),
      ...(filters.fieldType ? { fieldType: filters.fieldType } : {}),
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      badgeUrl: true,
      primaryColor: true,
      secondaryColor: true,
      city: true,
      region: true,
      fieldType: true,
      openMatchSlots: {
        where: { status: "OPEN" },
        orderBy: { date: "asc" },
        select: {
          id: true,
          date: true,
          timeLabel: true,
          venueLabel: true,
        },
      },
      _count: {
        select: {
          players: true,
          matches: true,
        },
      },
    },
    take: 80,
  });

  if (weekday === null) {
    return teams;
  }

  return teams
    .map((team) => ({
      ...team,
      openMatchSlots: team.openMatchSlots.filter((slot) => slot.date.getUTCDay() === weekday),
    }))
    .filter((team) => team.openMatchSlots.length > 0);
}

export default async function VitrineIndexPage({ searchParams }: VitrineIndexPageProps) {
  const { q, city, region, fieldType, weekday } = await searchParams;
  const teams = await getTeams({ q, city, region, fieldType, weekday });
  const hasFilters = Boolean(q || city || region || fieldType || weekday);

  return (
    <div className="min-h-screen pb-16">
      <header className="relative overflow-hidden border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-soft)_78%,white_22%)] px-4 pb-14 pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(58,120,99,0.18),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(232,163,82,0.22),transparent_33%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
            VARzea
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold text-[var(--text)] sm:text-5xl">
            Diretorio de Amistosos
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-[var(--text-muted)] sm:text-base">
            Descubra equipes com disponibilidade real para amistosos por local, dia e tipo de campo.
          </p>

          <form action="/vitrine" className="mx-auto mt-6 max-w-4xl rounded-[22px] border border-[var(--border-strong)] bg-white/80 p-4 shadow-[var(--shadow-sm)]">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <label className="sm:col-span-2 lg:col-span-2">
                <span className="sr-only">Buscar equipe</span>
                <input
                  id="team-search"
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="Buscar por nome da equipe"
                  className="h-10 w-full rounded-full border border-[var(--border)] bg-white px-4 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)]"
                />
              </label>
              <input
                name="city"
                defaultValue={city ?? ""}
                placeholder="Cidade"
                className="h-10 w-full rounded-full border border-[var(--border)] bg-white px-4 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)]"
              />
              <input
                name="region"
                defaultValue={region ?? ""}
                placeholder="Regiao"
                className="h-10 w-full rounded-full border border-[var(--border)] bg-white px-4 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)]"
              />
              <select
                name="fieldType"
                defaultValue={fieldType ?? ""}
                className="h-10 w-full rounded-full border border-[var(--border)] bg-white px-4 text-sm text-[var(--text)] outline-none"
              >
                {fieldTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                name="weekday"
                defaultValue={weekday ?? ""}
                className="h-10 w-full rounded-full border border-[var(--border)] bg-white px-4 text-sm text-[var(--text)] outline-none"
              >
                {weekdayOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex h-10 min-w-24 items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
              >
                Filtrar
              </button>
            </div>
          </form>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl px-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-muted)]">
            {teams.length} {teams.length === 1 ? "equipe encontrada" : "equipes encontradas"}
          </p>
          {hasFilters ? (
            <Link
              href="/vitrine"
              className="text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-strong)]"
            >
              Limpar busca
            </Link>
          ) : null}
        </div>

        {teams.length === 0 ? (
          <section className="app-surface rounded-[28px] border border-dashed border-[var(--border-strong)] px-6 py-12 text-center shadow-[var(--shadow-sm)]">
            <h2 className="font-display text-3xl font-bold text-[var(--text)]">
              Nenhuma equipe encontrada
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-muted)] sm:text-base">
              Ajuste os filtros para localizar equipes com agenda aberta para amistoso.
            </p>
          </section>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <article
                key={team.id}
                className="app-surface group flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex items-center gap-3">
                  {team.badgeUrl ? (
                    <img
                      src={team.badgeUrl}
                      alt={`Escudo ${team.name}`}
                      className="h-14 w-14 rounded-2xl border border-[var(--border)] object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl"
                      style={{
                        background: `linear-gradient(135deg, ${team.primaryColor || "#3a7863"}, ${team.secondaryColor || "#e8a352"})`,
                      }}
                    >
                      FC
                    </div>
                  )}
                  <div>
                    <h2 className="line-clamp-1 text-lg font-semibold text-[var(--text)]">{team.name}</h2>
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-subtle)]">/vitrine/{team.slug}</p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-sm text-[var(--text-muted)]">
                  {team.description || "Equipe em desenvolvimento. Em breve mais informacoes de elenco e temporada."}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--text-subtle)]">
                  {team.city && <span className="rounded-full border border-[var(--border)] bg-white/70 px-2 py-1">{team.city}</span>}
                  {team.region && <span className="rounded-full border border-[var(--border)] bg-white/70 px-2 py-1">{team.region}</span>}
                  {team.fieldType && (
                    <span className="rounded-full border border-[var(--border)] bg-white/70 px-2 py-1">Campo: {team.fieldType}</span>
                  )}
                </div>

                <div className="mt-3 rounded-2xl border border-[var(--border)] bg-white/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-subtle)]">Agenda aberta</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                    {team.openMatchSlots.length > 0 ? `${team.openMatchSlots.length} data(s) disponiveis` : "Sem data aberta no momento"}
                  </p>
                  {team.openMatchSlots[0] && (
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Proxima: {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(team.openMatchSlots[0].date)}
                    </p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-[var(--border)] bg-white/45 p-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{team._count.players}</p>
                    <p className="text-xs text-[var(--text-subtle)]">Jogadores</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{team._count.matches}</p>
                    <p className="text-xs text-[var(--text-subtle)]">Partidas</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {team.primaryColor ? <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: team.primaryColor }} /> : null}
                    {team.secondaryColor ? <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: team.secondaryColor }} /> : null}
                  </div>
                  <Link
                    href={`/vitrine/${team.slug}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm font-semibold text-white transition group-hover:bg-[var(--brand-strong)]"
                  >
                    Ver vitrine
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
