import { test as setup } from "@playwright/test";
import { login, AUTH_FILE } from "./fixtures";
import fs from "fs";
import path from "path";

setup("authenticate admin user", async ({ page }) => {
  // Ensure .auth dir exists
  const dir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await login(page);
  await page.context().storageState({ path: AUTH_FILE });
});
