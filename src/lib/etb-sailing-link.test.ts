import { describe, expect, it } from "vitest";
import { etbAutoLinkEligibility } from "./etb-sailing-link";

describe("ETB 自动船期关联资格", () => {
  const complete = { carrier: "KMTC", vesselName: "KMTC OSAKA", voyage: "2610N", loadPort: "CNSHK", parseReview: { needsReview: false } };
  it("only permits complete, unambiguous SO data", () => {
    expect(etbAutoLinkEligibility(complete)).toMatchObject({ eligible: true, terminal: "蛇口" });
    expect(etbAutoLinkEligibility({ ...complete, parseReview: { needsReview: true } })).toMatchObject({ eligible: false });
    expect(etbAutoLinkEligibility({ ...complete, voyage: "" })).toMatchObject({ eligible: false });
  });
  it("prefers the full-container return terminal over the empty pickup port", () => {
    expect(etbAutoLinkEligibility({ ...complete, loadPort: "YANTIAN", fullReturnLocation: "SHEKOU CONTAINER TERMINAL" })).toMatchObject({ eligible: true, terminal: "蛇口" });
  });
});
