import type { SuggestedLineupEntry } from "@/lib/validations/match";

interface FormationAssignment {
  score: number;
  coordsById: Map<string, { x: number; y: number }>;
}

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
      { x: 82, y: 31, positions: ["RIGHT_BACK", "DEFENDER"] },
      { x: 61, y: 31, positions: ["DEFENDER", "RIGHT_BACK", "LEFT_BACK", "DEFENSIVE_MIDFIELDER"] },
      { x: 39, y: 31, positions: ["DEFENDER", "LEFT_BACK", "RIGHT_BACK", "DEFENSIVE_MIDFIELDER"] },
      { x: 18, y: 31, positions: ["LEFT_BACK", "DEFENDER"] },
      // Midfield (flat)
      { x: 80, y: 56, positions: ["RIGHT_WINGER", "MIDFIELDER", "RIGHT_BACK"] },
      { x: 61, y: 57, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "RIGHT_WINGER"] },
      { x: 39, y: 57, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "LEFT_WINGER"] },
      { x: 20, y: 56, positions: ["LEFT_WINGER", "MIDFIELDER", "LEFT_BACK"] },
      // Attack
      { x: 58, y: 79, positions: ["FORWARD", "RIGHT_WINGER"] },
      { x: 42, y: 79, positions: ["FORWARD", "LEFT_WINGER"] },
    ],
  },
  "4-3-3": {
    label: "4-3-3",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      { x: 82, y: 31, positions: ["RIGHT_BACK", "DEFENDER"] },
      { x: 61, y: 31, positions: ["DEFENDER", "RIGHT_BACK", "LEFT_BACK"] },
      { x: 39, y: 31, positions: ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"] },
      { x: 18, y: 31, positions: ["LEFT_BACK", "DEFENDER"] },
      // Midfield triangle
      { x: 66, y: 58, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      { x: 50, y: 50, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      { x: 34, y: 58, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      // Attack
      { x: 84, y: 77, positions: ["RIGHT_WINGER", "FORWARD"] },
      { x: 50, y: 81, positions: ["FORWARD", "RIGHT_WINGER", "LEFT_WINGER", "MIDFIELDER"] },
      { x: 16, y: 77, positions: ["LEFT_WINGER", "FORWARD"] },
    ],
  },
  "4-2-3-1": {
    label: "4-2-3-1",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      { x: 82, y: 31, positions: ["RIGHT_BACK", "DEFENDER"] },
      { x: 61, y: 31, positions: ["DEFENDER", "RIGHT_BACK", "LEFT_BACK"] },
      { x: 39, y: 31, positions: ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"] },
      { x: 18, y: 31, positions: ["LEFT_BACK", "DEFENDER"] },
      // Double pivot
      { x: 58, y: 47, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      { x: 42, y: 47, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      // Attacking midfield trio
      { x: 80, y: 65, positions: ["RIGHT_WINGER", "MIDFIELDER", "FORWARD"] },
      { x: 50, y: 61, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "FORWARD"] },
      { x: 20, y: 65, positions: ["LEFT_WINGER", "MIDFIELDER", "FORWARD"] },
      // Centre-forward
      { x: 50, y: 82, positions: ["FORWARD", "RIGHT_WINGER", "LEFT_WINGER"] },
    ],
  },
  "3-5-2": {
    label: "3-5-2",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      // Three at the back
      { x: 72, y: 33, positions: ["DEFENDER", "RIGHT_BACK"] },
      { x: 50, y: 30, positions: ["DEFENDER"] },
      { x: 28, y: 33, positions: ["DEFENDER", "LEFT_BACK"] },
      // Five midfielders (wide + central)
      { x: 86, y: 55, positions: ["RIGHT_BACK", "RIGHT_WINGER", "MIDFIELDER"] },
      { x: 64, y: 58, positions: ["MIDFIELDER", "RIGHT_WINGER", "DEFENSIVE_MIDFIELDER"] },
      { x: 50, y: 54, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      { x: 36, y: 58, positions: ["MIDFIELDER", "LEFT_WINGER", "DEFENSIVE_MIDFIELDER"] },
      { x: 14, y: 55, positions: ["LEFT_BACK", "LEFT_WINGER", "MIDFIELDER"] },
      // Two strikers
      { x: 58, y: 80, positions: ["FORWARD", "RIGHT_WINGER"] },
      { x: 42, y: 80, positions: ["FORWARD", "LEFT_WINGER"] },
    ],
  },
  "3-4-3": {
    label: "3-4-3",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      { x: 72, y: 31, positions: ["DEFENDER", "RIGHT_BACK"] },
      { x: 50, y: 30, positions: ["DEFENDER"] },
      { x: 28, y: 31, positions: ["DEFENDER", "LEFT_BACK"] },
      // Four midfielders (wide)
      { x: 84, y: 55, positions: ["RIGHT_BACK", "RIGHT_WINGER", "MIDFIELDER"] },
      { x: 60, y: 55, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      { x: 40, y: 55, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      { x: 16, y: 55, positions: ["LEFT_BACK", "LEFT_WINGER", "MIDFIELDER"] },
      // Three forwards
      { x: 82, y: 78, positions: ["RIGHT_WINGER", "FORWARD", "MIDFIELDER"] },
      { x: 50, y: 80, positions: ["FORWARD", "RIGHT_WINGER", "LEFT_WINGER"] },
      { x: 18, y: 78, positions: ["LEFT_WINGER", "FORWARD", "MIDFIELDER"] },
    ],
  },
  "5-3-2": {
    label: "5-3-2",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      // Five defenders (wingbacks + CBs)
      { x: 86, y: 41, positions: ["RIGHT_BACK", "RIGHT_WINGER", "MIDFIELDER"] },
      { x: 68, y: 32, positions: ["DEFENDER", "RIGHT_BACK"] },
      { x: 50, y: 30, positions: ["DEFENDER"] },
      { x: 32, y: 32, positions: ["DEFENDER", "LEFT_BACK"] },
      { x: 14, y: 41, positions: ["LEFT_BACK", "LEFT_WINGER", "MIDFIELDER"] },
      // Three midfielders
      { x: 64, y: 57, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "RIGHT_WINGER"] },
      { x: 50, y: 51, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      { x: 36, y: 57, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER", "LEFT_WINGER"] },
      // Two strikers
      { x: 58, y: 80, positions: ["FORWARD", "RIGHT_WINGER"] },
      { x: 42, y: 80, positions: ["FORWARD", "LEFT_WINGER"] },
    ],
  },
  "4-1-4-1": {
    label: "4-1-4-1",
    slots: [
      { x: 50, y: 14, positions: ["GOALKEEPER"] },
      { x: 82, y: 31, positions: ["RIGHT_BACK", "DEFENDER"] },
      { x: 61, y: 31, positions: ["DEFENDER", "RIGHT_BACK", "LEFT_BACK"] },
      { x: 39, y: 31, positions: ["DEFENDER", "LEFT_BACK", "RIGHT_BACK"] },
      { x: 18, y: 31, positions: ["LEFT_BACK", "DEFENDER"] },
      // Holding midfielder
      { x: 50, y: 47, positions: ["DEFENSIVE_MIDFIELDER", "MIDFIELDER"] },
      // Four in midfield
      { x: 78, y: 60, positions: ["RIGHT_WINGER", "MIDFIELDER", "RIGHT_BACK"] },
      { x: 60, y: 61, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      { x: 40, y: 61, positions: ["MIDFIELDER", "DEFENSIVE_MIDFIELDER"] },
      { x: 22, y: 60, positions: ["LEFT_WINGER", "MIDFIELDER", "LEFT_BACK"] },
      // Lone striker
      { x: 50, y: 81, positions: ["FORWARD", "RIGHT_WINGER", "LEFT_WINGER"] },
    ],
  },
};

function getPreferenceScore(slot: FormationSlot, position: SuggestedLineupEntry["position"]) {
  const preferenceIndex = slot.positions.indexOf(position);
  if (preferenceIndex === -1) {
    return -1;
  }

  return Math.max(1, slot.positions.length - preferenceIndex);
}

function assignFormationSlots(
  formation: FormationName,
  starters: SuggestedLineupEntry[]
): FormationAssignment {
  const definition = FORMATIONS[formation];
  const remaining = [...starters];
  const filledSlots = new Set<number>();
  const coordsById = new Map<string, { x: number; y: number }>();
  let score = 0;

  for (let slotIndex = 0; slotIndex < definition.slots.length; slotIndex += 1) {
    const slot = definition.slots[slotIndex];
    let bestIndex = -1;
    let bestScore = -1;

    for (let playerIndex = 0; playerIndex < remaining.length; playerIndex += 1) {
      const preferenceScore = getPreferenceScore(slot, remaining[playerIndex].position);
      if (preferenceScore > bestScore) {
        bestScore = preferenceScore;
        bestIndex = playerIndex;
      }
    }

    if (bestIndex === -1 || bestScore < 0) {
      continue;
    }

    const player = remaining[bestIndex];
    coordsById.set(player.playerId, { x: slot.x, y: slot.y });
    filledSlots.add(slotIndex);
    score += bestScore;
    remaining.splice(bestIndex, 1);
  }

  const emptySlotIndices = definition.slots
    .map((_, index) => index)
    .filter((index) => !filledSlots.has(index));

  for (let index = 0; index < remaining.length && index < emptySlotIndices.length; index += 1) {
    const slot = definition.slots[emptySlotIndices[index]];
    coordsById.set(remaining[index].playerId, { x: slot.x, y: slot.y });
  }

  return { score, coordsById };
}

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

const FORMATION_TO_DB: Record<FormationName, string> = {
  "4-4-2": "FOUR_FOUR_TWO",
  "4-3-3": "FOUR_THREE_THREE",
  "4-2-3-1": "FOUR_TWO_THREE_ONE",
  "3-5-2": "THREE_FIVE_TWO",
  "3-4-3": "THREE_FOUR_THREE",
  "5-3-2": "FIVE_THREE_TWO",
  "4-1-4-1": "FOUR_ONE_FOUR_ONE",
};

const DB_TO_FORMATION: Record<string, FormationName> = Object.fromEntries(
  Object.entries(FORMATION_TO_DB).map(([formation, dbValue]) => [dbValue, formation])
) as Record<string, FormationName>;

export function serializeFormation(formation: FormationName | null | undefined) {
  if (!formation) return null;
  return FORMATION_TO_DB[formation] ?? null;
}

export function parseFormation(formation: string | null | undefined): FormationName | null {
  if (!formation) return null;
  return DB_TO_FORMATION[formation] ?? null;
}

export function inferBestFormation(starters: SuggestedLineupEntry[]): FormationName {
  let bestFormation: FormationName = FORMATION_NAMES[0];
  let bestScore = -1;

  for (const formation of FORMATION_NAMES) {
    const assignment = assignFormationSlots(formation, starters);
    if (assignment.score > bestScore) {
      bestFormation = formation;
      bestScore = assignment.score;
    }
  }

  return bestFormation;
}

export function getFormationCoordinates(
  formation: FormationName,
  starters: SuggestedLineupEntry[]
): Map<string, { x: number; y: number }> {
  return assignFormationSlots(formation, starters).coordsById;
}

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
  const coordsById = getFormationCoordinates(formation, starters);

  return starters.map((starter) => {
    const coords = coordsById.get(starter.playerId);
    if (!coords) return starter;
    return { ...starter, fieldX: coords.x, fieldY: coords.y };
  });
}
