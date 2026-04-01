-- F-015: open schedule directory foundation.

CREATE TYPE "TeamFieldType" AS ENUM (
  'GRASS',
  'SYNTHETIC',
  'FUTSAL',
  'SOCIETY',
  'OTHER'
);

CREATE TYPE "TeamCompetitiveLevel" AS ENUM (
  'CASUAL',
  'INTERMEDIATE',
  'COMPETITIVE'
);

CREATE TYPE "OpenMatchSlotStatus" AS ENUM (
  'OPEN',
  'BOOKED',
  'CLOSED'
);

ALTER TABLE "teams"
  ADD COLUMN "city" TEXT,
  ADD COLUMN "region" TEXT,
  ADD COLUMN "fieldType" "TeamFieldType",
  ADD COLUMN "competitiveLevel" "TeamCompetitiveLevel",
  ADD COLUMN "publicDirectoryOptIn" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "open_match_slots" (
  "id" TEXT NOT NULL,
  "teamId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "timeLabel" TEXT,
  "venueLabel" TEXT,
  "notes" TEXT,
  "status" "OpenMatchSlotStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "open_match_slots_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "open_match_slots_teamId_idx"
  ON "open_match_slots"("teamId");

CREATE INDEX "open_match_slots_status_date_idx"
  ON "open_match_slots"("status", "date");

CREATE INDEX "teams_city_idx"
  ON "teams"("city");

CREATE INDEX "teams_region_idx"
  ON "teams"("region");

CREATE INDEX "teams_publicDirectoryOptIn_idx"
  ON "teams"("publicDirectoryOptIn");

ALTER TABLE "open_match_slots"
  ADD CONSTRAINT "open_match_slots_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
