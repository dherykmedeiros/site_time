"use client";

import { useEffect } from "react";

export default function VitrineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na vitrine:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(227,96,79,0.15),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(58,120,99,0.12),transparent_36%)]" />
      <div className="app-surface relative w-full max-w-lg rounded-[28px] border border-[var(--border)] p-8 text-center shadow-[var(--shadow-lg)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
          Status da Vitrine
        </p>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold text-[var(--text)]">
          Erro ao carregar a pagina
        </h2>
        <p className="mt-3 text-sm text-[var(--text-muted)] sm:text-base">
          Nao foi possivel abrir esta vitrine agora. Voce pode tentar novamente em instantes.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--brand-strong)] bg-[var(--brand)] px-6 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_var(--brand-strong)] transition hover:bg-[var(--brand-strong)]"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
