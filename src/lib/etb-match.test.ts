import { describe, expect, it } from "vitest";
import { uniqueEtbMatch } from "./etb-match";

describe("ETB identity matching", () => {
  const sailing = { id: "s1", carrier: "COSCO", vesselName: "XIN YA-ZHOU", voyage: "001 W" };
  it("matches harmless source formatting differences", () => {
    expect(uniqueEtbMatch({ carrier: "cosco ", vesselName: "XIN YA ZHOU", voyage: "001-W" }, [sailing])?.id).toBe("s1");
  });
  it("matches carrier aliases returned by a terminal", () => {
    expect(uniqueEtbMatch({ carrier: "CMA-CGM", vesselName: "XIN YA-ZHOU", voyage: "001 W" }, [{ ...sailing, id: "s3", carrier: "CMA CGM" }])?.id).toBe("s3");
  });
  it("does not guess when normalization finds more than one candidate", () => {
    expect(uniqueEtbMatch(sailing, [sailing, { ...sailing, id: "s2" }])).toBeUndefined();
  });
});
