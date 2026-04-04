# Research: Recap & Sharing System Overhaul

**Feature**: 005-recap-overhaul | **Date**: 2026-04-04

## Research Task 1: Web Share API — File Sharing Support

**Question**: How to share PNG files via Web Share API with fallback?

**Decision**: Use `navigator.share({ files: [File] })` with `navigator.canShare()` feature detection.

**Rationale**:
- Web Share Level 2 (`files` parameter) is supported on Chrome Android 76+, Safari iOS 15.4+, and Edge 93+.
- Desktop support is limited (Chrome 89+ on Windows/ChromeOS, no Firefox).
- `navigator.canShare({ files: [new File([], 'test.png', { type: 'image/png' })] })` is the correct feature detection (not just checking `navigator.share` exists).
- Fallback chain: (1) try share with files, (2) if `canShare` returns false for files, fall back to share with URL only, (3) if `navigator.share` doesn't exist, fall back to clipboard copy.

**Alternatives Considered**:
- **Share via URL only**: Simpler but loses the key UX of sharing the image directly to Instagram Stories / WhatsApp Status.
- **Canvas-based download only**: No native share sheet integration.

**Implementation Pattern**:
```typescript
async function shareRecapImage(blob: Blob, fileName: string, vitrineUrl: string) {
  const file = new File([blob], fileName, { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: 'Recap',
      url: vitrineUrl,
    });
  } else if (navigator.share) {
    await navigator.share({
      title: 'Recap',
      url: vitrineUrl,
    });
  } else {
    await navigator.clipboard.writeText(vitrineUrl);
    // show toast
  }
}
```

---

## Research Task 2: PNG Download from OG Image Route

**Question**: How to download a PNG image from an API route in the browser?

**Decision**: Fetch the OG image URL as a blob, create an object URL, and trigger download via a hidden `<a>` element.

**Rationale**:
- OG routes return `ImageResponse` with `content-type: image/png` — standard fetch + blob pattern works.
- Using `URL.createObjectURL` is more reliable than `window.open` for triggering an actual download.
- Must revoke the object URL after download to avoid memory leaks.

