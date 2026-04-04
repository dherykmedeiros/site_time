# Implementation Plan: Recap & Sharing System Overhaul

**Branch**: `007-recap-overhaul` | **Date**: 2026-04-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-recap-overhaul/spec.md`

## Summary

Comprehensive overhaul of the recap and sharing system: fix share URLs to always point to the public vitrine page, add download/native share via Web Share API, enrich player recaps with cards and attendance, add season/weekly/monthly recap scopes, support 1080×1920 Stories format, introduce visual themes (classic/dark/vibrant) with custom fonts, add CDN caching on all OG routes, and provide a client-side live preview before sharing. No new database models — all new recaps are computed on-the-fly from existing Season→Match→MatchStats→MatchAttendance relations.

## Technical Context

**Language/Version**: TypeScript 5.x (strict: true), Node.js 20 LTS
**Primary Dependencies**: Next.js 16 (App Router, Turbopack), Prisma ORM, Tailwind CSS, NextAuth.js, Zod, `next/og` (Satori → PNG)
**Storage**: PostgreSQL via Prisma — no new models; all recaps computed from existing tables (Season, Match, MatchStats, MatchAttendance, Player, Team)
**Testing**: Manual testing + existing npm test/lint scripts
**Target Platform**: Vercel (serverless), CDN-cached OG images, mobile-first share UX
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: OG images cached at CDN edge for 1h (`s-maxage=3600, stale-while-revalidate=600`); recap JSON responses < 200ms
**Constraints**: No new Prisma migrations. Satori font loading limited to .ttf/.woff. `ImageResponse` max 4MB output.
**Scale/Scope**: ~50 active users per team, recaps are public routes (no auth required), typical seasons have 10-30 matches

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution Principle | Compliance | Notes |
|------------------------|------------|-------|
| **I. Componentes Reutilizáveis** | ✅ PASS | Shared OG layout helpers (theme system, font loader, dimension configs), shared recap TypeScript interfaces, reusable `RecapShareActions` component |
| **II. API-First** | ✅ PASS | All new recap data exposed via API routes (`/api/recap/season/[seasonId]`, `/api/recap/weekly/[teamId]`, `/api/recap/monthly/[teamId]`) before UI consumption. OG image routes consume these builders. |
| **III. Type-Safety** | ✅ PASS | All recap payloads have TypeScript interfaces in `contracts/`. Zod validation on all query params (`format`, `theme`, `matchId`). Prisma-generated types as source of truth. No `any`. |
| **IV. Segurança** | ✅ PASS | Recap routes are public by design (no auth needed). All query params validated with Zod. `safeHex()` already sanitizes color injection. No sensitive data exposed. |
| **V. Simplicidade** | ✅ PASS | No new DB models. Rolling date windows computed at query time. Theme selection via query param (no persistence). Client-side preview from existing JSON data. |

**GATE RESULT: ✅ ALL PASS — proceed to Phase 0**

## Project Structure

### Documentation (this feature)

```text
specs/005-recap-overhaul/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output (TypeScript interfaces)
    ├── recap-types.ts
    └── og-params.ts
```

### Source Code (repository root)

```text
lib/
├── player-recap.ts          # MODIFY — add yellowCards, redCards, attendance, matchId scope
├── team-recap.ts            # MODIFY — extend for weekly/monthly aggregation
├── season-recap.ts          # NEW — season recap builder
├── recap-shared.ts          # NEW — shared types, theme config, dimension constants
└── validations/
    └── recap.ts             # NEW — Zod schemas for format, theme, matchId params

app/api/
├── og/
│   ├── route-utils.ts       # MODIFY — add Cache-Control helper, theme resolver, dimension resolver, font loader
│   ├── player-recap/
│   │   └── [playerId]/
│   │       └── route.tsx     # MODIFY — add ?matchId, ?format, ?theme support + Cache-Control
│   ├── team-recap/
│   │   └── [matchId]/
│   │       └── route.tsx     # MODIFY — add ?format, ?theme support + Cache-Control
│   ├── season-recap/
│   │   └── [seasonId]/
│   │       └── route.tsx     # NEW — season recap OG image
│   ├── weekly-recap/
│   │   └── [teamId]/
│   │       └── route.tsx     # NEW — weekly team recap OG image
│   ├── monthly-recap/
│   │   └── [teamId]/
│   │       └── route.tsx     # NEW — monthly team recap OG image
│   └── match/
│       └── [id]/
│           └── route.tsx     # MODIFY — add ?format, ?theme + Cache-Control
├── recap/
│   ├── player/
│   │   └── [playerId]/
│   │       └── route.ts      # MODIFY — add ?matchId query param support
│   ├── team/
│   │   └── [matchId]/
│   │       └── route.ts      # MODIFY — add Cache-Control
│   ├── season/
│   │   └── [seasonId]/
│   │       └── route.ts      # NEW — season recap JSON endpoint
│   ├── weekly/
│   │   └── [teamId]/
│   │       └── route.ts      # NEW — weekly recap JSON endpoint
│   └── monthly/
│       └── [teamId]/
│           └── route.ts      # NEW — monthly recap JSON endpoint

