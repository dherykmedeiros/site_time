# Data Model: Recap & Sharing System Overhaul

**Feature**: 005-recap-overhaul | **Date**: 2026-04-04

## Key Decision: No New Database Models

All recaps are computed on-the-fly from existing Prisma models. No new migrations required.

## Existing Models Used

### Source Entities (read-only, no modifications)

```
Season
├── id: String (cuid)
├── teamId: String → Team
├── name: String
├── type: SeasonType (LEAGUE | CUP | TOURNAMENT)
├── startDate: DateTime
├── endDate: DateTime?
├── status: SeasonStatus (ACTIVE | FINISHED)
└── matches: Match[]               ← aggregation source

Match
├── id: String (cuid)
├── date: DateTime                  ← used for weekly/monthly rolling window
├── opponent: String
├── isHome: Boolean                 ← determines which score is "ours"
├── homeScore: Int?
├── awayScore: Int?
├── status: MatchStatus             ← must be COMPLETED for recaps
├── teamId: String → Team
├── seasonId: String? → Season
├── matchStats: MatchStats[]        ← per-player stats
└── attendances: MatchAttendance[]  ← attendance data

MatchStats
├── id: String (cuid)
├── goals: Int (default 0)
├── assists: Int (default 0)
├── yellowCards: Int (default 0)    ← ALREADY EXISTS, not yet surfaced in recaps
├── redCards: Int (default 0)       ← ALREADY EXISTS, not yet surfaced in recaps
├── playerId: String → Player
└── matchId: String → Match

MatchAttendance
├── id: String (cuid)
├── matchId: String → Match
├── playerId: String → Player
├── present: Boolean (default false) ← key field for attendance rate
└── checkedInAt: DateTime?

Player
├── id: String (cuid)
├── name: String
├── position: PlayerPosition
├── photoUrl: String?
└── teamId: String → Team

Team
├── id: String (cuid)
├── name: String
├── shortName: String?
├── slug: String (unique)           ← used for vitrine URL construction
├── badgeUrl: String?
├── primaryColor: String?           ← hex color for themes
└── secondaryColor: String?         ← hex color for themes
```

## Computed Data Shapes

### PlayerRecap (enhanced — career scope)

```
PlayerRecap
├── player: { id, name, position, photoUrl }
├── team: { id, name, shortName, slug, primaryColor, secondaryColor, badgeUrl }
├── career:
│   ├── matches: Int                ← count of MatchStats rows with COMPLETED match
│   ├── goals: Int                  ← sum of MatchStats.goals
│   ├── assists: Int                ← sum of MatchStats.assists
│   ├── yellowCards: Int            ← NEW: sum of MatchStats.yellowCards
│   └── redCards: Int               ← NEW: sum of MatchStats.redCards
├── attendance:                     ← NEW block
│   ├── totalMatches: Int           ← count of MatchAttendance records
│   ├── present: Int                ← count where present=true
│   └── rate: number | null         ← present/totalMatches (null if no records)
├── lastFive: { matches, goals, assists }
└── achievements: AchievementType[]
```

### PlayerRecap (match scope — NEW)

```
PlayerMatchRecap
├── player: { id, name, position, photoUrl }
├── team: { id, name, shortName, slug, primaryColor, secondaryColor, badgeUrl }
├── match: { id, date, opponent, isHome, homeScore, awayScore }
├── stats:
│   ├── goals: Int
│   ├── assists: Int
│   ├── yellowCards: Int
│   └── redCards: Int
└── attended: boolean | null         ← from MatchAttendance.present (null if no record)
```

### TeamRecap (match scope — enhanced)

```
TeamMatchRecap (existing, enhanced)
├── match: { id, date, opponent, isHome, opponentBadgeUrl, homeScore, awayScore }
├── team: { id, name, shortName, slug, primaryColor, secondaryColor, badgeUrl }
├── totals:
│   ├── goals: Int
│   ├── assists: Int
│   ├── yellowCards: Int            ← NEW
│   ├── redCards: Int               ← NEW
│   └── playersWithStats: Int
├── recentForm: { wins, draws, losses, goalsFor, goalsAgainst, matches }
└── leaders:
    ├── topScorer: { playerId, playerName, goals } | null
    └── topAssistant: { playerId, playerName, assists } | null
```

### SeasonRecap (NEW)

```
SeasonRecap
├── season: { id, name, type, startDate, endDate, status }
├── team: { id, name, shortName, slug, primaryColor, secondaryColor, badgeUrl }
├── record:
│   ├── matchesPlayed: Int
│   ├── wins: Int
│   ├── draws: Int
│   ├── losses: Int
│   ├── goalsScored: Int
│   ├── goalsConceded: Int
│   └── goalDifference: Int
├── discipline:
│   ├── yellowCards: Int
│   └── redCards: Int
├── topScorers: Array<{ playerId, playerName, goals }> (top 3)
├── topAssistants: Array<{ playerId, playerName, assists }> (top 3)
└── empty: false
```

### PeriodRecap (weekly/monthly — NEW)

```
PeriodRecap
├── period:
│   ├── type: 'weekly' | 'monthly'
│   ├── startDate: Date             ← rolling cutoff date
│   └── endDate: Date               ← request date
├── team: { id, name, shortName, slug, primaryColor, secondaryColor, badgeUrl }
├── record:
│   ├── matchesPlayed: Int
│   ├── wins: Int
│   ├── draws: Int
│   ├── losses: Int
│   ├── goalsScored: Int
│   └── goalsConceded: Int
├── topScorer: { playerId, playerName, goals } | null
└── empty: false
```

## Aggregation Paths

```
Career Player Recap:  Player → MatchStats (where match.status=COMPLETED) → aggregate
                      Player → MatchAttendance → count(present=true) / count(*)

Match Player Recap:   Player + Match → MatchStats (single row) → direct read
                      Player + Match → MatchAttendance (single row) → direct read

Match Team Recap:     Match → MatchStats[] → sort/aggregate
                      Match → team colors/branding

Season Recap:         Season → Match[] (where status=COMPLETED) → W/D/L from isHome+scores
                      Season → Match[] → MatchStats → groupBy(playerId) → top scorers

Weekly/Monthly Recap: Team + date filter → Match[] (where date >= cutoff, status=COMPLETED)
                      Same aggregation as Season Recap
```

## Validation Rules

| Field | Rule | Applied At |
|-------|------|------------|
| `format` query param | Must be `'landscape'` or `'stories'`; default `'landscape'` | API route (Zod) |
| `theme` query param | Must be `'classic'`, `'dark'`, or `'vibrant'`; default `'classic'` | API route (Zod) |
| `matchId` query param | Must be non-empty string if provided | API route (Zod) |
| `seasonId` path param | Must resolve to existing Season | API route |
| `teamId` path param | Must resolve to existing Team | API route |
| `playerId` path param | Must resolve to existing Player | API route |
| Team colors | If `primaryColor` is null and theme is `vibrant`, fall back to `classic` | OG route logic |
| Player names | Truncate at 25 chars with ellipsis in OG image | OG render logic |

## State Transitions

No state transitions — all recaps are read-only computed views of existing data.
