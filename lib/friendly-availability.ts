export const FRIENDLY_TIME_ZONE = "America/Sao_Paulo";

export interface FriendlyAvailabilityRules {
  enabled: boolean;
  minNoticeDays: number;
  maxAdvanceDays: number;
  bufferBeforeDays: number;
  bufferAfterDays: number;
  allowedWeekdays: number[];
}

export interface FriendlyAvailabilityDay {
  date: string;
  available: boolean;
  reason: string | null;
}

export function dateKeyInTimeZone(date: Date, timeZone = FRIENDLY_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function dateKeyToUtc(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

function addDays(dateKey: string, days: number): string {
  const date = dateKeyToUtc(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function differenceInDays(left: string, right: string): number {
  return Math.round((dateKeyToUtc(left).getTime() - dateKeyToUtc(right).getTime()) / 86_400_000);
}

export function normalizeAllowedWeekdays(value: unknown): number[] {
  if (!Array.isArray(value)) return [0, 1, 2, 3, 4, 5, 6];
  const days = [...new Set(value.filter((day): day is number => Number.isInteger(day) && day >= 0 && day <= 6))];
  return days.sort((a, b) => a - b);
}

export function buildFriendlyAvailability(args: {
  rules: FriendlyAvailabilityRules;
  scheduledMatches: Date[];
  now?: Date;
  timeZone?: string;
}): FriendlyAvailabilityDay[] {
  const now = args.now ?? new Date();
  const timeZone = args.timeZone ?? FRIENDLY_TIME_ZONE;
  const today = dateKeyInTimeZone(now, timeZone);
  const matchDays = args.scheduledMatches.map((date) => dateKeyInTimeZone(date, timeZone));
  const days: FriendlyAvailabilityDay[] = [];

  for (let offset = 0; offset <= args.rules.maxAdvanceDays; offset += 1) {
    const date = addDays(today, offset);
    const weekday = dateKeyToUtc(date).getUTCDay();
    let reason: string | null = null;

    if (!args.rules.enabled) {
      reason = "O time não está recebendo convites no momento";
    } else if (offset < args.rules.minNoticeDays) {
      reason = `Exige antecedência mínima de ${args.rules.minNoticeDays} dia(s)`;
    } else if (!args.rules.allowedWeekdays.includes(weekday)) {
      reason = "Dia da semana indisponível";
    } else {
      for (const matchDay of matchDays) {
        const distance = differenceInDays(date, matchDay);
        if (distance === 0) {
          reason = "Já existe uma partida confirmada";
          break;
        }
        if (distance < 0 && Math.abs(distance) <= args.rules.bufferBeforeDays) {
          reason = "Intervalo de descanso antes de uma partida";
          break;
        }
        if (distance > 0 && distance <= args.rules.bufferAfterDays) {
          reason = "Intervalo de descanso após uma partida";
          break;
        }
      }
    }

    days.push({ date, available: reason === null, reason });
  }

  return days;
}
