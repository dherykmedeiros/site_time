# Tasks: Recap & Sharing System Overhaul

**Input**: Design documents from `/specs/005-recap-overhaul/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/ ✅, research.md ✅, quickstart.md ✅

**Tests**: Not included — not explicitly requested. Add test phases if TDD approach is desired.

**Organization**: Tasks grouped by user story (10 stories across 3 priority blocks). Each story is independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on in-progress tasks)
- **[Story]**: Which user story this task belongs to (US1–US10)
- Exact file paths included in every task description

## Path Conventions

- **Lib**: `lib/` at repository root
- **API routes**: `app/api/` (Next.js App Router)
- **OG image routes**: `app/api/og/`
- **Components**: `components/dashboard/`
- **Validations**: `lib/validations/`
- **Contracts** (reference only): `specs/005-recap-overhaul/contracts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared types, constants, and validation schemas used across all blocks

- [X] T001 Create shared recap types, OG dimension constants (`OG_DIMENSIONS`), cache header constant (`OG_CACHE_HEADERS`), and `ThemeConfig` type stub in `lib/recap-shared.ts` — reference `specs/005-recap-overhaul/contracts/og-params.ts` and `contracts/recap-types.ts` for interfaces
- [X] T002 [P] Create Zod validation schemas (`formatSchema`, `themeSchema`, `matchIdSchema`, `recapQuerySchema`) in `lib/validations/recap.ts` — `format: z.enum(["landscape","stories"]).default("landscape")`, `theme: z.enum(["classic","dark","vibrant"]).default("classic")`, `matchId: z.string().min(1).optional()`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend existing OG route helpers so all story phases can use them

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Add `setCacheHeaders()` helper, `resolveOgParams()` function (parses `format`/`theme` query params using Zod schemas from T002, returns `{ format, theme, dimensions }`), and `getOgFonts()` stub to `app/api/og/route-utils.ts` — import from `lib/recap-shared.ts` and `lib/validations/recap.ts`

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 3 — Correct OG Route Caching (Priority: P1) 🎯 MVP

**Goal**: All existing OG image routes return `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600` for CDN edge caching

**Independent Test**: `curl -I http://localhost:3000/api/og/player-recap/{playerId}` → response includes `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600`

- [X] T004 [P] [US3] Add Cache-Control headers via `setCacheHeaders()` to player recap OG route in `app/api/og/player-recap/[playerId]/route.tsx`
- [X] T005 [P] [US3] Add Cache-Control headers via `setCacheHeaders()` to team recap OG route in `app/api/og/team-recap/[matchId]/route.tsx`
- [X] T006 [P] [US3] Add Cache-Control headers via `setCacheHeaders()` to match OG route in `app/api/og/match/[id]/route.tsx`

**Checkpoint**: All existing OG routes serve cached responses — CDN performance gain shipped

---

## Phase 4: User Story 2 — Enriched Player Recap with Cards and Attendance (Priority: P1)

**Goal**: Player and team recaps surface yellow/red cards and attendance data already in the database

**Independent Test**: View player recap widget for a player with cards and attendance records — verify "Cartões Amarelos", "Cartão Vermelho", "Presença %" display correctly

- [X] T007 [P] [US2] Add `yellowCards` and `redCards` aggregation (sum from `MatchStats`) to career recap builder in `lib/player-recap.ts` — match `PlayerCareerRecap.career` interface from contracts
- [X] T008 [P] [US2] Add attendance stats (`totalMatches`, `present`, `rate`) from `MatchAttendance` to career recap builder in `lib/player-recap.ts` — match `PlayerCareerRecap.attendance` interface, return `rate: null` when no records exist
- [X] T009 [P] [US2] Add `yellowCards` and `redCards` totals to team match recap builder in `lib/team-recap.ts` — match `TeamMatchRecap.totals` interface from contracts
- [X] T010 [US2] Update player recap OG image JSX to render cards and attendance stats in `app/api/og/player-recap/[playerId]/route.tsx` (depends on T007, T008)
- [X] T011 [P] [US2] Update team recap OG image JSX to render card totals in `app/api/og/team-recap/[matchId]/route.tsx` (depends on T009)
- [X] T012 [P] [US2] Update `PlayerRecapWidget` to display yellow/red cards and attendance rate in `components/dashboard/PlayerRecapWidget.tsx` (depends on T007, T008)

