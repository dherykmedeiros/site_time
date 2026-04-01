"use client";

import { useEffect, useState } from "react";

interface TeamRecapWidgetProps {
  matchId: string;
}

interface TeamRecapResponse {
  totals: {
    goals: number;
    assists: number;
    playersWithStats: number;
  };
  leaders: {
    topScorer: { playerName: string; goals: number } | null;
    topAssistant: { playerName: string; assists: number } | null;
  };
}

export function TeamRecapWidget({ matchId }: TeamRecapWidgetProps) {
  const [data, setData] = useState<TeamRecapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRecap() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/recap/team/${matchId}`);
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
  }, [matchId]);

  if (loading) {
    return <p className="text-sm text-[var(--text-subtle)]">Carregando resumo da rodada...</p>;
  }

  if (error || !data) {
    return <p className="text-sm text-[var(--text-subtle)]">{error || "Recap indisponivel."}</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-[12px] border border-[var(--border)] bg-white/70 p-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Totais</p>
        <p className="mt-1 text-sm font-semibold text-[var(--text)]">
          {data.totals.goals} gols • {data.totals.assists} assistencias
        </p>
      </div>
      <div className="rounded-[12px] border border-[var(--border)] bg-white/70 p-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Artilheiro</p>
        <p className="mt-1 text-sm font-semibold text-[var(--text)]">
          {data.leaders.topScorer
            ? `${data.leaders.topScorer.playerName} (${data.leaders.topScorer.goals})`
            : "Sem destaque"}
        </p>
      </div>
      <div className="rounded-[12px] border border-[var(--border)] bg-white/70 p-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-subtle)]">Assistencias</p>
        <p className="mt-1 text-sm font-semibold text-[var(--text)]">
          {data.leaders.topAssistant
            ? `${data.leaders.topAssistant.playerName} (${data.leaders.topAssistant.assists})`
            : "Sem destaque"}
        </p>
      </div>
    </div>
  );
}
