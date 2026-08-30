-- Creates the disciplinary entities that existed in the Prisma schema before
-- the later fine-to-match migration. Keeping this migration before
-- 20260611000000 makes a fresh database and existing production history agree.

CREATE TABLE "punishment_types" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "severity" TEXT NOT NULL DEFAULT 'WARNING',
  "teamId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "punishment_types_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rules" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "severity" TEXT NOT NULL DEFAULT 'WARNING',
  "defaultMatches" INTEGER,
  "teamId" TEXT NOT NULL,
  "punishmentTypeId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "rules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "fines" (
  "id" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "ruleId" TEXT,
  "description" TEXT NOT NULL,
  "severity" TEXT NOT NULL DEFAULT 'WARNING',
  "matchesSuspended" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "date" TIMESTAMP(3) NOT NULL,
  "teamId" TEXT NOT NULL,
  "punishmentTypeId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "fines_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "punishment_accumulation_rules" (
  "id" TEXT NOT NULL,
  "teamId" TEXT NOT NULL,
  "sourceTypeId" TEXT NOT NULL,
  "accumulateCount" INTEGER NOT NULL,
  "targetTypeId" TEXT NOT NULL,
  "targetMatches" INTEGER,
  "expiryDays" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "punishment_accumulation_rules_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "punishment_types_teamId_name_key"
  ON "punishment_types"("teamId", "name");
CREATE INDEX "punishment_types_teamId_idx" ON "punishment_types"("teamId");
CREATE INDEX "rules_teamId_idx" ON "rules"("teamId");
CREATE INDEX "fines_teamId_idx" ON "fines"("teamId");
CREATE INDEX "fines_playerId_idx" ON "fines"("playerId");
CREATE INDEX "fines_ruleId_idx" ON "fines"("ruleId");
CREATE UNIQUE INDEX "punishment_accumulation_rules_teamId_sourceTypeId_key"
  ON "punishment_accumulation_rules"("teamId", "sourceTypeId");
CREATE INDEX "punishment_accumulation_rules_teamId_idx"
  ON "punishment_accumulation_rules"("teamId");

ALTER TABLE "punishment_types"
  ADD CONSTRAINT "punishment_types_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rules"
  ADD CONSTRAINT "rules_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rules"
  ADD CONSTRAINT "rules_punishmentTypeId_fkey"
  FOREIGN KEY ("punishmentTypeId") REFERENCES "punishment_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "fines"
  ADD CONSTRAINT "fines_playerId_fkey"
  FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "fines"
  ADD CONSTRAINT "fines_ruleId_fkey"
  FOREIGN KEY ("ruleId") REFERENCES "rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "fines"
  ADD CONSTRAINT "fines_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "fines"
  ADD CONSTRAINT "fines_punishmentTypeId_fkey"
  FOREIGN KEY ("punishmentTypeId") REFERENCES "punishment_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "punishment_accumulation_rules"
  ADD CONSTRAINT "punishment_accumulation_rules_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "punishment_accumulation_rules"
  ADD CONSTRAINT "punishment_accumulation_rules_sourceTypeId_fkey"
  FOREIGN KEY ("sourceTypeId") REFERENCES "punishment_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "punishment_accumulation_rules"
  ADD CONSTRAINT "punishment_accumulation_rules_targetTypeId_fkey"
  FOREIGN KEY ("targetTypeId") REFERENCES "punishment_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
