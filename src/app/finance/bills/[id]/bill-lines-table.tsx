"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import css from "./bill-lines-table.module.css";

const fees = ["报关费", "异提费", "压车费", "打单费", "港建费", "保安费", "高速费", "预约费", "其他费"];
const columns = ["序号", "日期", "订舱号", "柜号", "工厂名称", "柜型", "行驶路线", "车牌号", "运费", ...fees, "备注", "小计", "操作"];
const widths = [52, 104, 148, 144, 180, 80, 200, 112, ...Array(10).fill(96), 200, 112, 96];
const cents = (value: unknown) => { const match = String(value ?? "0").match(/^(-?)(\d+)(?:\.(\d{1,2}))?$/); return match ? (match[1] ? -1n : 1n) * (BigInt(match[2]) * 100n + BigInt((match[3] || "").padEnd(2, "0"))) : 0n; };
const money = (value: bigint) => `${value < 0n ? "-" : ""}${((value < 0n ? -value : value) / 100n).toLocaleString("zh-CN")}.${String((value < 0n ? -value : value) % 100n).padStart(2, "0")}`;
const numeric = (label: string) => label === "运费" || label === "小计" || fees.includes(label);
function amount(line: any, label: string): bigint {
  if (label === "小计") return cents(line.amountSnapshot);
  if (label === "运费") return cents(line.priceSnapshot?.baseAmount ?? line.unitPriceSnapshot);
  return (line.priceSnapshot?.fees || []).filter((fee: any) => fee.label === label || fee.code === label).reduce((sum: bigint, fee: any) => sum + cents(fee.amount), 0n);
}
function cell(line: any, label: string, index: number) {
  if (numeric(label)) return money(amount(line, label));
  const plan = line.transportTask?.loadingPlan;
  const values: Record<string, unknown> = { 序号: index + 1, 日期: String(line.businessDate || "").slice(0, 10), 工厂名称: plan?.factory?.name, 订舱号: plan?.soOrder?.soNumber, 柜号: line.containerUnit?.containerNo, 柜型: line.containerUnit?.containerType, 行驶路线: line.route?.name, 车牌号: line.transportLeg?.vehicleNo || line.transportLeg?.vehicle?.plateNumber, 备注: line.priceSnapshot?.note || line.transportLeg?.note };
  return String(values[label] ?? "—");
}
export function BillLinesTable({ bill, items, offset, editable }: { bill: any; items: any[]; offset: number; editable: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null), [error, setError] = useState("");
  const totals = useMemo(() => Object.fromEntries(columns.filter(numeric).map(label => [label, bill.lines.reduce((sum: bigint, line: any) => sum + amount(line, label), 0n)])), [bill.lines]);
  const legCount = useMemo(() => new Set(bill.lines.map((line: any) => line.transportLegId).filter(Boolean)).size, [bill.lines]);
  async function remove(line: any) {
    if (!window.confirm("确认从账单移除此明细？")) return;
    setBusy(line.id); setError("");
    try { const response = await fetch(`/api/finance/bills/${bill.id}/lines?lineId=${encodeURIComponent(line.id)}`, { method: "DELETE" }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "移除失败"); router.refresh(); }
    catch (error) { setError(error instanceof Error ? error.message : "移除失败"); } finally { setBusy(null); }
  }
  function classes(label: string, index: number) { return [index >= columns.length - 2 ? css.frozenRight : "", numeric(label) ? css.number : "", label === "运费" || label === "小计" ? css.strong : ""].join(" "); }
  const position = (index: number) => index >= columns.length - 2 ? { right: index === columns.length - 2 ? widths[widths.length - 1] : 0 } : undefined;
  return <div className={css.root}>{error && <p role="alert">{error}</p>}<p className={css.hint}>金额单位：人民币（元） · 合计涵盖全部已入账明细，非仅当前页 · 左右滑动查看费用</p><div className={[css.scroll, !bill.lines.length ? css.emptyScroll : ""].join(" ")} tabIndex={0} role="region" aria-label="账单明细，可横向滚动"><table className={css.table} style={{ width: widths.reduce((sum, width) => sum + width, 0), minWidth: widths.reduce((sum, width) => sum + width, 0) }}><caption className={css.srOnly}>账单已入账明细与费用汇总</caption><colgroup>{columns.map((label, index) => <col key={label} style={{ width: widths[index] }} />)}</colgroup><thead><tr>{columns.map((label, index) => <th scope="col" key={label} className={classes(label, index)} style={position(index)}>{label}</th>)}</tr></thead><tbody>{items.map((line, index) => <tr key={line.id}>{columns.map((label, col) => <td key={label} className={classes(label, col)} style={position(col)} title={label === "操作" ? undefined : String(cell(line, label, index + offset))}>{label === "操作" ? <button className={css.remove} disabled={!editable || busy !== null} onClick={() => remove(line)}>{busy === line.id ? "移除中…" : "移除明细"}</button> : cell(line, label, index + offset)}</td>)}</tr>)}</tbody>{bill.lines.length > 0 && <tfoot><tr>{columns.map((label, index) => <td key={label} className={classes(label, index)} style={position(index)}>{index === 0 ? "合计" : index === 1 ? `${legCount} 个运段` : index === 2 ? `${bill.lines.length} 条明细` : numeric(label) ? money(totals[label]) : ""}</td>)}</tr></tfoot>}</table>{!bill.lines.length && <EmptyState title="暂无已入账明细">{editable ? "请通过右上角添加待结算运段，生成费用快照。" : "当前账单状态不支持追加明细。"}</EmptyState>}</div></div>;
}
