-- AlterTable
ALTER TABLE "fines" ADD COLUMN "suspendedMatchId" TEXT;

-- CreateIndex
CREATE INDEX "fines_suspendedMatchId_idx" ON "fines"("suspendedMatchId");

-- AddForeignKey
ALTER TABLE "fines" ADD CONSTRAINT "fines_suspendedMatchId_fkey" FOREIGN KEY ("suspendedMatchId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
