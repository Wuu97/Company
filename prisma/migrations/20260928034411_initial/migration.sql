-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BUSINESS', 'FINANCE', 'ADMIN');

-- CreateEnum
CREATE TYPE "ParseStatus" AS ENUM ('PENDING', 'PARSED', 'FAILED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'CANCELLED', 'REPLACED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ConfirmationStatus" AS ENUM ('PENDING', 'PARTIAL', 'CONFIRMED', 'DEFERRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BUSINESS',
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contactName" TEXT,
    "contactPhone" TEXT,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sailing" (
    "id" TEXT NOT NULL,
    "terminal" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "vesselName" TEXT NOT NULL,
    "voyage" TEXT NOT NULL,

    CONSTRAINT "Sailing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoOrder" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "sailingId" TEXT,
    "soNumber" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "parseStatus" "ParseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoFileVersion" (
    "id" TEXT NOT NULL,
    "soOrderId" TEXT,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "parseStatus" "ParseStatus" NOT NULL DEFAULT 'PENDING',
    "rawExtraction" JSONB,
    "correctedFields" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoFileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContainerUnit" (
    "id" TEXT NOT NULL,
    "internalCode" TEXT NOT NULL,
    "soOrderId" TEXT NOT NULL,
    "containerNo" TEXT,
    "containerType" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ContainerUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerConfirmation" (
    "id" TEXT NOT NULL,
    "soOrderId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ConfirmationStatus" NOT NULL DEFAULT 'PENDING',
    "confirmedDate" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoadingPlan" (
    "id" TEXT NOT NULL,
    "soOrderId" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "replacesPlanId" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoadingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoadingPlanItem" (
    "id" TEXT NOT NULL,
    "loadingPlanId" TEXT NOT NULL,
    "containerUnitId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LoadingPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_code_key" ON "Customer"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_customerId_name_key" ON "Factory"("customerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Sailing_terminal_carrier_vesselName_voyage_key" ON "Sailing"("terminal", "carrier", "vesselName", "voyage");

-- CreateIndex
CREATE INDEX "SoOrder_customerId_carrier_soNumber_idx" ON "SoOrder"("customerId", "carrier", "soNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SoFileVersion_storageKey_key" ON "SoFileVersion"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "SoFileVersion_sha256_key" ON "SoFileVersion"("sha256");

-- CreateIndex
CREATE UNIQUE INDEX "SoFileVersion_soOrderId_version_key" ON "SoFileVersion"("soOrderId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "ContainerUnit_internalCode_key" ON "ContainerUnit"("internalCode");

-- CreateIndex
CREATE INDEX "ContainerUnit_containerNo_idx" ON "ContainerUnit"("containerNo");

-- CreateIndex
CREATE INDEX "LoadingPlan_soOrderId_status_idx" ON "LoadingPlan"("soOrderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "LoadingPlanItem_loadingPlanId_containerUnitId_key" ON "LoadingPlanItem"("loadingPlanId", "containerUnitId");

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoOrder" ADD CONSTRAINT "SoOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoOrder" ADD CONSTRAINT "SoOrder_sailingId_fkey" FOREIGN KEY ("sailingId") REFERENCES "Sailing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoFileVersion" ADD CONSTRAINT "SoFileVersion_soOrderId_fkey" FOREIGN KEY ("soOrderId") REFERENCES "SoOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContainerUnit" ADD CONSTRAINT "ContainerUnit_soOrderId_fkey" FOREIGN KEY ("soOrderId") REFERENCES "SoOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerConfirmation" ADD CONSTRAINT "CustomerConfirmation_soOrderId_fkey" FOREIGN KEY ("soOrderId") REFERENCES "SoOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingPlan" ADD CONSTRAINT "LoadingPlan_soOrderId_fkey" FOREIGN KEY ("soOrderId") REFERENCES "SoOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingPlan" ADD CONSTRAINT "LoadingPlan_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingPlanItem" ADD CONSTRAINT "LoadingPlanItem_loadingPlanId_fkey" FOREIGN KEY ("loadingPlanId") REFERENCES "LoadingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingPlanItem" ADD CONSTRAINT "LoadingPlanItem_containerUnitId_fkey" FOREIGN KEY ("containerUnitId") REFERENCES "ContainerUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationLog" ADD CONSTRAINT "OperationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
