import { prisma } from "@/lib/prisma";
import businessStyles from "@/components/business.module.css";
import { evaluateRiskAlerts } from "@/lib/risk-alerts";
import { formatChinaDateTime } from "@/lib/time";
import { soReviewReasons } from "@/lib/so-review-task";
import { statusLabel } from "@/lib/status-labels";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import styles from "./page.module.css";

const alertSeverityLabels: Record<string, string> = { CRITICAL: "紧急", WARNING: "需关注" };

export default async function Dashboard() {
  const [pendingOrders, parseReviewCandidates, unmatchedOrders, unplanned, etbOrders, etbHandoffs, contactTasks, impactedTransport, ordersForConfirm, riskOrders] = await Promise.all([
    prisma.soOrder.findMany({ where: { parseStatus: { in: ["PENDING", "PARSED", "FAILED"] } }, select: { id: true, soNumber: true, carrier: true, parseStatus: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.soOrder.findMany({ where: { parseStatus: "PARSED" }, select: { id: true, soNumber: true, carrier: true, files: { orderBy: { version: "desc" }, take: 1, select: { rawExtraction: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.soOrder.findMany({ where: { customerId: null }, select: { id: true, soNumber: true, carrier: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.containerUnit.findMany({ where: { active: true, planItems: { none: { active: true } } }, select: { id: true, internalCode: true, containerType: true, soOrder: { select: { id: true, soNumber: true } } }, take: 8, orderBy: { internalCode: "asc" } }),
    prisma.soOrder.findMany({ where: { etbNeedsReview: true }, select: { id: true, soNumber: true, etbText: true, sailing: { select: { id: true } } }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.etbQueryRun.findMany({ where: { status: "AWAITING_MANUAL", manualHandledAt: null }, select: { id: true, terminal: true, handoffReason: true, errorMessage: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.customerContactTask.findMany({ where: { status: "OPEN" }, select: { id: true, dueAt: true, soOrder: { select: { id: true, soNumber: true } } }, take: 8, orderBy: { dueAt: "asc" } }),
    prisma.transportTask.findMany({ where: { etbImpactNeedsReview: true }, select: { id: true, scheduledAt: true, loadingPlan: { select: { soOrder: { select: { id: true, soNumber: true } } } } }, take: 8, orderBy: { scheduledAt: "asc" } }),
    prisma.soOrder.findMany({ where: { containers: { some: { active: true } } }, include: { containers: { where: { active: true }, select: { id: true } }, confirmations: { where: { status: { in: ["PARTIAL", "CONFIRMED"] } }, select: { quantity: true } } } }),
    prisma.soOrder.findMany({ select: { id: true, soNumber: true, etbNeedsReview: true, openingText: true, siCutoffText: true, vgmCutoffText: true, portCutoffText: true, plans: { select: { scheduledAt: true, status: true } } } }),
  ]);
  const parseReviewOrders = parseReviewCandidates.map(order => ({ ...order, reasons: soReviewReasons((order.files[0]?.rawExtraction as { parseReview?: unknown } | undefined)?.parseReview as { missingCoreFields?: string[]; conflictingFields?: string[]; needsReview?: boolean } | undefined) })).filter(order => order.reasons.length);
  const pendingConfirm = ordersForConfirm.filter(order => order.confirmations.reduce((sum, item) => sum + item.quantity, 0) < order.containers.length).length;
  const alerts = evaluateRiskAlerts(riskOrders);
  const cards = [
    ["待识别 SO", pendingOrders.length, "/orders", "识别上传文件中的订单信息"],
    ["需核对订单", parseReviewOrders.length, "/orders?review=1", "补全或确认关键信息"],
    ["待联系客户", contactTasks.length || pendingConfirm, contactTasks.length ? "/contact-tasks" : "/orders", "确认开仓或装柜安排"],
    ["待安排装柜", unplanned.length, "/plans", "为已确认柜子安排装柜"],
    ["业务预警", alerts.length, "#business-alerts", "优先查看船期与截单风险"],
  ] as const;

  return <>
    <PageHeader title="物流调度工作台" description={<span className={styles.intro}>从上方待办开始处理即可。船期、截止时间和派车变更均需人工确认后才会进入业务安排。</span>} />
    <div className={styles.cards}>{cards.map(([title, count, href, detail]) => <a className={[styles.card, count ? undefined : styles.quiet].filter(Boolean).join(" ")} href={href} key={title}><div className={styles.cardTitle}>{title}</div><div className={styles.number}>{count}</div><small>{count ? detail : "当前无需处理"}</small><span className={styles.cardAction}>{count ? "去处理 →" : "查看详情 →"}</span></a>)}</div>
    <section className={businessStyles["dashboard-alerts"]} id="business-alerts">
      <div className={businessStyles["dashboard-alerts__heading"]}><div><h3>业务预警</h3><p>预警仅用于提醒核对，不会自动改动船期、截止时间或装柜安排。</p></div><StatusBadge tone="warning">{alerts.length} 条待关注</StatusBadge></div>
      <div className={styles.alertList}>
        {alerts.length ? alerts.map((alert, index) => <a className={`${styles.alertItem}${alert.severity === "CRITICAL" ? ` ${styles.critical}` : ""}`} href={alert.href} key={`${alert.orderId}-${alert.type}-${index}`}><StatusBadge tone={alert.severity === "CRITICAL" ? "critical" : "warning"}>{alertSeverityLabels[alert.severity]}</StatusBadge><div><b>{alert.title}</b><p>{alert.detail}</p></div><span className={styles.alertAction}>去核对 →</span></a>) : <p className={businessStyles["dashboard-alerts__empty"]}>暂无需要处理的预警。</p>}
      </div>
    </section>
    <div className={styles.taskGrid}>
      <section><h3>待识别或核对</h3><p className={styles.taskHint}>打开 SO 后核对系统识别出的订单信息。</p>{pendingOrders.length ? <ul>{pendingOrders.map(order => <li key={order.id}><a href={`/orders/${order.id}`}>{order.soNumber}</a> · {order.carrier} · {statusLabel(order.parseStatus)}</li>)}</ul> : <p>暂无待处理 SO。</p>}</section>
      <section><h3>关键信息待确认</h3><p className={styles.taskHint}>补全缺失内容或确认存在差异的字段。</p>{parseReviewOrders.length ? <><ul>{parseReviewOrders.slice(0, 8).map(order => <li key={order.id}><a href={`/orders/${order.id}`}>{order.soNumber}</a> · {order.reasons.join("；")}</li>)}</ul><ButtonLink variant="secondary" size="toolbar" href="/orders?review=1">查看全部待确认订单</ButtonLink></> : <p>暂无字段冲突或缺失项。</p>}</section>
      <section><h3>待匹配客户</h3>{unmatchedOrders.length ? <ul>{unmatchedOrders.map(order => <li key={order.id}><a href={`/orders/${order.id}`}>{order.soNumber}</a> · {order.carrier}</li>)}</ul> : <p>暂无待匹配客户的 SO。</p>}</section>
      <section><h3>待联系/确认</h3>{contactTasks.length ? <ul>{contactTasks.map(task => <li key={task.id}><a href={`/orders/${task.soOrder.id}`}>{task.soOrder.soNumber}</a> · 开仓 {formatChinaDateTime(task.dueAt)}</li>)}</ul> : pendingConfirm ? <p>有 {pendingConfirm} 个订单尚未完成柜量确认。<a href="/orders">查看订单</a></p> : <p>暂无待联系或确认事项。</p>}</section>
      <section><h3>靠港时间待确认</h3><p className={styles.taskHint}>确认船期变化后，再决定是否调整后续安排。</p>{etbOrders.length ? <ul>{etbOrders.map(order => <li key={order.id}><a href={order.sailing ? `/sailings/${order.sailing.id}` : `/orders/${order.id}`}>{order.soNumber}</a> · {order.etbText || "预计靠港时间待确认"}</li>)}</ul> : <p>暂无需要确认的靠港时间。</p>}</section>
      <section><h3>船期更新需要协助</h3><p className={styles.taskHint}>部分船期信息无法自动取得，需要人工补充或再次查询。</p>{etbHandoffs.length ? <ul>{etbHandoffs.map(run => <li key={run.id}><a href="/etb-runs">{run.terminal} 船期更新</a> · {run.handoffReason || run.errorMessage || "请处理"}</li>)}</ul> : <p>暂无需要人工协助的船期更新。</p>}</section>
      <section><h3>已派车安排待确认</h3><p className={styles.taskHint}>靠港时间变化可能影响已安排的运输。</p>{impactedTransport.length ? <ul>{impactedTransport.map(task => <li key={task.id}><a href="/plans">{task.loadingPlan.soOrder.soNumber}</a> · 派车 {formatChinaDateTime(task.scheduledAt)}</li>)}</ul> : <p>暂无需要确认的派车安排。</p>}</section>
    </div>
  </>;
}
