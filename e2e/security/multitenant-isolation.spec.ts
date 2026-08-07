import { test, expect } from "@playwright/test";

test.describe("Security — Multi-Tenant Data Isolation Enforcement", () => {
  test("Team A user attempting to access Team B player details receives 404/403 without data leak", async ({ request }) => {
    // Attempt to access cross-tenant player resource
    const response = await request.get("/api/players/team-b-player-id-9999", {
      headers: {
        "x-tenant-id": "team-a-id-1111",
      },
    });

    expect([403, 404]).toContain(response.status());
    
    const body = await response.json().catch(() => ({}));
    expect(body).not.toHaveProperty("name");
    expect(body).not.toHaveProperty("cpf");
    expect(body).not.toHaveProperty("phone");
  });

  test("Team A user attempting to modify Team B match stats receives 403/404", async ({ request }) => {
    const response = await request.put("/api/matches/team-b-match-id-8888/stats", {
      data: {
        homeScore: 10,
        awayScore: 0,
      },
      headers: {
        "x-tenant-id": "team-a-id-1111",
      },
    });

    expect([401, 403, 404]).toContain(response.status());
  });

  test("Team A user attempting to export Team B financial records receives 403", async ({ request }) => {
    const response = await request.get("/api/finances/export?teamId=team-b-id-2222", {
      headers: {
        "x-tenant-id": "team-a-id-1111",
      },
    });

    expect([401, 403, 404]).toContain(response.status());
  });

  test("Team A user attempting to view Team B audit logs receives 403", async ({ request }) => {
    const response = await request.get("/api/audit?teamId=team-b-id-2222", {
      headers: {
        "x-tenant-id": "team-a-id-1111",
      },
    });

    expect([401, 403]).toContain(response.status());
  });
});
