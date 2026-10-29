-- The settlement unit identity intentionally excludes completion, business-attribution,
-- and settlement months. A released claim remains as an audit record while allowing
-- a controlled re-settlement to reserve the same stable business unit.
CREATE UNIQUE INDEX "SettlementUnitClaim_active_business_unit_key"
ON "SettlementUnitClaim" ("settlementUnitKey", "billType", "settlementObjectKey")
WHERE "releasedAt" IS NULL;
