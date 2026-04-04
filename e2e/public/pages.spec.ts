import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("home page loads (unauthenticated → login or landing)", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");
    // Should either show a landing page or redirect to login
    await expect(
      page.getByText(/Entrar|VARzea|Site Time|Bem-vindo/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("404 — Not Found", () => {
  test("shows 404 for unknown routes", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-xyz");
    await expect(
      page.getByText(/404|não encontrada|not found/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
