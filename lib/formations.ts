import type { SuggestedLineupEntry } from "@/lib/validations/match";

export type FormationName =
  | "4-4-2"
  | "4-3-3"
  | "4-2-3-1"
  | "3-5-2"
  | "3-4-3"
  | "5-3-2"
  | "4-1-4-1";

interface FormationSlot {
  /** Horizontal position 0-100 (%) inside the field. Left = small, Right = large. */
  x: number;
  /** Vertical position 0-100 (%) inside the field. Top (GK end) = small, Bottom (attack) = large. */
  y: number;
  /**
   * Player positions to fill this slot, in priority order.
   * First position found among unassigned starters wins.
   */
  positions: Array<SuggestedLineupEntry["position"]>;
}

interface FormationDefinition {
  label: string;
  slots: FormationSlot[];
}

// Field Y reference points:
//   ~14 => goalkeeper (near top)
//   ~30-34 => defense line
//   ~46-56 => midfield
//   ~75-82 => attack

const FORMATIONS: Record<FormationName, FormationDefinition> = {
  "4-4-2": {
    label: "4-4-2",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      // Defense
      { x: 80, y: 32, positions: ["RIGHT_BACK", "DEFENDER"] },
      { x: 62, y: 32, positions: ["DEFENDER", "RIGHT_BACK", "LEFT_BACK", "DEFENSIVE_MIDFIELDER"] },
      { x: 38, y: 32, positions: ["DEFENDER", "LEFT_BACK", "RIGHT_BACK", "DEFENSIVE_MIDFIELDER"] },
      { x: 20, y: 32, positions: ["LEFT_BACK", "DEFENDER"] },
      // Midfield (flat)
      { x: 80, y: 56, positions: ["RIGHT_WINGER", "MIDFIELDER", "RIGHT_BACK"] },
      { x: 62, y: 56, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "RIGHT_WINGER"] },
      { x: 38, y: 56, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "LEFT_WINGER"] },
      { x: 20, y: 56, positions: ["LEFT_WINGER", "MIDFIELDER", "LEFT_BACK"] },
      // Attack
      { x: 60, y: 80, positions: ["FORWARD", "RIGHT_WINGER"] },
      { x: 40, y: 80, positions: ["FORWARD", "LEFT_WINGER"] },
    ],
  },
  "4-3-3": {
    label: "4-3-3",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      { x: 80, y: 32, positions: ["RIGHT_BACK", "DEFENDER"] },
      { x: 62, y: 32, positions: ["DEFENDER", "RIGHT_BACK", "LEFT_BACK"] },
      { x: 38, y: 32, positions: ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"] },
      { x: 20, y: 32, positions: ["LEFT_BACK", "DEFENDER"] },
      // Midfield triangle
      { x: 68, y: 57, positions: ["MIDFIELDER", "RIGHT_WINGER", "DEFENSIVE_MIDFIELDER"] },
      { x: 50, y: 52, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      { x: 32, y: 57, positions: ["MIDFIELDER", "LEFT_WINGER", "DEFENSIVE_MIDFIELDER"] },
      // Attack
      { x: 76, y: 78, positions: ["RIGHT_WINGER", "FORWARD", "MIDFIELDER"] },
      { x: 50, y: 82, positions: ["FORWARD", "RIGHT_WINGER", "LEFT_WINGER"] },
      { x: 24, y: 78, positions: ["LEFT_WINGER", "FORWARD", "MIDFIELDER"] },
    ],
  },
  "4-2-3-1": {
    label: "4-2-3-1",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      { x: 80, y: 30, positions: ["RIGHT_BACK", "DEFENDER"] },
      { x: 62, y: 30, positions: ["DEFENDER", "RIGHT_BACK", "LEFT_BACK"] },
      { x: 38, y: 30, positions: ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"] },
      { x: 20, y: 30, positions: ["LEFT_BACK", "DEFENDER"] },
      // Double pivot
      { x: 62, y: 48, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      { x: 38, y: 48, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      // Attacking midfield trio
      { x: 74, y: 64, positions: ["RIGHT_WINGER", "MIDFIELDER", "FORWARD"] },
      { x: 50, y: 62, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "FORWARD"] },
      { x: 26, y: 64, positions: ["LEFT_WINGER", "MIDFIELDER", "FORWARD"] },
      // Centre-forward
      { x: 50, y: 80, positions: ["FORWARD", "RIGHT_WINGER", "LEFT_WINGER"] },
    ],
  },
  "3-5-2": {
    label: "3-5-2",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      // Three at the back
      { x: 70, y: 32, positions: ["DEFENDER", "RIGHT_BACK"] },
      { x: 50, y: 30, positions: ["DEFENDER"] },
      { x: 30, y: 32, positions: ["DEFENDER", "LEFT_BACK"] },
      // Five midfielders (wide + central)
      { x: 82, y: 54, positions: ["RIGHT_BACK", "RIGHT_WINGER", "MIDFIELDER"] },
      { x: 66, y: 56, positions: ["MIDFIELDER", "RIGHT_WINGER", "DEFENSIVE_MIDFIELDER"] },
      { x: 50, y: 54, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      { x: 34, y: 56, positions: ["MIDFIELDER", "LEFT_WINGER", "DEFENSIVE_MIDFIELDER"] },
      { x: 18, y: 54, positions: ["LEFT_BACK", "LEFT_WINGER", "MIDFIELDER"] },
      // Two strikers
      { x: 62, y: 80, positions: ["FORWARD", "RIGHT_WINGER"] },
      { x: 38, y: 80, positions: ["FORWARD", "LEFT_WINGER"] },
    ],
  },
  "3-4-3": {
    label: "3-4-3",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      { x: 70, y: 30, positions: ["DEFENDER", "RIGHT_BACK"] },
      { x: 50, y: 30, positions: ["DEFENDER"] },
      { x: 30, y: 30, positions: ["DEFENDER", "LEFT_BACK"] },
      // Four midfielders (wide)
      { x: 78, y: 54, positions: ["RIGHT_BACK", "RIGHT_WINGER", "MIDFIELDER"] },
      { x: 60, y: 54, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      { x: 40, y: 54, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      { x: 22, y: 54, positions: ["LEFT_BACK", "LEFT_WINGER", "MIDFIELDER"] },
      // Three forwards
      { x: 76, y: 76, positions: ["RIGHT_WINGER", "FORWARD", "MIDFIELDER"] },
      { x: 50, y: 78, positions: ["FORWARD", "RIGHT_WINGER", "LEFT_WINGER"] },
      { x: 24, y: 76, positions: ["LEFT_WINGER", "FORWARD", "MIDFIELDER"] },
    ],
  },
  "5-3-2": {
    label: "5-3-2",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      // Five defenders (wingbacks + CBs)
      { x: 84, y: 40, positions: ["RIGHT_BACK", "RIGHT_WINGER", "MIDFIELDER"] },
      { x: 70, y: 32, positions: ["DEFENDER", "RIGHT_BACK"] },
      { x: 50, y: 30, positions: ["DEFENDER"] },
      { x: 30, y: 32, positions: ["DEFENDER", "LEFT_BACK"] },
      { x: 16, y: 40, positions: ["LEFT_BACK", "LEFT_WINGER", "MIDFIELDER"] },
      // Three midfielders
      { x: 65, y: 56, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "RIGHT_WINGER"] },
      { x: 50, y: 52, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      { x: 35, y: 56, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "LEFT_WINGER"] },
      // Two strikers
      { x: 62, y: 80, positions: ["FORWARD", "RIGHT_WINGER"] },
      { x: 38, y: 80, positions: ["FORWARD", "LEFT_WINGER"] },
    ],
  },
  "4-1-4-1": {
    label: "4-1-4-1",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      { x: 80, y: 30, positions: ["RIGHT_BACK", "DEFENDER"] },
      { x: 62, y: 30, positions: ["DEFENDER", "RIGHT_BACK", "LEFT_BACK"] },
      { x: 38, y: 30, positions: ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"] },
      { x: 20, y: 30, positions: ["LEFT_BACK", "DEFENDER"] },
      // Holding midfielder
      { x: 50, y: 46, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      // Four in midfield
      { x: 80, y: 60, positions: ["RIGHT_WINGER", "MIDFIELDER", "RIGHT_BACK"] },
      { x: 62, y: 60, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      { x: 38, y: 60, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      { x: 20, y: 60, positions: ["LEFT_WINGER", "MIDFIELDER", "LEFT_BACK"] },
      // Lone striker
      { x: 50, y: 82, positions: ["FORWARD", "RIGHT_WINGER", "LEFT_WINGER"] },
    ],
  },
};

/** Ordered list of all available formation names. */
export const FORMATION_NAMES: FormationName[] = [
  "4-4-2",
  "4-3-3",
  "4-2-3-1",
  "3-5-2",
  "3-4-3",
  "5-3-2",
  "4-1-4-1",
];

/**
 * Assigns `fieldX`/`fieldY` to each starter based on the chosen formation.
 * Uses a greedy slot-fill approach: each slot iterates its `positions` priority list
 * and claims the first unassigned starter matching that position.
 * Remaining unassigned starters fill the leftover empty slots in order.
 * Starters that still have no slot assignment are returned unchanged
 * (they will be auto-placed by `buildLineupFieldPlacements`).
 */
export function applyFormationToStarters(
  formation: FormationName,
  starters: SuggestedLineupEntry[]
): SuggestedLineupEntry[] {
  const definition = FORMATIONS[formation];
  const unassigned = [...starters];
  const filledSlots = new Set<number>();
  const coordsById = new Map<string, { x: number; y: number }>();

  // First pass: fill each slot by position priority
  for (let slotIndex = 0; slotIndex < definition.slots.length; slotIndex++) {
    const slot = definition.slots[slotIndex];

    for (const preferredPosition of slot.positions) {
      const playerIndex = unassigned.findIndex((s) => s.position === preferredPosition);
      if (playerIndex !== -1) {
        coordsById.set(unassigned[playerIndex].playerId, { x: slot.x, y: slot.y });
        filledSlots.add(slotIndex);
        unassigned.splice(playerIndex, 1);
        break;
      }
    }
  }

  // Second pass: assign remaining unmatched players to unfilled slots
  const emptySlotIndices = definition.slots
    .map((_, index) => index)
    .filter((index) => !filledSlots.has(index));

  for (let i = 0; i < unassigned.length && i < emptySlotIndices.length; i++) {
    const slot = definition.slots[emptySlotIndices[i]];
    coordsById.set(unassigned[i].playerId, { x: slot.x, y: slot.y });
  }

  return starters.map((starter) => {
    const coords = coordsById.get(starter.playerId);
    if (!coords) return starter;
    return { ...starter, fieldX: coords.x, fieldY: coords.y };
  });
}
