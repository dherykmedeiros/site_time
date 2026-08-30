-- Communication and engagement models were added before the later performance
-- indexes migration, but their creation migration was missing.

CREATE TABLE "team_messages" (
  "id" TEXT NOT NULL,
  "teamId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "pinned" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "team_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "team_message_reactions" (
  "id" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "emoji" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "team_message_reactions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "date_polls" (
  "id" TEXT NOT NULL,
  "teamId" TEXT NOT NULL,
  "matchId" TEXT,
  "title" TEXT NOT NULL,
  "closedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "date_polls_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "date_poll_options" (
  "id" TEXT NOT NULL,
  "pollId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "label" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "date_poll_options_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "date_poll_votes" (
  "id" TEXT NOT NULL,
  "optionId" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "date_poll_votes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "teamId" TEXT,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "link" TEXT,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "readAt" TIMESTAMP(3),
  "metadata" JSONB,
  "entityType" TEXT,
  "entityId" TEXT,
  "category" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "match_photos" (
  "id" TEXT NOT NULL,
  "matchId" TEXT,
  "teamId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "caption" TEXT,
  "uploadedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "match_photos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "recruitment_requests" (
  "id" TEXT NOT NULL,
  "teamId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "contact" TEXT NOT NULL,
  "position" TEXT,
  "message" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "recruitment_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "team_message_reactions_messageId_userId_emoji_key" ON "team_message_reactions"("messageId", "userId", "emoji");
CREATE INDEX "team_messages_teamId_idx" ON "team_messages"("teamId");
CREATE INDEX "team_messages_teamId_pinned_idx" ON "team_messages"("teamId", "pinned");
CREATE UNIQUE INDEX "date_polls_matchId_key" ON "date_polls"("matchId");
CREATE INDEX "date_polls_teamId_idx" ON "date_polls"("teamId");
CREATE INDEX "date_poll_options_pollId_idx" ON "date_poll_options"("pollId");
CREATE UNIQUE INDEX "date_poll_votes_optionId_playerId_key" ON "date_poll_votes"("optionId", "playerId");
CREATE INDEX "date_poll_votes_optionId_idx" ON "date_poll_votes"("optionId");
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");
CREATE INDEX "notifications_teamId_idx" ON "notifications"("teamId");
CREATE INDEX "match_photos_teamId_idx" ON "match_photos"("teamId");
CREATE INDEX "match_photos_matchId_idx" ON "match_photos"("matchId");
CREATE INDEX "recruitment_requests_teamId_idx" ON "recruitment_requests"("teamId");

ALTER TABLE "team_messages" ADD CONSTRAINT "team_messages_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "team_messages" ADD CONSTRAINT "team_messages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "team_message_reactions" ADD CONSTRAINT "team_message_reactions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "team_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "team_message_reactions" ADD CONSTRAINT "team_message_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "date_polls" ADD CONSTRAINT "date_polls_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "date_polls" ADD CONSTRAINT "date_polls_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "date_poll_options" ADD CONSTRAINT "date_poll_options_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "date_polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "date_poll_votes" ADD CONSTRAINT "date_poll_votes_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "date_poll_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "date_poll_votes" ADD CONSTRAINT "date_poll_votes_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "match_photos" ADD CONSTRAINT "match_photos_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "match_photos" ADD CONSTRAINT "match_photos_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "match_photos" ADD CONSTRAINT "match_photos_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recruitment_requests" ADD CONSTRAINT "recruitment_requests_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
