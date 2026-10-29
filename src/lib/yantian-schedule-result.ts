import { parseChinaEtb } from "./etb-time";

export type YantianScheduleRow = { vesselName?: string; voyage?: string; etb?: string; raw: Record<string, string> };

const aliases: Record<string, keyof Omit<YantianScheduleRow, "raw">> = {
  "船名": "vesselName", "船名(英文)": "vesselName", "航次": "voyage", "出口航次": "voyage",
  "预计靠泊时间": "etb", "预计停靠时间": "etb", "ETB": "etb",
};

/** Only map columns explicitly named by the platform; column positions are not stable enough to infer. */
export function parseYantianScheduleTable(headers: string[], values: string[][]): YantianScheduleRow[] {
  const fields = headers.map(header => aliases[header.replace(/\s+/g, "").trim()]);
  if (!fields.includes("vesselName") || !fields.includes("voyage") || !fields.includes("etb")) {
    throw new Error("盐田结果表缺少船名、航次或 ETB 列；需人工核实。");
  }
  return values.map(cells => {
    const raw = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    const row: YantianScheduleRow = { raw };
    fields.forEach((field, index) => { if (field) row[field] = cells[index]?.trim() || ""; });
    return row;
  });
}

export function parseYantianEtb(raw: string | undefined) {
  if (!raw?.trim()) throw new Error("盐田结果未显示 ETB，不能保存观测。");
  const value = parseChinaEtb(raw);
  if (!value) throw new Error(`无法解析盐田页面原始 ETB：${raw}`);
  return value;
}

export function uniqueExactYantianScheduleMatch(rows: YantianScheduleRow[], input: { vesselName: string; voyage: string }) {
  const matches = rows.filter(row => row.vesselName === input.vesselName && row.voyage === input.voyage);
  if (matches.length !== 1) throw new Error(matches.length ? "盐田存在多条完全匹配结果，需人工核实。" : "盐田没有船名、航次完全匹配的结果，需人工核实。");
  return matches[0];
}
