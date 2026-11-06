import { describe, expect, it } from "vitest";
import ExcelJS from "exceljs";
import { buildBillWorkbook } from "./bill-excel";
import { chineseMoney, statementData, toCents } from "./bill-statement";
const bill = { settlementMonth: "2026-09", customer: { name: "测试客户" }, lines: [{ businessDate: "2026-09-12", unitPriceSnapshot: "3000", amountSnapshot: "3052", priceSnapshot: { fees: [{ label: "预约费", amount: "52" }] } }] };
describe("bill statement", () => {
  it("converts money precisely including group boundaries", () => {
    for (const [value, text] of [["0", "零元整"], ["52914", "伍万贰仟玖佰壹拾肆元整"], ["10001.01", "壹万零壹元零壹分"], ["100000001", "壹亿零壹元整"], ["-52.10", "负伍拾贰元壹角"]]) expect(chineseMoney(toCents(value))).toBe(text);
    expect(statementData(bill).total).toBe(305200n);
  });
  it("exports template columns, formulas, cached totals and account text", async () => {
    const wb = await buildBillWorkbook(bill); const read = new ExcelJS.Workbook(); await read.xlsx.load(await wb.xlsx.writeBuffer()); const s = read.worksheets[0];
    expect(s.getCell("J3").value).toBe("运费"); expect(s.getCell("R3").value).toBe("预约费"); expect(s.getCell("T3").value).toBe("小计"); expect(s.getCell("U3").value).toBe("备注");
    expect(s.getCell("R4").value).toBe(52); expect(s.getCell("T5").value).toEqual({ formula: "SUM(T4:T4)", result: 3052 }); expect(s.getCell("J6").value).toEqual({ formula: "T5", result: 3052 }); expect(s.getCell("J7").value).toBe("叁仟零伍拾贰元整"); expect(s.getCell("B10").value).toContain("4000024209200146814");
  });
  it("preserves template layout after xlsx serialization", async () => {
    const book = await buildBillWorkbook(bill);
    const read = new ExcelJS.Workbook();
    await read.xlsx.load(await book.xlsx.writeBuffer());
    const sheet = read.worksheets[0];
    expect(sheet.columnCount).toBe(21);
    expect(sheet.getColumn(1).width).toBe(0.33);
    expect(sheet.columns.filter(c => c.hidden).map(c => c.number)).toEqual([15, 16]);
    expect(sheet.getCell("B1").value).toBe("深圳市宝恒顺物流有限公司");
    expect(sheet.getCell("U1").master.address).toBe("B1");
    expect(sheet.getRow(1).height).toBe(33);
    expect(sheet.getCell("B1").font.size).toBe(24);
    for (const row of [1, 2, 5, 7, 8, 9, 10]) {
      for (let col = 2; col <= 21; col++) {
        expect(Object.values(sheet.getCell(row, col).border || {}).some(edge => edge?.style)).toBe(false);
      }
    }
    expect(sheet.getCell("B7").border?.bottom?.style).toBeUndefined();
    expect(sheet.getCell("I7").border?.bottom?.style).toBeUndefined();
    expect(sheet.getCell("T7").border?.right?.style).toBeUndefined();
    expect(sheet.getCell("S7").master.address).toBe("J7");
    expect(sheet.getCell("J6").border?.bottom?.style).toBe("thin");
    expect(sheet.getCell("B4").border?.left?.style).toBe("thin");
    expect(sheet.getCell("R8").value).toBe("Page 1 of 1");
  });
  it("has no inverted ranges for empty statements", async () => { const wb = await buildBillWorkbook({ ...bill, lines: [] }); expect(wb.worksheets[0].getCell("T4").value).toMatchObject({ formula: "SUM(0)" }); });
});
