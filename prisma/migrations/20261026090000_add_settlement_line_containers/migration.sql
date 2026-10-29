-- Settlement-only additive migration: retain all containers belonging to a
-- trip, leg, or combination priced by one SettlementLine.
CREATE TABLE "SettlementLineContainer" (
    "id" TEXT NOT NULL,
    "settlementLineId" TEXT NOT NULL,
    "containerUnitId" TEXT NOT NULL,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SettlementLineContainer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SettlementLineContainer_settlementLineId_containerUnitId_key"
ON "SettlementLineContainer"("settlementLineId", "containerUnitId");

CREATE INDEX "SettlementLineContainer_containerUnitId_idx"
ON "SettlementLineContainer"("containerUnitId");

ALTER TABLE "SettlementLineContainer"
ADD CONSTRAINT "SettlementLineContainer_settlementLineId_fkey"
FOREIGN KEY ("settlementLineId") REFERENCES "SettlementLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SettlementLineContainer"
ADD CONSTRAINT "SettlementLineContainer_containerUnitId_fkey"
FOREIGN KEY ("containerUnitId") REFERENCES "ContainerUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
