import { getOgBrowser } from "./browser";

interface RenderOptions {
  width: number;
  height: number;
}

export async function renderHtmlToImage(
  html: string,
  opts: RenderOptions
): Promise<Blob> {
  const browser = await getOgBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewport({
      width: opts.width,
      height: opts.height,
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "networkidle0" });
    // Ensure web fonts have loaded before screenshotting
    await page.evaluateHandle("document.fonts.ready");

    const screenshot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: opts.width, height: opts.height },
    });
    // Copy into a fresh Uint8Array<ArrayBuffer> so TS accepts it as BlobPart/BodyInit
    const bytes = new Uint8Array(screenshot.byteLength);
    bytes.set(screenshot);
    return new Blob([bytes], { type: "image/png" });
  } finally {
    await page.close();
  }
}
