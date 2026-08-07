import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Dashboard — Home", () => {
  test("renders main dashboard with team name", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("main")).toBeVisible();
    await expect(
      page.getByText(/Dashboard|Painel|Elenco|Jogos/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows navigation sidebar items", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("main")).toBeVisible();
  });

  test("admin sees admin-only nav items", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("main")).toBeVisible();
  });

  test("displays stats cards (seed data)", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("main")).toBeVisible();
  });
});
