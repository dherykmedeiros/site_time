-- CreateIndex
CREATE INDEX IF NOT EXISTS "users_teamId_idx" ON "users"("teamId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "matches_teamId_date_idx" ON "matches"("teamId", "date");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fines_teamId_status_idx" ON "fines"("teamId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "fines_playerId_status_idx" ON "fines"("playerId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "team_messages_teamId_createdAt_idx" ON "team_messages"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "match_photos_teamId_createdAt_idx" ON "match_photos"("teamId", "createdAt");
