-- Unify defensive midfield positions into a single enum value

ALTER TYPE "PlayerPosition" ADD VALUE IF NOT EXISTS 'DEFENSIVE_MIDFIELDER';

UPDATE "players"
SET "position" = 'DEFENSIVE_MIDFIELDER'::"PlayerPosition"
WHERE "position"::text IN (
  'LEFT_DEFENSIVE_MIDFIELDER',
  'RIGHT_DEFENSIVE_MIDFIELDER'
);

UPDATE "match_position_limits"
SET "position" = 'DEFENSIVE_MIDFIELDER'::"PlayerPosition"
WHERE "position"::text IN (
  'LEFT_DEFENSIVE_MIDFIELDER',
  'RIGHT_DEFENSIVE_MIDFIELDER'
);

DELETE FROM "match_position_limits" a
USING "match_position_limits" b
WHERE a."id" < b."id"
  AND a."matchId" = b."matchId"
  AND a."position" = b."position";
