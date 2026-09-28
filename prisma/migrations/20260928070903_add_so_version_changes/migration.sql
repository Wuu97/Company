-- CreateTable
CREATE TABLE "SoVersionChange" (
    "id" TEXT NOT NULL,
    "soOrderId" TEXT NOT NULL,
    "soFileVersionId" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "SoVersionChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SoVersionChange_soFileVersionId_key" ON "SoVersionChange"("soFileVersionId");

-- AddForeignKey
ALTER TABLE "SoVersionChange" ADD CONSTRAINT "SoVersionChange_soOrderId_fkey" FOREIGN KEY ("soOrderId") REFERENCES "SoOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoVersionChange" ADD CONSTRAINT "SoVersionChange_soFileVersionId_fkey" FOREIGN KEY ("soFileVersionId") REFERENCES "SoFileVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
