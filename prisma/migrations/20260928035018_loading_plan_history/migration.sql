-- CreateTable
CREATE TABLE "LoadingPlanChange" (
    "id" TEXT NOT NULL,
    "fromPlanId" TEXT NOT NULL,
    "toPlanId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoadingPlanChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoadingPlanChange_fromPlanId_toPlanId_key" ON "LoadingPlanChange"("fromPlanId", "toPlanId");

-- AddForeignKey
ALTER TABLE "LoadingPlanChange" ADD CONSTRAINT "LoadingPlanChange_fromPlanId_fkey" FOREIGN KEY ("fromPlanId") REFERENCES "LoadingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingPlanChange" ADD CONSTRAINT "LoadingPlanChange_toPlanId_fkey" FOREIGN KEY ("toPlanId") REFERENCES "LoadingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
