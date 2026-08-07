import { test, expect } from "@playwright/test";

test.describe("Vitrine — Public Directory / Vagas", () => {
  test("displays public vitrine/vagas page", async ({ page }) => {
    await page.goto("/vagas");
    await expect(page.locator("main")).toBeVisible();
  });

  test("can navigate to landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
  });
});
