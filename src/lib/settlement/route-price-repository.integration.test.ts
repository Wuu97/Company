import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import { matchRoutePriceFromDatabase } from "./route-price-repository";

const url = process.env.TEST_DATABASE_URL;
const enabled = Boolean(url && new URL(url).pathname === "/logistics_settlement_test");
const db = enabled ? new PrismaClient({ datasources: { db: { url } } }) : null;

describe.runIf(enabled)("route price repository (isolated database)", () => {
  it("matches a confirmed general price and rolls all fixtures back", async () => {
    await expect(db!.$transaction(async tx => {
      const route = await tx.route.create({ data: { code: `TEST-PRICE-${Date.now()}`, name: "测试路线", origin: "A", destination: "B" } });
      await tx.routePrice.create({ data: { routeId: route.id, billType: "DRIVER", scope: "GENERAL", billingBases: ["TRIP"], combinations: ["SINGLE"], unitPrice: "100.00", effectiveFrom: new Date("2026-01-01"), status: "CONFIRMED" } });
      const match = await matchRoutePriceFromDatabase(tx, { billType: "DRIVER", routeCode: route.code, businessDate: "2026-10-26", billingBasis: "TRIP", combination: "SINGLE" });
      expect(match.status).toBe("MATCHED");
      throw new Error("TEST_ROLLBACK");
    })).rejects.toThrow("TEST_ROLLBACK");
  });
});

if (db) afterAll(() => db.$disconnect());
