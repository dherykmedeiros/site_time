import { describe, it, expect } from "vitest";
import { createFriendlyRequestSchema } from "../validations/friendly-request";

describe("Friendly Request Bilateral Enhancements", () => {
  it("validates createFriendlyRequestSchema with optional requesterTeamId", () => {
    const validData = {
      teamSlug: "trovao-azul",
      requesterTeamName: "Azilados FC",
      contactEmail: "admin@azilados.com",
      contactPhone: "(11) 99999-9999",
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
      contactPhone: "(11) 98888-7777",
      suggestedDates: "Domingo de manhã",
    };

    const result = createFriendlyRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.requesterTeamId).toBeUndefined();
      expect(result.data.contactEmail).toBeUndefined();
    }
  });

  it("requires a WhatsApp number with DDD", () => {
    const result = createFriendlyRequestSchema.safeParse({
      teamSlug: "trovao-azul",
      requesterTeamName: "Time sem contato",
      contactEmail: "",
      suggestedDates: "Domingo de manhã",
    });

    expect(result.success).toBe(false);
  });
});
