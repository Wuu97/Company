import { describe, expect, it } from "vitest";
import { parseShekouEtb, parseShekouScheduleTable } from "./shekou-schedule-result";
import { ShekouManualVerificationRequiredError } from "./shekou-public-schedule";

describe("蛇口公共船期结果解析", () => {
  it("按真实中文表头保留原始字段，不补造缺失值", () => {
    const [row] = parseShekouScheduleTable(["船公司", "船名", "进口航次", "出口航次", "POB", "ETB", "ETD", "备注"], [["ANL", "OOCL NORFOLK", "0BT0QS1NL", "0BT0QS1NL", "SCT", "2026-10-02 08:00", "2026-10-03 10:00", ""]]);
    expect(row).toMatchObject({ carrier: "ANL", vesselName: "OOCL NORFOLK", exportVoyage: "0BT0QS1NL", etb: "2026-10-02 08:00" });
    expect(row.raw.备注).toBe("");
  });
  it("识别公共船期页显示的商业航次列", () => {
    const [row] = parseShekouScheduleTable(["船名", "出口航次", "进口商业航次码", "出口商业航次码", "ETB"], [["OOCL NORFOLK", "309S", "SHK309S", "309S", "2026-10-04 03:00"]]);
    expect(row).toMatchObject({ vesselName: "OOCL NORFOLK", importVoyage: "SHK309S", exportVoyage: "309S" });
  });
  it("缺少业务关键列或 ETB 时转人工核实", () => {
    expect(() => parseShekouScheduleTable(["船名", "ETB"], [["A", "2026-10-02"]])).toThrow(ShekouManualVerificationRequiredError);
    expect(() => parseShekouEtb("")).toThrow(ShekouManualVerificationRequiredError);
  });
  it("只解析页面明确显示的可解析 ETB", () => {
    expect(parseShekouEtb("2026-10-02 08:00").toISOString()).toBe("2026-10-02T00:00:00.000Z");
  });
});
