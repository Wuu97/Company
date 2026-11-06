import ExcelJS from "exceljs";
import { chineseMoney, statementAccount, statementBank, statementCompany, statementData, statementColumnWidths, statementHiddenColumns, statementHeaders, yuan } from "./bill-statement";

/** 客户2.xls layout. Coordinates include the deliberately blank A column. */
export async function buildBillWorkbook(bill: any) {
  const data = statementData(bill);
  const book = new ExcelJS.Workbook();
  book.creator = statementCompany;
  book.calcProperties.fullCalcOnLoad = true;
  const sheet = book.addWorksheet("客户对账单", {
    views: [{ showGridLines: false }],
    pageSetup: {
      paperSize: 9, orientation: "landscape", fitToPage: true,
      fitToWidth: 1, fitToHeight: 0,
      margins: { left: .39, right: .39, top: .31, bottom: .31, header: 0, footer: 0 },
    },
  });
  sheet.columns = statementColumnWidths.map((width, index) => ({ width, hidden: statementHiddenColumns.includes(index + 1) }));
  const summary = data.rows.length + 4;
  const lastRow = summary + 5;
  // Initialize before merging; never style merge children after their master.
  for (let r = 1; r <= lastRow; r++) {
    sheet.getRow(r).height = 16;
    for (let c = 2; c <= 21; c++) {
      sheet.getCell(r, c).style = {
        font: { name: "Arial", size: 9 },
        alignment: { vertical: "middle", horizontal: "center", wrapText: true },
      };
    }
  }
  const box = (r: number, c: number, color = "FF000000") => {
    const edge: ExcelJS.Border = { style: "thin", color: { argb: color } };
    sheet.getCell(r, c).border = { top: { ...edge }, bottom: { ...edge }, left: { ...edge }, right: { ...edge } };
  };
  const mergeText = (r: number, from: number, to: number, value: ExcelJS.CellValue, horizontal: ExcelJS.Alignment["horizontal"] = "center", bordered = false) => {
    sheet.mergeCells(r, from, r, to);
    const cell = sheet.getCell(r, from);
    cell.value = value;
    cell.alignment = { vertical: "middle", horizontal, wrapText: true };
    if (bordered) box(r, from);
    return cell;
  };
  const title = mergeText(1, 2, 21, statementCompany);
  title.font = { name: "隶书", size: 24, bold: false };
  sheet.getRow(1).height = 33;
  sheet.getCell("B2").value = "TO:";
  sheet.getCell("B2").alignment = { vertical: "middle", horizontal: "left" };
  mergeText(2, 3, 6, data.customer, "left");
  mergeText(2, 15, 20, data.period, "right");

  sheet.getRow(2).height = 18;
  sheet.getCell("B2").font = { name: "Arial", size: 10, bold: true };

  statementHeaders.forEach((header, i) => {
    const cell = sheet.getCell(3, i + 2);
    cell.value = header;
    cell.font = { name: i === 10 || i === 16 ? "宋体" : "Arial", size: 9, bold: false };
    box(3, i + 2);
  });
  data.rows.forEach((row, i) => row.forEach((value, j) => {
    const cell = sheet.getCell(i + 4, j + 2);
    cell.value = typeof value === "bigint" ? yuan(value) : value;
    if (j >= 8 && j <= 18) {
      cell.numFmt = "0.00";
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    }
    box(i + 4, j + 2);
  }));

  mergeText(summary, 2, 8, statementCompany, "left");
  sheet.getRow(summary).height = 21.95;
  sheet.getCell(summary, 9).value = "汇总：";

  for (let i = 0; i < 11; i++) {
    const cell = sheet.getCell(summary, i + 10);
    const col = sheet.getColumn(i + 10).letter;
    cell.value = { formula: data.rows.length ? `SUM(${col}4:${col}${summary - 1})` : "SUM(0)", result: yuan(data.totals[i]) };
    cell.numFmt = "0.00";
    cell.alignment = { vertical: "middle", horizontal: "center" };

  }
  sheet.getCell(summary + 1, 9).value = "合计：";
  sheet.getRow(summary + 1).height = 15;
  mergeText(summary + 1, 2, 8, "");
  mergeText(summary + 1, 10, 12, { formula: `T${summary}`, result: yuan(data.total) }, "center", true).numFmt = "0.00";
  mergeText(summary + 2, 2, 8, "Tel：0755-25284377 Fax:0755-25284396", "left");
  sheet.getCell(summary + 2, 9).value = "合计大写：";

  sheet.getRow(summary + 2).height = 21;
  mergeText(summary + 2, 10, 19, chineseMoney(data.total), "left");

  mergeText(summary + 3, 2, 17, `公司名称：${statementCompany}`, "left");
  mergeText(summary + 3, 18, 21, "Page 1 of 1", "right");
  mergeText(summary + 4, 2, 21, `开户银行：${statementBank}`, "left");
  mergeText(summary + 5, 2, 21, `帐号：${statementAccount}`, "left");
  for (const row of [summary, summary + 1, summary + 2]) {
    sheet.getCell(row, 9).alignment = { horizontal: "right", vertical: "middle" };
  }
  for (let r = summary + 3; r <= lastRow; r++) {
    sheet.getRow(r).height = r === summary + 3 ? 17.1 : 11.25;
    sheet.getCell(r, 2).font = { name: "宋体", size: 9 };
  }
  sheet.pageSetup.printArea = `A1:U${lastRow}`;
  sheet.pageSetup.printTitlesRow = "1:3";
  return book;
}
