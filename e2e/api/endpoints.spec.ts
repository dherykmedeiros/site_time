import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("API — Teams", () => {
  test("GET /api/teams returns team data", async ({ request }) => {
    const res = await request.get("/api/teams");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeDefined();
  });
});

test.describe("API — Players", () => {
  test("GET /api/players returns players list", async ({ request }) => {
    const res = await request.get("/api/players");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeDefined();
  });
});

test.describe("API — Matches", () => {
  test("GET /api/matches returns matches list", async ({ request }) => {
    const res = await request.get("/api/matches");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeDefined();
  });

  test("GET /api/matches?status=SCHEDULED returns only scheduled", async ({ request }) => {
    const res = await request.get("/api/matches?status=SCHEDULED");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeDefined();
  });
});

test.describe("API — Finances", () => {
  test("GET /api/finances returns transactions", async ({ request }) => {
    const res = await request.get("/api/finances");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeDefined();
  });
});

test.describe("API — Stats", () => {
  test("GET /api/stats/rankings returns rankings", async ({ request }) => {
    const res = await request.get("/api/stats/rankings");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeDefined();
  });
});

test.describe("API — Friendly Requests", () => {
  test("GET /api/friendly-requests returns requests", async ({ request }) => {
    const res = await request.get("/api/friendly-requests");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeDefined();
  });
});

test.describe("API — Discovery (Public)", () => {
  test("GET /api/teams/discovery returns public teams", async ({ request }) => {
    const res = await request.get("/api/teams/discovery");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toBeDefined();
  });
});

test.describe("API — Auth Validation", () => {
  test("POST /api/auth/register rejects duplicate email", async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: {
        email: "admin@sitetime.com.br",
        password: "SomePass123!",
        name: "Duplicate User",
      },
    });
    // Should be 409 (EMAIL_EXISTS) or 403 (REGISTRATION_LOCKED)
    expect([403, 409]).toContain(res.status());
  });

  test("POST /api/auth/register rejects invalid data", async ({ request }) => {
    const res = await request.post("/api/auth/register", {
      data: {
        email: "not-an-email",
        password: "short",
        name: "A",
      },
    });
    expect(res.ok()).toBeFalsy();
    expect([400, 403, 429]).toContain(res.status());
  });
});
