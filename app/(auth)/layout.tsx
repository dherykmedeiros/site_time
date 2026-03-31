export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(58,120,99,0.12),transparent_34%),radial-gradient(circle_at_88%_0%,rgba(232,163,82,0.14),transparent_34%)]" />
      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-soft)_80%,white_20%)] shadow-[var(--shadow-lg)] lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="hidden border-r border-[var(--border)] p-10 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Plataforma VARzea
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[var(--text)]">
            Gestao inteligente para o seu time amador.
          </h1>
          <p className="mt-4 max-w-md text-sm text-[var(--text-muted)]">
            Organize elenco, partidas e financeiro em um painel unico. Compartilhe a vitrine do time com visual profissional e fluxo seguro.
          </p>
          <div className="mt-10 space-y-3">
            <div className="rounded-2xl border border-[var(--border)] bg-white/65 px-4 py-3 text-sm text-[var(--text-muted)]">
              Convites de jogadores com links seguros e expiracao.
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white/65 px-4 py-3 text-sm text-[var(--text-muted)]">
              Controle de amistosos, RSVP e estatisticas por partida.
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-white/65 px-4 py-3 text-sm text-[var(--text-muted)]">
              Vitrine publica para fortalecer a imagem do clube.
            </div>
          </div>
        </aside>

        <main className="p-4 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