**Checkpoint**: Player and team recaps show complete stats — cards + attendance visible

---

## Phase 5: User Story 1 — Download & Share Recap via Native Share (Priority: P1) 🎯 MVP

**Goal**: Users can download recap PNG and share via native OS share sheet with vitrine URL

**Independent Test**: Open any match recap widget → tap "Baixar PNG" (verify file in Downloads) → tap "Compartilhar" (verify native share sheet with image file + vitrine URL)

- [X] T013 [US1] Add `downloadRecapPng()` function and "Baixar PNG" button to `components/dashboard/RecapShareActions.tsx` — fetch OG URL as blob, trigger download via hidden `<a>` element, filename `recap-{entityType}-{entityId}.png`, revoke object URL after download
- [X] T014 [US1] Add Web Share API integration with `navigator.canShare({ files })` feature detection and fallback chain (files → URL-only share → clipboard copy with toast) to `components/dashboard/RecapShareActions.tsx` (depends on T013)
- [X] T015 [US1] Fix all share/copy URLs in `components/dashboard/RecapShareActions.tsx` to use public vitrine page (`/vitrine/{slug}`) instead of raw `/api/og/...` image URLs — applies to download, Web Share, WhatsApp deep link, and clipboard copy actions

**Checkpoint**: Block 1 (P1) complete — caching, enriched stats, download/share all shipped

---

## Phase 6: User Story 4 — Player Recap Scoped to Specific Match (Priority: P2)

**Goal**: After a match, a player can view/share a recap showing only that match's stats

**Independent Test**: Navigate to completed match → view per-match player recap → verify stats match only that match's `MatchStats` row

- [X] T016 [US4] Add optional `matchId` scope filter to player recap builder in `lib/player-recap.ts` — when `matchId` provided, query single `MatchStats` row + `MatchAttendance` for that match, return `PlayerMatchRecap` shape from contracts (depends on T007, T008)
- [X] T017 [US4] Add `?matchId` query param support (validated via Zod) to player recap JSON API in `app/api/recap/player/[playerId]/route.ts` — return match-scoped or career-scoped data based on presence of param (depends on T016)
- [X] T018 [US4] Add `?matchId` support to player recap OG route in `app/api/og/player-recap/[playerId]/route.tsx` — render match-specific layout (opponent, date, single-match stats) when matchId present (depends on T016)

**Checkpoint**: Per-match player recaps functional and shareable

---

## Phase 7: User Story 5 — Season Recap (Priority: P2)

**Goal**: Team admins can view/share a season summary with W/D/L record, top scorers, discipline stats

**Independent Test**: Select a season with ≥1 completed match → generate season recap → verify aggregated stats correct

- [X] T019 [US5] Create season recap builder in `lib/season-recap.ts` — query `Match` by `seasonId` + `status=COMPLETED`, compute W/D/L from `isHome`+scores, aggregate goals scored/conceded, `groupBy(playerId)` for top 3 scorers/assistants, sum cards — match `SeasonRecap` / `SeasonRecapEmpty` interfaces from contracts
- [X] T020 [P] [US5] Create season recap JSON API route in `app/api/recap/season/[seasonId]/route.ts` — validate seasonId, call builder, return JSON with Cache-Control headers (depends on T019)
- [X] T021 [US5] Create season recap OG image route in `app/api/og/season-recap/[seasonId]/route.tsx` — render season record, top scorers, discipline, team branding; include Cache-Control headers (depends on T019, T003)

**Checkpoint**: Season recaps available as JSON + shareable OG image

---

## Phase 8: User Story 6 — Weekly/Monthly Team Recap (Priority: P2)

**Goal**: Team admins can share rolling 7-day or 30-day team performance summaries

**Independent Test**: Select "Recap Semanal" with ≥1 match in last 7 days → verify aggregated stats cover exactly those matches

