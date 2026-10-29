import { describe, expect, it } from "vitest";
import { etbManualEscalationBefore } from "./etb-handoff-escalation";

describe("ETB manual handoff escalation", () => {
  it("escalates only after the default one-hour wait", () => {
    expect(etbManualEscalationBefore(new Date("2026-10-17T08:00:00.000Z"))).toEqual(new Date("2026-10-17T07:00:00.000Z"));
  });
});
