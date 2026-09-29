ALTER TABLE "OperationLog" ADD COLUMN "actorUserId" TEXT, ADD COLUMN "actorName" TEXT, ADD COLUMN "actorRole" "AppRole";
CREATE INDEX "OperationLog_actorUserId_createdAt_idx" ON "OperationLog"("actorUserId", "createdAt");
