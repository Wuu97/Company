import { describe, expect, it } from "vitest";
import { normalizeCarrierName, sameCarrierName } from "./carrier-name";

describe("船公司名称标准化", () => {
  it("统一常见别名、大小写和连字符", () => {
    expect(normalizeCarrierName("CMA-CGM")).toBe("CMA CGM");
    expect(normalizeCarrierName("Hapag Lloyd")).toBe("HAPAG-LLOYD");
    expect(normalizeCarrierName("Mediterranean Shipping Company")).toBe("MSC");
    expect(sameCarrierName("Korea Marine Transport", "KMTC")).toBe(true);
  });
});
