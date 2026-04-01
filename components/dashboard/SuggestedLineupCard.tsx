"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { playerPositionLabels } from "@/lib/player-positions";
import type {
  LineupConfidence,
  SuggestedLineupEntry,
  SuggestedLineupResponse,
} from "@/lib/validations/match";

interface SuggestedLineupCardProps {
  loading: boolean;
  error: string | null;
  lineup: SuggestedLineupResponse | null;
  generatedAt: string | null;
  onRefresh: () => void;
  canRefresh: boolean;
}

const confidenceVariant: Record<LineupConfidence, "danger" | "warning" | "success"> = {
  LOW: "danger",
  MEDIUM: "warning",
  HIGH: "success",
};

const confidenceLabel: Record<LineupConfidence, string> = {
  LOW: "Baixa confiança",
  MEDIUM: "Confiança média",
  HIGH: "Confiança alta",
};

function formatDateTime(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function cloneLineup(lineup: SuggestedLineupResponse): SuggestedLineupResponse {
  return {
    ...lineup,
    starters: lineup.starters.map((entry) => ({ ...entry })),
    bench: lineup.bench.map((entry) => ({ ...entry })),
    alerts: [...lineup.alerts],
    meta: { ...lineup.meta },
  };
}

function movePlayerBetweenGroups(
  lineup: SuggestedLineupResponse,
  player: SuggestedLineupEntry,
  origin: "starters" | "bench"
) {
  const nextStarters = lineup.starters.filter((entry) => entry.playerId !== player.playerId);
  const nextBench = lineup.bench.filter((entry) => entry.playerId !== player.playerId);

  if (origin === "starters") {
    nextBench.unshift({
      ...player,
      reason: "Movido manualmente para o banco nesta visualizacao",
    });
  } else {
    nextStarters.push({
      ...player,
      reason: "Promovido manualmente para titulares nesta visualizacao",
    });
  }

  return {
    ...lineup,
    starters: nextStarters,
    bench: nextBench,
    meta: {
      ...lineup.meta,
      startersCount: nextStarters.length,
      benchCount: nextBench.length,
    },
  };
}

export function SuggestedLineupCard({
  loading,
  error,
  lineup,
  generatedAt,
  onRefresh,
  canRefresh,
}: SuggestedLineupCardProps) {
  const generatedLabel = formatDateTime(generatedAt);
  const [isEditing, setIsEditing] = useState(false);
  const [workingLineup, setWorkingLineup] = useState<SuggestedLineupResponse | null>(lineup);

  useEffect(() => {
    setWorkingLineup(lineup ? cloneLineup(lineup) : null);
    setIsEditing(false);
  }, [lineup, generatedAt]);

  const displayLineup = workingLineup ?? lineup;

  function handleMove(player: SuggestedLineupEntry, origin: "starters" | "bench") {
    setWorkingLineup((current) => {
      if (!current) return current;
      return movePlayerBetweenGroups(current, player, origin);
    });
  }

  function handleReset() {
    setWorkingLineup(lineup ? cloneLineup(lineup) : null);
    setIsEditing(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">
              Escalacao sugerida
            </p>
            <h2 className="text-lg font-semibold text-[var(--text)]">Titulares e banco iniciais</h2>
            <p className="text-sm text-[var(--text-subtle)]">
              A sugestao usa apenas confirmados ativos, pode ser recalculada e tambem ajustada manualmente na tela.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {displayLineup && (
              <Badge variant={confidenceVariant[displayLineup.meta.confidence]}>
                {confidenceLabel[displayLineup.meta.confidence]}
              </Badge>
            )}
            {displayLineup && (
              <Button
                type="button"
                variant={isEditing ? "secondary" : "ghost"}
                onClick={() => setIsEditing((current) => !current)}
              >
                {isEditing ? "Concluir ajuste" : "Editar manualmente"}
              </Button>
            )}
            {isEditing && (
              <Button type="button" variant="ghost" onClick={handleReset}>
                Reverter leitura
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={onRefresh} disabled={!canRefresh}>
              Recalcular sugestao
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {generatedLabel && (
          <p className="text-xs text-[var(--text-subtle)]">
            Ultima leitura: {generatedLabel}
            {isEditing ? " • ajustes manuais nao sao persistidos" : ""}
          </p>
        )}

        {loading && <p className="text-sm text-[var(--text-subtle)]">Carregando sugestao...</p>}

        {!loading && error && (
          <div className="rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        {!loading && !error && displayLineup && displayLineup.starters.length === 0 && displayLineup.bench.length === 0 && (
          <div className="rounded-[12px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-subtle)]">
            Ainda nao ha confirmados suficientes para montar uma sugestao util.
          </div>
        )}

        {!loading && !error && displayLineup && (displayLineup.starters.length > 0 || displayLineup.bench.length > 0) && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-[var(--text)]">Titulares</h3>
                <span className="text-xs text-[var(--text-subtle)]">{displayLineup.meta.startersCount}</span>
              </div>
              <div className="space-y-3">
                {displayLineup.starters.map((entry) => (
                  <div key={entry.playerId} className="rounded-[12px] bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--text)]">{entry.playerName}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="info">
                          {playerPositionLabels[entry.position as keyof typeof playerPositionLabels] || entry.position}
                        </Badge>
                        {isEditing && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMove(entry, "starters")}
                          >
                            Mandar para banco
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-subtle)]">{entry.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-[var(--text)]">Banco inicial</h3>
                <span className="text-xs text-[var(--text-subtle)]">{displayLineup.meta.benchCount}</span>
              </div>
              <div className="space-y-3">
                {displayLineup.bench.length === 0 && (
                  <p className="text-sm text-[var(--text-subtle)]">Nenhum jogador excedente no banco inicial.</p>
                )}
                {displayLineup.bench.map((entry) => (
                  <div key={entry.playerId} className="rounded-[12px] bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--text)]">{entry.playerName}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          {playerPositionLabels[entry.position as keyof typeof playerPositionLabels] || entry.position}
                        </Badge>
                        {isEditing && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMove(entry, "bench")}
                          >
                            Virar titular
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-subtle)]">{entry.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && displayLineup && displayLineup.alerts.length > 0 && (
          <div className="space-y-2">
            {displayLineup.alerts.map((alert) => (
              <div key={alert} className="rounded-[12px] border border-[#f3ddab] bg-[#fff8e8] p-3 text-sm text-[#7b5a1c]">
                {alert}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}