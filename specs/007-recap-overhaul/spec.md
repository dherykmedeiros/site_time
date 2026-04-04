# Feature Specification: Recap & Sharing System Overhaul

**Feature Branch**: `007-recap-overhaul`  
**Created**: 2026-04-04  
**Status**: Draft  
**Input**: User description: "Comprehensive overhaul of the recap and sharing system — fixing share URLs, adding download/native share, expanding recap scopes (match, season, weekly), adding Stories format, visual themes, and caching OG routes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Download & Share Recap via Native Share (Priority: P1)

A player finishes a match and opens the post-game recap widget on their phone. They tap "Baixar PNG" and the recap image saves to their device gallery. They then tap "Compartilhar" which opens the device's native share sheet (Instagram Stories, WhatsApp Status, Telegram, etc.) with the image pre-attached and a link to the vitrine page.

**Why this priority**: Today users must screenshot to save and can only share via WhatsApp deep link. Download + native share removes the #1 friction point and directly increases distribution of recaps.

**Independent Test**: Can be tested by opening any existing match-level team recap widget, tapping download (verify PNG file in Downloads), and tapping share (verify native sheet opens with image file). Delivers value even if no other story ships.

**Acceptance Scenarios**:

1. **Given** a completed match with recap data, **When** a user taps "Baixar PNG", **Then** the browser downloads a PNG file named `recap-{entityType}-{entityId}.png` to the device.
2. **Given** a mobile device with Web Share API support, **When** a user taps "Compartilhar", **Then** the native share sheet appears with the PNG file and the vitrine page URL as share text.
3. **Given** a desktop browser without Web Share API support, **When** a user taps "Compartilhar", **Then** the system falls back to copy-link-to-clipboard behavior with a toast confirmation.
4. **Given** any share action (download, share, WhatsApp), **When** the user triggers it, **Then** the shared/copied URL always points to the public vitrine page (e.g., `/vitrine/{slug}`), not the raw `/api/og/...` PNG route.

---

### User Story 2 — Enriched Player Recap with Cards and Attendance (Priority: P1)

A player views their career recap widget and sees yellow cards, red cards, and attendance rate alongside existing goals and assists. They get a complete picture of their contribution and discipline record.

**Why this priority**: Card and attendance data already exist in the database but are invisible. Surfacing them requires minimal effort and immediately adds value to every player recap.

**Independent Test**: Can be tested by viewing the player recap widget for a player who has yellow/red cards and match attendance records. Verify all four new data points render correctly.

**Acceptance Scenarios**:

1. **Given** a player with 3 yellow cards and 1 red card across completed matches, **When** viewing their career recap, **Then** the recap displays "3 Cartões Amarelos" and "1 Cartão Vermelho".
2. **Given** a player who attended 8 out of 10 matches (via MatchAttendance with present=true), **When** viewing their career recap, **Then** the recap shows "80% Presença" and "8 jogos presentes".
3. **Given** a player with zero cards, **When** viewing their recap, **Then** card counts display as "0" (not hidden).
4. **Given** a player with no MatchAttendance records, **When** viewing their recap, **Then** attendance section shows "Sem dados de presença" or is gracefully omitted.

---

### User Story 3 — Correct OG Route Caching (Priority: P1)

A team admin shares the vitrine link on WhatsApp or Twitter. The social platform fetches the OG image. Subsequent fetches within one hour are served from CDN cache, reducing server load and improving link-preview speed.

**Why this priority**: OG routes currently have zero caching, meaning every WhatsApp/Twitter/Facebook preview triggers a new Prisma query + Satori render. Caching is a one-line fix with outsized performance impact.

**Independent Test**: Can be tested by requesting any OG image route and inspecting response headers for `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600`.

**Acceptance Scenarios**:

1. **Given** any OG image route (`/api/og/player-recap/...`, `/api/og/team-recap/...`, `/api/og/match/...`), **When** the route responds, **Then** the response includes `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600`.
2. **Given** a second request to the same OG URL within 3600 seconds, **When** served by CDN, **Then** the response is served from cache (verifiable via `x-vercel-cache: HIT` header on Vercel).

