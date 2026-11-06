"use client";
import { MonthPicker } from "@/components/ui/month-picker";
import { AppPagination } from "@/components/ui/app-pagination";
import { useListPagination } from "@/components/ui/use-list-pagination";

import { PageContainer } from "@/components/ui/page-container";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CommonFilterBar, type FilterValues } from "@/components/ui/common-filter-bar";
import { type DataTableColumn } from "@/components/ui/data-table";
import { StatusTag } from "@/components/ui/status-tag";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";

import { SelectField } from "@/components/ui/form-controls";

import { PageHeader } from "@/components/ui/page-header";
import ui from "./settlement-bills.module.css";
import styles from "../routes/routes.module.css";

type Type = "DRIVER" | "PARTNER" | "TEMP_VEHICLE" | "CUSTOMER";
const labels: Record<Type, string> = { DRIVER: "司机工资", PARTNER: "合作车账单", TEMP_VEHICLE: "临时车账单", CUSTOMER: "客户对账单" };
const statusLabel: Record<string, string> = { DRAFT: "草稿", PENDING_CONFIRMATION: "待确认", CONFIRMED: "已确认", ADJUSTED: "已调整", VOIDED: "已作废", UNPAID: "未结算", PARTIALLY_PAID: "部分结算", PAID: "已结清", REVERSED: "已冲销" };
const confirmationChoices = (status: string) => status === "DRAFT" ? ["DRAFT", "PENDING_CONFIRMATION"] : status === "PENDING_CONFIRMATION" ? ["DRAFT", "PENDING_CONFIRMATION", "CONFIRMED"] : [status];
const paymentChoices = ["UNPAID", "PARTIALLY_PAID", "PAID", "REVERSED"];
function monthNow() { return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit" }).format(new Date()); }

async function request(url: string, method = "GET", body?: unknown) { const res = await fetch(url, { method, headers: body ? { "content-type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined }); const json = await res.json(); if (!res.ok) throw new Error(json.error || "操作失败"); return json; }

export function SettlementBillsClient({ initialBills, options, initialTab }: any) {
  const router = useRouter(); const [tab, setTab] = useState<Type>(Object.hasOwn(labels, initialTab) ? initialTab : "DRIVER"), [objectFilter, setObjectFilter] = useState(""), [monthFilter, setMonthFilter] = useState(""), [creating, setCreating] = useState(false), [notice, setNotice] = useState(""), [month, setMonth] = useState(monthNow);
  const [search, setSearch] = useState(""), [confirmation, setConfirmation] = useState(""), [payment, setPayment] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const objectName = (bill: any) => bill.driver?.name || bill.fleetOwner?.name || bill.vehicle?.plateNumber || bill.customer?.name || "—";
  const filterField = tab === "DRIVER" ? "driverId" : tab === "CUSTOMER" ? "customerId" : undefined;
  const settlementMonths = useMemo(() => [...new Set<string>(initialBills.filter((bill: any) => bill.billType === tab).map((bill: any) => bill.settlementMonth))].sort((a, b) => b.localeCompare(a)), [initialBills, tab]);
  const rows = useMemo(() => initialBills.filter((b: any) => b.billType === tab && (!filterField || !objectFilter || b[filterField] === objectFilter) && (!monthFilter || b.settlementMonth === monthFilter) && (!confirmation || b.confirmationStatus === confirmation) && (!payment || b.paymentStatus === payment) && (!search.trim() || `${b.billNo} ${objectName(b)}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))), [initialBills, tab, filterField, objectFilter, monthFilter, confirmation, payment, search]);
  async function create(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const f = new FormData(event.currentTarget); try { if (!f.get("objectId")) { setNotice("请先选择结算对象"); return; } const bill = await request("/api/finance/bills", "POST", { billType: tab, settlementMonth: f.get("month"), settlementObjectId: f.get("objectId") }); setCreating(false); setNotice(`已创建 ${bill.billNo}。请从待结算明细加入已完成的运输段。`); router.refresh(); } catch (e) { setNotice(e instanceof Error ? e.message : "创建失败"); } }
  const pagination = useListPagination<any>(rows,JSON.stringify([tab,objectFilter,monthFilter,search,confirmation,payment]));
  const statusTag = (status: string) => <StatusTag type={status === "CONFIRMED" || status === "PAID" ? "success" : status === "VOIDED" ? "danger" : status === "PENDING_CONFIRMATION" || status === "PARTIALLY_PAID" ? "warning" : "default"}>{statusLabel[status] || status}</StatusTag>;
  const columns: DataTableColumn<any>[] = [
    { key: "billNo", title: "账单编号", dataIndex: "billNo", render: (_, bill) => <a title={bill.billNo} href={`/finance/bills/${bill.id}`}>{bill.billNo.replace(/-\d{4}(?:0[1-9]|1[0-2])-\d+$/, "") || bill.billNo}</a> },
    { key: "object", title: "结算对象", render: (_, bill) => <span title={objectName(bill)}>{objectName(bill)}</span> },
    { key: "month", title: "结算月份", dataIndex: "settlementMonth", type: "month", width: 100 },
    { key: "count", title: "明细条数", dataIndex: ["_count", "lines"], type: "number", width: 80 },
    { key: "amount", title: "金额", dataIndex: "totalAmount", type: "money", width: 100 },
    { key: "confirmation", title: "对账状态", dataIndex: "confirmationStatus", type: "status", width: 90, render: value => statusTag(String(value)) },
    { key: "payment", title: "收付款状态", dataIndex: "paymentStatus", type: "status", width: 90, render: value => statusTag(String(value)) },
    { key: "actions", title: "操作", width: 80, align: "center", render: (_, bill) => <div className={ui.operations}><button type="button" onClick={() => setEditing(bill)}>修改状态</button></div> }
  ];
  return <main><PageHeader title="账单管理"  />
<PageContainer actions={<Button create size="toolbar" onClick={() => setCreating(true)}>新增{labels[tab]}</Button>} pagination={<AppPagination {...pagination.props} />} tabsLabel="账单类别" tabs={(Object.keys(labels) as Type[]).map(type => ({ label: labels[type], active: tab === type, onClick: () => { setTab(type); window.history.replaceState(null, "", `/finance/bills?tab=${type}`); setObjectFilter(""); setMonthFilter(""); setSearch(""); setConfirmation(""); setPayment(""); } }))} filter={<CommonFilterBar values={{ search, object: objectFilter, month: monthFilter, confirmation, payment }} items={[
  { type: "input", key: "search", label: "搜索账单", placeholder: "搜索账单编号/结算对象" },
  ...(filterField ? [{ type: "select" as const, key: "object", label: tab === "DRIVER" ? "全部司机" : "全部客户", options: (options[tab] || []).map((item: any) => ({ value: item.id, label: item.name })) }] : []),
  { type: "select", key: "month", label: "选择月份", options: settlementMonths.map(value => ({ value, label: value })) },
  { type: "select", key: "confirmation", label: "对账状态", options: ["DRAFT", "PENDING_CONFIRMATION", "CONFIRMED", "ADJUSTED", "VOIDED"].map(value => ({ value, label: statusLabel[value] })) },
  { type: "select", key: "payment", label: "收付款状态", options: paymentChoices.map(value => ({ value, label: statusLabel[value] })) }
]} onSearch={(values: FilterValues) => { setSearch(String(values.search || "")); setObjectFilter(String(values.object || "")); setMonthFilter(String(values.month || "")); setConfirmation(String(values.confirmation || "")); setPayment(String(values.payment || "")); }} />}>
{notice && <p className={styles.notice} role="status">{notice}</p>}<DataTable fitContainer className={ui.billTable} mobileHint={null} columns={columns} dataSource={pagination.items} rowKey="id" empty={{ title: "暂无符合条件的账单", description: "创建账单后，可添加已完成运输段的待结算明细。" }} />{editing && <Dialog title="修改账单状态" subtitle={`账单编号：${editing.billNo}`} onClose={() => setEditing(null)} actions={<><Button size="toolbar" variant="secondary" onClick={() => setEditing(null)}>取消</Button><Button size="toolbar" type="submit" form="bill-status-form">保存状态</Button></>}><form id="bill-status-form" className={styles.dialogForm} onSubmit={async event => { event.preventDefault(); const data = new FormData(event.currentTarget); try { await request(`/api/finance/bills/${editing.id}`, "PATCH", { confirmationStatus: String(data.get("confirmationStatus") || editing.confirmationStatus), paymentStatus: String(data.get("paymentStatus")) }); setEditing(null); router.refresh(); } catch (error) { setNotice(error instanceof Error ? error.message : "更新失败"); } }}><fieldset className={ui.statusGroup}><legend>对账状态</legend><div className={ui.statusOptions}>{confirmationChoices(editing.confirmationStatus).map(status => <label key={status} className={ui.statusOption}><input type="radio" name="confirmationStatus" value={status} defaultChecked={status === editing.confirmationStatus} /><span>{status === "DRAFT" && editing.confirmationStatus === "PENDING_CONFIRMATION" ? "退回草稿" : statusLabel[status]}</span></label>)}</div></fieldset><fieldset className={ui.statusGroup}><legend>收付款状态</legend><div className={ui.statusOptions}>{paymentChoices.map(status => <label key={status} className={ui.statusOption}><input type="radio" name="paymentStatus" value={status} defaultChecked={status === editing.paymentStatus} /><span>{statusLabel[status]}</span></label>)}</div></fieldset></form></Dialog>}{creating && <Dialog title={`新增${labels[tab]}`} onClose={() => setCreating(false)} actions={<><Button size="toolbar" variant="secondary" onClick={() => setCreating(false)}>取消</Button><Button size="toolbar" type="submit" form="bill-form">新增账单</Button></>}><form id="bill-form" className={ui.createForm} onSubmit={create}><MonthPicker name="month" value={month} onChange={setMonth} /><SelectField label={tab === "DRIVER" ? "司机" : tab === "PARTNER" ? "合作车老板" : tab === "TEMP_VEHICLE" ? "临时车" : "客户"} name="objectId" defaultValue="" required><option value="">请选择{tab === "DRIVER" ? "司机" : tab === "PARTNER" ? "合作车老板" : tab === "TEMP_VEHICLE" ? "临时车" : "客户"}</option>{(options[tab] || []).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField></form></Dialog>}
</PageContainer>
</main>;
}
