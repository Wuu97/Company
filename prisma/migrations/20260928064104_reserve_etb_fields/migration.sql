-- AlterTable
ALTER TABLE "SoOrder" ADD COLUMN     "etbNeedsReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "etbObservedAt" TIMESTAMP(3),
ADD COLUMN     "etbSource" TEXT,
ADD COLUMN     "etbText" TEXT;
