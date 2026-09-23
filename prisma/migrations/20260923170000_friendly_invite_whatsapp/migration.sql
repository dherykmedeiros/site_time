ALTER TABLE "teams"
ADD COLUMN "friendlyInviteWhatsapp" TEXT;

ALTER TABLE "friendly_requests"
ALTER COLUMN "contactEmail" DROP NOT NULL;
