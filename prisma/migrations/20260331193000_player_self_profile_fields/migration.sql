-- Add editable profile fields for players (self-service profile)

ALTER TABLE "players"
  ADD COLUMN "fullName" TEXT,
  ADD COLUMN "age" INTEGER,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "description" TEXT;
