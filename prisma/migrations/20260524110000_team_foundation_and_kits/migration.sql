-- Team foundation year and kit image URLs were added to the Prisma schema
-- without a corresponding migration.
ALTER TABLE "teams"
  ADD COLUMN "foundedYear" INTEGER,
  ADD COLUMN "kitHomeUrl" TEXT,
  ADD COLUMN "kitAwayUrl" TEXT,
  ADD COLUMN "kitGkUrl" TEXT;
