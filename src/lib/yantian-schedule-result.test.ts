import { describe, expect, it } from "vitest";
import { parseYantianEtb, parseYantianScheduleTable, uniqueExactYantianScheduleMatch } from "./yantian-schedule-result";

describe("盐田船期结果解析", () => {
  it("only accepts explicitly labelled fields and an exact identity", () => {
    const rows = parseYantianScheduleTable(["船名", "出口航次", "预计靠泊时间"], [["OOCL NORFOLK", "0BT0QS1NL", "2026-10-02 08:00"]]);
    expect(uniqueExactYantianScheduleMatch(rows, { vesselName: "OOCL NORFOLK", voyage: "0BT0QS1NL" }).etb).toBe("2026-10-02 08:00");
    expect(parseYantianEtb(rows[0].etb).toISOString()).toBe("2026-10-02T00:00:00.000Z");
  });
  it("rejects an ambiguous or unlabelled result", () => {
    expect(() => parseYantianScheduleTable(["船名", "航次"], [["A", "1"]])).toThrow("缺少");
    expect(() => uniqueExactYantianScheduleMatch([{ vesselName: "A", voyage: "1", etb: "x", raw: {} }, { vesselName: "A", voyage: "1", etb: "x", raw: {} }], { vesselName: "A", voyage: "1" })).toThrow("多条");
  });
});
