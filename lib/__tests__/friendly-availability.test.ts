import { describe, expect, it } from "vitest";
import { buildFriendlyAvailability } from "@/lib/friendly-availability";

const baseRules = {
  enabled: true,
  minNoticeDays: 2,
  maxAdvanceDays: 10,
  bufferBeforeDays: 1,
  bufferAfterDays: 1,
  allowedWeekdays: [0, 1, 2, 3, 4, 5, 6],
};

describe("friendly availability", () => {
  it("blocks confirmed matches and configured rest days", () => {
    const days = buildFriendlyAvailability({
      rules: baseRules,
      now: new Date("2026-09-23T15:00:00Z"),
      scheduledMatches: [new Date("2026-09-27T18:00:00-03:00")],
    });

    expect(days.find((day) => day.date === "2026-09-26")?.available).toBe(false);
    expect(days.find((day) => day.date === "2026-09-27")?.reason).toContain("confirmada");
    expect(days.find((day) => day.date === "2026-09-28")?.available).toBe(false);
    expect(days.find((day) => day.date === "2026-09-29")?.available).toBe(true);
  });

  it("enforces notice and allowed weekdays", () => {
    const days = buildFriendlyAvailability({
      rules: { ...baseRules, allowedWeekdays: [6] },
      now: new Date("2026-09-23T15:00:00Z"),
      scheduledMatches: [],
    });

    expect(days[0].available).toBe(false);
    expect(days.find((day) => day.date === "2026-09-26")?.available).toBe(true);
    expect(days.find((day) => day.date === "2026-09-27")?.reason).toContain("semana");
  });
});
