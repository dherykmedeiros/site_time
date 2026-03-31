-- AlterTable: add isHome to matches (true = team played as home side)
ALTER TABLE "matches" ADD COLUMN "isHome" BOOLEAN NOT NULL DEFAULT true;