---

### User Story 4 — Player Recap Scoped to a Specific Match (Priority: P2)

After a match, a player wants to share a recap card for *that specific match* — not their entire career stats. They navigate to the match details and see a "Meu recap do jogo" button. The resulting card shows their goals, assists, cards, and attendance for that single match.

**Why this priority**: Per-match player recap is the most natural share unit after a game. Career recap is useful but less viral. This unlocks post-match social sharing for players.

**Independent Test**: Can be tested by navigating to a completed match as a player, clicking "Meu recap do jogo", and verifying the data matches only that match's stats.

**Acceptance Scenarios**:

1. **Given** a completed match where a player scored 2 goals and received 1 yellow card, **When** the player views their per-match recap, **Then** the card shows "2 Gols", "1 Cartão Amarelo", and player/team branding.
2. **Given** a completed match where a player has zero stats (no goals, no assists, no cards), **When** the player views their per-match recap, **Then** the card still renders showing "0" for all stat categories plus attendance status.
3. **Given** a match that is not yet completed (status != COMPLETED), **When** a player attempts to view per-match recap, **Then** the system shows a message like "Recap disponível após o jogo ser finalizado."

---

### User Story 5 — Season Recap (Priority: P2)

At the end of a season (or mid-season), a team admin views a season recap summarizing all matches played: wins, draws, losses, total goals scored/conceded, top scorers, top assistants, and discipline record. They share it as a recap card to celebrate the season.

**Why this priority**: Season recap creates a high-value, shareable summary that boosts team engagement and gives admins content to distribute.

**Independent Test**: Can be tested by selecting a season with at least 1 completed match and generating the season recap. Verify all aggregated stats are correct.

**Acceptance Scenarios**:

1. **Given** a season with 5 completed matches (3W-1D-1L, 12 goals scored, 6 conceded), **When** viewing the season recap, **Then** the card shows record "3V 1E 1D", "12 Gols Marcados", "6 Gols Sofridos", and saldo "+6".
2. **Given** a season with 0 completed matches, **When** attempting to generate a season recap, **Then** the system shows "Nenhuma partida finalizada nesta temporada."
3. **Given** a season recap, **When** viewing top scorers, **Then** the top 3 scorers by goals are listed with name and goal count, ordered descending.
4. **Given** a season recap, **When** viewing discipline stats, **Then** total yellow cards and red cards across all matches in the season are displayed.

---

### User Story 6 — Weekly/Monthly Team Recap (Priority: P2)

A team admin wants to share a weekly summary of the team's recent results. They access "Recap Semanal" and see all matches from the last 7 days aggregated into a single card: matches played, results, goals, and top performers for that period.

**Why this priority**: Short time-window recaps encourage regular social sharing and keep team engagement high between season milestones.

**Independent Test**: Can be tested by selecting "Recap Semanal" when the team has at least 1 completed match in the last 7 days. Verify aggregated stats cover exactly matches within that window.

**Acceptance Scenarios**:

1. **Given** 2 matches completed in the past 7 days, **When** viewing weekly recap, **Then** the card shows data aggregated from exactly those 2 matches.
2. **Given** no matches in the past 7 days, **When** viewing weekly recap, **Then** the system shows "Nenhuma partida na última semana."
3. **Given** a monthly recap request, **When** viewing, **Then** the card aggregates all matches from the past 30 days.
4. **Given** a match that was completed 8 days ago, **When** viewing the weekly recap, **Then** that match is excluded from the aggregation.

---

### User Story 7 — Stories Format (1080×1920) (Priority: P2)

A player wants to share their recap card directly to Instagram Stories or WhatsApp Status. They select "Formato Stories" and the system generates a vertical 1080×1920 image optimized for mobile story formats, instead of the default 1200×630 landscape.

**Why this priority**: Instagram Stories and WhatsApp Status are the primary share destinations for amateur football players. Landscape images look poor cropped into vertical slots.

