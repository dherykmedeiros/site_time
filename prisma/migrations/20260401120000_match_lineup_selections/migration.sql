-- Persist manual lineup selections per match.

CREATE TYPE "MatchLineupRole" AS ENUM ('STARTER', 'BENCH');

CREATE TABLE "match_lineup_selections" (
  "id" TEXT NOT NULL,
  "matchId" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "role" "MatchLineupRole" NOT NULL,
  "sortOrder" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "match_lineup_selections_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "match_lineup_selections_matchId_playerId_key"
  ON "match_lineup_selections"("matchId", "playerId");

CREATE INDEX "match_lineup_selections_matchId_role_sortOrder_idx"
  ON "match_lineup_selections"("matchId", "role", "sortOrder");

CREATE INDEX "match_lineup_selections_playerId_idx"
  ON "match_lineup_selections"("playerId");

ALTER TABLE "match_lineup_selections"
  ADD CONSTRAINT "match_lineup_selections_matchId_fkey"
  FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "match_lineup_selections"
  ADD CONSTRAINT "match_lineup_selections_playerId_fkey"
  FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;