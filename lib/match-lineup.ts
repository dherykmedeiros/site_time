import { inferBestFormation, parseFormation } from "@/lib/formations";
import { buildSuggestedLineup } from "@/lib/lineup-suggester";
import type { SuggestedLineupEntry, SuggestedLineupResponse } from "@/lib/validations/match";

interface ConfirmedPlayerInput {
  playerId: string;
  playerName: string;
  position: string;
  shirtNumber: number;
  createdAt: Date;
  status: "ACTIVE" | "INACTIVE";
  rsvpStatus: "PENDING" | "CONFIRMED" | "DECLINED";
}

interface PositionLimitInput {
  position: string;
  maxPlayers: number;
}

interface SavedLineupSelectionInput {
  role: "STARTER" | "BENCH";
  sortOrder: number;
  fieldX: number | null;
  fieldY: number | null;
  updatedAt: Date;
  player: {
    id: string;
    name: string;
    position: string;
  };
}

function buildSavedLineupEntry(
  selection: SavedLineupSelectionInput,
  role: "STARTER" | "BENCH"
): SuggestedLineupEntry {
  return {
    playerId: selection.player.id,
    playerName: selection.player.name,
    position: selection.player.position as SuggestedLineupEntry["position"],
    fieldX: selection.fieldX ?? null,
    fieldY: selection.fieldY ?? null,
    reason:
      role === "STARTER"
        ? "Titular salvo manualmente para esta partida"
        : "Mantido no banco manualmente para esta partida",
  };
}

export function buildMatchLineupSnapshot(args: {
  matchId: string;
  confirmedPlayers: ConfirmedPlayerInput[];
  positionLimits: PositionLimitInput[];
  savedSelections: SavedLineupSelectionInput[];
  savedFormation?: string | null;
}) {
  const suggestedLineup = buildSuggestedLineup({
    matchId: args.matchId,
    confirmedPlayers: args.confirmedPlayers,
    positionLimits: args.positionLimits,
  });

  if (args.savedSelections.length === 0) {
    return {
      generatedAt: new Date().toISOString(),
      lineup: suggestedLineup,
    };
  }

  const eligiblePlayers = args.confirmedPlayers.filter(
    (player) => player.status === "ACTIVE" && player.rsvpStatus === "CONFIRMED"
  );
  const eligibleIds = new Set(eligiblePlayers.map((player) => player.playerId));

  const savedSelections = args.savedSelections
    .filter((selection) => eligibleIds.has(selection.player.id))
    .sort((left, right) => {
      if (left.role !== right.role) {
        return left.role === "STARTER" ? -1 : 1;
      }

      return left.sortOrder - right.sortOrder;
    });

  if (savedSelections.length === 0) {
    return {
      generatedAt: new Date().toISOString(),
      lineup: suggestedLineup,
    };
  }

  const assignedIds = new Set(savedSelections.map((selection) => selection.player.id));
  const savedStarters = savedSelections
    .filter((selection) => selection.role === "STARTER")
    .map((selection) => buildSavedLineupEntry(selection, "STARTER"));
  const savedBench = savedSelections
    .filter((selection) => selection.role === "BENCH")
    .map((selection) => buildSavedLineupEntry(selection, "BENCH"));

  const overflowBench = eligiblePlayers
    .filter((player) => !assignedIds.has(player.playerId))
    .map<SuggestedLineupEntry>((player) => ({
      playerId: player.playerId,
      playerName: player.playerName,
      position: player.position as SuggestedLineupEntry["position"],
      fieldX: null,
      fieldY: null,
      reason: "Confirmado ativo mantido no banco por nao estar salvo na escalação manual",
    }));

  const droppedSelections = args.savedSelections.length - savedSelections.length;
  const alerts = [...suggestedLineup.alerts];
  if (droppedSelections > 0) {
    alerts.unshift("Alguns atletas salvos sairam da escalação por nao estarem mais confirmados e ativos.");
  }

  const lastUpdatedAt = savedSelections.reduce((latest, selection) => {
    return selection.updatedAt > latest ? selection.updatedAt : latest;
  }, savedSelections[0].updatedAt);

  const lineup: SuggestedLineupResponse = {
    starters: savedStarters,
    bench: [...savedBench, ...overflowBench],
    alerts,
    meta: {
      ...suggestedLineup.meta,
      startersCount: savedStarters.length,
      benchCount: savedBench.length + overflowBench.length,
      source: "SAVED",
      formation: parseFormation(args.savedFormation) ?? (savedStarters.length > 0 ? inferBestFormation(savedStarters) : null),
    },
  };

  return {
    generatedAt: lastUpdatedAt.toISOString(),
    lineup,
  };
}