**Implementation Pattern**:
```typescript
async function downloadRecapPng(ogUrl: string, fileName: string) {
  const response = await fetch(ogUrl);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

---

## Research Task 3: Satori Custom Font Loading

**Question**: How to load custom fonts (Inter) in `next/og` ImageResponse?

**Decision**: Load Inter Bold `.ttf` from `public/fonts/` via `fetch()` at the module level, pass as `fonts` option to `ImageResponse`.

**Rationale**:
- Satori requires raw font data as `ArrayBuffer` passed in the `fonts` array of `ImageResponse` options.
- Font must be `.ttf` or `.woff` (NOT `.woff2` — Satori doesn't support it).
- Loading at module level with a cached promise avoids re-fetching on every request.
- Inter is a free font (SIL Open Font License) — no licensing issues.
- On Vercel, `fetch` from `public/` uses the same origin, so no CORS issues.

**Implementation Pattern**:
```typescript
// In route-utils.ts
const interBoldPromise = fetch(
  new URL('/fonts/Inter-Bold.ttf', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
).then(res => res.arrayBuffer());

export async function getOgFonts() {
  const interBold = await interBoldPromise;
  return [
    { name: 'Inter', data: interBold, weight: 700 as const, style: 'normal' as const },
  ];
}
```

**Alternatives Considered**:
- **`fs.readFileSync` from filesystem**: Works locally but NOT on Vercel Serverless (no guaranteed filesystem access to `public/`). Using `fetch` is the Vercel-recommended approach.
- **Google Fonts CDN fetch**: Adds external dependency and latency. Bundled font is more reliable.

---

## Research Task 4: Stories Format (1080×1920) in Satori

**Question**: How to render different dimensions from the same OG route?

**Decision**: Pass `width` and `height` to `ImageResponse` options dynamically based on `?format=` query param. The JSX layout adapts using conditional styles.

**Rationale**:
- `ImageResponse` constructor accepts `{ width, height }` — changing dimensions is trivial.
- The JSX layout must be designed responsively: landscape (1200×630) uses horizontal layout; stories (1080×1920) uses vertical stacked layout.
- Same data, different visual arrangement — best handled with a dimension config object.

**Dimensions Config**:
```typescript
export const OG_DIMENSIONS = {
  landscape: { width: 1200, height: 630 },
  stories: { width: 1080, height: 1920 },
} as const;

export type OgFormat = keyof typeof OG_DIMENSIONS;
```

---

## Research Task 5: Theme System for OG Images

**Question**: How to implement visual themes (classic/dark/vibrant) in Satori-rendered images?

**Decision**: Define a `ThemeConfig` type with background, text, accent, and pattern properties. Resolve theme config from query param + team colors. Pass config to OG card components as props.

**Rationale**:
- Satori supports inline CSS styles only — no CSS variables or Tailwind classes.
- Theme must be a plain object of color values passed as props.
- "vibrant" theme depends on team `primaryColor`/`secondaryColor` — needs null fallback to "classic".
- Patterns are CSS gradients (Satori supports `linear-gradient`, `radial-gradient`).

**Theme Configs**:
```typescript
interface ThemeConfig {
  name: 'classic' | 'dark' | 'vibrant';
  bg: string;           // primary background color/gradient
  text: string;          // primary text color
  textMuted: string;     // secondary text color
  cardBg: string;        // card overlay background
  accent: string;        // accent color for highlights
  pattern: string;       // CSS background pattern (gradient)
}
```

**Alternatives Considered**:
- **CSS-in-JS with theme provider**: Satori doesn't support runtime CSS — must be inline styles.
- **Separate JSX components per theme**: Too much duplication. Single component with theme config prop is simpler.

---

## Research Task 6: Cache-Control on Vercel for OG Routes

**Question**: What Cache-Control headers are needed for effective CDN caching on Vercel?

**Decision**: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600`

**Rationale**:
- `s-maxage=3600`: CDN caches for 1 hour. Client-side `max-age` is NOT set (browser always revalidates with CDN).
- `stale-while-revalidate=600`: Within 10 minutes after 1h expiry, CDN serves stale while revalidating in background — prevents cache stampede.
- `public`: Allows CDN and shared caches to store the response. Recap images are public by design.
- Vercel CDN respects `s-maxage` from Route Handlers automatically.
- `x-vercel-cache: HIT` header confirms CDN cache hit in production.

**Implementation**:
```typescript
// In route-utils.ts
export const OG_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
} as const;
```

Applied to `ImageResponse`:
```typescript
return new ImageResponse(<Component />, {
  width, height,
  headers: OG_CACHE_HEADERS,
});
```

---

## Research Task 7: Season Recap Aggregation Query

**Question**: How to aggregate season stats (W/D/L, goals, top scorers) from existing Prisma models?

**Decision**: Two queries — (1) aggregate matches in the season for W/D/L/goals, (2) group MatchStats by playerId for top scorers/assistants. Both use existing Season→Match→MatchStats relations.

**Rationale**:
- No need for a dedicated Season stats model — computed on-the-fly is fast enough for <30 matches per season.
- Prisma `groupBy` gives top scorers efficiently.
- The `isHome` field determines which score is "ours" vs "theirs".

**Query Pattern**:
```typescript
// 1. Get all completed matches in season
const matches = await prisma.match.findMany({
  where: { seasonId, status: 'COMPLETED', homeScore: { not: null }, awayScore: { not: null } },
  select: { id, isHome, homeScore, awayScore },
});

// 2. Compute W/D/L from match results
// 3. Get top scorers via MatchStats grouped by playerId
const topScorers = await prisma.matchStats.groupBy({
  by: ['playerId'],
  where: { match: { seasonId, status: 'COMPLETED' } },
  _sum: { goals: true, assists: true, yellowCards: true, redCards: true },
  orderBy: { _sum: { goals: 'desc' } },
  take: 3,
});
```

---

## Research Task 8: Weekly/Monthly Rolling Window Queries

**Question**: How to query matches within rolling 7-day and 30-day windows?

**Decision**: Compute the cutoff date at request time (`new Date(Date.now() - days * 86400000)`), filter matches by `date >= cutoff` and `status = COMPLETED`.

**Rationale**:
- Rolling window (not calendar week/month) is specified in the spec.
- Simple date arithmetic — no timezone-aware calendar logic needed.
- Same aggregation pattern as season recap, just with a date filter instead of seasonId.

**Implementation**:
```typescript
function getRollingCutoff(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

// Weekly: getRollingCutoff(7)
// Monthly: getRollingCutoff(30)
```

---

## Research Task 9: Client-Side Recap Preview

**Question**: How to render a live preview of the recap card client-side without Satori?

**Decision**: HTML/CSS thumbnail rendered in React, styled to approximate the OG card layout. Uses the same JSON data from the recap API. Scaled down via CSS `transform: scale()`.

**Rationale**:
- Satori runs server-side only (`next/og` is Node.js runtime). Cannot run in browser.
- A CSS-based approximation is sufficient for preview — users will see the exact image after download.
- Scale factor: render at full size in a hidden container, display at ~50% scale via CSS transform.
- Theme switching just swaps the color config in the React state — no API call needed.

**Alternatives Considered**:
- **Fetch OG image URL for preview**: Too slow (server render on every theme/format toggle). Would negate the "live preview" UX.
- **Ship Satori to the browser**: Large bundle size (~2MB+), complex setup. Not worth it for a thumbnail.

---

## Research Task 10: Vitrine URL Construction for Sharing

**Question**: How to construct the correct vitrine URL for sharing?

**Decision**: Each team has a `slug` field. The vitrine URL is `{origin}/vitrine/{team.slug}`. The `RecapShareActions` component receives the team slug as a prop.

**Rationale**:
- Current code incorrectly shares the `/api/og/...` URL. The fix is to construct the vitrine URL from the team slug.
- The vitrine page already has OG meta tags that point to the correct OG image routes — social platforms will fetch the image from there.
- No need to include recap-specific params in the vitrine URL; the vitrine page's OG tags handle that.

**Current Bug**: `recapUrl` in `RecapShareActions` points to `/api/og/{recapRouteSegment}/{entityId}` — should point to `/vitrine/{slug}`.
