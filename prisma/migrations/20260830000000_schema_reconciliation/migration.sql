-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "MatchLiveStatus" AS ENUM ('NOT_STARTED', 'FIRST_HALF', 'HALF_TIME', 'SECOND_HALF', 'FINISHED');

-- CreateEnum
CREATE TYPE "LiveEventType" AS ENUM ('GOAL', 'ASSIST', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION');

-- AlterEnum
ALTER TYPE "MatchLineupFormation" ADD VALUE 'FIVE_FOUR_ONE';

-- AlterEnum
BEGIN;
CREATE TYPE "PlayerPosition_new" AS ENUM ('GOALKEEPER', 'DEFENDER', 'LEFT_BACK', 'RIGHT_BACK', 'LEFT_WINGBACK', 'RIGHT_WINGBACK', 'MIDFIELDER', 'DEFENSIVE_MIDFIELDER', 'FORWARD', 'LEFT_WINGER', 'RIGHT_WINGER');
ALTER TABLE "players" ALTER COLUMN "position" TYPE "PlayerPosition_new" USING ("position"::text::"PlayerPosition_new");
ALTER TABLE "players" ALTER COLUMN "secondaryPosition" TYPE "PlayerPosition_new" USING ("secondaryPosition"::text::"PlayerPosition_new");
ALTER TABLE "match_position_limits" ALTER COLUMN "position" TYPE "PlayerPosition_new" USING ("position"::text::"PlayerPosition_new");
ALTER TABLE "guest_players" ALTER COLUMN "position" TYPE "PlayerPosition_new" USING ("position"::text::"PlayerPosition_new");
ALTER TYPE "PlayerPosition" RENAME TO "PlayerPosition_old";
ALTER TYPE "PlayerPosition_new" RENAME TO "PlayerPosition";
DROP TYPE "public"."PlayerPosition_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'COACH';
ALTER TYPE "Role" ADD VALUE 'MATERIAL_DIRECTOR';

-- AlterEnum
ALTER TYPE "TransactionCategory" ADD VALUE 'MATCH_FEE';

-- DropForeignKey
ALTER TABLE "achievements" DROP CONSTRAINT "achievements_playerId_fkey";

-- DropForeignKey
ALTER TABLE "friendly_requests" DROP CONSTRAINT "friendly_requests_teamId_fkey";

-- DropForeignKey
ALTER TABLE "invite_tokens" DROP CONSTRAINT "invite_tokens_playerId_fkey";

-- DropForeignKey
ALTER TABLE "invite_tokens" DROP CONSTRAINT "invite_tokens_teamId_fkey";

-- DropForeignKey
ALTER TABLE "match_stats" DROP CONSTRAINT "match_stats_matchId_fkey";

-- DropForeignKey
ALTER TABLE "match_stats" DROP CONSTRAINT "match_stats_playerId_fkey";

-- DropForeignKey
ALTER TABLE "membership_payments" DROP CONSTRAINT "membership_payments_playerId_fkey";

-- DropForeignKey
ALTER TABLE "membership_payments" DROP CONSTRAINT "membership_payments_teamId_fkey";

-- DropForeignKey
ALTER TABLE "rsvps" DROP CONSTRAINT "rsvps_matchId_fkey";

-- DropForeignKey
ALTER TABLE "rsvps" DROP CONSTRAINT "rsvps_playerId_fkey";

-- DropForeignKey
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_teamId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_teamId_fkey";

-- DropIndex
DROP INDEX "match_stats_playerId_matchId_key";

-- DropIndex
DROP INDEX "teams_city_idx";

-- DropIndex
DROP INDEX "teams_publicDirectoryOptIn_idx";

-- DropIndex
DROP INDEX "teams_region_idx";

-- AlterTable
ALTER TABLE "achievements" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "friendly_requests" ADD COLUMN     "requesterTeamId" TEXT,
ALTER COLUMN "proposedFee" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "invite_tokens" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "match_lineup_selections" ADD COLUMN     "guestPlayerId" TEXT,
ALTER COLUMN "playerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "match_position_limits" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "match_stats" ADD COLUMN     "guestPlayerId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "playerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "chargeAmount" DECIMAL(10,2),
ADD COLUMN     "coachPlayerBId" TEXT,
ADD COLUMN     "coachPlayerId" TEXT,
ADD COLUMN     "hasCharge" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pixKey" TEXT,
ADD COLUMN     "requiresDocumentDetails" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "membership_payments" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "secondaryPosition" "PlayerPosition";

-- AlterTable
ALTER TABLE "rsvps" ADD COLUMN     "summoned" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "defaultBlockPreset" "MatchLineupBlockPreset",
ADD COLUMN     "defaultFormation" "MatchLineupFormation",
ADD COLUMN     "defaultPositionLimits" JSONB,
ADD COLUMN     "defaultPositionLimitsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "monthlyFeesEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PAID',
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "rsvp_status_logs" (
    "id" TEXT NOT NULL,
    "rsvpId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "oldStatus" "RSVPStatus",
    "newStatus" "RSVPStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvp_status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_payments" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PAID',
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_evaluations" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "technical" INTEGER NOT NULL DEFAULT 3,
    "tactical" INTEGER NOT NULL DEFAULT 3,
    "physical" INTEGER NOT NULL DEFAULT 3,
    "discipline" INTEGER NOT NULL DEFAULT 3,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_player_ratings" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "raterId" TEXT NOT NULL,
    "ratedId" TEXT,
    "ratedGuestId" TEXT,
    "stars" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_player_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "default_lineup_selections" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "role" "MatchLineupRole" NOT NULL DEFAULT 'STARTER',
    "sortOrder" INTEGER NOT NULL,
    "fieldX" INTEGER,
    "fieldY" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "default_lineup_selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_lives" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "liveStatus" "MatchLiveStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "homeScore" INTEGER NOT NULL DEFAULT 0,
    "awayScore" INTEGER NOT NULL DEFAULT 0,
    "firstHalfStart" TIMESTAMP(3),
    "firstHalfEnd" TIMESTAMP(3),
    "secondHalfStart" TIMESTAMP(3),
    "secondHalfEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_lives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_live_events" (
    "id" TEXT NOT NULL,
    "matchLiveId" TEXT NOT NULL,
    "type" "LiveEventType" NOT NULL,
    "minute" INTEGER NOT NULL,
    "half" INTEGER NOT NULL,
    "playerId" TEXT,
    "guestPlayerId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_live_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT,
    "shirtNumber" INTEGER,
    "position" "PlayerPosition",
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guest_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_votes" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "votedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tactical_plays" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'CORNER_KICK',
    "movements" JSONB NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tactical_plays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_events" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "visibility" TEXT NOT NULL DEFAULT 'ALL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "teamId" TEXT,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "targetId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_coach_reports" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "coachPlayerId" TEXT,
    "coachPlayerBId" TEXT,
    "summary" TEXT,
    "formation" TEXT,
    "starterPlayerIds" JSONB,
    "substitutions" JSONB,
    "startingStrategy" TEXT,
    "substitutionsNotes" TEXT,
    "strengths" TEXT,
    "improvements" TEXT,
    "summaryB" TEXT,
    "formationB" TEXT,
    "starterPlayerIdsB" JSONB,
    "substitutionsB" JSONB,
    "startingStrategyB" TEXT,
    "substitutionsNotesB" TEXT,
    "strengthsB" TEXT,
    "improvementsB" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_coach_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_coach_evaluations" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "playerId" TEXT,
    "guestPlayerId" TEXT,
    "teamSide" TEXT DEFAULT 'A',
    "rating" INTEGER NOT NULL DEFAULT 5,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_coach_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rsvp_status_logs_rsvpId_idx" ON "rsvp_status_logs"("rsvpId");

-- CreateIndex
CREATE INDEX "rsvp_status_logs_playerId_idx" ON "rsvp_status_logs"("playerId");

-- CreateIndex
CREATE INDEX "rsvp_status_logs_matchId_idx" ON "rsvp_status_logs"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "match_payments_transactionId_key" ON "match_payments"("transactionId");

-- CreateIndex
CREATE INDEX "match_payments_matchId_idx" ON "match_payments"("matchId");

-- CreateIndex
CREATE INDEX "match_payments_teamId_idx" ON "match_payments"("teamId");

-- CreateIndex
CREATE INDEX "match_payments_playerId_idx" ON "match_payments"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "match_payments_playerId_matchId_key" ON "match_payments"("playerId", "matchId");

-- CreateIndex
CREATE INDEX "player_evaluations_playerId_idx" ON "player_evaluations"("playerId");

-- CreateIndex
CREATE INDEX "player_evaluations_evaluatorId_idx" ON "player_evaluations"("evaluatorId");

-- CreateIndex
CREATE INDEX "player_evaluations_teamId_idx" ON "player_evaluations"("teamId");

-- CreateIndex
CREATE INDEX "match_player_ratings_matchId_idx" ON "match_player_ratings"("matchId");

-- CreateIndex
CREATE INDEX "match_player_ratings_raterId_idx" ON "match_player_ratings"("raterId");

-- CreateIndex
CREATE INDEX "match_player_ratings_ratedId_idx" ON "match_player_ratings"("ratedId");

-- CreateIndex
CREATE INDEX "match_player_ratings_ratedGuestId_idx" ON "match_player_ratings"("ratedGuestId");

-- CreateIndex
CREATE UNIQUE INDEX "match_player_ratings_matchId_raterId_ratedId_key" ON "match_player_ratings"("matchId", "raterId", "ratedId");

-- CreateIndex
CREATE UNIQUE INDEX "match_player_ratings_matchId_raterId_ratedGuestId_key" ON "match_player_ratings"("matchId", "raterId", "ratedGuestId");

-- CreateIndex
CREATE INDEX "default_lineup_selections_teamId_role_sortOrder_idx" ON "default_lineup_selections"("teamId", "role", "sortOrder");

-- CreateIndex
CREATE INDEX "default_lineup_selections_playerId_idx" ON "default_lineup_selections"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "default_lineup_selections_teamId_playerId_key" ON "default_lineup_selections"("teamId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "match_lives_matchId_key" ON "match_lives"("matchId");

-- CreateIndex
CREATE INDEX "match_lives_matchId_idx" ON "match_lives"("matchId");

-- CreateIndex
CREATE INDEX "match_live_events_matchLiveId_idx" ON "match_live_events"("matchLiveId");

-- CreateIndex
CREATE INDEX "match_live_events_playerId_idx" ON "match_live_events"("playerId");

-- CreateIndex
CREATE INDEX "match_live_events_guestPlayerId_idx" ON "match_live_events"("guestPlayerId");

-- CreateIndex
CREATE INDEX "guest_players_matchId_idx" ON "guest_players"("matchId");

-- CreateIndex
CREATE INDEX "guest_players_teamId_idx" ON "guest_players"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "guest_players_matchId_name_key" ON "guest_players"("matchId", "name");

-- CreateIndex
CREATE INDEX "match_votes_matchId_idx" ON "match_votes"("matchId");

-- CreateIndex
CREATE INDEX "match_votes_votedId_idx" ON "match_votes"("votedId");

-- CreateIndex
CREATE UNIQUE INDEX "match_votes_matchId_voterId_key" ON "match_votes"("matchId", "voterId");

-- CreateIndex
CREATE INDEX "tactical_plays_teamId_idx" ON "tactical_plays"("teamId");

-- CreateIndex
CREATE INDEX "activity_events_teamId_idx" ON "activity_events"("teamId");

-- CreateIndex
CREATE INDEX "activity_events_teamId_createdAt_idx" ON "activity_events"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX "activity_events_teamId_visibility_idx" ON "activity_events"("teamId", "visibility");

-- CreateIndex
CREATE INDEX "audit_logs_teamId_idx" ON "audit_logs"("teamId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "notification_preferences_userId_idx" ON "notification_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_category_key" ON "notification_preferences"("userId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "match_coach_reports_matchId_key" ON "match_coach_reports"("matchId");

-- CreateIndex
CREATE INDEX "match_coach_reports_coachPlayerId_idx" ON "match_coach_reports"("coachPlayerId");

-- CreateIndex
CREATE INDEX "match_coach_reports_coachPlayerBId_idx" ON "match_coach_reports"("coachPlayerBId");

-- CreateIndex
CREATE INDEX "match_coach_evaluations_reportId_idx" ON "match_coach_evaluations"("reportId");

-- CreateIndex
CREATE INDEX "match_coach_evaluations_playerId_idx" ON "match_coach_evaluations"("playerId");

-- CreateIndex
CREATE INDEX "match_coach_evaluations_guestPlayerId_idx" ON "match_coach_evaluations"("guestPlayerId");

-- CreateIndex
CREATE INDEX "match_coach_evaluations_teamSide_idx" ON "match_coach_evaluations"("teamSide");

-- CreateIndex
CREATE UNIQUE INDEX "match_coach_evaluations_reportId_playerId_key" ON "match_coach_evaluations"("reportId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "match_coach_evaluations_reportId_guestPlayerId_key" ON "match_coach_evaluations"("reportId", "guestPlayerId");

-- CreateIndex
CREATE INDEX "achievements_playerId_idx" ON "achievements"("playerId");

-- CreateIndex
CREATE INDEX "achievements_matchId_idx" ON "achievements"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_playerId_type_matchId_key" ON "achievements"("playerId", "type", "matchId");

-- CreateIndex
CREATE INDEX "friendly_requests_teamId_idx" ON "friendly_requests"("teamId");

-- CreateIndex
CREATE INDEX "friendly_requests_requesterTeamId_idx" ON "friendly_requests"("requesterTeamId");

-- CreateIndex
CREATE INDEX "friendly_requests_teamId_status_idx" ON "friendly_requests"("teamId", "status");

-- CreateIndex
CREATE INDEX "invite_tokens_teamId_idx" ON "invite_tokens"("teamId");

-- CreateIndex
CREATE INDEX "invite_tokens_playerId_idx" ON "invite_tokens"("playerId");

-- CreateIndex
CREATE INDEX "match_lineup_selections_guestPlayerId_idx" ON "match_lineup_selections"("guestPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "match_lineup_selections_matchId_guestPlayerId_key" ON "match_lineup_selections"("matchId", "guestPlayerId");

-- CreateIndex
CREATE INDEX "match_stats_matchId_idx" ON "match_stats"("matchId");

-- CreateIndex
CREATE INDEX "match_stats_playerId_idx" ON "match_stats"("playerId");

-- CreateIndex
CREATE INDEX "match_stats_guestPlayerId_idx" ON "match_stats"("guestPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "match_stats_playerId_matchId_guestPlayerId_key" ON "match_stats"("playerId", "matchId", "guestPlayerId");

-- CreateIndex
CREATE INDEX "matches_teamId_idx" ON "matches"("teamId");

-- CreateIndex
CREATE INDEX "matches_seasonId_idx" ON "matches"("seasonId");

-- CreateIndex
CREATE INDEX "matches_coachPlayerId_idx" ON "matches"("coachPlayerId");

-- CreateIndex
CREATE INDEX "matches_coachPlayerBId_idx" ON "matches"("coachPlayerBId");

-- CreateIndex
CREATE INDEX "matches_teamId_status_idx" ON "matches"("teamId", "status");

-- CreateIndex
CREATE INDEX "membership_payments_teamId_idx" ON "membership_payments"("teamId");

-- CreateIndex
CREATE INDEX "membership_payments_playerId_teamId_idx" ON "membership_payments"("playerId", "teamId");

-- CreateIndex
CREATE INDEX "membership_payments_year_month_idx" ON "membership_payments"("year", "month");

-- CreateIndex
CREATE INDEX "players_teamId_status_idx" ON "players"("teamId", "status");

-- CreateIndex
CREATE INDEX "rsvps_matchId_idx" ON "rsvps"("matchId");

-- CreateIndex
CREATE INDEX "rsvps_matchId_status_idx" ON "rsvps"("matchId", "status");

-- CreateIndex
CREATE INDEX "seasons_teamId_idx" ON "seasons"("teamId");

-- CreateIndex
CREATE INDEX "seasons_teamId_status_idx" ON "seasons"("teamId", "status");

-- CreateIndex
CREATE INDEX "team_message_reactions_messageId_idx" ON "team_message_reactions"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_externalId_key" ON "transactions"("externalId");

-- CreateIndex
CREATE INDEX "transactions_teamId_idx" ON "transactions"("teamId");

-- CreateIndex
CREATE INDEX "transactions_teamId_date_idx" ON "transactions"("teamId", "date");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_coachPlayerId_fkey" FOREIGN KEY ("coachPlayerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_coachPlayerBId_fkey" FOREIGN KEY ("coachPlayerBId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_lineup_selections" ADD CONSTRAINT "match_lineup_selections_guestPlayerId_fkey" FOREIGN KEY ("guestPlayerId") REFERENCES "guest_players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_status_logs" ADD CONSTRAINT "rsvp_status_logs_rsvpId_fkey" FOREIGN KEY ("rsvpId") REFERENCES "rsvps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_status_logs" ADD CONSTRAINT "rsvp_status_logs_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_status_logs" ADD CONSTRAINT "rsvp_status_logs_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_guestPlayerId_fkey" FOREIGN KEY ("guestPlayerId") REFERENCES "guest_players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendly_requests" ADD CONSTRAINT "friendly_requests_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendly_requests" ADD CONSTRAINT "friendly_requests_requesterTeamId_fkey" FOREIGN KEY ("requesterTeamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_payments" ADD CONSTRAINT "membership_payments_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_payments" ADD CONSTRAINT "membership_payments_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_payments" ADD CONSTRAINT "match_payments_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_payments" ADD CONSTRAINT "match_payments_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_payments" ADD CONSTRAINT "match_payments_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_payments" ADD CONSTRAINT "match_payments_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_evaluations" ADD CONSTRAINT "player_evaluations_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_evaluations" ADD CONSTRAINT "player_evaluations_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_evaluations" ADD CONSTRAINT "player_evaluations_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_player_ratings" ADD CONSTRAINT "match_player_ratings_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_player_ratings" ADD CONSTRAINT "match_player_ratings_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_player_ratings" ADD CONSTRAINT "match_player_ratings_ratedId_fkey" FOREIGN KEY ("ratedId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_player_ratings" ADD CONSTRAINT "match_player_ratings_ratedGuestId_fkey" FOREIGN KEY ("ratedGuestId") REFERENCES "guest_players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "default_lineup_selections" ADD CONSTRAINT "default_lineup_selections_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "default_lineup_selections" ADD CONSTRAINT "default_lineup_selections_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_lives" ADD CONSTRAINT "match_lives_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_live_events" ADD CONSTRAINT "match_live_events_matchLiveId_fkey" FOREIGN KEY ("matchLiveId") REFERENCES "match_lives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_live_events" ADD CONSTRAINT "match_live_events_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_live_events" ADD CONSTRAINT "match_live_events_guestPlayerId_fkey" FOREIGN KEY ("guestPlayerId") REFERENCES "guest_players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_players" ADD CONSTRAINT "guest_players_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_players" ADD CONSTRAINT "guest_players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_votes" ADD CONSTRAINT "match_votes_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_votes" ADD CONSTRAINT "match_votes_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_votes" ADD CONSTRAINT "match_votes_votedId_fkey" FOREIGN KEY ("votedId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tactical_plays" ADD CONSTRAINT "tactical_plays_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tactical_plays" ADD CONSTRAINT "tactical_plays_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_coach_reports" ADD CONSTRAINT "match_coach_reports_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_coach_reports" ADD CONSTRAINT "match_coach_reports_coachPlayerId_fkey" FOREIGN KEY ("coachPlayerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_coach_reports" ADD CONSTRAINT "match_coach_reports_coachPlayerBId_fkey" FOREIGN KEY ("coachPlayerBId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_coach_evaluations" ADD CONSTRAINT "match_coach_evaluations_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "match_coach_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_coach_evaluations" ADD CONSTRAINT "match_coach_evaluations_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_coach_evaluations" ADD CONSTRAINT "match_coach_evaluations_guestPlayerId_fkey" FOREIGN KEY ("guestPlayerId") REFERENCES "guest_players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
