"use client";
import { PageContainer } from "@/components/ui/page-container";
import { AppPagination } from "@/components/ui/app-pagination";
import { useListPagination } from "@/components/ui/use-list-pagination";


import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BillLinesTable } from "./bill-lines-table";
import { SelectField, TextField } from "@/components/ui/form-controls";
import ui from "./bill-detail.module.css";
import { StatusBadge } from "@/components/ui/status-badge";
import styles from "../../routes/routes.module.css";

async function request(url: string, body: unknown) { const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "操作失败"); return data; }

export function SettlementBillDetailClient({ bill, candidates }: any) {
  const router = useRouter(); const [legKey, setLegKey] = useState(""), [notice, setNotice] = useState(""); const selected = useMemo(() => candidates.flatMap((task: any) => task.legs.map((leg: any) => ({ task, leg }))).find((item: any) => `${item.task.id}:${item.leg.id}` === legKey), [candidates, legKey]);
  async function add(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (addBusy) return; if (!selected) return setAddError("请选择运输段"); setAddBusy(true); setAddError(""); const form = new FormData(event.currentTarget); try { await request(`/api/finance/bills/${bill.id}/lines`, { transportTaskId: selected.task.id, transportLegId: selected.leg.id, billingBasis: form.get("basis"), combination: "SINGLE", quantity: form.get("quantity"), containerUnitId: form.get("containerId") || undefined }); setAdding(false); setLegKey(""); setNotice("明细已按已确认路线价格生成并保存快照。"); router.refresh(); } catch (error) { setAddError(error instanceof Error ? error.message : "新增失败"); } finally { setAddBusy(false); } }
  const object = bill.driver?.name || bill.fleetOwner?.name || bill.vehicle?.plateNumber || bill.customer?.name;
  const editable = ["DRAFT", "ADJUSTED"].includes(bill.confirmationStatus) && bill.billType !== "TEMP_VEHICLE";
  const [addBusy, setAddBusy] = useState(false), [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false), [confirming, setConfirming] = useState(false);
  const statusNames: Record<string, string> = { DRAFT: "草稿", PENDING_CONFIRMATION: "待确认", CONFIRMED: "已确认", ADJUSTED: "已调整", VOIDED: "已作废" };
  async function confirmBill() {
    if (!window.confirm("确认账单后将锁定原始价格，是否继续？")) return;
    setConfirming(true);
    try {
      const response = await fetch(`/api/finance/bills/${bill.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ confirmationStatus: "CONFIRMED" }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "确认失败");
      setAdding(false); setNotice("账单已确认，原始价格已锁定。"); router.refresh();
    } catch (error) { setNotice(error instanceof Error ? error.message : "确认失败"); }
    finally { setConfirming(false); }
  }
  const updatedAt = bill.updatedAt ? new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(bill.updatedAt)) : "—";
  const pagination = useListPagination<any>(bill.lines, bill.id);
  return <main className={styles.billDetails}><PageContainer workspace className={ui.mainCard} pagination={bill.lines.length > 0 ? <AppPagination {...pagination.props} /> : undefined}><header className={ui.header}><div className={ui.headingGroup}><a className={ui.back} href={`/finance/bills?tab=${bill.billType}`}>← 返回账单列表</a><h1 className={ui.title}>{bill.billNo}</h1><StatusBadge tone={bill.confirmationStatus === "CONFIRMED" ? "success" : "warning"}>{statusNames[bill.confirmationStatus] || "未知状态"}</StatusBadge></div><div data-page-toolbar className={ui.actions}><span title={!editable ? bill.billType === "TEMP_VEHICLE" ? "临时车账单不支持手动追加运段" : "仅草稿或已调整账单可追加运段，当前账单已锁定或不可编辑" : undefined}><Button create size="toolbar" aria-expanded={adding} disabled={!editable || addBusy} onClick={() => { setAddError(""); setAdding(true); }}>添加待结算运段</Button></span><Button size="toolbar" variant="secondary" onClick={() => window.print()}>打印对账单</Button><Button size="toolbar" variant="secondary" disabled={confirming || !["DRAFT", "PENDING_CONFIRMATION", "ADJUSTED"].includes(bill.confirmationStatus)} onClick={confirmBill}>{confirming ? "正在确认…" : bill.confirmationStatus === "CONFIRMED" ? "已确认 / 已锁定" : "确认账单"}</Button></div></header><section className={ui.banner} aria-label="账单概览"><div className={ui.amount}><span>账单总额</span><div className={ui.amountValue}><strong>{new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", minimumFractionDigits: 2 }).format(Number(bill.totalAmount))}</strong></div></div><dl className={ui.metadata}><div><dt>结算对象</dt><dd>{object || "—"}</dd></div><div><dt>结算月份</dt><dd>{bill.settlementMonth}</dd></div><div><dt>已入账运段</dt><dd>{bill.lines.length} 条</dd></div><div><dt>更新时间</dt><dd>{updatedAt}</dd></div></dl></section><section className={ui.details}><div className={ui.alert} role="note"><span aria-hidden="true">ⓘ</span><span>已确认账单不可追加或覆盖原始价格。</span></div>{bill.billType === "TEMP_VEHICLE" && <p>临时车账单仅归集标记为“临时现金车”的运输段，和合作车月结完全分开。</p>}{notice && <p className={styles.notice} role="status">{notice}</p>}<h3 className={ui.detailsTitle}>已入账明细</h3><BillLinesTable bill={bill} items={pagination.items} offset={(pagination.props.currentPage - 1) * pagination.props.pageSize} editable={editable} /></section></PageContainer>{editable && adding && <Dialog title="添加待结算运段" onClose={() => { setAdding(false); setAddError(""); }} closeDisabled={addBusy} actions={<><Button size="toolbar" variant="secondary" disabled={addBusy} onClick={() => { setAdding(false); setAddError(""); }}>取消</Button><Button size="toolbar" variant="primary" type="submit" form="add-bill-line" disabled={addBusy}>{addBusy ? "正在添加…" : "确认添加"}</Button></>}><form id="add-bill-line" className={ui.drawerForm} onSubmit={add}><SelectField label="待结算运输段" value={legKey} onChange={event => setLegKey(event.target.value)} required><option value="">请选择已完成、已关联路线的运输段</option>{candidates.flatMap((task: any) => task.legs.map((leg: any) => <option key={leg.id} value={`${task.id}:${leg.id}`}>{String(task.completedAt || task.scheduledAt || "").slice(0, 10)} · {task.loadingPlan.soOrder.soNumber} · {leg.route.name} · {leg.vehicleNo || "未填车牌"}</option>))}</SelectField><SelectField label="计费单位" name="basis" defaultValue="LEG"><option value="LEG">按运输段</option><option value="TRIP">按趟</option><option value="CONTAINER">按柜</option></SelectField>{selected && <SelectField label="柜子（按柜必选）" name="containerId" defaultValue=""><option value="">未选择</option>{selected.task.loadingPlan.items.map((item: any) => <option key={item.containerUnit.id} value={item.containerUnit.id}>{item.containerUnit.containerNo || item.containerUnit.internalCode} · {item.containerUnit.containerType}</option>)}</SelectField>}<TextField label="计费数量" name="quantity" defaultValue="1.00" required inputMode="decimal"/></form>{addError && <p role="alert" className={ui.addError}>{addError}</p>}</Dialog>}</main>;
}
