import { playerPositionShortLabels } from "@/lib/player-positions";
import type { SuggestedLineupEntry } from "@/lib/validations/match";

interface AnchorPoint {
  x: number;
  y: number;
}

export interface LineupFieldPlacement {
  playerId: string;
  playerName: string;
  position: SuggestedLineupEntry["position"];
  shortLabel: string;
  x: number;
  y: number;
}

const positionAnchors: Record<SuggestedLineupEntry["position"], AnchorPoint> = {
  GOALKEEPER: { x: 50, y: 12 },
  DEFENDER: { x: 50, y: 30 },
  LEFT_BACK: { x: 18, y: 42 },
  RIGHT_BACK: { x: 82, y: 42 },
  DEFENSIVE_MIDFIELDER: { x: 50, y: 53 },
  MIDFIELDER: { x: 50, y: 64 },
  LEFT_WINGER: { x: 18, y: 76 },
  RIGHT_WINGER: { x: 82, y: 76 },
  FORWARD: { x: 50, y: 84 },
};

function distributeAcross(count: number, anchorX: number) {
  if (count === 1) {
    return [anchorX];
  }

  const step = 14;
  const start = anchorX - (step * (count - 1)) / 2;
  return Array.from({ length: count }, (_, index) => Math.min(88, Math.max(12, start + step * index)));
}

export function buildLineupFieldPlacements(starters: SuggestedLineupEntry[]): LineupFieldPlacement[] {
  const grouped = new Map<SuggestedLineupEntry["position"], SuggestedLineupEntry[]>();

  for (const starter of starters) {
    const bucket = grouped.get(starter.position) ?? [];
    bucket.push(starter);
    grouped.set(starter.position, bucket);
  }

  const placements: LineupFieldPlacement[] = [];

  for (const [position, players] of grouped.entries()) {
    const anchor = positionAnchors[position] ?? { x: 50, y: 50 };
    const xPositions = distributeAcross(players.length, anchor.x);

    players.forEach((player, index) => {
      placements.push({
        playerId: player.playerId,
        playerName: player.playerName,
        position,
        shortLabel: playerPositionShortLabels[position],
        x: xPositions[index],
        y: anchor.y,
      });
    });
  }

  return placements.sort((left, right) => left.y - right.y || left.x - right.x);
}