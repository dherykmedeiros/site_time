-- Link financial transactions to matches without affecting legacy rows.

ALTER TABLE "transactions"
  ADD COLUMN "matchId" TEXT;

CREATE INDEX "transactions_matchId_idx"
  ON "transactions"("matchId");

ALTER TABLE "transactions"
  ADD CONSTRAINT "transactions_matchId_fkey"
  FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;