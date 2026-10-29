CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'COMPLETED', 'NOT_REQUIRED');

CREATE TABLE "OrderMilestone" (
  "id" TEXT NOT NULL,
  "soOrderId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
  "note" TEXT,
  "completedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OrderMilestone_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OrderMilestone_soOrderId_type_key" ON "OrderMilestone"("soOrderId", "type");
CREATE INDEX "OrderMilestone_status_updatedAt_idx" ON "OrderMilestone"("status", "updatedAt");
ALTER TABLE "OrderMilestone" ADD CONSTRAINT "OrderMilestone_soOrderId_fkey" FOREIGN KEY ("soOrderId") REFERENCES "SoOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
