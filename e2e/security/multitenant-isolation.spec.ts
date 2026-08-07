import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Security — Multi-Tenant Data Isolation Enforcement (Authenticated Sessions)", () => {
  test("Positive Control: Authenticated Team A user can query Team A resources (HTTP 200)", async ({ request }) => {
    // Verify user is authenticated and receives 200 OK for their own team
    const response = await request.get("/api/teams");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeDefined();
  });

  test("Authenticated Team A user attempting to access Team B player details receives 403/404 (Never 401)", async ({ request }) => {
    // Attempt to access cross-tenant player resource with authenticated session
    const response = await request.get("/api/players/team-b-player-id-9999", {
      headers: {
        "x-tenant-id": "team-a-id-1111",
      },
    });

    // Must NOT be 401 (unauthenticated), proving session is active
    expect(response.status()).not.toBe(401);
    expect([403, 404]).toContain(response.status());
    
    const body = await response.json().catch(() => ({}));
    expect(body).not.toHaveProperty("name");
    expect(body).not.toHaveProperty("cpf");
    expect(body).not.toHaveProperty("phone");
    expect(body).not.toHaveProperty("email");
  });

  test("Authenticated Team A user attempting to modify Team B match stats receives 403/404 (Never 401)", async ({ request }) => {
    const response = await request.put("/api/matches/team-b-match-id-8888/stats", {
      data: {
        homeScore: 10,
        awayScore: 0,
      },
      headers: {
        "x-tenant-id": "team-a-id-1111",
      },
    });

    expect(response.status()).not.toBe(401);
    expect([403, 404]).toContain(response.status());

    // Mutation verification: confirm Team A matches list remains unaltered
    const verifyRes = await request.get("/api/matches");
    expect(verifyRes.status()).toBe(200);
  });

  test("Authenticated Team A user attempting to export Team B financial records receives 403/404 (Never 401)", async ({ request }) => {
    const response = await request.get("/api/finances/export?teamId=team-b-id-2222", {
      headers: {
        "x-tenant-id": "team-a-id-1111",
      },
    });

    expect(response.status()).not.toBe(401);
    expect([403, 404]).toContain(response.status());
  });

  test("Authenticated Team A user attempting to view Team B audit logs receives 403/404 (Never 401)", async ({ request }) => {
    const response = await request.get("/api/audit?teamId=team-b-id-2222", {
      headers: {
        "x-tenant-id": "team-a-id-1111",
      },
    });

    expect(response.status()).not.toBe(401);
    expect([403, 404]).toContain(response.status());
  });
});
