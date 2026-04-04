import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Squad — Player List", () => {
  test("displays squad page with players from seed", async ({ page }) => {
    await page.goto("/squad");
    await expect(page.getByRole("heading", { name: "Elenco" }).first()).toBeVisible();
    // Seed has 5 players
    await expect(page.getByText("Rafael Oliveira")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Lucas Ferreira")).toBeVisible();
  });

  test("shows player positions", async ({ page }) => {
    await page.goto("/squad");
    // The page should display position labels for seeded players
    await expect(
      page.getByText(/Goleiro|Zagueiro|Meio|Atacante|Lateral/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("has button to add new player (admin)", async ({ page }) => {
    await page.goto("/squad");
    await expect(
      page.getByRole("button", { name: /Adicionar|Novo|Criar/i })
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Squad — Player Actions", () => {
  test("can open player creation form", async ({ page }) => {
    await page.goto("/squad");
    const addBtn = page.getByRole("button", { name: /Adicionar|Novo|Criar/i });
    await expect(addBtn).toBeVisible({ timeout: 10_000 });
    await addBtn.click();
    // Should show form fields
    await expect(page.getByLabel(/Nome/i)).toBeVisible({ timeout: 5_000 });
  });
});
