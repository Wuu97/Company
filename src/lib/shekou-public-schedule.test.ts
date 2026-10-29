import { describe, expect, it } from "vitest";
import { assertShekouConditionsCleared, assertShekouResultRefreshed, determineShekouClearStrategy, resultFingerprint, selectExactShekouVessel, ShekouManualVerificationRequiredError, uniqueExactShekouScheduleMatch } from "./shekou-public-schedule";

const row = (vesselName: string, exportVoyage: string) => ({ vesselName, exportVoyage, carrier: "ANL", etb: "2026-10-02 08:00", raw: { vesselName, exportVoyage } });

describe("蛇口公共船期连续查询保护", () => {
  it("允许首次查询及连续两条不同船名航次的精确匹配", () => {
    assertShekouConditionsCleared({ vesselName: "", voyage: "" });
    expect(selectExactShekouVessel(["OOCL NORFOLK"], "OOCL NORFOLK")).toBe("OOCL NORFOLK");
    expect(uniqueExactShekouScheduleMatch([row("OOCL NORFOLK", "0BT0QS1NL")], { vesselName: "OOCL NORFOLK", voyage: "0BT0QS1NL" }).exportVoyage).toBe("0BT0QS1NL");
    expect(uniqueExactShekouScheduleMatch([row("ANL WARRNAMBOOL", "0AA1")], { vesselName: "ANL WARRNAMBOOL", voyage: "0AA1" }).vesselName).toBe("ANL WARRNAMBOOL");
  });
  it("拒绝未清空旧条件与大小写不一致候选", () => {
    expect(() => assertShekouConditionsCleared({ vesselName: "OLD VESSEL" })).toThrow(ShekouManualVerificationRequiredError);
    expect(() => selectExactShekouVessel(["Oocl Norfolk"], "OOCL NORFOLK")).toThrow(ShekouManualVerificationRequiredError);
  });
  it("优先使用字段内 X，否则采用正常清空或表单重置", () => {
    expect(determineShekouClearStrategy({ value: "OLD", hasClearIcon: true })).toBe("INPUT_CLEAR_ICON");
    expect(determineShekouClearStrategy({ value: "OLD", hasClearIcon: false })).toBe("NORMAL_INPUT_CLEAR");
    expect(determineShekouClearStrategy({ value: "2026-10-01", hasClearIcon: false, isReadOnly: true })).toBe("RESET_FORM");
    expect(determineShekouClearStrategy({ value: "", hasClearIcon: true })).toBe("NONE");
  });
  it("拒绝未刷新结果、同船不同航次、多条和无结果", () => {
    const same = resultFingerprint([row("OLD", "1")]);
    expect(() => assertShekouResultRefreshed(same, same)).toThrow(ShekouManualVerificationRequiredError);
    expect(() => uniqueExactShekouScheduleMatch([row("OOCL NORFOLK", "OTHER")], { vesselName: "OOCL NORFOLK", voyage: "0BT0QS1NL" })).toThrow(ShekouManualVerificationRequiredError);
    expect(() => uniqueExactShekouScheduleMatch([row("OOCL NORFOLK", "0BT0QS1NL"), row("OOCL NORFOLK", "0BT0QS1NL")], { vesselName: "OOCL NORFOLK", voyage: "0BT0QS1NL" })).toThrow(ShekouManualVerificationRequiredError);
    expect(() => uniqueExactShekouScheduleMatch([], { vesselName: "OOCL NORFOLK", voyage: "0BT0QS1NL" })).toThrow(ShekouManualVerificationRequiredError);
  });
});
