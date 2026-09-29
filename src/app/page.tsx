import { prisma } from "@/lib/prisma";
import { evaluateRiskAlerts } from "@/lib/risk-alerts";
import { formatChinaDateTime } from "@/lib/time";

export default async function Dashboard() {
  const [pendingOrders, unmatchedOrders, unplanned, etbOrders, contactTasks, impactedTransport, ordersForConfirm, riskOrders] = await Promise.all([
    prisma.soOrder.findMany({ where: { parseStatus: { in: ["PENDING", "PARSED", "FAILED"] } }, select: { id: true, soNumber: true, carrier: true, parseStatus: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.soOrder.findMany({ where: { customerId: null }, select: { id: true, soNumber: true, carrier: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.containerUnit.findMany({ where: { active: true, planItems: { none: { active: true } } }, select: { id: true, internalCode: true, containerType: true, soOrder: { select: { id: true, soNumber: true } } }, take: 8, orderBy: { internalCode: "asc" } }),
    prisma.soOrder.findMany({ where: { etbNeedsReview: true }, select: { id: true, soNumber: true, etbText: true, sailing: { select: { id: true } } }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.customerContactTask.findMany({ where: { status: "OPEN" }, select: { id: true, dueAt: true, soOrder: { select: { id: true, soNumber: true } } }, take: 8, orderBy: { dueAt: "asc" } }),
    prisma.transportTask.findMany({ where: { etbImpactNeedsReview: true }, select: { id: true, scheduledAt: true, loadingPlan: { select: { soOrder: { select: { id: true, soNumber: true } } } } }, take: 8, orderBy: { scheduledAt: "asc" } }),
    prisma.soOrder.findMany({ where: { containers: { some: { active: true } } }, include: { containers: { where: { active: true }, select: { id: true } }, confirmations: { where: { status: { in: ["PARTIAL", "CONFIRMED"] } }, select: { quantity: true } } } }),
    prisma.soOrder.findMany({ select: { id: true, soNumber: true, etbNeedsReview: true, openingText: true, siCutoffText: true, vgmCutoffText: true, portCutoffText: true, plans: { select: { scheduledAt: true, status: true } } } }),
  ]);
  const pendingConfirm = ordersForConfirm.filter(order => order.confirmations.reduce((sum, item) => sum + item.quantity, 0) < order.containers.length).length;
  const alerts = evaluateRiskAlerts(riskOrders);
  const cards = [
    ["待解析/人工核对 SO", pendingOrders.length, "/orders"],
    ["待匹配客户", unmatchedOrders.length, "/orders"],
    ["待联系客户", contactTasks.length || pendingConfirm, "/contact-tasks"],
    ["待安排装柜", unplanned.length, "/plans"],
    ["ETB 变化待核对", etbOrders.length, "/sailings"],
    ["已派车 ETB 影响", impactedTransport.length, "/transport"],
    ["临近截止/计划", alerts.length, "/alerts"],
  ] as const;

  return <>
    <h2>物流调度工作台</h2>
    <p>船期变化、截止时间和派车计划只会生成待办；是否采用新 ETB 或调整计划，由人员核对后决定。</p>
    <div className="cards five-cards">{cards.map(([title, count, href]) => <a className="card dashboard-card" href={href} key={title}><div>{title}</div><div className="number">{count}</div><small>点击处理</small></a>)}</div>
    <div className="task-grid">
      <section><h3>待解析/核对</h3>{pendingOrders.length ? <ul>{pendingOrders.map(order => <li key={order.id}><a href={`/orders/${order.id}`}>{order.soNumber}</a> · {order.carrier} · {order.parseStatus}</li>)}</ul> : <p>暂无待处理 SO。</p>}</section>
      <section><h3>待匹配客户</h3>{unmatchedOrders.length ? <ul>{unmatchedOrders.map(order => <li key={order.id}><a href={`/orders/${order.id}`}>{order.soNumber}</a> · {order.carrier}</li>)}</ul> : <p>暂无待匹配客户的 SO。</p>}</section>
      <section><h3>待联系客户</h3>{contactTasks.length ? <ul>{contactTasks.map(task => <li key={task.id}><a href={`/orders/${task.soOrder.id}`}>{task.soOrder.soNumber}</a> · 开仓 {formatChinaDateTime(task.dueAt)}</li>)}</ul> : <p>暂无已生成的客户联系待办。</p>}</section>
      <section><h3>ETB 待核对</h3>{etbOrders.length ? <ul>{etbOrders.map(order => <li key={order.id}><a href={order.sailing ? `/sailings/${order.sailing.id}` : `/orders/${order.id}`}>{order.soNumber}</a> · {order.etbText || "ETB 待确认"}</li>)}</ul> : <p>暂无 ETB 待核对项。</p>}</section>
      <section><h3>已派车 ETB 影响</h3>{impactedTransport.length ? <ul>{impactedTransport.map(task => <li key={task.id}><a href="/transport">{task.loadingPlan.soOrder.soNumber}</a> · 派车 {formatChinaDateTime(task.scheduledAt)}</li>)}</ul> : <p>暂无已派车的 ETB 影响。</p>}</section>
    </div>
  </>;
}
