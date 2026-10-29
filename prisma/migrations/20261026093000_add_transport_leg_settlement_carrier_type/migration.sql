-- Settlement-only additive field. Existing transport legs are deliberately
-- marked UNRESOLVED; no historical owner, driver, or plate data is inferred.
CREATE TYPE "SettlementCarrierType" AS ENUM ('OWN_FLEET', 'PARTNER_MONTHLY', 'TEMP_CASH', 'UNRESOLVED');

ALTER TABLE "TransportLeg"
ADD COLUMN "settlementCarrierType" "SettlementCarrierType" NOT NULL DEFAULT 'UNRESOLVED';
