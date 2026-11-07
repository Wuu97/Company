import { partnerStatementHeaders, partnerMoneyColumns, partnerStatementCell } from "@/lib/settlement/partner-statement";
import ExcelJS from "exceljs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { driverStatementCell, driverStatementHeaders, driverMoneyColumns } from "./driver-statement";
import { chineseMoney, statementAccount, statementBank, statementCompany, statementData, statementColumnWidths, statementHiddenColumns, statementHeaders, yuan } from "./bill-statement";

/** 客户2.xls layout. Coordinates include the deliberately blank A column. */
export async function buildBillWorkbook(bill: any) {
  if (["DRIVER", "PARTNER"].includes(bill.billType)) return buildDriverWorkbook(bill);
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

/** Driver export shares its exact headers and value mapping with detail and print. */
async function buildDriverWorkbook(bill: any) {
  const partner = bill.billType === "PARTNER";
  const headers = partner ? partnerStatementHeaders : driverStatementHeaders;
  const moneyColumns = partner ? partnerMoneyColumns : driverMoneyColumns;
  const valueCell = partner ? partnerStatementCell : driverStatementCell;
  const book = new ExcelJS.Workbook();
  book.creator = statementCompany;
  book.calcProperties.fullCalcOnLoad = true;
  const sheet = book.addWorksheet(partner ? "车辆作业明细表" : "司机作业明细表", {
    views: [{ showGridLines: false, state: "frozen", ySplit: 5 }],
    pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: "1:5", margins: { left: .3, right: .3, top: .3, bottom: .3, header: .1, footer: .1 } },
  });
  sheet.columns = (partner ? [6, 14, 24, 10, 20, 10, 13, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 13] : [6, 14, 14, 18, 22, 22, 10, 20, 10, 13, 11, 11, 11, 11, 13, 11, 13, 11, 11]).map(width => ({ width }));
  sheet.mergeCells("A1:S1"); sheet.getRow(1).height = 34;
  sheet.mergeCells("A2:S2"); sheet.getRow(2).height = 30;
  const company = await readFile(path.join(process.cwd(), "public/images/statement-company-title-provided.png"));
  const title = await readFile(path.join(process.cwd(), partner ? "public/images/partner-statement-title.png" : "public/images/driver-statement-title.png"));
  sheet.addImage(book.addImage({ buffer: company as any, extension: "png" }), { tl: { col: 6, row: .1 }, ext: { width: 400, height: 400 * 96 / 1452 } });
  sheet.addImage(book.addImage({ buffer: title as any, extension: "png" }), { tl: { col: 7, row: 1.1 }, ext: { width: 240, height: 240 * 74 / 398 } });
  sheet.mergeCells("A3:H3"); sheet.getCell("A3").value = `${partner ? "合作车" : "司机姓名"}：${(partner ? bill.fleetOwner?.name : bill.driver?.name) || "—"}`;
  sheet.mergeCells("I3:S3"); sheet.getCell("I3").value = statementData(bill).period;
  sheet.mergeCells("A4:S4"); sheet.getCell("A4").value = "金额单位：元；— 表示未记录";
  sheet.getRow(5).values = [...headers];
  bill.lines.forEach((line: any, index: number) => {
    sheet.getRow(index + 6).values = headers.map(label => {
      const value = valueCell(line, label, index);
      return typeof value === "bigint" ? yuan(value) : value;
    });
  });
  const last = bill.lines.length + 6;
  sheet.getCell(last, 1).value = "合计";
  headers.forEach((label, index) => {
    if (!moneyColumns.has(label)) return;
    const values = bill.lines.map((line: any) => valueCell(line, label, 0)).filter((value: unknown): value is bigint => typeof value === "bigint") as bigint[];
    const column = sheet.getColumn(index + 1).letter;
    sheet.getCell(last, index + 1).value = values.length ? { formula: `SUM(${column}6:${column}${last - 1})`, result: yuan(values.reduce((sum, value) => sum + value, 0n)) } : "—";
  });
  for (let row = 3; row <= last; row++) {
    sheet.getRow(row).height = row === 5 ? 28 : 24;
    for (let col = 1; col <= 19; col++) {
      const cell = sheet.getCell(row, col);
      cell.font = { name: "宋体", size: 9, bold: row === 5 || row === last };
      cell.alignment = { vertical: "middle", horizontal: moneyColumns.has(headers[col - 1]) ? "right" : "left", wrapText: true };
      if (row >= 5) cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
      if (row > 5 && moneyColumns.has(headers[col - 1])) cell.numFmt = "#,##0.00";
    }
  }
  sheet.pageSetup.printArea = `A1:S${last}`;
  sheet.headerFooter.oddFooter = "Page &P of &N";
  return book;
}
