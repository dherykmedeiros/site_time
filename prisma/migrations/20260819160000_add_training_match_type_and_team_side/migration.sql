-- AlterEnum
ALTER TYPE "MatchType" ADD VALUE IF NOT EXISTS 'TRAINING';

-- AlterTable
ALTER TABLE "match_lineup_selections" ADD COLUMN IF NOT EXISTS "teamSide" TEXT DEFAULT 'A';
