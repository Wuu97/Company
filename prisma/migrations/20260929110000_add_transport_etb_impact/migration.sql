ALTER TABLE "TransportTask" ADD COLUMN "etbImpactNeedsReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "etbImpactResolvedAt" TIMESTAMP(3),
ADD COLUMN "etbImpactResolutionNote" TEXT;
CREATE INDEX "TransportTask_etbImpactNeedsReview_idx" ON "TransportTask"("etbImpactNeedsReview");
