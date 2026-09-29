CREATE TYPE "EtbQueryRunStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED');
CREATE TABLE "EtbQueryRun" (
  "id" TEXT NOT NULL, "terminal" TEXT NOT NULL, "source" TEXT NOT NULL, "scheduledFor" TIMESTAMP(3) NOT NULL,
  "startedAt" TIMESTAMP(3), "finishedAt" TIMESTAMP(3), "status" "EtbQueryRunStatus" NOT NULL DEFAULT 'PENDING',
  "resultCount" INTEGER NOT NULL DEFAULT 0, "errorMessage" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EtbQueryRun_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EtbQueryRun_terminal_scheduledFor_idx" ON "EtbQueryRun"("terminal", "scheduledFor");
CREATE INDEX "EtbQueryRun_status_createdAt_idx" ON "EtbQueryRun"("status", "createdAt");
