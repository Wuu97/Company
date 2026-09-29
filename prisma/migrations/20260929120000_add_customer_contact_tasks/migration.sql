CREATE TYPE "ContactTaskStatus" AS ENUM ('OPEN', 'COMPLETED', 'CANCELLED');
CREATE TABLE "CustomerContactTask" (
  "id" TEXT NOT NULL, "soOrderId" TEXT NOT NULL, "dueAt" TIMESTAMP(3) NOT NULL, "status" "ContactTaskStatus" NOT NULL DEFAULT 'OPEN', "note" TEXT, "completedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CustomerContactTask_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CustomerContactTask_soOrderId_dueAt_key" ON "CustomerContactTask"("soOrderId", "dueAt");
CREATE INDEX "CustomerContactTask_status_dueAt_idx" ON "CustomerContactTask"("status", "dueAt");
ALTER TABLE "CustomerContactTask" ADD CONSTRAINT "CustomerContactTask_soOrderId_fkey" FOREIGN KEY ("soOrderId") REFERENCES "SoOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
