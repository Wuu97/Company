import { prisma } from "@/lib/prisma";
import businessStyles from "@/components/business.module.css";
import { notFound } from "next/navigation";
import { DeleteOrderButton } from "@/components/delete-order-button";
import { InlineOrderValue } from "@/components/inline-order-value";
import { SoFilePreview } from "@/components/so-file-preview";
import { SoVersionUpload } from "@/components/so-version-upload";
import { CancelActionButton } from "@/components/cancel-action-button";
import { ApplyVersionChangeButton } from "@/components/apply-version-change-button";
import { ContainerAdjustmentForm } from "@/components/container-adjustment-form";
import { KeyValueGrid } from "@/components/ui/key-value-grid";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
const changeLabels: Record<string, string> = { soNumber: "SO 编号", carrier: "船公司", vesselName: "船名", voyage: "航次", etdText: "预计开船时间", etaText: "预计到港时间", etbText: "预计靠港时间", openingText: "开仓时间", siCutoffText: "补料时间", vgmCutoffText: "VGM 截止时间", portCutoffText: "码头截止时间" };
function versionChangeRows(changes: unknown) { if (!changes || typeof changes !== "object" || Array.isArray(changes)) return []; return Object.entries(changes as Record<string, unknown>).map(([key, value]) => ({ label: changeLabels[key] || "其他业务信息", value: typeof value === "object" ? "已更新" : String(value ?? "已清空") })); }
function pending(value?: string | null) { return !value || ["待解析", "待核对", "待人工核对"].includes(value.trim()); }
import { OrderStatusTag, ParseStatusTag } from "@/components/order-status-form";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { OrderSectionNav } from "@/components/order-section-nav";
import { estimateEtbFromPortCutoff, formatChinaDateTime, formatOperationalTimeText } from "@/lib/time";
import styles from "./page.module.css";

