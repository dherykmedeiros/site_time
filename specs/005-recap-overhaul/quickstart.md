# Quickstart: Recap & Sharing System Overhaul

**Feature**: 005-recap-overhaul | **Branch**: `007-recap-overhaul`

## What This Feature Does

Overhauls the recap and sharing system for a sports team management app. Adds download/native share, enriched player stats (cards + attendance), season/weekly/monthly recaps, Stories format (1080×1920), visual themes, CDN caching, and client-side live preview.

## Prerequisites

- Node.js 20 LTS
- PostgreSQL database with existing schema (no new migrations needed)
- Environment variables configured (`.env`)
- `npm install` completed

## Key Files to Understand First

| File | Purpose |
|------|---------|
| `lib/player-recap.ts` | Builds player recap data from Prisma. Modified to add cards, attendance, match scope. |
| `lib/team-recap.ts` | Builds team recap data per match. Extended for weekly/monthly. |
| `lib/season-recap.ts` | **NEW** — Season recap builder. |
| `app/api/og/route-utils.ts` | Shared OG helpers: color sanitization, cache headers, theme resolver, font loader. |
| `app/api/og/*/route.tsx` | OG image routes (Satori → PNG). Modified for format/theme/cache. |
| `app/api/recap/*/route.ts` | JSON data API routes. New routes for season/weekly/monthly. |
| `components/dashboard/RecapShareActions.tsx` | Share panel UI. Modified for download, Web Share, preview. |
| `lib/validations/recap.ts` | **NEW** — Zod schemas for `format`, `theme`, `matchId` query params. |

## Implementation Order

1. **Block 1 (P1)**: Cache headers → download button → Web Share API → fix vitrine URLs → add cards/attendance to recaps → Zod schemas
2. **Block 2 (P2)**: Season recap → match-scoped player recap → weekly/monthly recaps → Stories format
3. **Block 3 (P3)**: Custom fonts → theme system → background patterns → live preview

## How to Test Locally

```bash
# Start dev server
npm run dev

# Test cache headers (inspect response)
curl -I http://localhost:3000/api/og/team-recap/{matchId}
# Expect: Cache-Control: public, s-maxage=3600, stale-while-revalidate=600

# Test Stories format
# Open: http://localhost:3000/api/og/team-recap/{matchId}?format=stories
# Expect: 1080×1920 PNG

# Test themes
# Open: http://localhost:3000/api/og/team-recap/{matchId}?theme=dark
# Open: http://localhost:3000/api/og/team-recap/{matchId}?theme=vibrant

# Test new recap APIs
curl http://localhost:3000/api/recap/season/{seasonId}
curl http://localhost:3000/api/recap/weekly/{teamId}
curl http://localhost:3000/api/recap/monthly/{teamId}
curl http://localhost:3000/api/recap/player/{playerId}?matchId={matchId}
```

## API Route Reference

| Route | Method | Description | Query Params |
|-------|--------|-------------|--------------|
| `GET /api/recap/player/[playerId]` | GET | Player career recap JSON | `?matchId=` (optional) |
| `GET /api/recap/team/[matchId]` | GET | Team match recap JSON | — |
| `GET /api/recap/season/[seasonId]` | GET | Season recap JSON | — |
| `GET /api/recap/weekly/[teamId]` | GET | Weekly team recap JSON | — |
| `GET /api/recap/monthly/[teamId]` | GET | Monthly team recap JSON | — |
| `GET /api/og/player-recap/[playerId]` | GET | Player recap PNG | `?matchId=`, `?format=`, `?theme=` |
| `GET /api/og/team-recap/[matchId]` | GET | Team match recap PNG | `?format=`, `?theme=` |
| `GET /api/og/season-recap/[seasonId]` | GET | Season recap PNG | `?format=`, `?theme=` |
| `GET /api/og/weekly-recap/[teamId]` | GET | Weekly recap PNG | `?format=`, `?theme=` |
| `GET /api/og/monthly-recap/[teamId]` | GET | Monthly recap PNG | `?format=`, `?theme=` |
| `GET /api/og/match/[id]` | GET | Match OG image PNG | `?format=`, `?theme=` |

## Notes

- **No new Prisma migrations** — all recaps computed from existing data.
- **CDN caching**: 1h TTL. After data changes (e.g., post-game stats entry), stale images may persist for up to 1h. Acceptable trade-off.
- **Font**: Inter Bold `.ttf` bundled in `public/fonts/`. Satori requires `.ttf` or `.woff` (not `.woff2`).
- **Themes**: "vibrant" falls back to "classic" if team has no `primaryColor` set.
- **Web Share API**: File-based sharing requires `navigator.canShare({ files })` check. Falls back to URL-only share, then to clipboard copy.
