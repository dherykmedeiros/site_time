-- CreateIndex
CREATE INDEX "users_teamId_idx" ON "users"("teamId");

-- CreateIndex
CREATE INDEX "matches_teamId_date_idx" ON "matches"("teamId", "date");

-- CreateIndex
CREATE INDEX "fines_teamId_status_idx" ON "fines"("teamId", "status");

-- CreateIndex
CREATE INDEX "fines_playerId_status_idx" ON "fines"("playerId", "status");

-- CreateIndex
CREATE INDEX "team_messages_teamId_createdAt_idx" ON "team_messages"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "match_photos_teamId_createdAt_idx" ON "match_photos"("teamId", "createdAt");
