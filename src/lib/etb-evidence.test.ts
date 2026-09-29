import { describe, expect, it } from "vitest";
import { invalidEtbEvidence, missingEtbEvidence, requiresEtbResultEvidence } from "./etb-evidence";

describe("ETB result evidence", () => {
  it("requires a URL and result screenshot for controlled-browser sources", () => {
    expect(requiresEtbResultEvidence("YANTIAN_CONTROLLED_BROWSER")).toBe(true);
    expect(missingEtbEvidence([{ carrier: "A", vesselName: "V", voyage: "001", etbAt: new Date(), sourceUrl: "https://example.com" }])).toBeTruthy();
  });
  it("accepts a complete evidence reference", () => {
    expect(missingEtbEvidence([{ carrier: "A", vesselName: "V", voyage: "001", etbAt: new Date(), sourceUrl: "https://example.com", screenshotStorageKey: "etb/result.png" }])).toBeUndefined();
  });
  it("accepts only the configured platform and the ETB evidence directory", () => {
    const result = { carrier: "A", vesselName: "V", voyage: "001", etbAt: new Date(), sourceUrl: "https://www.156yt.cn/query", screenshotStorageKey: "etb/yantian-result.png" };
    expect(invalidEtbEvidence("盐田", [result])).toBeUndefined();
    expect(invalidEtbEvidence("盐田", [{ ...result, screenshotStorageKey: "etb-credential-tests/login.png" }])).toBeTruthy();
    expect(invalidEtbEvidence("盐田", [{ ...result, sourceUrl: "https://example.com" }])).toBeTruthy();
  });
});
