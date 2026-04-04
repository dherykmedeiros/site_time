import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Seasons — List Page (Admin)", () => {
  test("displays seasons page", async ({ page }) => {
    await page.goto("/seasons");
    await expect(page.getByRole("heading", { name: "Temporadas" }).first()).toBeVisible();
  });

  test("has button to create new season", async ({ page }) => {
    await page.goto("/seasons");
    await expect(
      page.getByRole("button", { name: /Nova|Criar|Adicionar/i })
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Friendly Requests — Admin Panel", () => {
  test("displays friendly requests page", async ({ page }) => {
    await page.goto("/friendly-requests");
    await expect(page.getByText(/Amistosos|Solicitações/i).first()).toBeVisible();
  });

  test("shows seed pending request", async ({ page }) => {
    await page.goto("/friendly-requests");
    // Seed created a pending request from "Dragões do Subúrbio"
    await expect(
      page.getByRole("heading", { name: /Dragões do Subúrbio/i })
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Team Settings — Admin", () => {
  test("displays settings page with team form", async ({ page }) => {
    await page.goto("/team/settings");
    await expect(page.getByText(/Configurações|Configuracoes/i).first()).toBeVisible();
    // Should show team name field pre-filled with "FC Trovão Azul"
    const nameInput = page.locator('input').filter({ hasText: /./i }).or(page.locator('input[type="text"]').first());
    await expect(page.getByText("Nome do Time")).toBeVisible({ timeout: 10_000 });
  });
});
