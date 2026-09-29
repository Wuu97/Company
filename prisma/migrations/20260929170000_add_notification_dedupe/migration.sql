ALTER TABLE "AppNotification" ADD COLUMN "dedupeKey" TEXT;
CREATE UNIQUE INDEX "AppNotification_userId_dedupeKey_key" ON "AppNotification"("userId", "dedupeKey");
