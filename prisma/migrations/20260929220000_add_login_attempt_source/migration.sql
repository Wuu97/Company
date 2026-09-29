ALTER TABLE "LoginAttempt" ADD COLUMN "sourceKey" TEXT NOT NULL DEFAULT 'unverified-client';
CREATE INDEX "LoginAttempt_sourceKey_failedAt_idx" ON "LoginAttempt"("sourceKey", "failedAt");