**Independent Test**: Can be tested by appending `?format=stories` to any OG recap route and verifying the returned image is 1080×1920 pixels.

**Acceptance Scenarios**:

1. **Given** any recap OG route, **When** appending `?format=stories`, **Then** the returned PNG image dimensions are exactly 1080×1920 pixels.
2. **Given** a recap in stories format, **When** viewing, **Then** all text and stats are legible and not clipped at the taller aspect ratio.
3. **Given** no `format` parameter or `?format=landscape`, **When** requesting the OG image, **Then** the default 1200×630 landscape format is returned.
4. **Given** the Web Share action with Stories format, **When** sharing, **Then** the shared image file is the 1080×1920 version.

---

### User Story 8 — Visual Themes (Priority: P3)

A team admin wants the recap cards to match their team's identity. They select a visual theme — "classic" (current light layout), "dark" (dark background with light text), or "vibrant" (bold colors using team primary/secondary colors as dominant background). The selected theme is applied to the recap card image.

**Why this priority**: Visual customization improves brand feel and share appeal. Lower priority because the current layout is functional — this is an enhancement to desirability.

**Independent Test**: Can be tested by appending `?theme=dark` or `?theme=vibrant` to any OG recap route and comparing visual output against the default "classic".

**Acceptance Scenarios**:

