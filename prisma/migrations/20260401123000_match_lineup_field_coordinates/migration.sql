-- Persist tactical board coordinates for saved lineup selections.

ALTER TABLE "match_lineup_selections"
  ADD COLUMN "fieldX" INTEGER,
  ADD COLUMN "fieldY" INTEGER;