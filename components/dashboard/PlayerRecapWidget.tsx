"use client";

import { useEffect, useMemo, useState } from "react";

interface PlayerRecapWidgetProps {
  playerId: string;
  playerName: string;
}

interface PlayerRecapResponse {
  career: {
    matches: number;
    goals: number;
    assists: number;
  };
  lastFive: {
    matches: number;
    goals: number;
    assists: number;
  };
  achievements: string[];
}

export function PlayerRecapWidget({ playerId, playerName }: PlayerRecapWidgetProps) {
  const [data, setData] = useState<PlayerRecapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const recapUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/api/og/player-recap/${playerId}`;
    }

    return `${window.location.origin}/api/og/player-recap/${playerId}`;
  }, [playerId]);

  useEffect(() => {
    let active = true;

    async function loadRecap() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/recap/player/${playerId}`);
        const json = await res.json();

        if (!res.ok) {
          if (active) {
            setData(null);
            setError(json.error || "Nao foi possivel carregar o recap.");
          }
          return;
        }

        if (active) {
          setData(json);
        }
      } catch {
        if (active) {
          setData(null);
          setError("Erro de conexao ao carregar o recap.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecap();

    return () => {
      active = false;
    };
  }, [playerId]);

  function handleCopyRecapLink() {
    navigator.clipboard.writeText(recapUrl).then(() => {
      setFeedback("Link do recap copiado!");
      setTimeout(() => setFeedback(null), 2000);
    });
  }

  const whatsAppMessage = `Confira o recap de ${playerName} no VARzea: ${recapUrl}`;

  return (
    <article className="app-surface rounded-[20px] border border-[var(--border)] p-5 shadow-[var(--shadow-sm)]">
      <h2 className="text-base font-bold text-[var(--text)]">Recap compartilhavel</h2>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Gere o card com desempenho do jogador para divulgar no WhatsApp e redes.
      </p>

      {loading && (
        <p className="mt-3 text-sm text-[var(--text-subtle)]">Carregando resumo do jogador...</p>
      )}

      {!loading && error && (
        <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>
      )}

      {!loading && !error && data && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[12px] border border-[var(--border)] bg-white/70 p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Carreira</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">
              {data.career.matches} jogos
            </p>
          </div>
          <div className="rounded-[12px] border border-[var(--border)] bg-white/70 p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Numeros</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">
              {data.career.goals} gols • {data.career.assists} assistencias
            </p>
          </div>
          <div className="rounded-[12px] border border-[var(--border)] bg-white/70 p-3">
            <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Forma recente</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">
              {data.lastFive.goals}G {data.lastFive.assists}A nos ultimos {data.lastFive.matches}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={recapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--brand)] px-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Abrir card recap
        </a>
        <button
          type="button"
          onClick={handleCopyRecapLink}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
        >
          Copiar link
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(whatsAppMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
        >
          Compartilhar no WhatsApp
        </a>
      </div>

      {feedback && (
        <p className="mt-3 text-sm text-[#1d5f4f]">{feedback}</p>
      )}
    </article>
  );
}
