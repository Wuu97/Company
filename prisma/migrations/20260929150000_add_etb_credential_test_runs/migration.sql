CREATE TYPE "EtbCredentialTestStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'AWAITING_MANUAL', 'FAILED');
CREATE TABLE "EtbCredentialTestRun" (
  "id" TEXT NOT NULL,
  "terminal" TEXT NOT NULL,
  "credentialId" TEXT NOT NULL,
  "status" "EtbCredentialTestStatus" NOT NULL DEFAULT 'PENDING',
  "errorMessage" TEXT,
  "screenshotStorageKey" TEXT,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EtbCredentialTestRun_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EtbCredentialTestRun_status_createdAt_idx" ON "EtbCredentialTestRun"("status", "createdAt");
CREATE INDEX "EtbCredentialTestRun_terminal_createdAt_idx" ON "EtbCredentialTestRun"("terminal", "createdAt");
ALTER TABLE "EtbCredentialTestRun" ADD CONSTRAINT "EtbCredentialTestRun_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "DataSourceCredential"("id") ON DELETE CASCADE ON UPDATE CASCADE;
