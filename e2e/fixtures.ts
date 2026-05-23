import { test as base, expect, type Page } from "@playwright/test";
import path from "path";
import fs from "fs";

/* ── Seed Credentials ─────────────────────────────── */
export const ADMIN_EMAIL = "admin@admin.com";
export const ADMIN_PASSWORD = "Admin123456";
export const ADMIN_NAME = "Administrador Geral";

/* ── Auth state file ──────────────────────────────── */
export const AUTH_FILE = path.join(__dirname, ".auth", "admin.json");

/* ── Login helper ─────────────────────────────────── */
export async function login(page: Page, email = ADMIN_EMAIL, password = ADMIN_PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(/\/dashboard(?:\/.*)?$/, { timeout: 15_000 });
}

/* ── Extended test fixture ────────────────────────── */
export const test = base.extend<{ adminPage: Page }>({
  adminPage: async ({ browser }, use) => {
    // Reuse stored auth state if available
    if (fs.existsSync(AUTH_FILE)) {
      const ctx = await browser.newContext({ storageState: AUTH_FILE });
      const page = await ctx.newPage();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      await use(page);
      await ctx.close();
    } else {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await login(page);
      await ctx.storageState({ path: AUTH_FILE });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      await use(page);
      await ctx.close();
    }
  },
});

export { expect };
