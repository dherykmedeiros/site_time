import { playerPositionShortLabels } from "@/lib/player-positions";
import type { SuggestedLineupEntry } from "@/lib/validations/match";

interface AnchorPoint {
  x: number;
  y: number;
}

type FieldLane = "goal" | "defense" | "midfield" | "attack";

export interface LineupFieldPlacement {
  playerId: string;
  playerName: string;
  position: SuggestedLineupEntry["position"];
  shortLabel: string;
  x: number;
  y: number;
}

const laneRows: Record<FieldLane, number> = {
  goal: 14,
  defense: 34,
  midfield: 56,
  attack: 79,
};

function getFieldAnchor(position: SuggestedLineupEntry["position"]): AnchorPoint & { lane: FieldLane } {
  switch (position) {
    case "GOALKEEPER":
      return { lane: "goal", x: 50, y: laneRows.goal };
    case "LEFT_BACK":
      return { lane: "defense", x: 18, y: laneRows.defense };
    case "DEFENDER":
      return { lane: "defense", x: 50, y: laneRows.defense };
    case "RIGHT_BACK":
      return { lane: "defense", x: 82, y: laneRows.defense };
    case "DEFENSIVE_MIDFIELDER":
      return { lane: "midfield", x: 50, y: laneRows.midfield - 6 };
    case "MIDFIELDER":
      return { lane: "midfield", x: 50, y: laneRows.midfield };
    case "LEFT_WINGER":
      return { lane: "attack", x: 24, y: laneRows.attack - 5 };
    case "RIGHT_WINGER":
      return { lane: "attack", x: 76, y: laneRows.attack - 5 };
    case "FORWARD":
      return { lane: "attack", x: 50, y: laneRows.attack };
    default:
      return { lane: "midfield", x: 50, y: laneRows.midfield };
  }
}

function resolveLaneXPositions(preferred: number[]) {
  const minimumGap = 12;
  const minX = 12;
  const maxX = 88;
  const resolved = [...preferred].sort((left, right) => left - right);

  for (let index = 1; index < resolved.length; index += 1) {
    if (resolved[index] - resolved[index - 1] < minimumGap) {
      resolved[index] = resolved[index - 1] + minimumGap;
    }
  }

  const overflow = resolved[resolved.length - 1] - maxX;
  if (overflow > 0) {
    for (let index = resolved.length - 1; index >= 0; index -= 1) {
      resolved[index] -= overflow;
      if (index > 0 && resolved[index] - resolved[index - 1] < minimumGap) {
        resolved[index - 1] = resolved[index] - minimumGap;
      }
    }
  }

  const underflow = minX - resolved[0];
  if (underflow > 0) {
    for (let index = 0; index < resolved.length; index += 1) {
      resolved[index] += underflow;
      if (index > 0 && resolved[index] - resolved[index - 1] < minimumGap) {
        resolved[index] = resolved[index - 1] + minimumGap;
      }
    }
  }

  return resolved.map((value) => Math.min(maxX, Math.max(minX, value)));
}

export function buildLineupFieldPlacements(starters: SuggestedLineupEntry[]): LineupFieldPlacement[] {
  const grouped = new Map<FieldLane, Array<SuggestedLineupEntry & { preferredX: number; preferredY: number }>>();

  for (const starter of starters) {
    const anchor = getFieldAnchor(starter.position);
    const bucket = grouped.get(anchor.lane) ?? [];
    bucket.push({ ...starter, preferredX: anchor.x, preferredY: anchor.y });
    grouped.set(anchor.lane, bucket);
  }

  const placements: LineupFieldPlacement[] = [];

  for (const [, players] of grouped.entries()) {
    const orderedPlayers = [...players].sort((left, right) => left.preferredX - right.preferredX || left.playerName.localeCompare(right.playerName));
    const xPositions = resolveLaneXPositions(orderedPlayers.map((player) => player.preferredX));

    orderedPlayers.forEach((player, index) => {
      placements.push({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position,
        shortLabel: playerPositionShortLabels[player.position],
        x: xPositions[index],
        y: player.preferredY,
      });
    });
  }

  return placements.sort((left, right) => left.y - right.y || left.x - right.x);
}