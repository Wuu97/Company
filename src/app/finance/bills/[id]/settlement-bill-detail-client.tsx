"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { SelectField, TextField } from "@/components/ui/form-controls";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import styles from "../../routes/routes.module.css";

type Column = { label: string; value: (line: any, index: number) => React.ReactNode };
const date = (value: unknown) => value ? String(value).slice(0, 10) : "—";
const text = (value: unknown) => value === undefined || value === null || value === "" ? "" : String(value);
const charge = (line: any, label: string) => text((line.priceSnapshot as any)?.fees?.find((fee: any) => fee.label === label || fee.code === label)?.amount);
const deduction = (line: any, label: string) => text((line.priceSnapshot as any)?.deductions?.find((fee: any) => fee.label === label || fee.code === label)?.amount);
async function request(url: string, body: unknown) { const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "操作失败"); return data; }

const value = {
  date: (line: any) => date(line.businessDate),
  factory: (line: any) => line.transportTask?.loadingPlan?.factory?.name || "—",
  so: (line: any) => line.transportTask?.loadingPlan?.soOrder?.soNumber || "—",
  containerNo: (line: any) => line.containerUnit?.containerNo || "—",
  containerType: (line: any) => line.containerUnit?.containerType || (line.priceSnapshot as any)?.rate?.containerTypes?.join(",") || "—",
  route: (line: any) => line.route?.name || "—",
  plate: (line: any) => line.transportLeg?.vehicleNo || line.transportLeg?.vehicle?.plateNumber || "—",
  kilometers: (line: any) => text(line.route?.standardKilometers),
  total: (line: any) => text(line.amountSnapshot),
};

function columnsFor(bill: any): Column[] {
  if (bill.billType === "DRIVER") return [
    ["序号", (_: any, index: number) => index + 1], ["工作号", () => "—"], ["做柜日期", value.date], ["工厂名称", value.factory], ["行驶路线", value.route], ["订舱号", value.so], ["柜型", value.containerType], ["柜号", value.containerNo], ["公里数", value.kilometers], ["付运费", (line: any) => text(line.unitPriceSnapshot)], ["关场费", (line: any) => charge(line, "关场费")], ["压车费", (line: any) => charge(line, "压车费")], ["打单费", (line: any) => charge(line, "打单费")], ["其他费", (line: any) => charge(line, "其他费")], ["小计", value.total], ["借款", (line: any) => deduction(line, "借款")], ["代收运费", (line: any) => charge(line, "代收运费")], ["罚款", (line: any) => deduction(line, "罚款")], ["其它", (line: any) => charge(line, "其它")],
  ].map(([label, cell]) => ({ label: label as string, value: cell as Column["value"] }));
  if (bill.billType === "PARTNER" || bill.billType === "TEMP_VEHICLE") return [
    ["序号", (_: any, index: number) => index + 1], ["做柜日期", value.date], ["装卸地点", value.route], ["柜型", value.containerType], ["柜号", value.containerNo], ["公里数", value.kilometers], ["司机运费", (line: any) => charge(line, "司机运费")], ["路桥费", (line: any) => charge(line, "路桥费")], ["油费", (line: any) => charge(line, "油费")], ["码头费", (line: any) => charge(line, "码头费")], ["高速费", (line: any) => charge(line, "高速费")], ["关场费", (line: any) => charge(line, "关场费")], ["空返费", (line: any) => charge(line, "空返费")], ["送本费", (line: any) => charge(line, "送本费")], ["停车费", (line: any) => charge(line, "停车费")], ["港建费", (line: any) => charge(line, "港建费")], ["保安费", (line: any) => charge(line, "保安费")], ["其他费", (line: any) => charge(line, "其他费")], ["小计", value.total],
  ].map(([label, cell]) => ({ label: label as string, value: cell as Column["value"] }));
  const denas = bill.customer?.name === "广东德纳斯金属制品有限公司";
  const extras = denas ? ["油费补贴", "异提费", "压车费", "约柜费", "堆存费", "封条费", "高速费", "预约费", "过磅费"] : ["报关费", "异提费", "压车费", "打单费", "港建费", "保安费", "高速费", "预约费", "其他费"];
  return [{ label: "序号", value: (_, index) => index + 1 }, { label: "日期", value: value.date }, { label: "工厂名称", value: value.factory }, { label: "订舱号", value: value.so }, { label: "柜号", value: value.containerNo }, { label: "柜型", value: value.containerType }, { label: "行驶路线", value: value.route }, { label: "车牌号", value: value.plate }, { label: "运费", value: line => text(line.unitPriceSnapshot) }, ...extras.map(label => ({ label, value: (line: any) => charge(line, label) })), { label: "小计", value: value.total }, { label: "备注", value: line => (line.priceSnapshot as any)?.note || line.transportLeg?.note || "" }, ...(denas ? [{ label: "税后合计", value: value.total }] : [])];
}
function ExcelTable({ bill }: { bill: any }) { const columns = columnsFor(bill); return <DataTable><thead><tr>{columns.map(column => <th key={column.label}>{column.label}</th>)}</tr></thead><tbody>{bill.lines.length ? bill.lines.map((line: any, index: number) => <tr key={line.id}>{columns.map(column => <td key={column.label}>{column.value(line, index)}</td>)}</tr>) : <tr><td colSpan={columns.length}>暂无明细</td></tr>}</tbody></DataTable>; }

