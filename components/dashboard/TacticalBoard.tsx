"use client";

import { createRef, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Move, Save, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const TOKEN_SIZE = 50;
const FIELD_ZONES = [
  { key: "build", label: "Saida", top: "8%", height: "20%" },
  { key: "defense", label: "Defesa", top: "28%", height: "20%" },
  { key: "midfield", label: "Meio", top: "48%", height: "22%" },
  { key: "attack", label: "Ataque", top: "70%", height: "18%" },
] as const;

export interface TacticalBoardPlayer {
  player_id: string;
  name: string;
  short_label: string;
  position_label: string;
  position_code: string;
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

function nearestValue(value: number, candidates: number[]) {
  return candidates.reduce((closest, current) =>
    Math.abs(current - value) < Math.abs(closest - value) ? current : closest
  );
}

function snapPlayerPosition(player: TacticalBoardPlayer, nextPosition: { x_percent: number; y_percent: number }) {
  switch (player.position_code) {
    case "GOALKEEPER":
      return { x_percent: 50, y_percent: 14 };
    case "LEFT_BACK":
      return { x_percent: nearestValue(nextPosition.x_percent, [16, 20, 24]), y_percent: nearestValue(nextPosition.y_percent, [30, 34, 38]) };
    case "RIGHT_BACK":
      return { x_percent: nearestValue(nextPosition.x_percent, [76, 80, 84]), y_percent: nearestValue(nextPosition.y_percent, [30, 34, 38]) };
    case "DEFENDER":
      return { x_percent: nearestValue(nextPosition.x_percent, [30, 40, 50, 60, 70]), y_percent: nearestValue(nextPosition.y_percent, [30, 34, 38]) };
    case "DEFENSIVE_MIDFIELDER":
      return { x_percent: nearestValue(nextPosition.x_percent, [34, 42, 50, 58, 66]), y_percent: nearestValue(nextPosition.y_percent, [46, 52, 58]) };
    case "MIDFIELDER":
      return { x_percent: nearestValue(nextPosition.x_percent, [22, 34, 50, 66, 78]), y_percent: nearestValue(nextPosition.y_percent, [54, 60, 66]) };
    case "LEFT_WINGER":
      return { x_percent: nearestValue(nextPosition.x_percent, [16, 22, 28]), y_percent: nearestValue(nextPosition.y_percent, [72, 78, 84]) };
    case "RIGHT_WINGER":
      return { x_percent: nearestValue(nextPosition.x_percent, [72, 78, 84]), y_percent: nearestValue(nextPosition.y_percent, [72, 78, 84]) };
    case "FORWARD":
      return { x_percent: nearestValue(nextPosition.x_percent, [34, 42, 50, 58, 66]), y_percent: nearestValue(nextPosition.y_percent, [74, 80, 86]) };
    default:
      return nextPosition;
  }
}

function getPlayerMarkerClasses(positionLabel: string) {
  const normalized = positionLabel.toLowerCase();

  if (normalized.includes("gole")) {
    return {
      ring: "border-[#d2f0ff]/95",
      surface: "bg-[linear-gradient(180deg,rgba(21,57,76,0.80)_0%,rgba(9,25,35,0.88)_100%)]",
      name: "bg-[rgba(12,36,46,0.72)]",
    };
  }

  if (normalized.includes("zague") || normalized.includes("lateral")) {
    return {
      ring: "border-[#d9fff0]/90",
      surface: "bg-[linear-gradient(180deg,rgba(18,63,46,0.82)_0%,rgba(8,29,22,0.90)_100%)]",
      name: "bg-[rgba(8,30,22,0.68)]",
    };
  }

  if (normalized.includes("vol") || normalized.includes("meio")) {
    return {
      ring: "border-[#fff0c4]/90",
      surface: "bg-[linear-gradient(180deg,rgba(71,58,19,0.78)_0%,rgba(31,24,7,0.90)_100%)]",
      name: "bg-[rgba(33,26,8,0.68)]",
    };
  }

  return {
    ring: "border-[#ffe1d5]/90",
    surface: "bg-[linear-gradient(180deg,rgba(82,36,28,0.78)_0%,rgba(32,12,8,0.90)_100%)]",
    name: "bg-[rgba(34,14,9,0.68)]",
  };
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
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.06)] px-4 py-3 backdrop-blur-sm">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-[0.06em] text-white">Quadro tatico</p>
          <p className="text-xs text-white/70">
            {editable ? "Arraste os jogadores para ajustar o posicionamento. O snap tatico ajuda a manter cada linha organizada." : "Visualizacao responsiva do posicionamento atual."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {formationOptions.length > 0 && onFormationChange && (
            <div className="min-w-[170px]">
              <Select
                aria-label="Selecionar formacao"
                className="border-white/15 bg-[rgba(255,255,255,0.10)] text-white shadow-none [&>option]:text-slate-900"
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
        className="relative aspect-[3/2] w-full overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,#2f8f59_0%,#276e48_42%,#1a4e35_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_28px_rgba(0,0,0,0.16)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_30%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.024)_0,rgba(255,255,255,0.024)_27px,rgba(0,0,0,0.022)_27px,rgba(0,0,0,0.022)_54px)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_18%,transparent_82%,rgba(0,0,0,0.16)_100%)]" />
        {FIELD_ZONES.map((zone) => (
          <div
            key={zone.key}
            className="pointer-events-none absolute left-[6%] right-[6%] rounded-[18px] border border-white/6 bg-white/[0.025]"
            style={{ top: zone.top, height: zone.height }}
          >
            <span className="absolute left-3 top-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">
              {zone.label}
            </span>
          </div>
        ))}
        <div className="absolute inset-4 rounded-[24px] border-2 border-white/70" />
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
          const markerClasses = getPlayerMarkerClasses(player.position_label);

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
              onStop={(_, data) => {
                const nextPercents = toPercents(data.x, data.y);
                const snapped = snapPlayerPosition(player, nextPercents);
                updatePlayers(
                  boardPlayers.map((current) =>
                    current.player_id === player.player_id
                      ? { ...current, ...snapped }
                      : current
                  )
                );
              }}
            >
              <div ref={nodeRef} className="absolute h-[86px] w-[92px] touch-none select-none">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-white/16 bg-white/8 p-0.5 shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-transform duration-150 hover:scale-[1.03]">
                  <div className={`flex h-full w-full flex-col items-center justify-center rounded-full border ${markerClasses.ring} ${markerClasses.surface} text-white`}>
                    <User className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold tracking-[0.12em]">{player.short_label}</span>
                  </div>
                </div>
                <div className="pointer-events-none absolute left-[25px] top-[56px] min-w-[72px] max-w-[92px] -translate-x-1/2 rounded-[999px] border border-white/10 px-2 py-1 text-center text-[10px] font-semibold leading-[1.15] text-white shadow-sm backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(8, 21, 18, 0.54)" }}
                >
                  <span className="block truncate">{player.name}</span>
                </div>
              </div>
            </Draggable>
          );
        })}

        {editable && (
          <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(8,21,18,0.45)] px-3 py-1.5 text-[11px] font-medium text-white/78 backdrop-blur-sm">
            <Move className="h-3.5 w-3.5" />
            snap tatico ativo
          </div>
        )}
      </div>
    </div>
  );
}