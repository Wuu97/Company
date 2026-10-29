import { prisma } from "@/lib/prisma";
import { matchRoutePrice } from "./settlement-pricing";
import type { PriceMatchRequest, PriceMatchResult, RoutePriceRate } from "./settlement-domain";

type Database = Pick<typeof prisma, "routePrice" | "route">;

/** Database adapter: it deliberately returns the domain service's explicit result codes. */
export async function matchRoutePriceFromDatabase(db: Database, input: PriceMatchRequest): Promise<PriceMatchResult> {
  const route = await db.route.findUnique({ where: { code: input.routeCode }, select: { id: true } });
  if (!route) return { status: "PRICE_MISSING", reason: "路线不存在或已无法识别" };
  const objectFilter = input.billType === "DRIVER" ? { driverId: input.settlementObjectId } : input.billType === "PARTNER" ? { fleetOwnerId: input.settlementObjectId } : { customerId: input.settlementObjectId };
  const rows = await db.routePrice.findMany({
    where: {
      routeId: route.id, billType: input.billType, status: { in: ["CONFIRMED", "DRAFT"] },
      effectiveFrom: { lte: new Date(`${input.businessDate}T23:59:59.999Z`) },
      OR: [{ effectiveTo: null }, { effectiveTo: { gte: new Date(`${input.businessDate}T00:00:00.000Z`) } }],
      AND: [{ OR: [{ scope: "GENERAL", factoryId: null }, ...(input.factoryId ? [{ scope: "GENERAL" as const, factoryId: input.factoryId }] : []), { scope: "OBJECT", ...objectFilter }] }],
    }, include: { route: { select: { code: true } }, fees: { orderBy: { sortOrder: "asc" } } },
  });
  const rates: RoutePriceRate[] = rows.map(row => ({
    id: row.id, billType: row.billType, routeCode: row.route.code, scope: row.scope,
    settlementObjectId: row.scope === "OBJECT" ? (row.driverId || row.fleetOwnerId || row.customerId || undefined) : undefined,
    factoryId: row.factoryId || undefined,
    effectiveFrom: row.effectiveFrom.toISOString().slice(0, 10), effectiveTo: row.effectiveTo?.toISOString().slice(0, 10),
    billingBases: row.billingBases, combinations: row.combinations, containerTypes: row.applicableContainerTypes,
    vehicleTypes: row.applicableVehicleTypes, unitPrice: row.unitPrice.toFixed(2),
    verification: row.status === "CONFIRMED" ? "CONFIRMED" : "UNCONFIRMED",
    fees: row.fees.map(fee => ({ code: fee.code, amount: fee.amount.toFixed(2), participatesInSettlement: fee.participatesInSettlement, bearer: fee.bearer, includedInBaseRate: fee.includedInBaseRate })),
  }));
  return matchRoutePrice(rates, input);
}
