"use client";

import { useEffect, useRef, useState } from "react";
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

interface DragState {
  playerId: string;
  /** Pixel offset between pointer-down position and the token's center — prevents jump on drag start. */
  offsetX: number;
  offsetY: number;
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
  const fieldRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [workingLineup, setWorkingLineup] = useState<SuggestedLineupResponse | null>(lineup);
  const [dragging, setDragging] = useState<DragState | null>(null);

  useEffect(() => {
    setWorkingLineup(lineup ? cloneLineup(lineup) : null);
    setIsEditing(false);
  }, [lineup, generatedAt]);

  const displayLineup = workingLineup ?? lineup;
  const placements = displayLineup ? buildLineupFieldPlacements(displayLineup.starters) : [];
  const hasManualFieldPositions = Boolean(displayLineup?.starters.some((entry) => entry.fieldX != null && entry.fieldY != null));
  const detectedFormation = displayLineup && displayLineup.starters.length > 0
    ? inferBestFormation(displayLineup.starters)
    : null;

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
    setWorkingLineup((current) => {
      if (!current) return current;
      return {
        ...current,
        starters: applyFormationToStarters(formation, current.starters),
      };
    });
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

  function updateStarterCoordinates(
    playerId: string,
    clientX: number,
    clientY: number,
    offsetX = 0,
    offsetY = 0
  ) {
    const field = fieldRef.current;
    if (!field) return;

    const rect = field.getBoundingClientRect();
    const nextX = Math.min(92, Math.max(8, Math.round(((clientX - offsetX - rect.left) / rect.width) * 100)));
    const nextY = Math.min(88, Math.max(10, Math.round(((clientY - offsetY - rect.top) / rect.height) * 100)));

    setWorkingLineup((current) => {
      if (!current) return current;

      return {
        ...current,
        starters: current.starters.map((entry) =>
          entry.playerId === playerId
            ? {
                ...entry,
                fieldX: nextX,
                fieldY: nextY,
                reason: "Posicionado manualmente na prancheta desta partida",
              }
            : entry
        ),
      };
    });
  }

  useEffect(() => {
    if (!dragging) return;
    const currentDragging = dragging;

    function handlePointerMove(event: PointerEvent) {
      updateStarterCoordinates(
        currentDragging.playerId,
        event.clientX,
        event.clientY,
        currentDragging.offsetX,
        currentDragging.offsetY
      );
    }

    function handlePointerUp() {
      setDragging(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging]);

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
                  {detectedFormation && <Badge variant="default">Base {detectedFormation}</Badge>}
                  <Badge variant="info">{displayLineup.starters.length} em campo</Badge>
                </div>
              </div>
              {isEditing && (
                <div className="mb-3 space-y-2">
                  <p className="text-sm text-white/78">
                    Arraste os titulares na prancheta para ajustar posicionamento. Use um esquema abaixo para partir de uma formação conhecida.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-white/60">Esquema:</span>
                    {FORMATION_NAMES.map((name) => (
                      <button
                        key={name}
                        type="button"
                        className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/28 active:bg-white/35"
                        onClick={() => handleApplyFormation(name)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div
                ref={fieldRef}
                className="relative mx-auto aspect-[3/4] w-full max-w-[560px] overflow-hidden rounded-[24px] border border-white/15 bg-[linear-gradient(180deg,#23724d_0%,#19553a_42%,#123e2b_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_34px,rgba(0,0,0,0.03)_34px,rgba(0,0,0,0.03)_68px)]" />
                <div className="absolute inset-4 rounded-[20px] border-2 border-white/70" />
                <div className="absolute left-1/2 top-4 h-[18%] w-[34%] -translate-x-1/2 rounded-b-[18px] border-2 border-t-0 border-white/70" />
                <div className="absolute left-1/2 top-4 h-[8%] w-[16%] -translate-x-1/2 rounded-b-[12px] border-2 border-t-0 border-white/70" />
                <div className="absolute left-1/2 top-[10.5%] h-3 w-3 -translate-x-1/2 rounded-full bg-white/80" />
                <div className="absolute bottom-4 left-1/2 h-[18%] w-[34%] -translate-x-1/2 rounded-t-[18px] border-2 border-b-0 border-white/70" />
                <div className="absolute bottom-4 left-1/2 h-[8%] w-[16%] -translate-x-1/2 rounded-t-[12px] border-2 border-b-0 border-white/70" />
                <div className="absolute bottom-[10.5%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white/80" />
                <div className="absolute bottom-4 left-1/2 top-4 w-px -translate-x-1/2 bg-white/70" />
                <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />
                {placements.map((placement) => (
                  <div
                    key={placement.playerId}
                    className={`absolute flex w-24 -translate-x-1/2 -translate-y-1/2 touch-none select-none flex-col items-center gap-1.5 md:w-28 ${isEditing ? "cursor-grab active:cursor-grabbing" : ""}`}
                    style={{ left: `${placement.x}%`, top: `${placement.y}%` }}
                    title={`${placement.playerName} • ${playerPositionLabels[placement.position]}`}
                    onPointerDown={isEditing ? (event) => {
                      event.preventDefault();
                      const field = fieldRef.current;
                      if (!field) return;
                      const rect = field.getBoundingClientRect();
                      const tokenCenterClientX = rect.left + (placement.x / 100) * rect.width;
                      const tokenCenterClientY = rect.top + (placement.y / 100) * rect.height;
                      setDragging({
                        playerId: placement.playerId,
                        offsetX: event.clientX - tokenCenterClientX,
                        offsetY: event.clientY - tokenCenterClientY,
                      });
                    } : undefined}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/85 bg-[rgba(6,25,18,0.40)] text-[10px] font-bold tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(0,0,0,0.22)] backdrop-blur-sm md:h-11 md:w-11 md:text-xs">
                      {placement.shortLabel}
                    </div>
                    <div className="max-w-full rounded-full bg-[rgba(8,21,18,0.60)] px-2.5 py-1 text-center text-[11px] font-semibold leading-tight text-white shadow-sm backdrop-blur-sm md:px-3 md:text-xs">
                      {placement.playerName}
                    </div>
                  </div>
                ))}
              </div>
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