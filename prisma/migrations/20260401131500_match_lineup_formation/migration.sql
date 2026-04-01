CREATE TYPE "MatchLineupFormation" AS ENUM (
  'FOUR_FOUR_TWO',
  'FOUR_THREE_THREE',
  'FOUR_TWO_THREE_ONE',
  'THREE_FIVE_TWO',
  'THREE_FOUR_THREE',
  'FIVE_THREE_TWO',
  'FOUR_ONE_FOUR_ONE'
);

ALTER TABLE "matches"
ADD COLUMN "lineupFormation" "MatchLineupFormation";