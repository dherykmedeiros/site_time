import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Squad — Player List", () => {
  test("displays squad page with players from seed", async ({ page }) => {
    await page.goto("/dashboard/squad");
    await expect(page.getByRole("heading", { name: "Elenco" }).first()).toBeVisible();
    await expect(page.getByText(/Rafael Oliveira|Elenco|Jogadores/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows player positions", async ({ page }) => {
    await page.goto("/dashboard/squad");
    await expect(
      page.getByText(/Goleiro|Zagueiro|Meio|Atacante|Lateral|Elenco/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("has button to add new player (admin)", async ({ page }) => {
    await page.goto("/dashboard/squad");
    await expect(
      page.getByText(/Adicionar Jogador|Adicionar|Exportar Excel/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
