"use client";

import { TABLE_EMPTY_MARKER, TablePlaceholder } from "@/components/ui/table-placeholder";
import { TableHeader } from "@/components/ui/table-header";

import { partnerStatementHeaders, partnerStatementCell } from "@/lib/settlement/partner-statement";
import { useConfirm } from "@/components/ui/use-confirm";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusTag } from "@/components/ui/status-tag";
import { EmptyState } from "@/components/ui/empty-state";
import { driverStatementCell } from "@/lib/settlement/driver-statement";
import { DriverStatementTable } from "@/components/driver-statement-table";
import css from "./bill-lines-table.module.css";

const fees = ["报关费", "异提费", "压车费", "打单费", "港建费", "保安费", "高速费", "预约费", "油费补贴", "约柜费", "堆存费", "封条费", "过磅费", "其他费"];
const columns = ["序号", "日期", "订舱号", "柜号", "工厂名称", "柜型", "行驶路线", "车牌号", "运费", ...fees, "备注", "小计", "操作"];
// Explicit widths distribute available space across every column, never two auto columns.
const expandedColumns = [
  ["序号", 50], ["日期", 100], ["工厂名称", 130], ["订舱号", 130],
  ["柜号", 130], ["柜型", 70], ["行驶路线", 140], ["车牌号", 100],
  ["运费", 100], ["报关费", 80], ["异提费", 80], ["压车费", 80],
  ["打单费", 80], ["港建费", 80], ["保安费", 80],
  ["高速费", 80], ["预约费", 80], ["油费补贴", 80], ["约柜费", 80],
  ["堆存费", 80], ["封条费", 80], ["过磅费", 80], ["其他费", 80],
  ["小计", 110], ["备注", 140],
] as const;
const expandedWidth = expandedColumns.reduce((sum, [, width]) => sum + width, 0);
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
  return String(values[label] ?? TABLE_EMPTY_MARKER);
}
export function BillLinesTable({ bill, items, offset, editable }: { bill: any; items: any[]; offset: number; editable: boolean }) {
  const { showConfirm, confirmationDialog } = useConfirm();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null), [error, setError] = useState("");
  const totals = useMemo(() => Object.fromEntries(columns.filter(numeric).map(label => [label, bill.lines.reduce((sum: bigint, line: any) => sum + amount(line, label), 0n)])), [bill.lines]);
  const legCount = useMemo(() => new Set(bill.lines.map((line: any) => line.transportLegId).filter(Boolean)).size, [bill.lines]);
  async function remove(line: any) {
    if (!await showConfirm({ title: "移除账单明细", description: "确认从账单移除此明细？", danger: true, confirmLabel: "确认移除" })) return;
    setBusy(line.id); setError("");
    try { const response = await fetch(`/api/finance/bills/${bill.id}/lines?lineId=${encodeURIComponent(line.id)}`, { method: "DELETE" }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "移除失败"); router.refresh(); }
    catch (error) { setError(error instanceof Error ? error.message : "移除失败"); } finally { setBusy(null); }
  }
  const extra = (line: any) => fees.reduce((sum, label) => sum + amount(line, label), 0n);
  const feeTitle = (line: any) => fees.map(label => `${label}：¥${money(amount(line, label))}`).join("\n");
  const partner = bill.billType === "PARTNER";
  const valueCell = partner ? partnerStatementCell : driverStatementCell;
  const feeLabels = partner ? [...partnerStatementHeaders.slice(7, 18)] : ["关场费", "压车费", "打单费", "其他费", "借款", "代收运费", "罚款", "其它"];
  const driverValue = (line: any, label: string, index = 0) => {
    const value = valueCell(line, label, index);
    return typeof value === "bigint" ? money(value) : value;
  };
  const driverTags = (line: any, labels: string[]) => <div className={css.feeTags}>{labels.map(label => <StatusTag key={label} text={`${label} ${driverValue(line, label)}`} />)}</div>;
  const driverSum = (label: string) => {
    const values = bill.lines.map((line: any) => valueCell(line, label, 0)).filter((value: unknown) => typeof value === "bigint") as bigint[];
    return values.length ? money(values.reduce((sum, value) => sum + value, 0n)) : TABLE_EMPTY_MARKER;
  };
  const freightLabel = partner ? "司机运费" : "付运费";
  const moneyCell = (value: string | number, heading: string) => value === TABLE_EMPTY_MARKER ? <TablePlaceholder heading={heading} /> : value;
  if (bill.billType === "DRIVER" || partner) return <div className={css.root}>{confirmationDialog}
    {error && <p role="alert">{error}</p>}
    <p className={css.hint}>作业明细 · 金额单位：元 · 合计涵盖全部明细 · {TABLE_EMPTY_MARKER} 表示未记录</p>
    <div className={css.scroll} role="region" aria-label={partner ? "合作车明细" : "司机工资明细"}>
      <table className={`${css.table} ${css.compact}`}>
        <caption className={css.srOnly}>司机工资明细（紧凑模式）</caption>
        <colgroup>{[5, 18, 18, 13, 10, 18, 10, 8].map((width, index) => <col key={index} style={{ width: `${width}%` }} />)}</colgroup>
        <TableHeader><tr>{["序号", partner ? "做柜日期 / 装卸地点" : "做柜日期 / 行驶路线", partner ? "柜号 / 柜型" : "订舱号 / 柜号 / 柜型", partner ? "公里数" : "工厂 / 工作号 / 公里数", partner ? "司机运费" : "付运费", "费用 / 扣款明细", "小计", "操作"].map((label, index) => <th key={label} scope="col" className={index >= 4 && index <= 6 ? css.number : undefined}>{label}</th>)}</tr></TableHeader>
        <tbody>{items.map((line, index) => <tr key={line.id}>
          <td>{offset + index + 1}</td>
          <td>{driverValue(line, "做柜日期")}<div className={css.secondary}>{driverValue(line, partner ? "装卸地点" : "行驶路线")}</div></td>
          <td><div className={css.container}>{driverValue(line, "柜号")}<StatusTag text={String(driverValue(line, "柜型"))} /></div>{!partner && <div className={css.secondary}>{driverValue(line, "订舱号")}</div>}</td>
          <td>{!partner && <>{driverValue(line, "工厂名称")}<div className={css.secondary}>工作号：{driverValue(line, "工作号")}</div></>}<div className={css.secondary}>公里数：{driverValue(line, "公里数")}</div></td>
          <td className={css.number}>{moneyCell(driverValue(line, freightLabel), freightLabel)}</td>
          <td>{driverTags(line, feeLabels)}</td>
          <td className={`${css.number} ${css.strong}`}>{moneyCell(driverValue(line, "小计"), "小计")}</td>
          <td><button className={css.remove} disabled={!editable || busy !== null} onClick={() => remove(line)}>{busy === line.id ? "移除中…" : "移除"}</button></td>
        </tr>)}</tbody>
        {bill.lines.length > 0 && <tfoot><tr><td>合计</td><td>{legCount} 个运段</td><td>{bill.lines.length} 条明细</td><td /><td className={css.number}>{moneyCell(driverSum(freightLabel), freightLabel)}</td><td><div className={css.feeTags}>{feeLabels.map(label => <StatusTag key={label} text={`${label} ${driverSum(label)}`} />)}</div></td><td className={`${css.number} ${css.strong}`}>{moneyCell(driverSum("小计"), "小计")}</td><td /></tr></tfoot>}
      </table>
      <DriverStatementTable partner={partner} className={`${css.table} ${css.expanded}`} items={items} allItems={bill.lines} offset={offset} actions={line => <div><button className={css.remove} disabled={!editable || busy !== null} onClick={() => remove(line)}>{busy === line.id ? "移除中…" : "移除"}</button></div>} />
      {!bill.lines.length && <EmptyState title="暂无已入账明细">添加待结算运段后显示司机作业明细。</EmptyState>}
    </div>
  </div>;
  return <div className={css.root}>{confirmationDialog}
    {error && <p role="alert">{error}</p>}
    <p className={css.hint}>金额单位：人民币（元） · 合计涵盖全部已入账明细，非仅当前页</p>
    <div className={css.scroll} role="region" aria-label="账单明细">
      <table className={`${css.table} ${css.compact}`}>
        <caption className={css.srOnly}>账单已入账明细与费用汇总</caption>
        <colgroup>{[5, 18, 18, 13, 10, 18, 10, 8].map((width, index) => <col key={index} style={{ width: `${width}%` }} />)}</colgroup>
        <TableHeader><tr>{["序号", "日期 / 行驶路线", "订舱号 / 柜号 / 柜型", "工厂 / 车牌号", "基本运费", "杂费明细", "小计金额", "操作"].map((label, index) => <th key={label} scope="col" className={index >= 4 && index <= 6 ? css.number : index === 0 || index === 7 ? css.center : undefined}>{label}</th>)}</tr></TableHeader>
        <tbody>{items.map((line, index) => <tr key={line.id}>
          <td className={css.center}>{offset + index + 1}</td>
          <td><strong>{cell(line, "日期", index)}</strong><div className={css.secondary}>{cell(line, "行驶路线", index)}</div></td>
          <td><div className={css.container}><span>{cell(line, "柜号", index)}</span><StatusTag text={cell(line, "柜型", index)} /></div><div className={css.secondary}>{cell(line, "订舱号", index)}</div></td>
          <td>{cell(line, "工厂名称", index)}<div className={css.secondary}>{cell(line, "车牌号", index)}</div></td>
          <td className={css.number}>{money(amount(line, "运费"))}</td>
          <td className={css.number} title={feeTitle(line)}><span>{money(extra(line))}</span>{extra(line) > 0n && <div className={css.feeTags}>{fees.filter(label => amount(line, label) !== 0n).map(label => <StatusTag key={label} text={`${label} ${money(amount(line, label))}`} />)}</div>}</td>
          <td className={`${css.number} ${css.strong}`}>{money(amount(line, "小计"))}</td>
          <td className={css.center}><button className={css.remove} disabled={!editable || busy !== null} onClick={() => remove(line)}>{busy === line.id ? "移除中…" : "移除"}</button></td>
        </tr>)}</tbody>
        {bill.lines.length > 0 && <tfoot><tr><td className={css.center}>合计</td><td>{legCount} 个运段</td><td>{bill.lines.length} 条明细</td><td /><td className={css.number}>{money(totals["运费"])}</td><td className={css.number}>{money(fees.reduce((sum, label) => sum + totals[label], 0n))}</td><td className={`${css.number} ${css.strong}`}>{money(totals["小计"])}</td><td /></tr></tfoot>}
      </table>
      <table className={`${css.table} ${css.expanded}`}>
        <caption className={css.srOnly}>账单已入账明细与费用汇总（完整展开）</caption>
        <colgroup>{expandedColumns.map(([label, width]) => <col key={label} style={{ width: `${width / expandedWidth * 100}%` }} />)}</colgroup>
        <TableHeader><tr>{expandedColumns.map(([label]) => <th key={label} scope="col" className={numeric(label) ? css.number : undefined}>{label}</th>)}</tr></TableHeader>
        <tbody>{items.map((line, index) => <tr key={line.id}>{expandedColumns.map(([label]) => <td key={label} className={numeric(label) ? css.number : undefined}>
          {cell(line, label, offset + index)}
          {label === "备注" && <div><button className={css.remove} disabled={!editable || busy !== null} onClick={() => remove(line)}>{busy === line.id ? "移除中…" : "移除"}</button></div>}
        </td>)}</tr>)}</tbody>
        {bill.lines.length > 0 && <tfoot><tr>{expandedColumns.map(([label], index) => <td key={label} className={numeric(label) ? css.number : undefined}>{index === 0 ? "合计" : index === 1 ? `${legCount} 个运段` : numeric(label) ? money(totals[label]) : ""}</td>)}</tr></tfoot>}
      </table>
      {!bill.lines.length && <EmptyState title="暂无已入账明细">{editable ? "请通过右上角添加待结算运段，生成费用快照。" : "当前账单状态不支持追加明细。"}</EmptyState>}
    </div>
  </div>;
}
