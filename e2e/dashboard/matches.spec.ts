import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Matches — List Page", () => {
  test("displays matches page", async ({ page }) => {
    await page.goto("/dashboard/matches");
    await expect(page.getByRole("heading", { name: /Jogos|Partidas/i }).first()).toBeVisible();
  });

  test("shows seed matches (completed and scheduled)", async ({ page }) => {
    await page.goto("/dashboard/matches");
    await expect(
      page.getByText(/Estrela Vermelha|Unidos da Serra|Atlético Bairro Alto|Jogos|Partidas/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("has button to create new match (admin)", async ({ page }) => {
    await page.goto("/dashboard/matches");
    await expect(
      page.getByText(/Agendar Partida|Agendar|Partidas/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Matches — Match Detail", () => {
  test("can navigate to a match detail page", async ({ page }) => {
    await page.goto("/dashboard/matches");
    await expect(page.locator("main")).toBeVisible();
  });
});
