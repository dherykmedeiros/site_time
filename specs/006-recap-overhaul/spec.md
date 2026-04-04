# Feature Specification: Recap & Sharing System Overhaul

**Feature Branch**: `006-recap-overhaul`  
**Created**: 2026-04-04  
**Status**: Draft  
**Input**: User description: "Comprehensive overhaul of the recap/sharing system — covering caching, download, native share, new formats (Stories, season, per-match, weekly/monthly), visual customization (variants, fonts, backgrounds), and fixing data gaps (cards, attendance) and shared-link routing."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Download & Share Recap Images (Priority: P1)

A team admin or player views a recap (player or team) and wants to save the image to their device or share it directly to WhatsApp, Instagram Stories, or another app without screenshotting.

**Why this priority**: This is the most requested improvement — without a direct download or native share, users resort to screenshots, which degrades quality and adds friction. Fixing this alone delivers immediate value to every recap user.

**Independent Test**: Open any existing recap page, tap "Download PNG", verify the file is saved to the device. Tap "Share", verify the native OS share sheet appears and allows sending to at least WhatsApp and Instagram Stories.

**Acceptance Scenarios**:

1. **Given** a user is viewing a player recap, **When** they tap "Download Image", **Then** the recap image is downloaded to their device as a PNG file with a descriptive filename.
2. **Given** a user is on a mobile device viewing a team recap, **When** they tap "Share", **Then** the native share sheet opens with the recap image pre-attached, allowing sharing to any installed app.
3. **Given** a user is on a desktop browser that does not support the Web Share API, **When** they view share options, **Then** the system falls back to WhatsApp link and copy-link buttons (current behavior preserved).
4. **Given** a user shares a recap link, **When** a recipient opens it, **Then** the link leads to the vitrine page (with OG preview), not a raw PNG URL.

---

### User Story 2 — Complete Stats in Recaps (Priority: P1)

A player or admin views a recap and expects to see all relevant match stats — including yellow cards, red cards, and attendance — not just goals and assists.

**Why this priority**: The data already exists in the database but is ignored in recaps, creating a misleading or incomplete picture. Including it requires minimal effort and significantly improves recap accuracy.

**Independent Test**: Create a match where a player received a yellow card and had attendance marked. Generate the player recap and verify cards and attendance appear in the output.

**Acceptance Scenarios**:

1. **Given** a player received 2 yellow cards and 1 red card across their career, **When** their career recap is generated, **Then** the recap displays yellow card count (2) and red card count (1).
2. **Given** a team played 10 matches in a season and a player attended 8, **When** a player recap is generated for that season, **Then** attendance rate (80%) is displayed.
3. **Given** a match where no cards were issued, **When** the match recap is generated, **Then** card stats are either hidden or show zero without visual clutter.

---

### User Story 3 — OG Route Caching (Priority: P1)

A shared recap link is opened by multiple people on social media. The OG image should be served from cache rather than re-rendered on every request.

**Why this priority**: Without caching, every social preview triggers server-side image rendering, causing slow load times and unnecessary compute cost. This is a quick infrastructure fix with high impact on perceived performance.

**Independent Test**: Request an OG image route, verify the response includes a `Cache-Control` header with at least a 1-hour max-age. Request the same URL again and verify a cached response is returned.

**Acceptance Scenarios**:

1. **Given** an OG image route is requested for the first time, **When** the response is returned, **Then** it includes appropriate cache headers with at least a 1-hour duration.
2. **Given** an OG image was already generated within the cache window, **When** the same URL is requested again, **Then** the cached image is served without re-rendering.
3. **Given** underlying recap data changes (new match result), **When** a new OG image is requested, **Then** the stale-while-revalidate strategy ensures fresh content within a reasonable time.

---

### User Story 4 — Stories Format (Vertical 9:16) (Priority: P2)

A player wants to share their recap directly to Instagram Stories or WhatsApp Status, which require a vertical (9:16) image format rather than the current landscape (16:9).

**Why this priority**: Stories are the dominant sharing format on mobile social platforms. Without vertical support, shared images appear tiny or cropped in Stories, reducing engagement and virality.

**Independent Test**: Navigate to a recap page, select "Stories format", verify the generated image is 1080×1920, then share to Instagram Stories and confirm it fills the screen.

**Acceptance Scenarios**:

1. **Given** a user is viewing a player recap, **When** they select the Stories format option, **Then** the recap image is generated at 1080×1920 pixels in vertical layout.
2. **Given** a user requests a recap via the OG route with a stories format parameter, **When** the image is rendered, **Then** a top-to-bottom layout is used with all stats visible and readable.
3. **Given** a recap has many stats that don't fit vertically, **When** the Stories format is rendered, **Then** content is intelligently truncated or reorganized (not simply squished).

