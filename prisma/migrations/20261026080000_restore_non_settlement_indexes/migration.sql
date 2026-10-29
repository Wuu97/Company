-- Restore indexes that were unintentionally removed while applying the
-- settlement foundation migration. Definitions match their original migrations.
CREATE INDEX IF NOT EXISTS "EtbQueryRun_status_sessionState_createdAt_idx"
  ON "EtbQueryRun"("status", "sessionState", "createdAt");

CREATE INDEX IF NOT EXISTS "OperationLog_actorUserId_createdAt_idx"
  ON "OperationLog"("actorUserId", "createdAt");

CREATE INDEX IF NOT EXISTS "SoOrder_status_idx"
  ON "SoOrder"("status");

CREATE INDEX IF NOT EXISTS "TransportTask_etbImpactNeedsReview_idx"
  ON "TransportTask"("etbImpactNeedsReview");
