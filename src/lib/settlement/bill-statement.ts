export const statementHeaders = ["序号", "日期", "工厂名称", "订舱号", "柜号", "柜型", "行驶路线", "车牌号", "运费", "报关费", "异提费", "压车费", "打单费", "港建费", "保安费", "高速费", "预约费", "其他费", "小计", "备注"];
export const statementCompany = "深圳市宝恒顺物流有限公司";
export const statementBank = "中国工商银行股份有限公司深圳盐田港支行";
export const statementAccount = "4000024209200146814";
export function toCents(value: unknown): bigint { const m = String(value ?? 0).match(/^(-?)(\d+)(?:\.(\d{1,2}))?$/); if (!m) throw new Error(`无效金额：${value}`); return (m[1] ? -1n : 1n) * (BigInt(m[2]) * 100n + BigInt((m[3] || "").padEnd(2, "0"))); }
export function yuan(value: bigint) { return Number(value) / 100; }
export function chineseMoney(value: bigint): string {
  const digits = "零壹贰叁肆伍陆柒捌玖", units = ["", "万", "亿", "万亿"];
  const group = (n: number) => { let text = "", zero = false; for (let i = 3; i >= 0; i--) { const d = Math.floor(n / 10 ** i) % 10; if (d) { if (zero && text) text += "零"; text += digits[d] + ["", "拾", "佰", "仟"][i]; zero = false; } else if (text) zero = true; } return text; };
  const absolute = value < 0n ? -value : value; let integer = absolute / 100n, text = "", gap = false, index = 0;
  if (integer >= 10000000000000000n) throw new Error("金额超出大写转换范围");
  while (integer) { const n = Number(integer % 10000n); if (n) { text = group(n) + units[index] + (text && (gap || n < 1000) ? "零" : "") + text; gap = false; } else if (text) gap = true; integer /= 10000n; index++; }
  // Join groups with a zero when the lower group has fewer than four digits.
  const raw = (absolute / 100n).toString();
  if (raw.length > 4) { const parts = raw.match(/.{1,4}(?=(.{4})*$)/g) || []; text = ""; parts.forEach((part, i) => { const n = Number(part); if (!n) return; if (text && (part.startsWith("0") || Number(parts[i - 1]) === 0)) text += "零"; text += group(n) + units[parts.length - i - 1]; }); }
  const jiao = Number(absolute / 10n % 10n), fen = Number(absolute % 10n);
  return (value < 0n ? "负" : "") + (text || "零") + "元" + (!jiao && !fen ? "整" : (jiao ? digits[jiao] + "角" : fen ? "零" : "") + (fen ? digits[fen] + "分" : ""));
}
export function statementData(bill: any) {
  const rows = bill.lines.map((line: any, index: number) => {
    const plan = line.transportTask?.loadingPlan;
    const fees = statementHeaders.slice(9, 18).map(label => (line.priceSnapshot?.fees || []).filter((f: any) => f.label === label || f.code === label).reduce((sum: bigint, f: any) => sum + toCents(f.amount), 0n));
    return [index + 1, String(line.businessDate || "").slice(0, 10), plan?.factory?.name || "", plan?.soOrder?.soNumber || "", line.containerUnit?.containerNo || "", line.containerUnit?.containerType || "", line.route?.name || "", line.transportLeg?.vehicleNo || line.transportLeg?.vehicle?.plateNumber || "", toCents(line.priceSnapshot?.baseAmount ?? line.unitPriceSnapshot), ...fees, toCents(line.amountSnapshot), line.priceSnapshot?.note || line.transportLeg?.note || ""];
  }) as (string | number | bigint)[][];
  const totals = Array.from({ length: 11 }, (_, i) => rows.reduce((sum, row) => sum + (row[i + 8] as bigint), 0n));
  const month = bill.settlementMonth; const [year, m] = month.split("-").map(Number);
  return { rows, totals, total: totals[10], customer: bill.customer?.name || bill.driver?.name || bill.fleetOwner?.name || bill.vehicle?.plateNumber || "", period: `From: ${month}-01 To: ${month}-${new Date(Date.UTC(year, m, 0)).getUTCDate()}` };
}

export const statementColumnWidths = [0.33, 5.1640625, 7, 9.6640625, 21.5, 15.33203125, 6, 15.33203125, 9, 8.6640625, 7, 7, 7, 6.83203125, 7, 7, 7, 7, 6.83203125, 8.5, 15.1640625];
export const statementHiddenColumns = [15, 16];
