-- Driver pay templates are maintained by factory + route + container type.
-- The nullable field is intentionally additive so existing general rates remain valid.
ALTER TABLE "RoutePrice" ADD COLUMN "factoryId" TEXT;
CREATE INDEX "RoutePrice_factoryId_billType_status_idx" ON "RoutePrice"("factoryId", "billType", "status");
ALTER TABLE "RoutePrice" ADD CONSTRAINT "RoutePrice_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