1. **Given** no `theme` parameter, **When** requesting a recap image, **Then** the "classic" (current) layout is rendered.
2. **Given** `?theme=dark`, **When** requesting a recap image, **Then** the image has a dark background (#1a1a2e or similar), light text, and team accent colors.
3. **Given** `?theme=vibrant`, **When** requesting a recap image, **Then** the image uses the team's `primaryColor` as dominant background and `secondaryColor` for accents.
4. **Given** a team with no `primaryColor` set (null), **When** requesting `?theme=vibrant`, **Then** the system falls back to the "classic" theme.

---

### User Story 9 — Custom Fonts and Background Patterns (Priority: P3)

Recap cards use a modern, legible font (Inter or similar) instead of the default Arial. Background patterns — subtle stripes or gradients derived from team colors — add visual polish to all themes.

**Why this priority**: Typography and backgrounds are cosmetic enhancements that improve perceived quality but don't affect functionality.

**Independent Test**: Can be tested by visually inspecting any recap card image and confirming the font is not Arial and a subtle pattern/gradient is present in the background.

**Acceptance Scenarios**:

1. **Given** any recap card, **When** rendered, **Then** the primary font is Inter (or chosen alternative), not Arial/sans-serif default.
2. **Given** the "dark" theme, **When** rendered, **Then** a subtle diagonal stripe pattern based on team `secondaryColor` at reduced opacity appears in the background.
3. **Given** the "classic" theme, **When** rendered, **Then** a light gradient from white to a tint of the team `primaryColor` at 5-10% opacity is visible.

---

### User Story 10 — Live Preview Before Sharing (Priority: P3)

Before sharing, a user sees a live thumbnail preview of the recap card rendered client-side from JSON data. They can toggle between landscape/stories format and switch themes. Only after confirming the preview do they trigger download or share.

**Why this priority**: Preview reduces share anxiety and supports theme/format selection. Lowest priority because the current "open card" flow is serviceable.

**Independent Test**: Can be tested by opening the share actions for any recap, verifying a thumbnail preview appears, toggling format and theme dropdowns, and confirming the preview updates accordingly.

**Acceptance Scenarios**:

1. **Given** a user opens the share/download panel for a recap, **When** the panel loads, **Then** a reduced-size preview of the recap card is displayed immediately (rendered client-side from JSON).
2. **Given** the preview is showing, **When** the user toggles "Formato Stories", **Then** the preview updates to show the vertical layout.
3. **Given** the preview is showing, **When** the user selects "Tema Escuro", **Then** the preview re-renders with the dark theme applied.
4. **Given** the user confirms their format/theme choices and taps "Baixar", **Then** the download fetches the OG image route with the matching `?format=` and `?theme=` parameters.

---

### Edge Cases

- **No match stats for a player-match combo**: A player was registered for a match but has no MatchStats row. The per-match recap should show zeros for all stat fields, not error.
- **Team has no badge/colors**: If `badgeUrl`, `primaryColor`, or `secondaryColor` are null, recap cards degrade gracefully (placeholder badge icon, neutral color palette, "classic" theme forced).
- **Very long player/team names**: Names exceeding ~25 characters should be truncated with ellipsis in the image to prevent text overflow.
- **Season with only forfeited/cancelled matches**: If a season has matches but none with status=COMPLETED, season recap returns the "Nenhuma partida finalizada" message, not an empty card.
- **Concurrent OG image requests (cache stampede)**: Cache-Control with `stale-while-revalidate` allows serving stale while revalidating in background, mitigating stampede.
- **Stories format with very few stats**: A per-match recap in stories format for a player with all-zero stats still renders a complete card (all rows showing 0), not a blank area.
- **Unsupported `format` or `theme` parameter values**: Invalid values (e.g., `?format=square`, `?theme=neon`) fall back to defaults (landscape format, classic theme) silently — no error response.
- **MatchAttendance record with present=false**: Player marked as absent counts toward total matches but not attended matches. Attendance rate reflects this correctly.
- **Player with no completed matches at all**: Career recap shows "Nenhuma partida registrada" message instead of a card with all zeros.
- **Weekly recap spanning team creation date**: If the team was created 3 days ago, weekly recap includes only those 3 days of data without error.

## Requirements *(mandatory)*

### Functional Requirements

#### Block 1 — Quick Wins (P1)

- **FR-001**: All OG image routes MUST include `Cache-Control: public, s-maxage=3600, stale-while-revalidate=600` in their response headers.
- **FR-002**: RecapShareActions MUST provide a "Baixar PNG" button that fetches the OG image as a blob and triggers a browser download with filename `recap-{entityType}-{entityId}.png`.
- **FR-003**: RecapShareActions MUST provide a "Compartilhar" button that uses `navigator.share()` with a `files` array containing the recap PNG when the Web Share API is available.
- **FR-004**: When the Web Share API is unavailable, the "Compartilhar" button MUST fall back to copying the vitrine page URL to the clipboard with a toast notification.
- **FR-005**: The player recap builder MUST include `yellowCards` and `redCards` aggregated totals from MatchStats in the career-scope recap data.
- **FR-006**: The player recap builder MUST include attendance statistics — total matches with MatchAttendance records, count where `present=true`, and the derived attendance percentage.
- **FR-007**: The team recap builder MUST include `yellowCards` and `redCards` per player and totals in the match-scope recap data.
- **FR-008**: All share/copy actions in RecapShareActions MUST use the public vitrine page URL (e.g., `/vitrine/{slug}`) as the shared link, never the raw `/api/og/...` image URL.

#### Block 2 — New Recap Formats (P2)

- **FR-009**: OG image routes MUST accept an optional `format` query parameter with values `landscape` (default, 1200×630) and `stories` (1080×1920).
- **FR-010**: The system MUST provide a season recap builder that aggregates all completed matches within a given season: wins, draws, losses, goals scored, goals conceded, top 3 scorers, top 3 assistants, total yellow cards, total red cards.
- **FR-011**: The system MUST expose a season recap data route and a corresponding OG image route for season recaps.
- **FR-012**: The player recap builder MUST accept an optional match scope parameter. When provided, the recap shows stats for that single match only (goals, assists, yellow cards, red cards, attendance status).
- **FR-013**: The system MUST provide a weekly team recap that aggregates all completed matches for a given team within the last 7 calendar days from the request date.
- **FR-014**: The system MUST provide a monthly team recap that aggregates all completed matches for a given team within the last 30 calendar days from the request date.
- **FR-015**: Weekly and monthly team recaps MUST include: matches played, wins/draws/losses, goals scored/conceded, and top scorer for the period.

#### Block 3 — Visual Customization (P3)

- **FR-016**: OG image routes MUST accept an optional `theme` query parameter with values `classic` (default), `dark`, and `vibrant`.
- **FR-017**: The "dark" theme MUST render a dark background with light text and team accent colors.
- **FR-018**: The "vibrant" theme MUST use the team's `primaryColor` as the dominant background and `secondaryColor` for accents. If team colors are null, it MUST fall back to "classic".
- **FR-019**: Recap card images MUST use a custom loaded font (Inter or equivalent) instead of the system default.
- **FR-020**: Recap card backgrounds MUST include subtle patterns or gradients derived from team colors, varying by theme.
- **FR-021**: RecapShareActions MUST provide a live preview panel that renders a thumbnail of the recap card from JSON data, allowing the user to toggle format (landscape/stories) and theme (classic/dark/vibrant) before downloading or sharing.
- **FR-022**: The download and share actions MUST pass the user-selected `format` and `theme` parameters to the OG image route.

### Key Entities

- **PlayerRecap**: Aggregated player statistics scoped to career, season, or single match. Attributes: player identity, goals, assists, yellow cards, red cards, matches played, attendance rate, scope (career/season/match), and associated team branding.
- **TeamRecap (match)**: Summary of a single completed match. Attributes: score, opponent, top scorers, top assistants, total cards, date, team branding.
- **SeasonRecap**: Aggregated team results across all completed matches in a season. Attributes: record (W/D/L), goals scored/conceded, goal difference, top scorers, top assistants, discipline totals, season identity.
- **PeriodRecap (weekly/monthly)**: Aggregated team results within a rolling date window. Same attributes as SeasonRecap but scoped to 7 or 30 days.
- **RecapImage**: A rendered PNG from recap data. Attributes: format (landscape/stories), theme (classic/dark/vibrant), dimensions, cache TTL.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can download a recap as a PNG image in one tap from the share panel.
- **SC-002**: On mobile devices supporting Web Share API, users can share a recap image natively to Instagram Stories, WhatsApp Status, or any installed app.
- **SC-003**: OG image routes return `Cache-Control` headers with `s-maxage=3600` (verifiable via HTTP response inspection).
- **SC-004**: Player career recap displays yellow cards, red cards, and attendance rate alongside goals and assists.
- **SC-005**: Season recap is available and correctly aggregated for any season with at least 1 completed match.
- **SC-006**: Stories format (1080×1920) renders correctly when `?format=stories` is passed to any recap OG route.
- **SC-007**: At least 2 visual themes are available: "classic" (current) and "dark", selectable via `?theme=` parameter.
- **SC-008**: All shared links point to the public vitrine page with proper OG meta tags, not to the raw PNG route.
- **SC-009**: A player can view and share a recap scoped to a specific match showing only that match's statistics.
- **SC-010**: Weekly team recap correctly aggregates results from matches completed in the last 7 days.

## Assumptions

- Users access recap/share features primarily on mobile devices (Android and iOS) where Web Share API is widely supported.
- The existing vitrine page infrastructure (`/vitrine/[slug]`) will be extended to support new recap types (season, weekly, per-match player) without a full redesign.
- Satori (used by `next/og`) supports loading custom `.ttf`/`.woff` font files, which will be bundled in the project assets.
- Vercel's CDN respects `Cache-Control` headers set in OG route responses — no additional CDN configuration is needed.
- The `MatchAttendance` model is already populated for past matches; no backfill migration is required for attendance data.
- Team `primaryColor` and `secondaryColor` are hex strings (e.g., `#FF5500`). If null, the system defaults to a neutral palette.
- "Weekly" means a rolling 7-day window from the current date, not a calendar week (Monday–Sunday). Same logic for "monthly" (rolling 30 days).
- Client-side live preview will use simplified rendering (CSS/HTML-based thumbnail), not a full Satori render in the browser.
- The current telemetry tracking in RecapShareActions will be preserved and extended to track new actions (download, native share, format/theme selections).
