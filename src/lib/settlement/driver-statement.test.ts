import { describe, expect, it } from "vitest";
import { driverStatementCell, driverStatementHeaders } from "./driver-statement";

describe("driver statement", () => {
  it("preserves the reference's 19 columns and separates fees from deductions", () => {
    expect(driverStatementHeaders).toHaveLength(19);
    expect(driverStatementHeaders.slice(-4)).toEqual(["借款", "代收运费", "罚款", "其它"]);
    const line = { amountSnapshot: "123.45", priceSnapshot: { baseAmount: "100.00", fees: [{ label: "其他费", amount: "23.45" }], deductions: [{ code: "罚款", amount: "5.00" }] } };
    expect(driverStatementCell(line, "其他费", 0)).toBe(2345n);
    expect(driverStatementCell(line, "罚款", 0)).toBe(500n);
    expect(driverStatementCell(line, "借款", 0)).toBe("—");
    expect(driverStatementCell(line, "工作号", 0)).toBe("—");
    expect(driverStatementCell(line, "小计", 0)).toBe(12345n);
  });
});