- [X] T022 [US6] Add `buildPeriodRecap(teamId, days)` function to `lib/period-recap.ts` — rolling date window via `new Date(Date.now() - days * 86400000)`, filter matches by `date >= cutoff` + `status=COMPLETED`, aggregate W/D/L/goals, find top scorer — match `PeriodRecap` / `PeriodRecapEmpty` interfaces from contracts
- [X] T023 [P] [US6] Create weekly recap JSON API route in `app/api/recap/weekly/[teamId]/route.ts` — validate teamId, call `buildPeriodRecap(teamId, 7)`, return JSON with Cache-Control (depends on T022)
- [X] T024 [P] [US6] Create monthly recap JSON API route in `app/api/recap/monthly/[teamId]/route.ts` — validate teamId, call `buildPeriodRecap(teamId, 30)`, return JSON with Cache-Control (depends on T022)
- [X] T025 [P] [US6] Create weekly recap OG image route in `app/api/og/weekly-recap/[teamId]/route.tsx` — render period record, top scorer, team branding, include Cache-Control (depends on T022, T003)
- [X] T026 [P] [US6] Create monthly recap OG image route in `app/api/og/monthly-recap/[teamId]/route.tsx` — same layout as weekly with "Último Mês" label, include Cache-Control (depends on T022, T003)

**Checkpoint**: Period recaps (weekly + monthly) available as JSON + OG images

---

## Phase 9: User Story 7 — Stories Format 1080×1920 (Priority: P2)

**Goal**: All OG recap routes accept `?format=stories` and return vertical 1080×1920 images optimized for Instagram Stories / WhatsApp Status

**Independent Test**: Append `?format=stories` to any OG recap URL → verify returned PNG is 1080×1920 pixels

- [X] T027 [US7] Update `resolveOgParams()` in `app/api/og/route-utils.ts` to fully resolve format → dimensions using `OG_DIMENSIONS` from `lib/recap-shared.ts`, and export a `isStories(format)` layout helper for conditional vertical/horizontal rendering
- [X] T028 [P] [US7] Adapt player-recap and team-recap OG routes for format-aware rendering — use `resolveOgParams()` dimensions in `ImageResponse`, add conditional vertical layout when `format=stories` in `app/api/og/player-recap/[playerId]/route.tsx` and `app/api/og/team-recap/[matchId]/route.tsx` (depends on T027)
- [X] T029 [P] [US7] Adapt match and season-recap OG routes for format-aware rendering — conditional vertical layout in `app/api/og/match/[id]/route.tsx` and `app/api/og/season-recap/[seasonId]/route.tsx` (depends on T027)
- [X] T030 [P] [US7] Adapt weekly and monthly recap OG routes for format-aware rendering — conditional vertical layout in `app/api/og/weekly-recap/[teamId]/route.tsx` and `app/api/og/monthly-recap/[teamId]/route.tsx` (depends on T027)

**Checkpoint**: Block 2 (P2) complete — per-match, season, weekly/monthly recaps + Stories format all shipped

---

## Phase 10: User Story 8 — Visual Themes (Priority: P3)

**Goal**: OG routes accept `?theme=classic|dark|vibrant` and render with matching color scheme

**Independent Test**: Append `?theme=dark` to any OG URL → verify dark background + light text; `?theme=vibrant` → team `primaryColor` as dominant background

- [X] T031 [US8] Implement `resolveTheme()` function and `THEME_CONFIGS` (classic/dark/vibrant presets) in `lib/recap-shared.ts` — `vibrant` uses team `primaryColor`/`secondaryColor`, falls back to `classic` when colors are null; match `ThemeConfig` interface from contracts
- [X] T032 [US8] Integrate theme resolution into `resolveOgParams()` in `app/api/og/route-utils.ts` — accept team colors, return fully resolved `ThemeConfig` alongside format/dimensions (depends on T031)
- [X] T033 [P] [US8] Apply theme-aware rendering (bg, text, accent, cardBg colors from `ThemeConfig`) to player-recap, team-recap, and match OG routes in `app/api/og/player-recap/[playerId]/route.tsx`, `app/api/og/team-recap/[matchId]/route.tsx`, `app/api/og/match/[id]/route.tsx` (depends on T032)
- [X] T034 [P] [US8] Apply theme-aware rendering to season, weekly, and monthly OG routes in `app/api/og/season-recap/[seasonId]/route.tsx`, `app/api/og/weekly-recap/[teamId]/route.tsx`, `app/api/og/monthly-recap/[teamId]/route.tsx` (depends on T032)

**Checkpoint**: All OG routes support 3 visual themes

---

## Phase 11: User Story 9 — Custom Fonts and Background Patterns (Priority: P3)

**Goal**: Recap cards use Inter font and theme-specific background patterns/gradients

**Independent Test**: Visually inspect any OG image — confirm font is not Arial and a subtle pattern/gradient is visible in the background

