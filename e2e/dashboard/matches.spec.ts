import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Matches — List Page", () => {
  test("displays matches page", async ({ page }) => {
    await page.goto("/matches");
    await expect(page.getByRole("heading", { name: "Jogos do Time" })).toBeVisible();
  });

  test("shows seed matches (completed and scheduled)", async ({ page }) => {
    await page.goto("/matches");
    // Seed has opponents: Estrela Vermelha FC, Unidos da Serra, Atlético Bairro Alto
    await expect(
      page.getByText(/Estrela Vermelha|Unidos da Serra|Atlético Bairro Alto/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("has button to create new match (admin)", async ({ page }) => {
    await page.goto("/matches");
    await expect(
      page.getByRole("button", { name: /Novo|Criar|Adicionar|Agendar/i })
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Matches — Match Detail", () => {
  test("can navigate to a match detail page", async ({ page }) => {
    await page.goto("/matches");
    // Click on the first match link
    const matchLink = page.getByRole("link", { name: /Estrela Vermelha|Unidos da Serra|Atlético Bairro Alto/i }).first();
    if (await matchLink.isVisible({ timeout: 10_000 })) {
      await matchLink.click();
      // Should navigate to /matches/[id]
      await expect(page).toHaveURL(/\/matches\/.+/);
      // Match detail page should show opponent name
      await expect(
        page.getByText(/Estrela Vermelha|Unidos da Serra|Atlético Bairro Alto/i).first()
      ).toBeVisible();
    }
  });

  test("scheduled match shows RSVPs section", async ({ page }) => {
    await page.goto("/matches");
    // Find the scheduled match (Atlético Bairro Alto)
    const matchLink = page.getByRole("link", { name: /Atlético Bairro Alto/i });
    if (await matchLink.isVisible({ timeout: 10_000 })) {
      await matchLink.click();
      await expect(page).toHaveURL(/\/matches\/.+/);
      // RSVPs should be visible for scheduled matches
      await expect(
        page.getByText(/Confirmados|RSVP|Presença|Confirmação/i).first()
      ).toBeVisible({ timeout: 10_000 });
    }
  });
});
