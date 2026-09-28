-- AlterTable
ALTER TABLE "SoOrder" ADD COLUMN     "customerReference" TEXT,
ADD COLUMN     "cutoffText" TEXT,
ADD COLUMN     "dischargePort" TEXT,
ADD COLUMN     "emptyPickupLocation" TEXT,
ADD COLUMN     "etaText" TEXT,
ADD COLUMN     "etdText" TEXT,
ADD COLUMN     "fullReturnLocation" TEXT,
ADD COLUMN     "loadPort" TEXT,
ADD COLUMN     "transportMode" TEXT,
ADD COLUMN     "vesselName" TEXT,
ADD COLUMN     "voyage" TEXT;
