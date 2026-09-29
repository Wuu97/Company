ALTER TYPE "EtbQueryRunStatus" ADD VALUE IF NOT EXISTS 'AWAITING_MANUAL';

CREATE TYPE "EtbSessionState" AS ENUM ('NOT_REQUIRED', 'ACTIVE', 'EXPIRED', 'ROBOT_VERIFICATION_REQUIRED', 'MANUAL_HANDOFF_REQUIRED');

ALTER TABLE "EtbQueryRun"
  ADD COLUMN "sessionState" "EtbSessionState" NOT NULL DEFAULT 'NOT_REQUIRED',
  ADD COLUMN "handoffReason" TEXT,
  ADD COLUMN "screenshotStorageKey" TEXT,
  ADD COLUMN "retryAfter" TIMESTAMP(3),
  ADD COLUMN "manualHandledAt" TIMESTAMP(3);

CREATE INDEX "EtbQueryRun_status_sessionState_createdAt_idx"
  ON "EtbQueryRun"("status", "sessionState", "createdAt");
