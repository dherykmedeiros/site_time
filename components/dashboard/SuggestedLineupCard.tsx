"use client";

import { useEffect, useState } from "react";
import { TacticalBoard, type TacticalBoardPlayer } from "@/components/dashboard/TacticalBoard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { applyFormationToStarters, FORMATION_NAMES, inferBestFormation, type FormationName } from "@/lib/formations";
import { buildLineupFieldPlacements } from "@/lib/lineup-field";
import { playerPositionLabels } from "@/lib/player-positions";
import type {
  LineupConfidence,
  LineupSource,
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
  onSaveLineup: (payload: {
    starters: Array<{ playerId: string; fieldX: number | null; fieldY: number | null }>;
    bench: string[];
  }) => Promise<void> | void;
  onResetSavedLineup: () => Promise<void> | void;
  saveLoading: boolean;
  imageUrl: string | null;
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

const sourceLabel: Record<LineupSource, string> = {
  SAVED: "Escalacao salva",
  SUGGESTED: "Sugestao automatica",
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

function clampFieldX(value: number) {
  return Math.min(92, Math.max(8, Math.round(value)));
}

function clampFieldY(value: number) {
  return Math.min(88, Math.max(10, Math.round(value)));
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
  onSaveLineup,
  onResetSavedLineup,
  saveLoading,
  imageUrl,
}: SuggestedLineupCardProps) {
  const generatedLabel = formatDateTime(generatedAt);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<FormationName | null>(null);
  const [workingLineup, setWorkingLineup] = useState<SuggestedLineupResponse | null>(lineup);

  useEffect(() => {
    setWorkingLineup(lineup ? cloneLineup(lineup) : null);
    setSelectedFormation(null);
    setIsEditing(false);
  }, [lineup, generatedAt]);

  const displayLineup = workingLineup ?? lineup;
  const placements = displayLineup ? buildLineupFieldPlacements(displayLineup.starters) : [];
  const hasManualFieldPositions = Boolean(displayLineup?.starters.some((entry) => entry.fieldX != null && entry.fieldY != null));
  const detectedFormation = displayLineup && displayLineup.starters.length > 0
    ? inferBestFormation(displayLineup.starters)
    : null;
  const activeFormation = selectedFormation ?? detectedFormation;
  const boardPlayers: TacticalBoardPlayer[] = displayLineup
    ? displayLineup.starters.map((entry) => {
        const placement = placements.find((item) => item.playerId === entry.playerId);
        return {
          player_id: entry.playerId,
          name: entry.playerName,
          short_label: placement?.shortLabel ?? entry.position.slice(0, 3),
          position_label: playerPositionLabels[entry.position as keyof typeof playerPositionLabels] || entry.position,
          x_percent: entry.fieldX ?? placement?.x ?? 50,
          y_percent: entry.fieldY ?? placement?.y ?? 50,
        };
      })
    : [];

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

  function handleApplyFormation(formation: FormationName) {
    setSelectedFormation(formation);
    setWorkingLineup((current) => {
      if (!current) return current;
      return {
        ...current,
        starters: applyFormationToStarters(formation, current.starters),
      };
    });
  }

  function handleBoardChange(nextPlayers: TacticalBoardPlayer[]) {
    setWorkingLineup((current) => {
      if (!current) return current;

      return {
        ...current,
        starters: current.starters.map((entry) => {
          const nextPlayer = nextPlayers.find((player) => player.player_id === entry.playerId);
          if (!nextPlayer) {
            return entry;
          }

          return {
            ...entry,
            fieldX: clampFieldX(nextPlayer.x_percent),
            fieldY: clampFieldY(nextPlayer.y_percent),
            reason: "Posicionado manualmente na prancheta desta partida",
          };
        }),
      };
    });
  }

  async function handleBoardSave(nextPositions: Array<{ player_id: string; x_percent: number; y_percent: number }>) {
    if (!displayLineup) return;

    const positionsById = new Map(
      nextPositions.map((player) => [
        player.player_id,
        {
          fieldX: clampFieldX(player.x_percent),
          fieldY: clampFieldY(player.y_percent),
        },
      ])
    );

    await onSaveLineup({
      starters: displayLineup.starters.map((entry) => ({
        playerId: entry.playerId,
        fieldX: positionsById.get(entry.playerId)?.fieldX ?? entry.fieldX ?? null,
        fieldY: positionsById.get(entry.playerId)?.fieldY ?? entry.fieldY ?? null,
      })),
      bench: displayLineup.bench.map((entry) => entry.playerId),
    });
    setIsEditing(false);
  }

  async function handleSave() {
    if (!displayLineup) return;

    await onSaveLineup({
      starters: displayLineup.starters.map((entry) => ({
        playerId: entry.playerId,
        fieldX: entry.fieldX ?? null,
        fieldY: entry.fieldY ?? null,
      })),
      bench: displayLineup.bench.map((entry) => entry.playerId),
    });
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
            {displayLineup && <Badge variant="default">{sourceLabel[displayLineup.meta.source]}</Badge>}
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
            {displayLineup?.meta.source === "SAVED" && !isEditing && (
              <Button type="button" variant="ghost" onClick={() => void onResetSavedLineup()}>
                Voltar para sugestao
              </Button>
            )}
            {imageUrl && displayLineup && displayLineup.starters.length > 0 && (
              <Button type="button" variant="ghost" onClick={() => window.open(imageUrl, "_blank", "noopener,noreferrer")}>
                Abrir imagem do campo
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={onRefresh} disabled={!canRefresh}>
              Recalcular sugestao
            </Button>
            {isEditing && (
              <Button type="button" onClick={() => void handleSave()} disabled={saveLoading}>
                {saveLoading ? "Salvando..." : "Salvar escalação"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {generatedLabel && (
          <p className="text-xs text-[var(--text-subtle)]">
            Ultima leitura: {generatedLabel}
            {isEditing ? " • arraste na prancheta e salve para persistir" : ""}
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
          <div className="space-y-4">
            <div className="rounded-[16px] border border-[var(--border)] bg-[linear-gradient(180deg,#1a6a4f_0%,#124432_100%)] p-4 text-white">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Campo dos titulares</h3>
                  <p className="text-sm text-white/72">
                    {hasManualFieldPositions ? "Prancheta com ajuste manual salvo." : "Distribuição automática baseada em formação."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {activeFormation && <Badge variant="default">Base {activeFormation}</Badge>}
                  <Badge variant="info">{displayLineup.starters.length} em campo</Badge>
                </div>
              </div>
              <TacticalBoard
                editable={isEditing}
                formationOptions={FORMATION_NAMES.map((name) => ({ value: name, label: name }))}
                onChange={handleBoardChange}
                onFormationChange={(formation) => handleApplyFormation(formation as FormationName)}
                onSave={handleBoardSave}
                players={boardPlayers}
                saveLoading={saveLoading}
                selectedFormation={activeFormation ?? undefined}
              />
            </div>

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