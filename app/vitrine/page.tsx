import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

interface VitrineIndexPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Vitrine VARzea",
  description:
    "Conheca equipes, estatisticas e elenco em uma vitrine publica pronta para compartilhar.",
};

async function getTeams(query?: string) {
  const normalizedQuery = query?.trim();

  return prisma.team.findMany({
    where: normalizedQuery
      ? {
          OR: [
            { name: { contains: normalizedQuery, mode: "insensitive" } },
            { description: { contains: normalizedQuery, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      badgeUrl: true,
      primaryColor: true,
      secondaryColor: true,
      _count: {
        select: {
          players: true,
          matches: true,
        },
      },
    },
    take: 60,
  });
}

export default async function VitrineIndexPage({ searchParams }: VitrineIndexPageProps) {
  const { q } = await searchParams;
  const teams = await getTeams(q);

  return (
    <div className="min-h-screen pb-16">
      <header className="relative overflow-hidden border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-soft)_78%,white_22%)] px-4 pb-14 pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(58,120,99,0.18),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(232,163,82,0.22),transparent_33%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
            VARzea
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold text-[var(--text)] sm:text-5xl">
            Vitrine VARzea
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-[var(--text-muted)] sm:text-base">
            Explore perfis publicos com elenco, retrospecto e detalhes para amistosos.
            Compartilhe o link da sua equipe e fortaleça a presenca no futebol amador.
          </p>

          <form action="/vitrine" className="mx-auto mt-6 max-w-xl">
            <label htmlFor="team-search" className="sr-only">
              Buscar equipe
            </label>
            <div className="flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/80 p-2 shadow-[var(--shadow-sm)]">
              <input
                id="team-search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Buscar por nome da equipe"
                className="h-10 flex-1 rounded-full bg-transparent px-4 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)]"
              />
              <button
                type="submit"
                className="inline-flex h-10 min-w-24 items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
              >
                Buscar
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
          {q ? (
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
              Nao encontramos um perfil com esse termo. Tente outra palavra-chave ou remova o filtro da busca.
            </p>
            <Link
              href="/vitrine"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] px-5 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              Ver todas as equipes
            </Link>
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
                      ⚽
                    </div>
                  )}
                  <div>
                    <h2 className="line-clamp-1 text-lg font-semibold text-[var(--text)]">
                      {team.name}
                    </h2>
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-subtle)]">
                      /vitrine/{team.slug}
                    </p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-sm text-[var(--text-muted)]">
                  {team.description || "Equipe em desenvolvimento. Em breve mais informacoes de elenco e temporada."}
                </p>

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
                    {team.primaryColor ? (
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: team.primaryColor }}
                      />
                    ) : null}
                    {team.secondaryColor ? (
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: team.secondaryColor }}
                      />
                    ) : null}
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