// ============================================================
// Recap System — TypeScript Interfaces for Recap Payloads
// specs/005-recap-overhaul/contracts/recap-types.ts
// ============================================================

// ─── Shared ────────────────────────────────────────────────

export interface RecapTeamBranding {
  id: string;
  name: string;
  shortName: string | null;
  slug: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  badgeUrl: string | null;
}

export interface RecapPlayerIdentity {
  id: string;
  name: string;
  position: string;
  photoUrl: string | null;
}

export interface RecapLeader {
  playerId: string;
  playerName: string;
  goals?: number;
  assists?: number;
}

// ─── Player Recap (Career Scope) ──────────────────────────

export interface PlayerCareerRecap {
  player: RecapPlayerIdentity;
  team: RecapTeamBranding;
  career: {
    matches: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
  attendance: {
    totalMatches: number;
    present: number;
    rate: number | null; // null if no MatchAttendance records
  };
  lastFive: {
    matches: number;
    goals: number;
    assists: number;
  };
  achievements: string[];
}

// ─── Player Recap (Match Scope) ───────────────────────────

export interface PlayerMatchRecap {
  player: RecapPlayerIdentity;
  team: RecapTeamBranding;
  match: {
    id: string;
    date: string; // ISO 8601
    opponent: string;
    isHome: boolean;
    homeScore: number;
    awayScore: number;
  };
  stats: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
  attended: boolean | null; // null if no MatchAttendance record
}

// ─── Team Recap (Match Scope) ─────────────────────────────

export interface TeamMatchRecap {
  match: {
    id: string;
    date: string; // ISO 8601
    opponent: string;
    isHome: boolean;
    opponentBadgeUrl: string | null;
    homeScore: number;
    awayScore: number;
  };
  team: RecapTeamBranding;
  totals: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    playersWithStats: number;
  };
  recentForm: {
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    matches: number;
  };
  leaders: {
    topScorer: RecapLeader | null;
    topAssistant: RecapLeader | null;
  };
}

// ─── Season Recap ─────────────────────────────────────────

export interface SeasonRecap {
  season: {
    id: string;
    name: string;
    type: string;
    startDate: string; // ISO 8601
    endDate: string | null;
    status: string;
  };
  team: RecapTeamBranding;
  record: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
    goalDifference: number;
  };
  discipline: {
    yellowCards: number;
    redCards: number;
  };
  topScorers: RecapLeader[]; // top 3, ordered by goals desc
  topAssistants: RecapLeader[]; // top 3, ordered by assists desc
  empty: false;
}

export interface SeasonRecapEmpty {
  season: {
    id: string;
    name: string;
  };
  team: RecapTeamBranding;
  empty: true;
  message: string; // "Nenhuma partida finalizada nesta temporada."
}

export type SeasonRecapResponse = SeasonRecap | SeasonRecapEmpty;

// ─── Period Recap (Weekly / Monthly) ──────────────────────

export interface PeriodRecap {
  period: {
    type: "weekly" | "monthly";
    startDate: string; // ISO 8601
    endDate: string; // ISO 8601
  };
  team: RecapTeamBranding;
  record: {
    matchesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
  };
  topScorer: RecapLeader | null;
  empty: false;
}

export interface PeriodRecapEmpty {
  period: {
    type: "weekly" | "monthly";
    startDate: string;
    endDate: string;
  };
  team: RecapTeamBranding;
  empty: true;
  message: string; // "Nenhuma partida na última semana." or "...último mês."
}

export type PeriodRecapResponse = PeriodRecap | PeriodRecapEmpty;
