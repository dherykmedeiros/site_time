ALTER TABLE "teams"
  ADD COLUMN "friendlyInvitesEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "friendlyInviteMinNoticeDays" INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN "friendlyInviteMaxAdvanceDays" INTEGER NOT NULL DEFAULT 90,
  ADD COLUMN "friendlyInviteBufferBeforeDays" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "friendlyInviteBufferAfterDays" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "friendlyInviteAllowedWeekdays" JSONB NOT NULL DEFAULT '[0,1,2,3,4,5,6]'::jsonb;

ALTER TABLE "friendly_requests"
  ADD COLUMN "requestedDate" TIMESTAMP(3);

CREATE INDEX "friendly_requests_teamId_requestedDate_idx"
  ON "friendly_requests"("teamId", "requestedDate");
