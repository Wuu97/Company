CREATE TYPE "TransportStatus" AS ENUM ('PLANNED', 'DISPATCHED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED');
ALTER TABLE "LoadingPlan" ADD COLUMN "customerConfirmationId" TEXT;
ALTER TABLE "LoadingPlan" ADD CONSTRAINT "LoadingPlan_customerConfirmationId_fkey" FOREIGN KEY ("customerConfirmationId") REFERENCES "CustomerConfirmation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE TABLE "TransportTask" (
  "id" TEXT NOT NULL, "loadingPlanId" TEXT NOT NULL, "status" "TransportStatus" NOT NULL DEFAULT 'PLANNED', "scheduledAt" TIMESTAMP(3) NOT NULL,
  "dispatchedAt" TIMESTAMP(3), "completedAt" TIMESTAMP(3), "primaryCostText" TEXT, "note" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TransportTask_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TransportTask_loadingPlanId_key" ON "TransportTask"("loadingPlanId");
CREATE INDEX "TransportTask_status_scheduledAt_idx" ON "TransportTask"("status", "scheduledAt");
CREATE TABLE "TransportLeg" (
  "id" TEXT NOT NULL, "transportTaskId" TEXT NOT NULL, "sequence" INTEGER NOT NULL, "vehicleNo" TEXT, "driverName" TEXT, "driverPhone" TEXT, "status" "TransportStatus" NOT NULL DEFAULT 'PLANNED', "note" TEXT,
  CONSTRAINT "TransportLeg_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TransportLeg_transportTaskId_sequence_key" ON "TransportLeg"("transportTaskId", "sequence");
ALTER TABLE "TransportTask" ADD CONSTRAINT "TransportTask_loadingPlanId_fkey" FOREIGN KEY ("loadingPlanId") REFERENCES "LoadingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransportLeg" ADD CONSTRAINT "TransportLeg_transportTaskId_fkey" FOREIGN KEY ("transportTaskId") REFERENCES "TransportTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