components/dashboard/
├── RecapShareActions.tsx      # MODIFY — download PNG, Web Share API, fix URLs, theme/format selector
└── RecapPreview.tsx           # NEW — client-side live preview component

public/
└── fonts/
    └── Inter-Bold.ttf         # NEW — custom font for OG images
```

**Structure Decision**: Next.js App Router flat segments. All new recap routes follow existing patterns. Shared logic in `lib/`, shared types in `contracts/`.

## Complexity Tracking

No constitution violations detected. No complexity justification needed.

---

## Implementation Phases

### Block 1 — Quick Wins (P1)

**Estimated scope**: Modify 5 existing files, add 2 new files

| Task | Type | Files | Depends On |
|------|------|-------|------------|
| 1.1 Add Cache-Control headers to all OG routes | Modify | `app/api/og/route-utils.ts`, all `route.tsx` in `og/` | — |
| 1.2 Add download PNG button to RecapShareActions | Modify | `components/dashboard/RecapShareActions.tsx` | — |
| 1.3 Add Web Share API with file support | Modify | `components/dashboard/RecapShareActions.tsx` | 1.2 |
| 1.4 Fix all share URLs to point to vitrine page | Modify | `components/dashboard/RecapShareActions.tsx` | — |
| 1.5 Add yellowCards, redCards to player recap | Modify | `lib/player-recap.ts` | — |
| 1.6 Add attendance stats to player recap | Modify | `lib/player-recap.ts` | — |
| 1.7 Add yellowCards, redCards to team recap | Modify | `lib/team-recap.ts` | — |
| 1.8 Add Zod validation schemas for recap params | Create | `lib/validations/recap.ts` | — |

### Block 2 — New Recap Formats (P2)

**Estimated scope**: 8 new files, 3 modified files

| Task | Type | Files | Depends On |
|------|------|-------|------------|
| 2.1 Create season recap builder | Create | `lib/season-recap.ts` | — |
| 2.2 Create season recap JSON API | Create | `app/api/recap/season/[seasonId]/route.ts` | 2.1 |
| 2.3 Create season recap OG route | Create | `app/api/og/season-recap/[seasonId]/route.tsx` | 2.1, 1.1 |
| 2.4 Add matchId scope to player recap builder | Modify | `lib/player-recap.ts` | 1.5, 1.6 |
| 2.5 Add matchId query param to player recap API | Modify | `app/api/recap/player/[playerId]/route.ts` | 2.4, 1.8 |
| 2.6 Add matchId support to player recap OG route | Modify | `app/api/og/player-recap/[playerId]/route.tsx` | 2.4 |
| 2.7 Create weekly team recap builder + API + OG | Create | `lib/team-recap.ts` (extend), new API and OG routes | 1.7 |
| 2.8 Create monthly team recap builder + API + OG | Create | Same pattern as weekly | 2.7 |
| 2.9 Add `?format=stories` support (1080×1920) | Modify | All OG routes, `app/api/og/route-utils.ts` | 1.1, 1.8 |

### Block 3 — Visual Customization (P3)

**Estimated scope**: 5 new files, 6 modified files

| Task | Type | Files | Depends On |
|------|------|-------|------------|
| 3.1 Add Inter font loading to OG routes | Create | `public/fonts/Inter-Bold.ttf`, `app/api/og/route-utils.ts` | — |
| 3.2 Implement theme system (classic/dark/vibrant) | Create | `lib/recap-shared.ts`, modify all OG routes | 3.1, 1.8 |
| 3.3 Add background patterns per theme | Modify | All OG route components | 3.2 |
| 3.4 Add ?theme= query param to all OG routes | Modify | All OG `route.tsx` files | 3.2, 1.8 |
| 3.5 Create RecapPreview component (client-side) | Create | `components/dashboard/RecapPreview.tsx` | — |
| 3.6 Integrate preview + theme/format selectors | Modify | `components/dashboard/RecapShareActions.tsx` | 3.5, 2.9, 3.4 |

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Satori font loading fails on Vercel Edge | OG images fall back to Arial | Load `.ttf` from `public/fonts/` with absolute URL; test on Vercel preview deploy |
| ImageResponse exceeds 4MB for Stories format | Route returns error | Keep designs simple; test with data-heavy recaps |
| Web Share API `files` not supported on iOS Safari < 15.4 | Share button falls back to copy-link | Feature-detect `navigator.canShare({files: [...]})` before using files |
| CDN cache serves stale data after match update | Old recap shown for up to 1h | Acceptable trade-off per spec; document in quickstart |
| Team with no colors breaks vibrant theme | Ugly/broken card | Fall back to classic theme when `primaryColor` is null |
