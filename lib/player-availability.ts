import { playerPositionLabels } from "@/lib/player-positions";
import type { AvailabilityFrequencyValue, AvailabilityLevelValue } from "@/lib/validations/player-availability";

export type AvailabilityForecastRisk = "LOW" | "MEDIUM" | "HIGH";
export type AvailabilityClassification = "likelyAvailable" | "uncertain" | "likelyUnavailable";

export interface AvailabilityRuleLike {
  dayOfWeek: number;
  startMinutes: number;
  endMinutes: number;
  frequency: AvailabilityFrequencyValue;
  availability: AvailabilityLevelValue;
}

export interface AvailabilityForecastPlayer {
  id: string;
  position: string;
  availabilityRules: AvailabilityRuleLike[];
}

export interface AvailabilityPositionSummary {
  position: string;
  likelyAvailable: number;
  uncertain: number;
  likelyUnavailable: number;
  risk: AvailabilityForecastRisk;
}

export interface AvailabilityForecast {
  snapshot: {
    date: string;
    activePlayers: number;
    likelyAvailableCount: number;
    uncertainCount: number;
    likelyUnavailableCount: number;
    overallRisk: AvailabilityForecastRisk;
  };
  positions: AvailabilityPositionSummary[];
  explanations: string[];
}

const frequencyWeight: Record<AvailabilityFrequencyValue, number> = {
  WEEKLY: 1,
  BIWEEKLY: 0.65,
  MONTHLY_OPTIONAL: 0.35,
};

const availabilityWeight: Record<AvailabilityLevelValue, number> = {
  AVAILABLE: 1,
  PREFERABLE: 0.7,
  UNAVAILABLE: -1,
};

export function resolveAvailabilitySlot(dateInput: string) {
  const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);

  if (match) {
    const [, yearValue, monthValue, dayValue, hoursValue, minutesValue] = match;
    const year = Number(yearValue);
    const month = Number(monthValue);
    const day = Number(dayValue);
    const hours = Number(hoursValue);
    const minutes = Number(minutesValue);
    const localDate = new Date(year, month - 1, day, hours, minutes);

    return {
      matchDate: localDate,
      dayOfWeek: localDate.getDay(),
      minutesOfDay: hours * 60 + minutes,
    };
  }

  const parsed = new Date(dateInput);

  return {
    matchDate: parsed,
    dayOfWeek: parsed.getUTCDay(),
    minutesOfDay: parsed.getUTCHours() * 60 + parsed.getUTCMinutes(),
  };
}

function classifyPlayer(
  rules: AvailabilityRuleLike[],
  dayOfWeek: number,
  minutesOfDay: number
): AvailabilityClassification {
  const relevantRules = rules.filter(
    (rule) =>
      rule.dayOfWeek === dayOfWeek &&
      rule.startMinutes <= minutesOfDay &&
      minutesOfDay < rule.endMinutes
  );

  if (relevantRules.length === 0) {
    return "uncertain";
  }

  const strongestScore = relevantRules.reduce((bestScore, rule) => {
    const score = frequencyWeight[rule.frequency] * availabilityWeight[rule.availability];
    return Math.abs(score) > Math.abs(bestScore) ? score : bestScore;
  }, 0);

  if (strongestScore >= 0.75) {
    return "likelyAvailable";
  }

  if (strongestScore <= -0.45) {
    return "likelyUnavailable";
  }

  return "uncertain";
}

