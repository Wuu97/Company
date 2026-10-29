import { describe, expect, it } from "vitest";
import { matchRoutePriceFromDatabase } from "./route-price-repository";

const request = { billType: "DRIVER" as const, routeCode: "R-1", businessDate: "2026-10-26", settlementObjectId: "d-1", billingBasis: "TRIP" as const, combination: "SINGLE" as const };
const base = { id: "p-1", billType: "DRIVER", scope: "OBJECT", driverId: "d-1", fleetOwnerId: null, customerId: null, effectiveFrom: new Date("2026-01-01"), effectiveTo: null, billingBases: ["TRIP"], combinations: ["SINGLE"], applicableContainerTypes: [], applicableVehicleTypes: [], unitPrice: { toFixed: () => "100.00" }, status: "CONFIRMED", route: { code: "R-1" }, fees: [] };
function database(rows: any[]) { return { route: { findUnique: async () => ({ id: "r-1" }) }, routePrice: { findMany: async () => rows } } as any; }
describe("database route-price repository", () => {
  it("returns the dedicated confirmed price", async () => expect((await matchRoutePriceFromDatabase(database([base]), request)).status).toBe("MATCHED"));
  it("does not use an unconfirmed rate for settlement", async () => expect((await matchRoutePriceFromDatabase(database([{ ...base, status: "DRAFT" }]), request)).status).toBe("UNCONFIRMED_PRICE"));
  it("reports same-priority database rows as a conflict", async () => expect((await matchRoutePriceFromDatabase(database([base, { ...base, id: "p-2" }]), request)).status).toBe("PRICE_CONFLICT"));
  it("reports a missing route explicitly", async () => {
    const db = { route: { findUnique: async () => null }, routePrice: { findMany: async () => [] } } as any;
    expect((await matchRoutePriceFromDatabase(db, request)).status).toBe("PRICE_MISSING");
  });
});
