import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("home page loads (unauthenticated → login or landing)", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("404 — Not Found", () => {
  test("shows 404 for unknown routes", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-xyz");
    await expect(page.getByText("Página não encontrada")).toBeVisible();
  });
});
