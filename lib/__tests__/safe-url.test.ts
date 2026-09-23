import { describe, expect, it } from "vitest";
import { isSafeUrl } from "@/lib/utils";
import { createTeamSchema } from "@/lib/validations/team";

describe("isSafeUrl", () => {
  it("accepts legacy and VPS local upload URLs", () => {
    expect(isSafeUrl("/uploads/550e8400-e29b-41d4-a716-446655440000.png")).toBe(true);
    expect(isSafeUrl("/api/assets/550e8400-e29b-41d4-a716-446655440000.webp")).toBe(true);
  });

  it("allows a newly uploaded VPS badge when creating a team", () => {
    const result = createTeamSchema.safeParse({
      name: "Time Novo",
      badgeUrl: "/api/assets/550e8400-e29b-41d4-a716-446655440000.png",
    });

    expect(result.success).toBe(true);
  });

  it("rejects unsafe local paths", () => {
    expect(isSafeUrl("/api/assets/../secret.png")).toBe(false);
    expect(isSafeUrl("/api/assets/image.png?redirect=https://example.com")).toBe(false);
    expect(isSafeUrl("/api/other/image.png")).toBe(false);
  });

  it("keeps accepting safe public HTTPS URLs", () => {
    expect(isSafeUrl("https://example.com/uploads/badge.png")).toBe(true);
    expect(isSafeUrl("http://example.com/uploads/badge.png")).toBe(false);
    expect(isSafeUrl("https://127.0.0.1/badge.png")).toBe(false);
  });
});
