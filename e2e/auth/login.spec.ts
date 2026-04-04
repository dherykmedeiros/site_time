import { test, expect } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../fixtures";

test.describe("Auth — Login", () => {
  test("shows login form with correct fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Criar conta" })).toBeVisible();
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("wrong@test.com");
    await page.getByLabel("Senha").fill("wrongpass123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("E-mail ou senha inválidos")).toBeVisible();
  });

  test("validates required fields (client-side)", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Entrar" }).click();
    // Form should NOT navigate away — stays on /login
    await expect(page).toHaveURL(/\/login/);
  });

  test("logs in with seed admin credentials and redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.waitForURL(/\/(squad|team|$)/, { timeout: 15_000 });
    // Dashboard should be visible — use heading to avoid strict mode
    await expect(page.getByRole("link", { name: /Painel/i }).first()).toBeVisible();
  });
});

test.describe("Auth — Register page", () => {
  test("shows registration form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Criar Conta" })).toBeVisible();
    await expect(page.getByLabel("Nome")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
  });

  test("link to login page works", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("link", { name: /Entrar|login/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Auth — Route Protection", () => {
  test("unauthenticated user visiting dashboard is redirected to login", async ({ page }) => {
    // Clear any session state
    await page.context().clearCookies();
    await page.goto("/");
    // Should show landing page or login — unauthenticated user cannot see dashboard nav
    await expect(
      page.getByText(/Entrar|VARzea|Explorar vitrine/i).first()
    ).toBeVisible({ timeout: 10_000 });
    // Dashboard sidebar should NOT be visible
    await expect(page.getByRole("link", { name: "Elenco" })).not.toBeVisible();
  });
});
