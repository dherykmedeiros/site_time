import puppeteer, { type Browser } from "puppeteer-core";

let browser: Browser | null = null;

export async function getOgBrowser(): Promise<Browser> {
  if (browser?.connected) return browser;

  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });
  } else {
    const fs = await import("fs");
    const candidates = [
      process.env.CHROME_PATH,
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ].filter(Boolean) as string[];

    const execPath = candidates.find((p) => fs.existsSync(p));
    if (!execPath) {
      throw new Error(
        "Chrome not found for local OG rendering. Set CHROME_PATH in .env"
      );
    }

    browser = await puppeteer.launch({
      headless: "shell",
      executablePath: execPath,
    });
  }

  return browser;
}
