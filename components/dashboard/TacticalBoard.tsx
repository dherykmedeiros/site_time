"use client";

import { createRef, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Move, Save, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const TOKEN_SIZE = 56;

export interface TacticalBoardPlayer {
  player_id: string;
  name: string;
  short_label: string;
  position_label: string;
  x_percent: number;
  y_percent: number;
}

interface TacticalBoardProps {
  players: TacticalBoardPlayer[];
  editable?: boolean;
  saveLoading?: boolean;
  formationOptions?: { value: string; label: string }[];
  selectedFormation?: string;
  onFormationChange?: (formation: string) => void;
  onChange?: (players: TacticalBoardPlayer[]) => void;
  onSave?: (positions: Array<{ player_id: string; x_percent: number; y_percent: number }>) => Promise<void> | void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundPercent(value: number) {
  return Math.round(value * 10) / 10;
}

export function TacticalBoard({
  players,
  editable = false,
  saveLoading = false,
  formationOptions = [],
  selectedFormation,
  onFormationChange,
  onChange,
  onSave,
}: TacticalBoardProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, React.RefObject<HTMLDivElement | null>>());
  const [fieldSize, setFieldSize] = useState({ width: 0, height: 0 });
  const [boardPlayers, setBoardPlayers] = useState(players);

  useEffect(() => {
    setBoardPlayers(players);
  }, [players]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    function updateSize() {
      const currentField = fieldRef.current;
      if (!currentField) return;
      setFieldSize({ width: currentField.clientWidth, height: currentField.clientHeight });
    }

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(field);

    return () => observer.disconnect();
  }, []);

  function getNodeRef(playerId: string) {
    const existingRef = nodeRefs.current.get(playerId);
    if (existingRef) return existingRef;
    const nextRef = createRef<HTMLDivElement>();
    nodeRefs.current.set(playerId, nextRef);
    return nextRef;
  }

  function updatePlayers(nextPlayers: TacticalBoardPlayer[]) {
    setBoardPlayers(nextPlayers);
    onChange?.(nextPlayers);
  }

  function toPixels(xPercent: number, yPercent: number) {
    const maxX = Math.max(0, fieldSize.width - TOKEN_SIZE);
    const maxY = Math.max(0, fieldSize.height - TOKEN_SIZE);

    const x = clamp((xPercent / 100) * fieldSize.width - TOKEN_SIZE / 2, 0, maxX);
    const y = clamp((yPercent / 100) * fieldSize.height - TOKEN_SIZE / 2, 0, maxY);

    return { x, y };
  }

  function toPercents(x: number, y: number) {
    const safeWidth = Math.max(fieldSize.width, 1);
    const safeHeight = Math.max(fieldSize.height, 1);
    const centerX = x + TOKEN_SIZE / 2;
    const centerY = y + TOKEN_SIZE / 2;

    return {
      x_percent: roundPercent(clamp((centerX / safeWidth) * 100, 0, 100)),
      y_percent: roundPercent(clamp((centerY / safeHeight) * 100, 0, 100)),
    };
  }

  async function handleSave() {
    if (!onSave) return;

    await onSave(
      boardPlayers.map((player) => ({
        player_id: player.player_id,
        x_percent: player.x_percent,
        y_percent: player.y_percent,
      }))
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Quadro tatico</p>
          <p className="text-xs text-white/70">
            {editable ? "Arraste os jogadores para ajustar o posicionamento." : "Visualizacao responsiva do posicionamento atual."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {formationOptions.length > 0 && onFormationChange && (
            <div className="min-w-[150px]">
              <Select
                aria-label="Selecionar formacao"
                className="border-white/15 bg-white/10 text-white"
                options={formationOptions}
                value={selectedFormation ?? ""}
                onChange={(event) => onFormationChange(event.target.value)}
              />
            </div>
          )}
          {editable && onSave && (
            <Button type="button" variant="secondary" onClick={() => void handleSave()} disabled={saveLoading}>
              <Save className="mr-2 h-4 w-4" />
              {saveLoading ? "Salvando..." : "Salvar"}
            </Button>
          )}
        </div>
      </div>

      <div
        ref={fieldRef}
        className="relative aspect-[3/2] w-full overflow-hidden rounded-[24px] border border-white/15 bg-[linear-gradient(180deg,#2d8b57_0%,#236b45_45%,#1a5236_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_34px,rgba(0,0,0,0.03)_34px,rgba(0,0,0,0.03)_68px)]" />
        <div className="absolute inset-4 rounded-[20px] border-2 border-white/70" />
        <div className="absolute left-1/2 top-4 h-[34%] w-[18%] -translate-x-1/2 rounded-b-[18px] border-2 border-t-0 border-white/70" />
        <div className="absolute left-1/2 top-4 h-[16%] w-[7%] -translate-x-1/2 rounded-b-[12px] border-2 border-t-0 border-white/70" />
        <div className="absolute left-[11%] top-1/2 h-px w-[78%] -translate-y-1/2 bg-white/70" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />
        <div className="absolute bottom-4 left-1/2 h-[34%] w-[18%] -translate-x-1/2 rounded-t-[18px] border-2 border-b-0 border-white/70" />
        <div className="absolute bottom-4 left-1/2 h-[16%] w-[7%] -translate-x-1/2 rounded-t-[12px] border-2 border-b-0 border-white/70" />
        <div className="absolute left-1/2 top-[18%] h-3 w-3 -translate-x-1/2 rounded-full bg-white/80" />
        <div className="absolute bottom-[18%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white/80" />

        {boardPlayers.map((player) => {
          const nodeRef = getNodeRef(player.player_id);
          const position = toPixels(player.x_percent, player.y_percent);

          return (
            <Draggable
              key={player.player_id}
              bounds="parent"
              disabled={!editable || fieldSize.width === 0 || fieldSize.height === 0}
              nodeRef={nodeRef}
              position={position}
              onDrag={(_, data) => {
                const nextPercents = toPercents(data.x, data.y);
                updatePlayers(
                  boardPlayers.map((current) =>
                    current.player_id === player.player_id
                      ? { ...current, ...nextPercents }
                      : current
                  )
                );
              }}
            >
              <div ref={nodeRef} className="absolute h-14 w-14 touch-none select-none">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/85 bg-[rgba(7,22,16,0.42)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.24)] backdrop-blur-sm">
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <User className="h-4 w-4" />
                    <span className="text-[10px] font-bold tracking-[0.08em]">{player.short_label}</span>
                  </div>
                </div>
                <div className="pointer-events-none absolute left-1/2 top-full mt-1 min-w-[88px] -translate-x-1/2 rounded-full bg-[rgba(8,21,18,0.62)] px-2 py-1 text-center text-[11px] font-semibold leading-tight text-white shadow-sm backdrop-blur-sm">
                  {player.name}
                </div>
              </div>
            </Draggable>
          );
        })}

        {editable && (
          <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-[rgba(8,21,18,0.45)] px-3 py-1.5 text-[11px] font-medium text-white/78 backdrop-blur-sm">
            <Move className="h-3.5 w-3.5" />
            arraste para reposicionar
          </div>
        )}
      </div>
    </div>
  );
}