-- Create tables for equipments if they don't exist
CREATE TABLE IF NOT EXISTS "equipments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "totalQty" INTEGER NOT NULL DEFAULT 0,
    "availableQty" INTEGER NOT NULL DEFAULT 0,
    "minQty" INTEGER NOT NULL DEFAULT 0,
    "damagedQty" INTEGER NOT NULL DEFAULT 0,
    "lostQty" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'GOOD',
    "location" TEXT,
    "notes" TEXT,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "equipment_orders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_orders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "match_equipments" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "equipmentId" TEXT,
    "name" TEXT NOT NULL,
    "quantitySent" INTEGER NOT NULL DEFAULT 0,
    "quantityReturned" INTEGER NOT NULL DEFAULT 0,
    "returned" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_equipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "equipments_teamId_idx" ON "equipments"("teamId");
CREATE INDEX IF NOT EXISTS "equipments_category_idx" ON "equipments"("category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "equipment_orders_teamId_idx" ON "equipment_orders"("teamId");
CREATE INDEX IF NOT EXISTS "equipment_orders_status_idx" ON "equipment_orders"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "match_equipments_matchId_idx" ON "match_equipments"("matchId");
CREATE INDEX IF NOT EXISTS "match_equipments_equipmentId_idx" ON "match_equipments"("equipmentId");

-- AddForeignKey
ALTER TABLE "equipments" DROP CONSTRAINT IF EXISTS "equipments_teamId_fkey";
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_orders" DROP CONSTRAINT IF EXISTS "equipment_orders_teamId_fkey";
ALTER TABLE "equipment_orders" ADD CONSTRAINT "equipment_orders_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_equipments" DROP CONSTRAINT IF EXISTS "match_equipments_matchId_fkey";
ALTER TABLE "match_equipments" ADD CONSTRAINT "match_equipments_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_equipments" DROP CONSTRAINT IF EXISTS "match_equipments_equipmentId_fkey";
ALTER TABLE "match_equipments" ADD CONSTRAINT "match_equipments_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable (for compatibility if table existed already)
ALTER TABLE "equipments" ADD COLUMN IF NOT EXISTS "minQty" INTEGER NOT NULL DEFAULT 0;

