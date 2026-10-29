import { describe, expect, it } from "vitest";
import type { RoutePriceRate, SettlementCalculationInput } from "./settlement-domain";
import { calculateSettlementLine, findDuplicateSettlement, matchRoutePrice, settlementUnitKey } from "./settlement-pricing";

const baseRequest = { billType: "CUSTOMER" as const, routeCode: "YT-XX-YT", businessDate: "2026-09-15", settlementObjectId: "customer-a", billingBasis: "CONTAINER" as const, combination: "SINGLE" as const, containerType: "40HQ" };
const generalRate: RoutePriceRate = { id: "general", billType: "CUSTOMER", routeCode: "YT-XX-YT", scope: "GENERAL", effectiveFrom: "2026-01-01", billingBases: ["CONTAINER"], combinations: ["SINGLE"], containerTypes: ["40HQ"], unitPrice: "3000.00", verification: "CONFIRMED" };
const objectRate: RoutePriceRate = { ...generalRate, id: "object", scope: "OBJECT", settlementObjectId: "customer-a", unitPrice: "2800.00" };
const calculationInput: SettlementCalculationInput = { ...baseRequest, settlementObjectId: "customer-a", businessAttributionMonth: "2026-09", settlementMonth: "2026-10", billingBasis: "CONTAINER", combination: "SINGLE", quantity: "2.00", source: { taskId: "task-1", containerId: "container-1" } };

describe("route price matching", () => {
  it("prefers an object-specific effective price over the general price", () => {
    expect(matchRoutePrice([generalRate, objectRate], baseRequest)).toMatchObject({ status: "MATCHED", rate: { id: "object" }, matchLevel: "OBJECT" });
  });
  it("reports conflicting prices instead of choosing one", () => {
    expect(matchRoutePrice([generalRate, { ...generalRate, id: "general-2" }], { ...baseRequest, settlementObjectId: undefined })).toMatchObject({ status: "PRICE_CONFLICT", conflictingRateIds: ["general", "general-2"] });
  });
  it("does not allow an unconfirmed historical candidate to settle", () => {
    expect(matchRoutePrice([{ ...generalRate, id: "candidate", verification: "UNCONFIRMED" }], { ...baseRequest, settlementObjectId: undefined })).toMatchObject({ status: "UNCONFIRMED_PRICE", candidateRateIds: ["candidate"] });
  });
  it("reports missing prices explicitly", () => {
    expect(matchRoutePrice([], baseRequest)).toMatchObject({ status: "PRICE_MISSING" });
  });
});

describe("settlement amount calculation", () => {
  it("uses fixed-point Decimal-style money without adding included fees twice", () => {
    const result = calculateSettlementLine([{ ...objectRate, fees: [
      { code: "FUEL", amount: "100.00", participatesInSettlement: true, bearer: "CUSTOMER", includedInBaseRate: true },
      { code: "BOOKING", amount: "52.00", participatesInSettlement: true, bearer: "CUSTOMER", includedInBaseRate: false },
      { code: "REFERENCE", amount: "30.00", participatesInSettlement: false, bearer: "COMPANY", includedInBaseRate: false },
    ] }], { ...calculationInput, deductions: [{ code: "DISCOUNT", amount: "5.50" }] });
    expect(result).toMatchObject({ status: "CALCULATED", baseAmount: "5600.00", includedFeeAmount: "100.00", additionalFeeAmount: "52.00", deductionAmount: "5.50", totalAmount: "5646.50" });
  });
  it("supports double-trailer combination pricing as an explicit basis", () => {
    const result = calculateSettlementLine([{ ...generalRate, id: "double", billingBases: ["COMBINATION"], combinations: ["DOUBLE_TRAILER"], unitPrice: "4350.00" }], { ...calculationInput, billingBasis: "COMBINATION", combination: "DOUBLE_TRAILER", quantity: "1.00", source: { taskId: "task-1", combinationId: "pair-1" } });
    expect(result).toMatchObject({ status: "CALCULATED", totalAmount: "4350.00" });
  });
  it("returns structured failure for a missing price", () => {
    expect(calculateSettlementLine([], calculationInput)).toMatchObject({ status: "PRICE_MISSING" });
  });
});

describe("duplicate settlement identity", () => {
  it("uses the correct source for each charging basis and prevents duplicate active entries", () => {
    const key = settlementUnitKey(calculationInput);
    expect(key).toContain("task-1:container-1");
    expect(findDuplicateSettlement(calculationInput, [{ settlementUnitKey: key, active: true, billLineId: "line-1" }, { settlementUnitKey: key, active: false, billLineId: "void-line" }])).toEqual({ status: "DUPLICATE", settlementUnitKey: key, existingBillLineIds: ["line-1"] });
  });
  it("requires a stable business source for independent fees", () => {
    expect(() => settlementUnitKey({ ...calculationInput, billingBasis: "ADHOC", source: {} })).toThrow("缺少可审计");
    expect(settlementUnitKey({ ...calculationInput, billingBasis: "ADHOC", source: { manualChargeId: "fee-1" } })).toContain("fee-1");
  });
});
