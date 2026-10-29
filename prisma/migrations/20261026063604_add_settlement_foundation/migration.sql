/*
  Warnings:

  - You are about to drop the `E2ETestMarker` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RouteType" AS ENUM ('ONE_WAY', 'ROUND_TRIP', 'MULTI_LEG');

-- CreateEnum
CREATE TYPE "RouteAliasStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RoutePriceScope" AS ENUM ('OBJECT', 'GENERAL');

-- CreateEnum
CREATE TYPE "RoutePriceStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'DISABLED');

-- CreateEnum
CREATE TYPE "SettlementBillType" AS ENUM ('DRIVER', 'PARTNER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "BillingBasis" AS ENUM ('CONTAINER', 'TRIP', 'LEG', 'COMBINATION', 'ADHOC');

-- CreateEnum
CREATE TYPE "BillingCombination" AS ENUM ('SINGLE', 'DOUBLE_TRAILER', 'SHARED_TRAILER');

-- CreateEnum
CREATE TYPE "FeeBearer" AS ENUM ('COMPANY', 'DRIVER', 'PARTNER', 'CUSTOMER', 'THIRD_PARTY');

-- CreateEnum
CREATE TYPE "SettlementConfirmationStatus" AS ENUM ('DRAFT', 'PENDING_CONFIRMATION', 'CONFIRMED', 'ADJUSTED', 'VOIDED');

-- CreateEnum
CREATE TYPE "SettlementPaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REVERSED');

-- DropIndex
DROP INDEX "EtbQueryRun_status_sessionState_createdAt_idx";

-- DropIndex
DROP INDEX "OperationLog_actorUserId_createdAt_idx";

-- DropIndex
DROP INDEX "SoOrder_status_idx";

-- DropIndex
DROP INDEX "TransportTask_etbImpactNeedsReview_idx";

-- AlterTable
ALTER TABLE "LoginAttempt" ALTER COLUMN "sourceKey" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TransportLeg" ADD COLUMN     "driverId" TEXT,
ADD COLUMN     "fleetOwnerId" TEXT,
ADD COLUMN     "routeId" TEXT,
ADD COLUMN     "vehicleId" TEXT;

-- DropTable
DROP TABLE "E2ETestMarker";

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetOwner" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FleetOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "vehicleType" TEXT,
    "fleetOwnerId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "viaPoints" TEXT,
    "routeType" "RouteType" NOT NULL DEFAULT 'ROUND_TRIP',
    "standardKilometers" DECIMAL(12,2),
    "standardToll" DECIMAL(14,2),
    "standardFuel" DECIMAL(14,2),
    "applicableVehicleTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applicableContainerTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteAlias" (
    "id" TEXT NOT NULL,
    "routeId" TEXT,
    "rawText" TEXT NOT NULL,
    "normalizedText" TEXT NOT NULL,
    "status" "RouteAliasStatus" NOT NULL DEFAULT 'PENDING',
    "source" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "RouteAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutePrice" (
    "id" TEXT NOT NULL,
    "billType" "SettlementBillType" NOT NULL,
    "routeId" TEXT NOT NULL,
    "scope" "RoutePriceScope" NOT NULL,
    "customerId" TEXT,
    "driverId" TEXT,
    "fleetOwnerId" TEXT,
    "billingBases" "BillingBasis"[],
    "combinations" "BillingCombination"[] DEFAULT ARRAY[]::"BillingCombination"[],
    "applicableVehicleTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applicableContainerTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unitPrice" DECIMAL(14,2) NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "status" "RoutePriceStatus" NOT NULL DEFAULT 'DRAFT',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "RoutePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutePriceFee" (
    "id" TEXT NOT NULL,
    "routePriceId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "participatesInSettlement" BOOLEAN NOT NULL DEFAULT false,
    "bearer" "FeeBearer" NOT NULL,
    "includedInBaseRate" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RoutePriceFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementBill" (
    "id" TEXT NOT NULL,
    "billNo" TEXT NOT NULL,
    "billType" "SettlementBillType" NOT NULL,
    "customerId" TEXT,
    "driverId" TEXT,
    "fleetOwnerId" TEXT,
    "settlementMonth" TEXT NOT NULL,
    "confirmationStatus" "SettlementConfirmationStatus" NOT NULL DEFAULT 'DRAFT',
    "paymentStatus" "SettlementPaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "totalAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SettlementBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementLine" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "billType" "SettlementBillType" NOT NULL,
    "routeId" TEXT,
    "transportTaskId" TEXT,
    "transportLegId" TEXT,
    "containerUnitId" TEXT,
    "billingBasis" "BillingBasis" NOT NULL,
    "combination" "BillingCombination" NOT NULL DEFAULT 'SINGLE',
    "businessDate" TIMESTAMP(3) NOT NULL,
    "completionMonth" TEXT NOT NULL,
    "businessAttributionMonth" TEXT NOT NULL,
    "settlementMonth" TEXT NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unitPriceSnapshot" DECIMAL(14,2) NOT NULL,
    "amountSnapshot" DECIMAL(14,2) NOT NULL,
    "priceSnapshot" JSONB NOT NULL,
    "settlementUnitKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettlementLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementUnitClaim" (
    "id" TEXT NOT NULL,
    "settlementUnitKey" TEXT NOT NULL,
    "billType" "SettlementBillType" NOT NULL,
    "settlementObjectKey" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "releasedAt" TIMESTAMP(3),
    "releaseReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettlementUnitClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementAdjustment" (
    "id" TEXT NOT NULL,
    "settlementLineId" TEXT NOT NULL,
    "adjustmentType" TEXT NOT NULL,
    "beforeSnapshot" JSONB NOT NULL,
    "afterSnapshot" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettlementAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementPayment" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "referenceNo" TEXT,
    "note" TEXT,
    "reversedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettlementPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementPaymentAllocation" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettlementPaymentAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_code_key" ON "Driver"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FleetOwner_code_key" ON "FleetOwner"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE INDEX "Vehicle_fleetOwnerId_idx" ON "Vehicle"("fleetOwnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Route_code_key" ON "Route"("code");

-- CreateIndex
CREATE INDEX "Route_active_name_idx" ON "Route"("active", "name");

-- CreateIndex
CREATE INDEX "Route_origin_destination_idx" ON "Route"("origin", "destination");

-- CreateIndex
CREATE INDEX "RouteAlias_normalizedText_status_idx" ON "RouteAlias"("normalizedText", "status");

-- CreateIndex
CREATE INDEX "RouteAlias_routeId_status_idx" ON "RouteAlias"("routeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RouteAlias_rawText_routeId_key" ON "RouteAlias"("rawText", "routeId");

-- CreateIndex
CREATE INDEX "RoutePrice_billType_routeId_status_effectiveFrom_effectiveT_idx" ON "RoutePrice"("billType", "routeId", "status", "effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE INDEX "RoutePrice_customerId_billType_status_idx" ON "RoutePrice"("customerId", "billType", "status");

-- CreateIndex
CREATE INDEX "RoutePrice_driverId_billType_status_idx" ON "RoutePrice"("driverId", "billType", "status");

-- CreateIndex
CREATE INDEX "RoutePrice_fleetOwnerId_billType_status_idx" ON "RoutePrice"("fleetOwnerId", "billType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RoutePriceFee_routePriceId_code_key" ON "RoutePriceFee"("routePriceId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementBill_billNo_key" ON "SettlementBill"("billNo");

-- CreateIndex
CREATE INDEX "SettlementBill_billType_settlementMonth_confirmationStatus_idx" ON "SettlementBill"("billType", "settlementMonth", "confirmationStatus");

-- CreateIndex
CREATE INDEX "SettlementLine_billId_businessAttributionMonth_idx" ON "SettlementLine"("billId", "businessAttributionMonth");

-- CreateIndex
CREATE INDEX "SettlementLine_transportTaskId_idx" ON "SettlementLine"("transportTaskId");

-- CreateIndex
CREATE INDEX "SettlementLine_transportLegId_idx" ON "SettlementLine"("transportLegId");

-- CreateIndex
CREATE INDEX "SettlementLine_containerUnitId_idx" ON "SettlementLine"("containerUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementUnitClaim_lineId_key" ON "SettlementUnitClaim"("lineId");

-- CreateIndex
CREATE INDEX "SettlementUnitClaim_settlementUnitKey_releasedAt_idx" ON "SettlementUnitClaim"("settlementUnitKey", "releasedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementPaymentAllocation_paymentId_lineId_key" ON "SettlementPaymentAllocation"("paymentId", "lineId");

-- CreateIndex
CREATE INDEX "TransportLeg_driverId_idx" ON "TransportLeg"("driverId");

-- CreateIndex
CREATE INDEX "TransportLeg_fleetOwnerId_idx" ON "TransportLeg"("fleetOwnerId");

-- CreateIndex
CREATE INDEX "TransportLeg_vehicleId_idx" ON "TransportLeg"("vehicleId");

-- CreateIndex
CREATE INDEX "TransportLeg_routeId_idx" ON "TransportLeg"("routeId");

-- AddForeignKey
ALTER TABLE "TransportLeg" ADD CONSTRAINT "TransportLeg_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportLeg" ADD CONSTRAINT "TransportLeg_fleetOwnerId_fkey" FOREIGN KEY ("fleetOwnerId") REFERENCES "FleetOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportLeg" ADD CONSTRAINT "TransportLeg_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportLeg" ADD CONSTRAINT "TransportLeg_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_fleetOwnerId_fkey" FOREIGN KEY ("fleetOwnerId") REFERENCES "FleetOwner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteAlias" ADD CONSTRAINT "RouteAlias_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePrice" ADD CONSTRAINT "RoutePrice_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePrice" ADD CONSTRAINT "RoutePrice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePrice" ADD CONSTRAINT "RoutePrice_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePrice" ADD CONSTRAINT "RoutePrice_fleetOwnerId_fkey" FOREIGN KEY ("fleetOwnerId") REFERENCES "FleetOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePriceFee" ADD CONSTRAINT "RoutePriceFee_routePriceId_fkey" FOREIGN KEY ("routePriceId") REFERENCES "RoutePrice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementBill" ADD CONSTRAINT "SettlementBill_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementBill" ADD CONSTRAINT "SettlementBill_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementBill" ADD CONSTRAINT "SettlementBill_fleetOwnerId_fkey" FOREIGN KEY ("fleetOwnerId") REFERENCES "FleetOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementLine" ADD CONSTRAINT "SettlementLine_billId_fkey" FOREIGN KEY ("billId") REFERENCES "SettlementBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementLine" ADD CONSTRAINT "SettlementLine_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementLine" ADD CONSTRAINT "SettlementLine_transportTaskId_fkey" FOREIGN KEY ("transportTaskId") REFERENCES "TransportTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementLine" ADD CONSTRAINT "SettlementLine_transportLegId_fkey" FOREIGN KEY ("transportLegId") REFERENCES "TransportLeg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementLine" ADD CONSTRAINT "SettlementLine_containerUnitId_fkey" FOREIGN KEY ("containerUnitId") REFERENCES "ContainerUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementUnitClaim" ADD CONSTRAINT "SettlementUnitClaim_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "SettlementLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementAdjustment" ADD CONSTRAINT "SettlementAdjustment_settlementLineId_fkey" FOREIGN KEY ("settlementLineId") REFERENCES "SettlementLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementPayment" ADD CONSTRAINT "SettlementPayment_billId_fkey" FOREIGN KEY ("billId") REFERENCES "SettlementBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementPaymentAllocation" ADD CONSTRAINT "SettlementPaymentAllocation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "SettlementPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementPaymentAllocation" ADD CONSTRAINT "SettlementPaymentAllocation_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "SettlementLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
