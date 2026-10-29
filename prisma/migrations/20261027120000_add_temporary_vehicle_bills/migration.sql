ALTER TYPE "SettlementBillType" ADD VALUE IF NOT EXISTS 'TEMP_VEHICLE';
ALTER TABLE "SettlementBill" ADD COLUMN "vehicleId" TEXT;
CREATE INDEX "SettlementBill_vehicleId_billType_idx" ON "SettlementBill"("vehicleId", "billType");
ALTER TABLE "SettlementBill" ADD CONSTRAINT "SettlementBill_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
