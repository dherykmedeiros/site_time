import { inferBestFormation } from "@/lib/formations";
import { playerPositionLabels } from "@/lib/player-positions";
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

function formatPositionLabel(position: string) {
  const knownLabel = playerPositionLabels[position as keyof typeof playerPositionLabels];
  if (knownLabel) {
    return knownLabel.toLowerCase();
  }

  return position.toLowerCase().replace(/_/g, " ");
}

function formatMissingPlayersAlert(position: string, missingCount: number) {
  const athleteLabel = missingCount === 1 ? "atleta" : "atletas";
  return `Faltam ${missingCount} ${athleteLabel} na posicao ${formatPositionLabel(position)}.`;
}

function sortPlayers(players: ConfirmedPlayerInput[]) {
  return [...players].sort((left, right) => {
    if (left.shirtNumber !== right.shirtNumber) {
      return left.shirtNumber - right.shirtNumber;
    }

    return left.createdAt.getTime() - right.createdAt.getTime();
  });
}

function buildLimitedLineup(players: ConfirmedPlayerInput[], positionLimits: PositionLimitInput[]) {
  const grouped = new Map<string, ConfirmedPlayerInput[]>();
  const starters: SuggestedLineupEntry[] = [];
  const bench: SuggestedLineupEntry[] = [];
  const alerts: string[] = [];

  for (const player of players) {
    const current = grouped.get(player.position) ?? [];
    current.push(player);
    grouped.set(player.position, current);
  }

  for (const [position, currentPlayers] of grouped.entries()) {
    grouped.set(position, sortPlayers(currentPlayers));
  }

  const coveredPositions = new Set<string>();

  for (const limit of positionLimits) {
    const playersForPosition = grouped.get(limit.position) ?? [];
    coveredPositions.add(limit.position);

    if (playersForPosition.length < limit.maxPlayers) {
      alerts.push(formatMissingPlayersAlert(limit.position, limit.maxPlayers - playersForPosition.length));
    }

    starters.push(
      ...playersForPosition.slice(0, limit.maxPlayers).map((player) => ({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position as SuggestedLineupEntry["position"],
        reason: "Posicao preenchida conforme limite da partida",
        fieldX: null,
        fieldY: null,
      }))
    );

    bench.push(
      ...playersForPosition.slice(limit.maxPlayers).map((player) => ({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position as SuggestedLineupEntry["position"],
        reason: "Excedente da posicao apos preencher titulares",
        fieldX: null,
        fieldY: null,
      }))
    );
  }

  for (const player of players) {
    if (!coveredPositions.has(player.position)) {
      bench.push({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position as SuggestedLineupEntry["position"],
        reason: "Posicao sem limite explicito; mantido no banco inicial",
        fieldX: null,
        fieldY: null,
      });
    }
  }

  return { starters, bench, alerts };
}

function buildFallbackLineup(players: ConfirmedPlayerInput[]) {
  const starters: SuggestedLineupEntry[] = [];
  const bench: SuggestedLineupEntry[] = [];
  const alerts: string[] = [];
  const sortedPlayers = sortPlayers(players);
  const goalkeepers = sortedPlayers.filter((player) => player.position === "GOALKEEPER");
  const remaining = sortedPlayers.filter((player) => player.position !== "GOALKEEPER");

  if (goalkeepers.length === 0) {
    alerts.push("Nao ha goleiro confirmado para esta partida.");
  } else {
    const firstGoalkeeper = goalkeepers[0];
    starters.push({
      playerId: firstGoalkeeper.playerId,
      playerName: firstGoalkeeper.playerName,
      position: firstGoalkeeper.position as SuggestedLineupEntry["position"],
      reason: "Goleiro confirmado priorizado para iniciar",
      fieldX: null,
      fieldY: null,
    });

    for (const extraGoalkeeper of goalkeepers.slice(1)) {
      bench.push({
        playerId: extraGoalkeeper.playerId,
        playerName: extraGoalkeeper.playerName,
        position: extraGoalkeeper.position as SuggestedLineupEntry["position"],
        reason: "Goleiro extra mantido como opcao de banco",
        fieldX: null,
        fieldY: null,
      });
    }
  }

  const seenPositions = new Set<string>(starters.map((player) => player.position));

  for (const player of remaining) {
    if (starters.length >= 11) {
      bench.push({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position as SuggestedLineupEntry["position"],
        reason: "Mantido no banco apos completar a base inicial",
        fieldX: null,
        fieldY: null,
      });
      continue;
    }

    if (!seenPositions.has(player.position)) {
      starters.push({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position as SuggestedLineupEntry["position"],
        reason: "Posicao ainda sem cobertura na base inicial",
        fieldX: null,
        fieldY: null,
      });
      seenPositions.add(player.position);
      continue;
    }

    bench.push({
      playerId: player.playerId,
      playerName: player.playerName,
        position: player.position as SuggestedLineupEntry["position"],
      reason: "Mantido no banco para preservar equilibrio inicial por posicao",
        fieldX: null,
        fieldY: null,
    });
  }

  if (starters.length < Math.min(players.length, 11)) {
    for (const reserve of [...bench]) {
      if (starters.length >= Math.min(players.length, 11)) {
        break;
      }

      starters.push({
        ...reserve,
        reason: "Promovido para completar a base minima de titulares",
      });
    }
  }

  const starterIds = new Set(starters.map((player) => player.playerId));
  const finalBench = bench.filter((player) => !starterIds.has(player.playerId));

  if (players.length < 11) {
    alerts.push("Ha poucos confirmados para montar uma base completa de titulares.");
  }

  return { starters, bench: finalBench, alerts };
}