export function SettlementBillDetailClient({ bill, candidates }: any) {
  const router = useRouter(); const [legKey, setLegKey] = useState(""), [notice, setNotice] = useState(""); const selected = useMemo(() => candidates.flatMap((task: any) => task.legs.map((leg: any) => ({ task, leg }))).find((item: any) => `${item.task.id}:${item.leg.id}` === legKey), [candidates, legKey]);
  async function add(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (!selected) return setNotice("请选择运输段"); const form = new FormData(event.currentTarget); try { await request(`/api/finance/bills/${bill.id}/lines`, { transportTaskId: selected.task.id, transportLegId: selected.leg.id, billingBasis: form.get("basis"), combination: "SINGLE", quantity: form.get("quantity"), containerUnitId: form.get("containerId") || undefined }); setNotice("明细已按已确认路线价格生成并保存快照。"); router.refresh(); } catch (error) { setNotice(error instanceof Error ? error.message : "新增失败"); } }
  const object = bill.driver?.name || bill.fleetOwner?.name || bill.vehicle?.plateNumber || bill.customer?.name;
  const editable = ["DRAFT", "ADJUSTED"].includes(bill.confirmationStatus) && bill.billType !== "TEMP_VEHICLE";
  return <main><PageHeader title={bill.billNo} description={`${object} · ${bill.settlementMonth} · 总额 ¥ ${bill.totalAmount}`} actions={<ButtonLink variant="secondary" href="/finance/bills">返回账单列表</ButtonLink>} /><p><StatusBadge tone={bill.confirmationStatus === "CONFIRMED" ? "success" : "warning"}>{bill.confirmationStatus}</StatusBadge> 已确认账单不可追加或覆盖原始价格。</p>{editable && <form className={styles.form} onSubmit={add}><SelectField label="待结算运输段" value={legKey} onChange={event => setLegKey(event.target.value)} required><option value="">请选择已完成、已关联路线的运输段</option>{candidates.flatMap((task: any) => task.legs.map((leg: any) => <option key={leg.id} value={`${task.id}:${leg.id}`}>{task.loadingPlan.soOrder.soNumber} · {leg.route.code} · {leg.vehicleNo || "未填车牌"}</option>))}</SelectField><SelectField label="计费单位" name="basis" defaultValue="LEG"><option value="LEG">按运输段</option><option value="TRIP">按趟</option><option value="CONTAINER">按柜</option></SelectField>{selected && <SelectField label="柜子（按柜必选）" name="containerId" defaultValue=""><option value="">未选择</option>{selected.task.loadingPlan.items.map((item: any) => <option key={item.containerUnit.id} value={item.containerUnit.id}>{item.containerUnit.containerNo || item.containerUnit.internalCode} · {item.containerUnit.containerType}</option>)}</SelectField>}<TextField label="计费数量" name="quantity" defaultValue="1.00" required inputMode="decimal"/><div><Button type="submit">添加明细</Button></div></form>}{bill.billType === "TEMP_VEHICLE" && <p>临时车账单仅归集标记为“临时现金车”的运输段，和合作车月结完全分开。</p>}{notice && <p role="status">{notice}</p>}<h3>已入账明细</h3><ExcelTable bill={bill}/></main>;
}
