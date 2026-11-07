import { toCents } from "./bill-statement";
export const partnerStatementHeaders = ["序号", "做柜日期", "装卸地点", "柜型", "柜号", "公里数", "司机运费", "路桥费", "油费", "码头费", "高速费", "关场费", "空返费", "送本费", "停车费", "港建费", "保安费", "其他费", "小计"] as const;
export const partnerMoneyColumns = new Set<string>(partnerStatementHeaders.slice(6));
export function partnerStatementCell(line: any, label: string, index: number): string | number | bigint {
  const snapshot = line.priceSnapshot || {};
  if (label === "司机运费") return toCents(snapshot.baseAmount ?? line.unitPriceSnapshot ?? 0);
  if (label === "小计") return toCents(line.amountSnapshot ?? 0);
  if (partnerMoneyColumns.has(label)) {
    const fees = (snapshot.fees || []).filter((fee: any) => fee.label === label || fee.code === label);
    return fees.length ? fees.reduce((sum: bigint, fee: any) => sum + toCents(fee.amount), 0n) : "—";
  }
  const values: Record<string, unknown> = { 序号: index + 1, 做柜日期: String(line.businessDate || "").slice(0, 10), 装卸地点: line.route?.name, 柜型: line.containerUnit?.containerType, 柜号: line.containerUnit?.containerNo, 公里数: line.route?.standardKilometers };
  return String(values[label] ?? "—");
}
