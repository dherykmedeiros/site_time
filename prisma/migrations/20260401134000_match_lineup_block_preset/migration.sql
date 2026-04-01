CREATE TYPE "MatchLineupBlockPreset" AS ENUM (
  'DEEP',
  'BALANCED',
  'HIGH'
);

ALTER TABLE "matches"
ADD COLUMN "lineupBlockPreset" "MatchLineupBlockPreset";
