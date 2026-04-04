/** Validate and sanitize a CSS hex color to prevent injection */
export function safeHex(color: string | null | undefined, fallback: string): string {
  if (!color) return fallback;
  return /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : fallback;
}

/** Standard OG image cache headers — 1 h CDN + 10 min stale-while-revalidate */
export const OG_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
} as const;

/* ── Format (landscape / stories) ────────────────────────── */

export type OgFormat = "landscape" | "stories";

export const OG_DIMENSIONS: Record<OgFormat, { width: number; height: number }> = {
  landscape: { width: 1200, height: 630 },
  stories: { width: 1080, height: 1920 },
};

export function resolveFormat(formatParam: string | null): OgFormat {
  if (formatParam === "stories") return "stories";
  return "landscape";
}

