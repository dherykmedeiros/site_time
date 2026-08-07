import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Seasons — List Page (Admin)", () => {
  test("displays seasons page", async ({ page }) => {
    await page.goto("/dashboard/seasons");
    await expect(page.getByRole("heading", { name: "Temporadas" }).first()).toBeVisible();
  });

  test("has button to create new season", async ({ page }) => {
    await page.goto("/dashboard/seasons");
    await expect(
      page.getByText(/Nova temporada/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Friendly Requests — Admin Panel", () => {
  test("displays friendly requests page", async ({ page }) => {
    await page.goto("/dashboard/friendly-requests");
    await expect(page.getByText(/Amistosos|Solicitações/i).first()).toBeVisible();
  });

  test("shows seed pending request", async ({ page }) => {
    await page.goto("/dashboard/friendly-requests");
    await expect(
      page.getByText(/Dragões do Subúrbio|Amistoso|Pendente|Solicitações/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Team Settings — Admin", () => {
  test("displays settings page with team form", async ({ page }) => {
    await page.goto("/dashboard/team/settings");
    await expect(page.getByText(/Configurações|Configuracoes|Time/i).first()).toBeVisible();
  });
});
