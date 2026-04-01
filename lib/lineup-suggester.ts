import { playerPositionLabels } from "@/lib/player-positions";

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

interface SuggestedLineupEntry {
  playerId: string;
  playerName: string;
  position: string;
  reason: string;
}

interface SuggestedLineup {
  starters: SuggestedLineupEntry[];
  bench: SuggestedLineupEntry[];
  alerts: string[];
  meta: {
    confirmedPlayers: number;
    startersCount: number;
    benchCount: number;
    usesPositionLimits: boolean;
    confidence: "LOW" | "MEDIUM" | "HIGH";
  };
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
        position: player.position,
        reason: "Posicao preenchida conforme limite da partida",
      }))
    );

    bench.push(
      ...playersForPosition.slice(limit.maxPlayers).map((player) => ({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position,
        reason: "Excedente da posicao apos preencher titulares",
      }))
    );
  }

  for (const player of players) {
    if (!coveredPositions.has(player.position)) {
      bench.push({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position,
        reason: "Posicao sem limite explicito; mantido no banco inicial",
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
      position: firstGoalkeeper.position,
      reason: "Goleiro confirmado priorizado para iniciar",
    });

    for (const extraGoalkeeper of goalkeepers.slice(1)) {
      bench.push({
        playerId: extraGoalkeeper.playerId,
        playerName: extraGoalkeeper.playerName,
        position: extraGoalkeeper.position,
        reason: "Goleiro extra mantido como opcao de banco",
      });
    }
  }

  const seenPositions = new Set<string>(starters.map((player) => player.position));

  for (const player of remaining) {
    if (starters.length >= 11) {
      bench.push({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position,
        reason: "Mantido no banco apos completar a base inicial",
      });
      continue;
    }

    if (!seenPositions.has(player.position)) {
      starters.push({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position,
        reason: "Posicao ainda sem cobertura na base inicial",
      });
      seenPositions.add(player.position);
      continue;
    }

    bench.push({
      playerId: player.playerId,
      playerName: player.playerName,
      position: player.position,
      reason: "Mantido no banco para preservar equilibrio inicial por posicao",
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

export function buildSuggestedLineup(args: {
  matchId: string;
  confirmedPlayers: ConfirmedPlayerInput[];
  positionLimits: PositionLimitInput[];
}): SuggestedLineup {
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
      },
    };
  }

  const base = args.positionLimits.length > 0
    ? buildLimitedLineup(eligiblePlayers, args.positionLimits)
    : buildFallbackLineup(eligiblePlayers);

  if (args.positionLimits.length > 0 && !eligiblePlayers.some((player) => player.position === "GOALKEEPER")) {
    base.alerts.unshift("Nao ha goleiro confirmado para esta partida.");
  }

  return {
    starters: base.starters,
    bench: base.bench,
    alerts: base.alerts,
    meta: {
      confirmedPlayers: eligiblePlayers.length,
      startersCount: base.starters.length,
      benchCount: base.bench.length,
      usesPositionLimits: args.positionLimits.length > 0,
      confidence: buildConfidence(eligiblePlayers.length, base.alerts),
    },
  };
}