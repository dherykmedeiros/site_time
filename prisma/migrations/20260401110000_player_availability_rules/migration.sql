-- Add recurring availability rules for player self-service availability.

CREATE TYPE "AvailabilityFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY_OPTIONAL');
CREATE TYPE "AvailabilityLevel" AS ENUM ('AVAILABLE', 'PREFERABLE', 'UNAVAILABLE');

CREATE TABLE "player_availability_rules" (
  "id" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "dayOfWeek" INTEGER NOT NULL,
  "startMinutes" INTEGER NOT NULL,
  "endMinutes" INTEGER NOT NULL,
  "frequency" "AvailabilityFrequency" NOT NULL,
  "availability" "AvailabilityLevel" NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "player_availability_rules_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "player_availability_rules_playerId_idx"
  ON "player_availability_rules"("playerId");

CREATE INDEX "player_availability_rules_playerId_dayOfWeek_idx"
  ON "player_availability_rules"("playerId", "dayOfWeek");

ALTER TABLE "player_availability_rules"
  ADD CONSTRAINT "player_availability_rules_playerId_fkey"
  FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;