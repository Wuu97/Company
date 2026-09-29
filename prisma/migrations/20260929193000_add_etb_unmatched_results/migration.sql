CREATE TABLE "EtbUnmatchedResult" (
  "id" TEXT NOT NULL,
  "queryRunId" TEXT NOT NULL,
  "carrier" TEXT NOT NULL,
  "vesselName" TEXT NOT NULL,
  "voyage" TEXT NOT NULL,
  "etbAt" TIMESTAMP(3) NOT NULL,
  "sourceUrl" TEXT,
  "screenshotStorageKey" TEXT,
  "matchNote" TEXT,
  "resolvedAt" TIMESTAMP(3),
  "resolvedSailingId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EtbUnmatchedResult_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EtbUnmatchedResult_queryRunId_createdAt_idx" ON "EtbUnmatchedResult"("queryRunId", "createdAt");
CREATE INDEX "EtbUnmatchedResult_resolvedAt_createdAt_idx" ON "EtbUnmatchedResult"("resolvedAt", "createdAt");
ALTER TABLE "EtbUnmatchedResult" ADD CONSTRAINT "EtbUnmatchedResult_queryRunId_fkey" FOREIGN KEY ("queryRunId") REFERENCES "EtbQueryRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
