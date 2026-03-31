-- Add new player positions
ALTER TYPE "PlayerPosition" ADD VALUE IF NOT EXISTS 'LEFT_BACK';
ALTER TYPE "PlayerPosition" ADD VALUE IF NOT EXISTS 'RIGHT_BACK';
ALTER TYPE "PlayerPosition" ADD VALUE IF NOT EXISTS 'LEFT_DEFENSIVE_MIDFIELDER';
ALTER TYPE "PlayerPosition" ADD VALUE IF NOT EXISTS 'RIGHT_DEFENSIVE_MIDFIELDER';
ALTER TYPE "PlayerPosition" ADD VALUE IF NOT EXISTS 'LEFT_WINGER';
ALTER TYPE "PlayerPosition" ADD VALUE IF NOT EXISTS 'RIGHT_WINGER';

-- Match limits by position
CREATE TABLE "match_position_limits" (
  "id" TEXT NOT NULL,
  "matchId" TEXT NOT NULL,
  "position" "PlayerPosition" NOT NULL,
  "maxPlayers" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "match_position_limits_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "match_position_limits_matchId_position_key"
ON "match_position_limits"("matchId", "position");

CREATE INDEX "match_position_limits_matchId_idx"
ON "match_position_limits"("matchId");

ALTER TABLE "match_position_limits"
  ADD CONSTRAINT "match_position_limits_matchId_fkey"
  FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
