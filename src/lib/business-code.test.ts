import { describe, expect, it } from "vitest";
import { businessCode } from "./business-code";

describe("automatic business codes", () => {
  it("keeps entity prefixes and fits the database code limit", () => {
    for (const prefix of ["CUST", "DRV", "FLEET", "ROUTE"]) {
      const code = businessCode(prefix);
      expect(code).toMatch(new RegExp(`^${prefix}-[a-f0-9]{32}$`));
      expect(code.length).toBeLessThanOrEqual(40);
    }
  });
  it("generates distinct codes for simultaneous creations", () => {
    const codes = Array.from({ length: 1000 }, () => businessCode("CUST"));
    expect(new Set(codes).size).toBe(codes.length);
  });
});
