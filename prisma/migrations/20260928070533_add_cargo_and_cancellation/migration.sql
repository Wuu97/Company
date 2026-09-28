-- AlterEnum
ALTER TYPE "ConfirmationStatus" ADD VALUE 'CANCELLED';

-- CreateTable
CREATE TABLE "CargoItem" (
    "id" TEXT NOT NULL,
    "soOrderId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "packagesText" TEXT,
    "weightText" TEXT,
    "volumeText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CargoItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CargoItem_soOrderId_sortOrder_idx" ON "CargoItem"("soOrderId", "sortOrder");

-- AddForeignKey
ALTER TABLE "CargoItem" ADD CONSTRAINT "CargoItem_soOrderId_fkey" FOREIGN KEY ("soOrderId") REFERENCES "SoOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
