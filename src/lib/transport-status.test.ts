import { describe, expect, it } from "vitest";
import { assertTransportStatusTransition, canTransitionTransportStatus } from "./transport-status";

describe("transport status transitions", () => {
  it("allows the normal dispatch path", () => {
    expect(canTransitionTransportStatus("PLANNED", "DISPATCHED")).toBe(true);
    expect(canTransitionTransportStatus("DISPATCHED", "IN_TRANSIT")).toBe(true);
    expect(canTransitionTransportStatus("IN_TRANSIT", "COMPLETED")).toBe(true);
  });

  it("rejects status skips and terminal-state changes", () => {
    expect(() => assertTransportStatusTransition("PLANNED", "COMPLETED")).toThrow("不允许");
    expect(() => assertTransportStatusTransition("COMPLETED", "IN_TRANSIT")).toThrow("不允许");
  });
});