- [X] T035 [US9] Add `Inter-Bold.ttf` font file to `public/fonts/Inter-Bold.ttf` (download from Google Fonts, SIL Open Font License)
- [X] T036 [US9] Implement `getOgFonts()` font loader in `app/api/og/route-utils.ts` — fetch `Inter-Bold.ttf` from `/fonts/` as ArrayBuffer, cache the promise at module level, return `fonts` array for `ImageResponse` options (depends on T035)
- [X] T037 [US9] Add `getBackgroundPattern(theme, primaryColor, secondaryColor)` function to `lib/recap-shared.ts` — classic: white→team tint gradient at 5-10% opacity; dark: diagonal stripes with `secondaryColor` at reduced opacity; vibrant: radial gradient from `primaryColor` (depends on T031)
- [X] T038 [US9] Apply custom font (via `getOgFonts()`) and background patterns (via `getBackgroundPattern()`) to all OG image routes — pass `fonts` in `ImageResponse` options, add pattern as background CSS in root container of each route (depends on T036, T037)

**Checkpoint**: All recap cards have professional typography and themed backgrounds

---

## Phase 12: User Story 10 — Live Preview Before Sharing (Priority: P3)

**Goal**: Users see a thumbnail preview of the recap card and can toggle format/theme before downloading or sharing

**Independent Test**: Open share panel → verify thumbnail preview appears → toggle "Formato Stories" and "Tema Escuro" → confirm preview updates → tap download → verify URL includes selected `?format=` and `?theme=` params

- [X] T039 [US10] Create `RecapPreview` component in `components/dashboard/RecapPreview.tsx` — renders a reduced-size thumbnail from recap JSON data using CSS/HTML (not Satori), accepts `format` and `theme` props, uses `ThemeConfig` from `lib/recap-shared.ts` for color rendering
- [X] T040 [US10] Add format dropdown (Paisagem/Stories) and theme dropdown (Clássico/Escuro/Vibrante) selectors to `components/dashboard/RecapShareActions.tsx` — manage state with `useState`, pass selected values to `RecapPreview` (depends on T039)
- [X] T041 [US10] Wire download and share actions in `RecapShareActions.tsx` to append user-selected `?format=` and `?theme=` params to the OG image URL when fetching PNG for download or Web Share (depends on T040, T014)

**Checkpoint**: Block 3 (P3) complete — themes, fonts, patterns, and live preview all shipped

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, validation, and final verification

- [X] T042 [P] Handle edge cases across all OG routes and builders: team with no `badgeUrl`/colors (placeholder badge, neutral palette, force `classic` theme), player/team names >25 chars (truncate with ellipsis), player with no `MatchStats` row for a match (show zeros), season with only non-COMPLETED matches (show empty message), invalid `format`/`theme` params (silent fallback to defaults)
- [X] T043 [P] Verify all `RecapShareActions` telemetry tracking is preserved and extended for new actions (download, native share, format/theme selections) in `components/dashboard/RecapShareActions.tsx`
- [X] T044 Run `quickstart.md` validation scenarios — test all API routes per the reference table, verify OG images render for all format/theme combinations, verify download/share flow on mobile

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ────────► Phase 2 (Foundational) ────┬──► Phase 3 (US3 - Cache) ──────────┐
                                                       ├──► Phase 4 (US2 - Stats) ──────────┤
                                                       └──► Phase 5 (US1 - Share) ──────────┤
                                                                                             │
                    Phase 4 (US2) ────► Phase 6 (US4 - Match Recap)                          │
                    Phase 2 ──────────► Phase 7 (US5 - Season Recap)                         ├─► Phase 13
                    Phase 4 (US2) ────► Phase 8 (US6 - Period Recaps)                        │   (Polish)
                    Phases 6,7,8 ─────► Phase 9 (US7 - Stories Format) ─────┐                │
                                                                             ├─► Phase 11 ───┤
                    Phase 2 ──────────► Phase 10 (US8 - Themes) ────────────┤   (US9 Font)   │
                                                                             │                │
                    Phases 9,10 ──────► Phase 12 (US10 - Preview) ──────────┘────────────────┘
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|-----------|-----------------|
| **US3** (Cache) | Foundational (T003) | Phase 2 |
| **US2** (Enriched Stats) | Foundational (T003) | Phase 2 |
| **US1** (Download/Share) | Foundational (T003) | Phase 2 |
| **US4** (Match Player Recap) | US2 (T007, T008) | Phase 4 |
| **US5** (Season Recap) | Foundational (T003) | Phase 2 |
| **US6** (Period Recaps) | US2 (T009 for card totals) | Phase 4 |
| **US7** (Stories Format) | US5, US6 (routes must exist) | Phases 7, 8 |
| **US8** (Themes) | Foundational (T003) | Phase 2 |
| **US9** (Fonts/Patterns) | US8 (T031 for theme configs) | Phase 10 |
| **US10** (Live Preview) | US7 (format), US8 (theme), US1 (share actions) | Phases 5, 9, 10 |