export default async function OrderDetail({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const [order,customers]=await Promise.all([prisma.soOrder.findUnique({where:{id},include:{customer:true,files:{orderBy:{version:"asc"}},containers:true,plans:{include:{factory:true,items:true}},versionChanges:{where:{status:"PENDING"},include:{soFileVersion:true}}}}),prisma.customer.findMany({select:{id:true,name:true},orderBy:{name:"asc"}})]);
  if(!order)notFound();
  const etb=order.etbText?formatOperationalTimeText(order.etbText):estimateEtbFromPortCutoff(order.portCutoffText);
  const parsedContainers = ((order.files.at(-1)?.rawExtraction as { containers?: Array<{ containerType?: string; quantity?: number }> } | null)?.containers ?? []).filter(item => item.containerType && item.quantity).map(item => ({ containerType: item.containerType!, quantity: item.quantity! }));
  const initialContainers = order.containers.filter(container => container.active).sort((a, b) => a.internalCode.localeCompare(b.internalCode)).map(container => ({ id: container.id, internalCode: container.internalCode, containerType: container.containerType, note: container.note, containerNo: container.containerNo }));
  return <>
    <PageHeader title={<>SO 详情：{order.soNumber}</>} actions={<DeleteOrderButton orderId={id} returnToOrders/>}/>
    <section className={styles.summary}>
      <div className={styles.field}><span className={styles.fieldLabel}>客户</span><div className={styles.fieldValue}><b>{order.customer?.name || <InlineOrderValue orderId={id} field="customerId" display="待匹配" placeholder="选择客户" options={customers}/>}</b></div></div>
      <div className={styles.field}><span className={styles.fieldLabel}>船公司</span><div className={styles.fieldValue}><b>{pending(order.carrier) ? <InlineOrderValue orderId={id} field="carrier" display="待解析" placeholder="输入船公司"/> : order.carrier}</b></div></div>
      <div className={styles.field}><span className={styles.fieldLabel}>船名 / 航次</span><div className={styles.fieldValue}><b>{pending(order.vesselName) ? <InlineOrderValue orderId={id} field="vesselName" display="待核对" placeholder="输入船名"/> : order.vesselName} / {pending(order.voyage) ? <InlineOrderValue orderId={id} field="voyage" display="待核对" placeholder="输入航次"/> : order.voyage}</b></div></div>
      <div className={styles.field}><span className={styles.fieldLabel}>解析状态</span><div className={styles.fieldValue}>{["PARSED", "VERIFIED"].includes(order.parseStatus) ? <ParseStatusTag orderId={id} status={order.parseStatus as "PARSED" | "VERIFIED"}/> : <StatusBadge tone={statusTone(order.parseStatus)}>{statusLabel(order.parseStatus)}</StatusBadge>}</div></div>
      <div className={styles.field}><span className={styles.fieldLabel}>业务状态</span><div className={styles.fieldValue}><OrderStatusTag orderId={id} status={order.status}/></div></div>
    </section>
    <OrderSectionNav/>
    {order.versionChanges.map(change=>{const rows=versionChangeRows(change.changes);return <section key={change.id}><h3>新版本差异待确认（v{change.soFileVersion.version}）</h3>{rows.length?<ul className={businessStyles["change-summary"]}>{rows.map((row,index)=><li key={`${row.label}-${index}`}><b>{row.label}：</b>{row.value}</li>)}</ul>:<p>本次版本包含待确认的业务信息更新。</p>}<p className={businessStyles["muted"]}>柜型或柜量变化不会在此自动应用，需使用柜量调整流程处理。</p><ApplyVersionChangeButton url={`/api/orders/${id}/version-changes/${change.id}/apply`}/></section>})}
    <section className={styles.fileSection}><h3>上传的 SO 文件</h3>{order.files.map(f=><SoFilePreview key={f.id} fileId={f.id} fileName={f.originalName}/>)}</section>
    <section><h3>关键时间</h3><KeyValueGrid items={[{label:"预计靠泊时间（ETB）",emphasis:true,value:<InlineOrderValue orderId={id} field="etbText" value={etb || ""} display={etb || "待人工核对"} placeholder="输入 ETB"/>},{label:"补料时间",value:<InlineOrderValue orderId={id} field="siCutoffText" value={order.siCutoffText ? formatOperationalTimeText(order.siCutoffText) : ""} display={order.siCutoffText ? formatOperationalTimeText(order.siCutoffText) : "待人工核对"} placeholder="输入补料时间"/>},{label:"截关时间（CY）",value:<InlineOrderValue orderId={id} field="portCutoffText" value={order.portCutoffText ? formatOperationalTimeText(order.portCutoffText) : ""} display={order.portCutoffText ? formatOperationalTimeText(order.portCutoffText) : "待人工核对"} placeholder="输入 CY 截关时间"/>},{label:"预计到港时间（ETA）",value:<InlineOrderValue orderId={id} field="etaText" value={order.etaText ? formatOperationalTimeText(order.etaText) : ""} display={order.etaText ? formatOperationalTimeText(order.etaText) : "待人工核对"} placeholder="输入 ETA"/>},{label:"预计开船时间（ETD）",value:<InlineOrderValue orderId={id} field="etdText" value={order.etdText ? formatOperationalTimeText(order.etdText) : ""} display={order.etdText ? formatOperationalTimeText(order.etdText) : "待人工核对"} placeholder="输入 ETD"/>}]} /></section>
    <section><h3>空柜流转</h3><div className={styles.locationSummary}><span>提柜</span><b>{order.emptyPickupLocation || <InlineOrderValue className={styles.locationValue} orderId={id} field="emptyPickupLocation" display="待人工核对" placeholder="输入提空柜地点"/>}</b><span>还柜</span><b>{order.fullReturnLocation || <InlineOrderValue className={styles.locationValue} orderId={id} field="fullReturnLocation" display="待人工核对" placeholder="输入交重柜地点"/>}</b></div></section>
    <ContainerAdjustmentForm orderId={id} initialContainers={initialContainers.length ? initialContainers : parsedContainers.flatMap(({ containerType, quantity }) => Array.from({ length: quantity }, () => ({ containerType })) )}/>
    <SoVersionUpload orderId={id}/>
    <section><h3>装柜计划</h3>{order.plans.length?<div className={styles.planList}>{order.plans.map(p=><article className={styles.planItem} key={p.id}><div><b>{formatChinaDateTime(p.scheduledAt)} · {p.factory.name}</b><span>{statusLabel(p.status)} · 已安排 {p.items.length} 柜</span></div>{["DRAFT","CONFIRMED"].includes(p.status)&&<CancelActionButton url={`/api/plans/${p.id}/cancel`} label="取消计划"/>}</article>)}</div>:"暂无计划"}</section>
  </>;
}
