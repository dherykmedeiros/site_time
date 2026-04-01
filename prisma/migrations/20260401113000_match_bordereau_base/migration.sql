-- Add bordereau checklist and attendance tables.

CREATE TABLE "match_checklist_items" (
  "id" TEXT NOT NULL,
  "matchId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "isChecked" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "match_checklist_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "match_attendances" (
  "id" TEXT NOT NULL,
  "matchId" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "present" BOOLEAN NOT NULL DEFAULT false,
  "checkedInAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "match_attendances_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "match_checklist_items_matchId_sortOrder_idx"
  ON "match_checklist_items"("matchId", "sortOrder");

CREATE UNIQUE INDEX "match_attendances_matchId_playerId_key"
  ON "match_attendances"("matchId", "playerId");

CREATE INDEX "match_attendances_matchId_idx"
  ON "match_attendances"("matchId");

CREATE INDEX "match_attendances_playerId_idx"
  ON "match_attendances"("playerId");

ALTER TABLE "match_checklist_items"
  ADD CONSTRAINT "match_checklist_items_matchId_fkey"
  FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "match_attendances"
  ADD CONSTRAINT "match_attendances_matchId_fkey"
  FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "match_attendances"
  ADD CONSTRAINT "match_attendances_playerId_fkey"
  FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;