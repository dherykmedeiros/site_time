// ============================================================
// Recap System — OG Image Route Parameters & Theme Config
// specs/005-recap-overhaul/contracts/og-params.ts
// ============================================================

// ─── OG Image Format / Dimensions ─────────────────────────

export type OgFormat = "landscape" | "stories";

export interface OgDimensions {
  width: number;
  height: number;
}

export const OG_DIMENSIONS: Record<OgFormat, OgDimensions> = {
  landscape: { width: 1200, height: 630 },
  stories: { width: 1080, height: 1920 },
} as const;

// ─── Visual Themes ────────────────────────────────────────

export type OgTheme = "classic" | "dark" | "vibrant";

export interface ThemeConfig {
  name: OgTheme;
  bg: string; // primary background (CSS gradient or color)
  text: string; // primary text color
  textMuted: string; // secondary/muted text color
  cardBg: string; // card/overlay background
  accent: string; // accent color for highlights
  border: string; // card border color
  pattern: string; // CSS background pattern for overlay
}

/**
 * Resolve theme based on query param and team colors.
 * If "vibrant" is requested but team has no primaryColor, falls back to "classic".
 */
export interface ThemeResolverInput {
  theme: OgTheme;
  primaryColor: string | null;
  secondaryColor: string | null;
}

// ─── Resolved OG Route Params ─────────────────────────────

/**
 * Common params extracted and validated from OG image route query strings.
 */
export interface OgRouteParams {
  format: OgFormat;
  theme: OgTheme;
  dimensions: OgDimensions;
}

/**
 * Extended params for player recap OG route.
 */
export interface PlayerRecapOgParams extends OgRouteParams {
  matchId?: string; // optional match scope
}

// ─── Cache Headers ────────────────────────────────────────

export const OG_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
} as const;

// ─── Zod Schema Shapes (reference for lib/validations/recap.ts) ─

/**
 * Query param validation shapes:
 *
 * format: z.enum(["landscape", "stories"]).default("landscape")
 * theme:  z.enum(["classic", "dark", "vibrant"]).default("classic")
 * matchId: z.string().min(1).optional()
 */
