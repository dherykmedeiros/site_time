import { inferBestFormation, parseBlockPreset, parseFormation } from "@/lib/formations";
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
  teamSide?: string | null;
  sortOrder: number;
  fieldX: number | null;
  fieldY: number | null;
  updatedAt: Date;
  player: {
    id: string;
    name: string;
    position: string;
    shirtNumber?: number | null;
  };
}

function buildSavedLineupEntry(
  selection: SavedLineupSelectionInput,
  role: "STARTER" | "BENCH"
): SuggestedLineupEntry & { teamSide?: string } {
  return {
    playerId: selection.player.id,
    playerName: selection.player.name,
    position: selection.player.position as SuggestedLineupEntry["position"],
    fieldX: selection.fieldX ?? null,
    fieldY: selection.fieldY ?? null,
    teamSide: selection.teamSide || "A",
    reason:
      role === "STARTER"
        ? `Titular (${selection.teamSide === "B" ? "Time B" : "Time A"}) salvo para esta partida`
        : `Reserva (${selection.teamSide === "B" ? "Time B" : "Time A"}) salvo para esta partida`,
  };
}

export function buildMatchLineupSnapshot(args: {
  matchId: string;
  confirmedPlayers: ConfirmedPlayerInput[];
  positionLimits: PositionLimitInput[];
  savedSelections: SavedLineupSelectionInput[];
  savedFormation?: string | null;
  savedBlockPreset?: string | null;
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
  const savedStarterCandidates = savedSelections
    .filter((selection) => selection.role === "STARTER")
    .map((selection) => buildSavedLineupEntry(selection, "STARTER"));
  const savedStarters = savedStarterCandidates.slice(0, 11);
  const overflowFromStarters = savedStarterCandidates.slice(11).map((entry) => ({
    ...entry,
    reason: "Movido para o banco por limite maximo de 11 titulares",
  }));
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
    bench: [...overflowFromStarters, ...savedBench, ...overflowBench],
    alerts,
    meta: {
      ...suggestedLineup.meta,
      startersCount: savedStarters.length,
      benchCount: overflowFromStarters.length + savedBench.length + overflowBench.length,
      source: "SAVED",
      formation: parseFormation(args.savedFormation) ?? (savedStarters.length > 0 ? inferBestFormation(savedStarters) : null),
      blockPreset: parseBlockPreset(args.savedBlockPreset) ?? "BALANCED",
    },
  };

  return {
    generatedAt: lastUpdatedAt.toISOString(),
    lineup,
  };
}

export interface TrainingPlayerCandidate {
  id: string;
  name: string;
  position: string;
  shirtNumber?: number | null;
  isGuest?: boolean;
}

export function autoBalanceTrainingTeams(players: TrainingPlayerCandidate[]) {
  const goalkeepers: TrainingPlayerCandidate[] = [];
  const defenders: TrainingPlayerCandidate[] = [];
  const midfielders: TrainingPlayerCandidate[] = [];
  const forwards: TrainingPlayerCandidate[] = [];
  const others: TrainingPlayerCandidate[] = [];

  for (const p of players) {
    const pos = p.position?.toUpperCase() || "";
    if (pos === "GOALKEEPER") {
      goalkeepers.push(p);
    } else if (["DEFENDER", "LEFT_BACK", "RIGHT_BACK", "LEFT_WINGBACK", "RIGHT_WINGBACK"].includes(pos)) {
      defenders.push(p);
    } else if (["MIDFIELDER", "DEFENSIVE_MIDFIELDER"].includes(pos)) {
      midfielders.push(p);
    } else if (["FORWARD", "LEFT_WINGER", "RIGHT_WINGER"].includes(pos)) {
      forwards.push(p);
    } else {
      others.push(p);
    }
  }

  const teamA: TrainingPlayerCandidate[] = [];
  const teamB: TrainingPlayerCandidate[] = [];

  const distribute = (bucket: TrainingPlayerCandidate[]) => {
    bucket.forEach((item) => {
      if (teamA.length <= teamB.length) {
        teamA.push(item);
      } else {
        teamB.push(item);
      }
    });
  };

  distribute(goalkeepers);
  distribute(defenders);
  distribute(midfielders);
  distribute(forwards);
  distribute(others);

  return {
    teamA: {
      starters: teamA.slice(0, 11),
      bench: teamA.slice(11),
    },
    teamB: {
      starters: teamB.slice(0, 11),
      bench: teamB.slice(11),
    },
  };
}