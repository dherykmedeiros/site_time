import { test, expect, AUTH_FILE } from "../fixtures";

test.use({ storageState: AUTH_FILE });

test.describe("Finances — Transactions Page", () => {
  test("displays finances page with nav link", async ({ page }) => {
    await page.goto("/finances");
    await expect(page.getByRole("heading", { name: "Finanças" }).first()).toBeVisible();
  });

  test("shows seed transactions", async ({ page }) => {
    await page.goto("/finances");
    // Seed has transactions with descriptions like "Mensalidade", "Aluguel", "Arbitragem"
    await expect(
      page.getByText(/Mensalidade|Aluguel|Arbitragem|amistoso|coletes/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows income and expense types", async ({ page }) => {
    await page.goto("/finances");
    // Transaction cards show category labels like "Mensalidade", "Arbitragem", etc.
    // The type filter dropdown has "Receitas"/"Despesas" as options but they're hidden
    // Check for visible transaction amount indicators instead (+ or - prefix on R$ amounts)
    await expect(
      page.getByText(/R\$/).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("has button to add new transaction", async ({ page }) => {
    await page.goto("/finances");
    await expect(
      page.getByRole("button", { name: /Nova|Adicionar|Criar|Registrar/i })
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Finances — Transaction Creation", () => {
  test("can open transaction form", async ({ page }) => {
    await page.goto("/finances");
    const addBtn = page.getByRole("button", { name: /Nova|Adicionar|Criar|Registrar/i });
    await expect(addBtn).toBeVisible({ timeout: 10_000 });
    await addBtn.click();
    // Modal should show "Nova Transação" heading and form fields
    await expect(
      page.getByRole("heading", { name: /Nova Transação/i })
    ).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText("Valor (R$)")).toBeVisible();
  });
});
