import { describe, it, expect } from "vitest";
import { createFriendlyRequestSchema } from "../validations/friendly-request";

describe("Friendly Request Bilateral Enhancements", () => {
  it("validates createFriendlyRequestSchema with optional requesterTeamId", () => {
    const validData = {
      teamSlug: "trovao-azul",
      requesterTeamName: "Azilados FC",
      contactEmail: "admin@azilados.com",
      suggestedDates: "Sábado às 16h",
      requesterTeamId: "team-azilados-id-123",
    };

    const result = createFriendlyRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.requesterTeamId).toBe("team-azilados-id-123");
    }
  });

  it("validates createFriendlyRequestSchema without requesterTeamId for external teams", () => {
    const validData = {
      teamSlug: "trovao-azul",
      requesterTeamName: "Time Bairro Amigos",
      contactEmail: "contato@amigos.com",
      suggestedDates: "Domingo de manhã",
    };

    const result = createFriendlyRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.requesterTeamId).toBeUndefined();
    }
  });
});
