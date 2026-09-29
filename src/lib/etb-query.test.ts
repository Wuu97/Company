import { describe, expect, it } from "vitest";
import { EtbManualHandoffRequiredError, etbQueryFailureState } from "./etb-query-state";

describe("ETB query handoff", () => {
  it("turns robot verification into a manual-handoff task", () => {
    const retryAfter = new Date("2026-09-29T09:00:00.000Z");
    const state = etbQueryFailureState(new EtbManualHandoffRequiredError("需要机器人验证", "ROBOT_VERIFICATION_REQUIRED", { screenshotStorageKey: "etb/yt.png", retryAfter }));
    expect(state).toMatchObject({ status: "AWAITING_MANUAL", sessionState: "ROBOT_VERIFICATION_REQUIRED", screenshotStorageKey: "etb/yt.png" });
    expect(state.retryAfter).toEqual(retryAfter);
  });

  it("keeps ordinary adapter failures as failed runs", () => {
    expect(etbQueryFailureState(new Error("网站超时"))).toEqual({ status: "FAILED", sessionState: "NOT_REQUIRED", errorMessage: "网站超时" });
  });
});
