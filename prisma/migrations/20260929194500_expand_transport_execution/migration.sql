ALTER TABLE "TransportLeg"
  ADD COLUMN "fleetOwnerName" TEXT,
  ADD COLUMN "pickupTerminal" TEXT,
  ADD COLUMN "factoryLocation" TEXT,
  ADD COLUMN "returnTerminal" TEXT,
  ADD COLUMN "plannedPickupAt" TIMESTAMP(3),
  ADD COLUMN "actualPickupAt" TIMESTAMP(3),
  ADD COLUMN "actualFactoryArrivedAt" TIMESTAMP(3),
  ADD COLUMN "actualReturnAt" TIMESTAMP(3),
  ADD COLUMN "trailerSwapNote" TEXT,
  ADD COLUMN "overnightNote" TEXT,
  ADD COLUMN "exceptionNote" TEXT;
