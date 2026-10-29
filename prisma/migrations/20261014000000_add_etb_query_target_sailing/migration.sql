ALTER TABLE "EtbQueryRun" ADD COLUMN "targetSailingId" TEXT;

ALTER TABLE "EtbQueryRun"
  ADD CONSTRAINT "EtbQueryRun_targetSailingId_fkey"
  FOREIGN KEY ("targetSailingId") REFERENCES "Sailing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "EtbQueryRun_targetSailingId_createdAt_idx"
  ON "EtbQueryRun"("targetSailingId", "createdAt");
