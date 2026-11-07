import { toCents } from "./bill-statement";

/** Column order from the supplied 司机2.xls, separate from customer statements. */
export const driverStatementHeaders = ["序号", "工作号", "做柜日期", "工厂名称", "行驶路线", "订舱号", "柜型", "柜号", "公里数", "付运费", "关场费", "压车费", "打单费", "其他费", "小计", "借款", "代收运费", "罚款", "其它"] as const;
export const driverMoneyColumns = new Set<string>(driverStatementHeaders.slice(9));

export function driverStatementCell(line: any, label: string, index: number): string | number | bigint {
  const snapshot = line.priceSnapshot || {};
  const plan = line.transportTask?.loadingPlan;
  if (label === "付运费") return toCents(snapshot.baseAmount ?? line.unitPriceSnapshot ?? 0);
  if (label === "小计") return toCents(line.amountSnapshot ?? 0);
  if (driverMoneyColumns.has(label)) {
    const entries = ["借款", "代收运费", "罚款", "其它"].includes(label) ? snapshot.deductions || [] : snapshot.fees || [];
    const matches = entries.filter((item: any) => item.label === label || item.code === label);
    // Unrecorded adjustments are unknown, rather than invented zero amounts.
    return matches.length ? matches.reduce((sum: bigint, item: any) => sum + toCents(item.amount), 0n) : "—";
  }
  const values: Record<string, unknown> = {
    序号: index + 1, 工作号: snapshot.workNo,
    做柜日期: String(line.businessDate || "").slice(0, 10),
    工厂名称: plan?.factory?.name, 行驶路线: line.route?.name,
    订舱号: plan?.soOrder?.soNumber, 柜型: line.containerUnit?.containerType,
    柜号: line.containerUnit?.containerNo, 公里数: line.route?.standardKilometers,
  };
  return String(values[label] ?? "—");
}
