import { describe, expect, it } from "vitest";
import { staleEtbRunBefore } from "./etb-query-lease";

describe("ETB Worker lease", () => {
  it("uses a one-hour default lease before reclaiming a running task", () => {
    expect(staleEtbRunBefore(new Date("2026-10-16T08:00:00.000Z"))).toEqual(new Date("2026-10-16T07:00:00.000Z"));
  });
});