---

### User Story 5 — Season Recap (Priority: P2)

A team admin or player wants to see aggregated stats for an entire season — totals across all matches — instead of only match-by-match summaries.

**Why this priority**: Season-level recaps let players celebrate achievements over time and let admins share season wrap-ups. This is a natural extension of existing per-match data.

**Independent Test**: Complete at least 1 match in a season, navigate to the season recap, verify it aggregates goals, assists, cards, and attendance across all matches in that season.

**Acceptance Scenarios**:

1. **Given** a season has 5 completed matches, **When** the season recap is generated, **Then** it shows aggregated totals (goals, assists, yellow cards, red cards, attendance) across all 5 matches.
2. **Given** a season has 0 completed matches, **When** a user attempts to generate a season recap, **Then** a friendly message explains that at least 1 completed match is needed.
3. **Given** a season is still in progress, **When** the season recap is generated, **Then** it shows stats for completed matches only, labeled as "in progress".

---

### User Story 6 — Player-per-Match Recap (Priority: P2)

A player wants to see and share their individual stats for a specific match, not just their career-wide numbers.

**Why this priority**: After each game, players want to share their individual performance. Currently the player recap only shows career aggregates, missing the "post-match highlight" opportunity.

**Independent Test**: Select a specific match where a player scored 2 goals, generate the player recap scoped to that match, verify it shows 2 goals (not career totals).

**Acceptance Scenarios**:

1. **Given** a player scored 2 goals in Match #7, **When** the player-per-match recap is generated for Match #7, **Then** it displays 2 goals, not career totals.
2. **Given** a player had no stats in Match #3, **When** the per-match recap is generated, **Then** it shows "0 goals, 0 assists" with attendance status, not an empty or error page.
3. **Given** a user accesses a player-per-match recap via shared link, **When** the vitrine page loads, **Then** it clearly indicates the specific match context (date, opponent, score).

---

### User Story 7 — Weekly/Monthly Team Recap (Priority: P3)

A team admin wants to generate a recap that summarizes team performance over the last week or month, covering multiple matches in that time window.

**Why this priority**: Builds on the season recap concept with more granular time windows. Useful for admins who post regular updates but lower priority since season recap covers most use cases.

**Independent Test**: With 3 matches played in the last 7 days, generate a weekly team recap and verify it aggregates results, scorers, and attendance for those 3 matches.

**Acceptance Scenarios**:

1. **Given** a team played 3 matches in the past 7 days, **When** a weekly team recap is generated, **Then** it shows aggregate results (wins/draws/losses), top scorers, and average attendance for those 3 matches.
2. **Given** no matches were played in the selected time window, **When** the user requests a weekly/monthly recap, **Then** a message indicates no matches are available for the period.
3. **Given** a monthly recap is generated on April 15, **When** the recap renders, **Then** it includes all matches from April 1–15 (current month to date).

---

### User Story 8 — Visual Layout Variants (Priority: P3)

A team admin wants to choose a visual style for their recaps — e.g., minimalist, vibrant, or dark — to match their team's brand or mood.

**Why this priority**: Adds differentiation and delight but doesn't change functionality. Requires more design effort and is valuable only after core recap features (download, share, formats) are solid.

**Independent Test**: Open the recap customization panel, select "Dark" variant, generate a preview, verify the image uses a dark background with appropriate contrast. Switch to "Vibrant", confirm colors change.

**Acceptance Scenarios**:

1. **Given** an admin opens the recap sharing screen, **When** they see layout options, **Then** at least 2 variants are available (e.g., "Minimalist" and "Dark").
2. **Given** an admin selects the "Dark" variant, **When** the recap preview updates, **Then** it shows a dark background with light text and high contrast.
3. **Given** an admin selects a variant and shares the recap, **When** the recipient opens the shared link, **Then** the vitrine page renders using the selected variant style.

---

### User Story 9 — Live Preview Before Sharing (Priority: P3)

A user (admin or player) wants to preview exactly how their recap will look before sharing it — including format (landscape vs. Stories) and visual variant — without having to share first and check afterward.

**Why this priority**: Prevents "share regret" and reduces friction, but is a comfort feature. Users can still share and check; preview enhances confidence.

**Independent Test**: Toggle between landscape and Stories format, switch between visual variants, confirm the preview updates in near real-time showing the final image layout.

**Acceptance Scenarios**:

1. **Given** a user is on the recap sharing screen, **When** they toggle between landscape and Stories format, **Then** the preview updates to show the correct dimensions and layout.
2. **Given** a user selects a different visual variant, **When** the preview refreshes, **Then** it accurately reflects the chosen variant's colors, fonts, and background.
3. **Given** the user is on a slow connection, **When** the preview is loading, **Then** a loading indicator is shown and the previous preview remains visible until the new one is ready.

