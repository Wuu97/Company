CREATE TYPE "EtbObservationStatus" AS ENUM ('PENDING', 'ADOPTED', 'IGNORED', 'SUPERSEDED');

ALTER TABLE "Sailing"
  ADD COLUMN "loadPort" TEXT,
  ADD COLUMN "adoptedEtbAt" TIMESTAMP(3),
  ADD COLUMN "adoptedEtbSource" TEXT,
  ADD COLUMN "adoptedEtbAtConfirmedAt" TIMESTAMP(3),
  ADD COLUMN "pendingEtbAt" TIMESTAMP(3),
  ADD COLUMN "pendingEtbSource" TEXT,
  ADD COLUMN "pendingEtbObservedAt" TIMESTAMP(3),
  ADD COLUMN "etbNeedsReview" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "SailingObservation" (
  "id" TEXT NOT NULL,
  "sailingId" TEXT NOT NULL,
  "etbAt" TIMESTAMP(3) NOT NULL,
  "source" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "screenshotStorageKey" TEXT,
  "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" "EtbObservationStatus" NOT NULL DEFAULT 'PENDING',
  "reviewedAt" TIMESTAMP(3),
  "reviewNote" TEXT,
  CONSTRAINT "SailingObservation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SailingObservation_sailingId_observedAt_idx" ON "SailingObservation"("sailingId", "observedAt");
CREATE INDEX "SailingObservation_status_observedAt_idx" ON "SailingObservation"("status", "observedAt");
ALTER TABLE "SailingObservation" ADD CONSTRAINT "SailingObservation_sailingId_fkey" FOREIGN KEY ("sailingId") REFERENCES "Sailing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
