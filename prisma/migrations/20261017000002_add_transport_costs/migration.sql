CREATE TABLE "TransportCost" (
  "id" TEXT NOT NULL,
  "transportTaskId" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'CNY',
  "vendorName" TEXT,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TransportCost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TransportCost_transportTaskId_createdAt_idx" ON "TransportCost"("transportTaskId", "createdAt");
ALTER TABLE "TransportCost" ADD CONSTRAINT "TransportCost_transportTaskId_fkey" FOREIGN KEY ("transportTaskId") REFERENCES "TransportTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
