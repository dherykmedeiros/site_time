import { describe, expect, it } from "vitest";
import { createWhatsappUrl, normalizeWhatsappNumber } from "@/lib/whatsapp";

describe("WhatsApp helpers", () => {
  it("normalizes a Brazilian mobile number with DDD", () => {
    expect(normalizeWhatsappNumber("(11) 99999-9999")).toBe("5511999999999");
  });

  it("does not duplicate the Brazilian country code", () => {
    expect(normalizeWhatsappNumber("+55 11 99999-9999")).toBe("5511999999999");
  });

  it("creates an encoded wa.me link", () => {
    expect(createWhatsappUrl("(11) 99999-9999", "Jogo sábado às 10h")).toBe(
      "https://wa.me/5511999999999?text=Jogo%20s%C3%A1bado%20%C3%A0s%2010h",
    );
  });
});
