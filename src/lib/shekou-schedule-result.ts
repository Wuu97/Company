import { ShekouManualVerificationRequiredError, type ShekouScheduleRow } from "./shekou-public-schedule";
import { parseChinaEtb } from "./etb-time";

const aliases: Record<string, keyof Omit<ShekouScheduleRow, "raw">> = {
  "船名": "vesselName", "船公司": "carrier", "进口航次": "importVoyage", "出口航次": "exportVoyage",
  "POB": "pob", "预计靠泊时间": "etb", "ETB": "etb", "预计离泊时间": "etd", "ETD": "etd",
  "实际靠泊时间": "ata", "ATA": "ata", "实际离泊时间": "atd", "ATD": "atd", "备注": "remark",
  "进口商业航次码": "importVoyage", "出口商业航次码": "exportVoyage",
};

export function parseShekouScheduleTable(headers: string[], values: string[][]): ShekouScheduleRow[] {
  const indexes = headers.map(header => aliases[header.trim()]);
  if (!indexes.includes("vesselName") || !indexes.includes("exportVoyage")) {
    throw new ShekouManualVerificationRequiredError("蛇口结果表缺少船名或出口航次列；不推断字段含义，需人工核实。");
  }
  return values.map(cells => {
    const raw = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    const row: ShekouScheduleRow = { raw };
    indexes.forEach((field, index) => { if (field) row[field] = cells[index] ?? ""; });
    return row;
});
}

export function parseShekouEtb(raw: string | undefined) {
  if (!raw?.trim()) throw new ShekouManualVerificationRequiredError("结果未显示 ETB，不能自行推断或保存观测。");
  const value = parseChinaEtb(raw);
  if (!value) throw new ShekouManualVerificationRequiredError(`无法解析页面原始 ETB：${raw}`);
  return value;
}
