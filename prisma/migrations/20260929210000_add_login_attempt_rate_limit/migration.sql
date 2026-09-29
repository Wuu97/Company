CREATE TABLE "LoginAttempt" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "failedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "LoginAttempt_email_failedAt_idx" ON "LoginAttempt"("email", "failedAt");
