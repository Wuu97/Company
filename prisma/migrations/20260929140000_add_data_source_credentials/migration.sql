CREATE TABLE "DataSourceCredential" (
  "id" TEXT NOT NULL,
  "terminal" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "ciphertext" TEXT NOT NULL,
  "iv" TEXT NOT NULL,
  "authTag" TEXT NOT NULL,
  "changedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DataSourceCredential_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "DataSourceCredential_terminal_key" ON "DataSourceCredential"("terminal");
ALTER TABLE "DataSourceCredential" ADD CONSTRAINT "DataSourceCredential_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "AppUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
