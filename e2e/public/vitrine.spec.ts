import { test, expect } from "@playwright/test";

test.describe("Vitrine — Public Team Directory", () => {
  test("displays public vitrine page", async ({ page }) => {
    await page.goto("/vitrine");
    // Should show some heading or search UI
    await expect(page.locator("main")).toBeVisible();
  });

  test("shows teams that opted into directory", async ({ page }) => {
    await page.goto("/vitrine");
    // Seed has FC Trovão Azul and Uniao Leste FC with publicDirectoryOptIn: true
    await expect(
      page.getByText(/Trovão Azul|Uniao Leste/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("can navigate to a team public profile", async ({ page }) => {
    await page.goto("/vitrine");
    const teamLink = page.getByRole("link", { name: /Trovão Azul/i });
    if (await teamLink.isVisible({ timeout: 10_000 })) {
      await teamLink.click();
      // Should navigate to /vitrine/fc-trovao-azul
      await expect(page).toHaveURL(/\/vitrine\/fc-trovao-azul/);
      await expect(page.getByText(/Trovão Azul/i).first()).toBeVisible();
    }
  });
});

test.describe("Vitrine — Team Public Profile", () => {
  test("displays team profile with details", async ({ page }) => {
    await page.goto("/vitrine/fc-trovao-azul");
    // Use heading to avoid matching hidden <title> tag
    await expect(page.getByRole("heading", { name: /Trovão Azul/i }).first()).toBeVisible({ timeout: 10_000 });
    // Should show description or venue
    await expect(
      page.getByText(/Parque Municipal|Vila Nova|futebol amador/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows friendly request form on team profile", async ({ page }) => {
    await page.goto("/vitrine/fc-trovao-azul");
    // There should be a form or button to request a friendly
    await expect(
      page.getByText(/Solicitar Amistoso|Agendar|Desafiar|Contato/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows open match slots if available", async ({ page }) => {
    await page.goto("/vitrine/fc-trovao-azul");
    // Seed created open slots for this team
    await expect(
      page.getByText(/Sábado|Domingo|Horários|Disponível/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Vitrine — Public Match Deep Link", () => {
  test("vitrine team page loads without auth", async ({ page }) => {
    // Ensure no cookies
    await page.context().clearCookies();
    await page.goto("/vitrine/fc-trovao-azul");
    // Should NOT redirect to login
    await expect(page).toHaveURL(/\/vitrine\/fc-trovao-azul/);
    // Use heading to avoid matching hidden <title> tag
    await expect(page.getByRole("heading", { name: /Trovão Azul/i }).first()).toBeVisible({ timeout: 10_000 });
  });
});
