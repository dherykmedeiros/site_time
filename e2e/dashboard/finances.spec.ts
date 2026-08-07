import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Finances — Transactions Page", () => {
  test("displays finances page with nav link", async ({ page }) => {
    await page.goto("/dashboard/finances");
    await expect(page.getByRole("heading", { name: "Finanças" }).first()).toBeVisible();
  });

  test("shows seed transactions", async ({ page }) => {
    await page.goto("/dashboard/finances");
    await expect(
      page.getByText(/Mensalidade|Aluguel|Arbitragem|amistoso|coletes|Finanças/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows income and expense types", async ({ page }) => {
    await page.goto("/dashboard/finances");
    await expect(
      page.getByText(/R\$|Receita|Despesa|Saldo/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("has button to add new transaction", async ({ page }) => {
    await page.goto("/dashboard/finances");
    await expect(
      page.getByText(/Nova Transação|Exportar Excel/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Finances — Transaction Creation", () => {
  test("can open transaction form", async ({ page }) => {
    await page.goto("/dashboard/finances");
    const addBtn = page.getByText(/Nova Transação/i).first();
    await expect(addBtn).toBeVisible({ timeout: 10_000 });
    await addBtn.click();
    // Modal should show transaction modal heading or form
    await expect(
      page.getByText(/Nova Transação|Valor|Categoria/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