### Within Each User Story

1. Builder/lib changes first (data layer)
2. JSON API routes second (data exposure)
3. OG image routes third (rendering)
4. UI components last (frontend)

### Parallel Opportunities per Phase

| Phase | Parallel Tasks | Sequential Tasks |
|-------|---------------|-----------------|
| Phase 1 | T001, T002 | — |
| Phase 3 | T004, T005, T006 | — |
| Phase 4 | T007, T008, T009 (different files/sections) | T010 after T007+T008; T011 after T009 |
| Phase 5 | — | T013 → T014 → T015 (same file) |
| Phase 7 | T020, T021 (after T019) | T019 → T020/T021 |
| Phase 8 | T023, T024, T025, T026 (after T022) | T022 first |
| Phase 9 | T028, T029, T030 (after T027) | T027 first |
| Phase 10 | T033, T034 (after T032) | T031 → T032 |

---

## Parallel Example: Block 1 (P1) Stories

```
# After Foundational phase, launch all P1 stories in parallel:

Stream A (US3 - Cache):
  T004 ─┐
  T005 ─┼─ all parallel (different files)
  T006 ─┘

Stream B (US2 - Stats):
  T007 ─┬─ parallel (different concerns in player-recap.ts / team-recap.ts)
  T008 ─┤
  T009 ─┘
  then: T010, T011, T012 (parallel where marked)

Stream C (US1 - Share):
  T013 → T014 → T015 (sequential, same file)
```

---

## Implementation Strategy

### MVP First (Block 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003)
3. Complete Phase 3: US3 — Cache (T004–T006)
4. Complete Phase 4: US2 — Enriched Stats (T007–T012)
5. Complete Phase 5: US1 — Download/Share (T013–T015)
6. **STOP AND VALIDATE**: Test all P1 stories independently
7. Deploy — immediate value: caching, richer data, share UX

### Incremental Delivery

1. **Block 1 (P1)** → Cache + Stats + Share → Deploy/Demo (MVP!)
2. **Block 2 (P2)** → Match recap + Season + Weekly/Monthly + Stories → Deploy/Demo
3. **Block 3 (P3)** → Themes + Fonts + Preview → Deploy/Demo
4. Each block adds value without breaking previous blocks

### Key Files Modified Across Multiple Stories

| File | Stories | Notes |
|------|---------|-------|
| `lib/player-recap.ts` | US2, US4 | Enriched stats → match scope |
| `lib/team-recap.ts` | US2, US6 | Card totals → period aggregation |
| `app/api/og/route-utils.ts` | US3, US7, US8, US9 | Cache → format → theme → font |
| `app/api/og/player-recap/[playerId]/route.tsx` | US2, US3, US4, US7, US8, US9 | Most-modified OG route |
| `components/dashboard/RecapShareActions.tsx` | US1, US10 | Download/share → preview/selectors |
| `lib/recap-shared.ts` | Setup, US8, US9 | Types → themes → patterns |

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 44 |
| **Phase 1 (Setup)** | 2 |
| **Phase 2 (Foundational)** | 1 |
| **US3 (P1 — Cache)** | 3 |
| **US2 (P1 — Stats)** | 6 |
| **US1 (P1 — Share)** | 3 |
| **US4 (P2 — Match Recap)** | 3 |
| **US5 (P2 — Season)** | 3 |
| **US6 (P2 — Period)** | 5 |
| **US7 (P2 — Stories)** | 4 |
| **US8 (P3 — Themes)** | 4 |
| **US9 (P3 — Fonts)** | 4 |
| **US10 (P3 — Preview)** | 3 |
| **Polish** | 3 |
| **New files** | ~15 |
| **Modified files** | ~12 |
| **New Prisma migrations** | 0 |
