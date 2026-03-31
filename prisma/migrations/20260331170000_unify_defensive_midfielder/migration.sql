-- Unify defensive midfield positions into a single enum value

ALTER TYPE "PlayerPosition" ADD VALUE IF NOT EXISTS 'DEFENSIVE_MIDFIELDER';

UPDATE "players"
SET "position" = 'DEFENSIVE_MIDFIELDER'::"PlayerPosition"
WHERE "position" IN (
  'LEFT_DEFENSIVE_MIDFIELDER'::"PlayerPosition",
  'RIGHT_DEFENSIVE_MIDFIELDER'::"PlayerPosition"
);

UPDATE "match_position_limits"
SET "position" = 'DEFENSIVE_MIDFIELDER'::"PlayerPosition"
WHERE "position" IN (
  'LEFT_DEFENSIVE_MIDFIELDER'::"PlayerPosition",
  'RIGHT_DEFENSIVE_MIDFIELDER'::"PlayerPosition"
);

DELETE FROM "match_position_limits" a
USING "match_position_limits" b
WHERE a."id" < b."id"
  AND a."matchId" = b."matchId"
  AND a."position" = b."position";