function buildPositionCoverageSummary(players: AvailabilityForecastPlayer[], classifications: Map<string, AvailabilityClassification>) {
  const summaryMap = new Map<string, AvailabilityPositionSummary>();

  for (const player of players) {
    const current = summaryMap.get(player.position) ?? {
      position: player.position,
      likelyAvailable: 0,
      uncertain: 0,
      likelyUnavailable: 0,
      risk: "MEDIUM" as AvailabilityForecastRisk,
    };

    const classification = classifications.get(player.id) ?? "uncertain";
    if (classification === "likelyAvailable") current.likelyAvailable += 1;
    if (classification === "uncertain") current.uncertain += 1;
    if (classification === "likelyUnavailable") current.likelyUnavailable += 1;

    summaryMap.set(player.position, current);
  }

  return [...summaryMap.values()]
    .map((entry) => {
      let risk: AvailabilityForecastRisk = "MEDIUM";

      if (entry.likelyAvailable === 0) {
        risk = "HIGH";
      } else if (entry.likelyAvailable >= 2 || entry.uncertain === 0) {
        risk = "LOW";
      }

      return {
        ...entry,
        risk,
      };
    })
    .sort((left, right) => left.position.localeCompare(right.position));
}

function buildExplanations(
  activePlayers: number,
  likelyAvailableCount: number,
  uncertainCount: number,
  positions: AvailabilityPositionSummary[]
) {
  const explanations: string[] = [];

  if (activePlayers === 0) {
    explanations.push("Nao ha atletas ativos suficientes para gerar previsao.");
    return explanations;
  }

  if (likelyAvailableCount === 0) {
    explanations.push("Nenhum atleta aparece como disponibilidade forte para este horario.");
  } else if (likelyAvailableCount / activePlayers < 0.45) {
    explanations.push("A base estimada de atletas disponiveis esta abaixo da media do elenco.");
  } else {
    explanations.push("A previsao indica base razoavel para montar o jogo neste horario.");
  }

  if (uncertainCount > 0) {
    explanations.push("Parte do elenco ainda aparece com baixa confianca para este horario.");
  }

  const riskyPositions = positions.filter((position) => position.risk !== "LOW").slice(0, 2);
  for (const position of riskyPositions) {
    const label = playerPositionLabels[position.position as keyof typeof playerPositionLabels] ?? position.position;
    if (position.likelyAvailable === 0) {
      explanations.push(`Nao ha cobertura forte para ${label.toLowerCase()} neste horario.`);
    } else {
      explanations.push(`A cobertura de ${label.toLowerCase()} ainda depende de confirmacoes adicionais.`);
    }
  }

  return explanations.slice(0, 3);
}

export function buildMatchAvailabilityForecast(args: {
  matchDate: Date;
  dayOfWeek: number;
  minutesOfDay: number;
  players: AvailabilityForecastPlayer[];
}): AvailabilityForecast {
  const classifications = new Map<string, AvailabilityClassification>();

  for (const player of args.players) {
    classifications.set(
      player.id,
      classifyPlayer(player.availabilityRules, args.dayOfWeek, args.minutesOfDay)
    );
  }

  let likelyAvailableCount = 0;
  let uncertainCount = 0;
  let likelyUnavailableCount = 0;

  for (const classification of classifications.values()) {
    if (classification === "likelyAvailable") likelyAvailableCount += 1;
    if (classification === "uncertain") uncertainCount += 1;
    if (classification === "likelyUnavailable") likelyUnavailableCount += 1;
  }

  const positions = buildPositionCoverageSummary(args.players, classifications);
  const highRiskPositions = positions.filter((entry) => entry.risk === "HIGH").length;
  const availabilityRatio = args.players.length === 0 ? 0 : likelyAvailableCount / args.players.length;

  let overallRisk: AvailabilityForecastRisk = "MEDIUM";
  if (availabilityRatio >= 0.55 && highRiskPositions === 0) {
    overallRisk = "LOW";
  } else if (availabilityRatio < 0.35 || highRiskPositions >= 2) {
    overallRisk = "HIGH";
  }

  return {
    snapshot: {
      date: args.matchDate.toISOString(),
      activePlayers: args.players.length,
      likelyAvailableCount,
      uncertainCount,
      likelyUnavailableCount,
      overallRisk,
    },
    positions,
    explanations: buildExplanations(args.players.length, likelyAvailableCount, uncertainCount, positions),
  };
}