---

### Edge Cases

- What happens when a player has stats in a match but was not marked as attended? The recap shows the stats with attendance marked as "unconfirmed."
- What happens if the OG route is called with an invalid match/player/season ID? The system returns a generic fallback OG image and a 404 status.
- What happens when the Web Share API call is rejected by the user (e.g., cancelled the share sheet)? No error is shown; the share buttons remain available.
- What happens if a recap image exceeds the Stories format's safe area? Content is repositioned within safe margins; critical stats are never clipped.
- What happens when a team has no logo uploaded? The recap renders with a generic placeholder badge.
- What happens when the custom font fails to load in Satori? The system falls back to a bundled default font.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a "Download Image" button on all recap views that saves the recap as a PNG file to the user's device.
- **FR-002**: System MUST use the Web Share API on supported devices to show the native share sheet with the recap image; on unsupported devices, existing WhatsApp + copy-link buttons are preserved.
- **FR-003**: All shared recap links MUST point to the vitrine page (e.g., `/vitrine/{slug}`) with correct OG meta tags, not directly to the raw PNG.
- **FR-004**: All OG image routes MUST return cache headers with a minimum 1-hour cache duration.
- **FR-005**: Player recaps MUST include yellow card count, red card count, and attendance rate in addition to existing stats (goals, assists, matches played).
- **FR-006**: Team recaps MUST include aggregate yellow/red card counts and average attendance for the scope being displayed.
- **FR-007**: System MUST support generating recap images in vertical Stories format (1080×1920) via a format parameter.
- **FR-008**: System MUST support a season recap that aggregates all completed matches in a given season, available once at least 1 match is completed.
- **FR-009**: System MUST support player-per-match recaps scoped to a specific match, showing that player's individual stats for that match.
- **FR-010**: System MUST support weekly and monthly team recaps that aggregate matches within the specified time window.
- **FR-011**: System MUST offer at least 2 visual layout variants (e.g., minimalist, dark) selectable by the user before generating a recap.
- **FR-012**: System MUST support custom font loading for recap image generation.
- **FR-013**: System MUST support background patterns (gradient, stripes, or texture) as part of visual variants.
- **FR-014**: System MUST provide a live preview of the recap that updates when format or variant is changed, before the user confirms sharing or downloading.
- **FR-015**: Landscape format (1200×630) MUST remain the default and continue to work as before.

### Key Entities

- **Recap**: A generated visual summary of performance data. Scoped to a player or a team, and to a time range (single match, season, week, or month). Associated with a format (landscape or stories) and a visual variant.
- **RecapVariant**: A named visual style configuration — defines color palette, font, background pattern, and layout adjustments. At least 2 built-in variants are provided.
- **Player**: Existing entity — extended in recaps to include cards and attendance stats.
- **Match / MatchStats / MatchAttendance**: Existing entities — their data feeds into all recap types.
- **Season**: Existing entity — serves as scoping boundary for season recaps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can download recap images directly to their device in 1 tap, without screenshotting.
- **SC-002**: Users on mobile can share recaps to Instagram Stories and WhatsApp Status via the native share sheet.
- **SC-003**: Season recap is available for any season that has at least 1 completed match.
- **SC-004**: All existing stats — goals, assists, yellow cards, red cards, attendance — are visible in player and team recaps.
- **SC-005**: OG image routes are cached for at least 1 hour, reducing redundant server-side renders.
- **SC-006**: At least 2 visual layout variants are available for users to choose from when generating a recap.
- **SC-007**: Recap images are available in both landscape (1200×630) and Stories (1080×1920) formats.
- **SC-008**: Shared recap links open the vitrine page with proper OG preview, not a raw image URL.
- **SC-009**: Live preview updates within 3 seconds of changing format or variant selection.
- **SC-010**: Player-per-match recaps correctly show stats scoped to a single match, not career totals.

## Assumptions

- The existing image generation pipeline will continue to be used for recap rendering; no switch to a headless browser or external service is planned.
- Custom fonts will be bundled in the project or fetched at build time for use in image generation.
- The Web Share API with file sharing is supported on modern mobile browsers (iOS Safari 15+, Chrome Android 76+); desktop fallback is acceptable.
- The existing vitrine route will be extended to handle new recap types (season, per-match, weekly/monthly) by expanding the slug structure or adding query parameters.
- "Weekly" means the last 7 rolling days from today; "Monthly" means from the 1st of the current month to today.
- Visual variants are predefined by the development team — users cannot create fully custom themes in this iteration.
- Existing recap routes and URLs remain backward-compatible; new formats and scopes are additive.
- The stale-while-revalidate caching strategy is used for OG routes — serving stale content while revalidating in the background after data changes.