function buildConfidence(confirmedPlayers: number, alerts: string[]) {
  if (confirmedPlayers >= 11 && alerts.length === 0) {
    return "HIGH" as const;
  }

  if (confirmedPlayers >= 7) {
    return "MEDIUM" as const;
  }

  return "LOW" as const;
}

function enforceStarterLimit(lineup: {
  starters: SuggestedLineupEntry[];
  bench: SuggestedLineupEntry[];
  alerts: string[];
}) {
  if (lineup.starters.length <= 11) {
    return lineup;
  }

  const allowedStarters = lineup.starters.slice(0, 11);
  const overflowStarters = lineup.starters.slice(11).map((player) => ({
    ...player,
    reason: "Movido para o banco por limite maximo de 11 titulares",
  }));

  return {
    starters: allowedStarters,
    bench: [...overflowStarters, ...lineup.bench],
    alerts: [
      "A sugestao foi ajustada para no maximo 11 titulares.",
      ...lineup.alerts,
    ],
  };
}

export function buildSuggestedLineup(args: {
  matchId: string;
  confirmedPlayers: ConfirmedPlayerInput[];
  positionLimits: PositionLimitInput[];
}): SuggestedLineupResponse {
  const eligiblePlayers = sortPlayers(
    args.confirmedPlayers.filter(
      (player) => player.status === "ACTIVE" && player.rsvpStatus === "CONFIRMED"
    )
  );

  if (eligiblePlayers.length === 0) {
    return {
      starters: [],
      bench: [],
      alerts: ["Ainda nao ha jogadores confirmados suficientes para sugerir a escalacao."],
      meta: {
        confirmedPlayers: 0,
        startersCount: 0,
        benchCount: 0,
        usesPositionLimits: args.positionLimits.length > 0,
        confidence: "LOW",
        source: "SUGGESTED",
        formation: null,
        blockPreset: "BALANCED",
      },
    };
  }

  const base = args.positionLimits.length > 0
    ? buildLimitedLineup(eligiblePlayers, args.positionLimits)
    : buildFallbackLineup(eligiblePlayers);

  const normalized = enforceStarterLimit(base);

  if (args.positionLimits.length > 0 && !eligiblePlayers.some((player) => player.position === "GOALKEEPER")) {
    normalized.alerts.unshift("Nao ha goleiro confirmado para esta partida.");
  }

  return {
    starters: normalized.starters,
    bench: normalized.bench,
    alerts: normalized.alerts,
    meta: {
      confirmedPlayers: eligiblePlayers.length,
      startersCount: normalized.starters.length,
      benchCount: normalized.bench.length,
      usesPositionLimits: args.positionLimits.length > 0,
      confidence: buildConfidence(eligiblePlayers.length, normalized.alerts),
      source: "SUGGESTED",
      formation: normalized.starters.length > 0 ? inferBestFormation(normalized.starters) : null,
      blockPreset: "BALANCED",
    },
  };
}