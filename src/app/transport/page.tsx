import { prisma } from "@/lib/prisma";
import businessStyles from "@/components/business.module.css";
import { ResolveEtbImpactButton } from "@/components/resolve-etb-impact-button";
import { formatChinaDateTime } from "@/lib/time";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { TransportLegEditorList } from "@/components/transport-leg-editor-list";
import { TransportCostForm } from "@/components/transport-cost-form";
import { currentUser } from "@/lib/auth";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { FilterActions, FilterClearLink, FilterField, FilterSelectField, FilterTextField, ListFilter, Pagination, ResultSummary } from "@/components/ui/list";
import { RecordCard, RecordCardField, RecordCardFields, RecordCardHeader, RecordCardList } from "@/components/ui/record-card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { NavTabs } from "@/components/ui/nav-tabs";
import styles from "./page.module.css";

const statuses = ["PLANNED", "DISPATCHED", "IN_TRANSIT", "COMPLETED", "CANCELLED"] as const;
const pageSize = 30;
type Search = { q?: string; status?: string; page?: string };
const href = (input: Search, page: number) => { const params = new URLSearchParams(); if (input.q) params.set("q", input.q); if (input.status) params.set("status", input.status); params.set("page", String(page)); return `/transport?${params}`; };
const statusHref = (input: Search, status?: string) => { const params = new URLSearchParams(); if (input.q) params.set("q", input.q); if (status) params.set("status", status); return `/transport?${params}`; };

export default async function Transport({ searchParams }: { searchParams: Promise<Search> }) {
  const input = await searchParams; const user = await currentUser(); const canManageCosts = user?.role === "ADMIN"; const q = input.q?.trim() || ""; const status = statuses.includes(input.status as (typeof statuses)[number]) ? input.status as (typeof statuses)[number] : undefined; const requestedPage = Math.max(1, Number(input.page) || 1);
  const where = { ...(status ? { status } : {}), ...(q ? { OR: [{ loadingPlan: { soOrder: { soNumber: { contains: q, mode: "insensitive" as const } } } }, { loadingPlan: { factory: { name: { contains: q, mode: "insensitive" as const } } } }] } : {}) };
  const [total, statusGroups] = await Promise.all([prisma.transportTask.count({ where }), prisma.transportTask.groupBy({ by: ["status"], _count: { _all: true } })]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize)); const currentPage = Math.min(requestedPage, totalPages);
  const tasks = await prisma.transportTask.findMany({ where, include: { loadingPlan: { include: { soOrder: { include: { sailing: true } }, factory: true } }, legs: { orderBy: { sequence: "asc" } }, costs: { orderBy: { createdAt: "asc" } } }, orderBy: { scheduledAt: "asc" }, skip: (currentPage - 1) * pageSize, take: pageSize });
  return <>
    <PageHeader title="运输任务" description={<>按任务记录派车、换车和实际还柜情况。完成前，请确保每一段运输都已补充实际还柜时间。 {canManageCosts ? <a href="/api/transport-tasks/export">导出运输记录</a> : <span className={businessStyles["muted"]}>费用记录仅管理员可维护。</span>}</>} />
    <NavTabs className={businessStyles["status-quick-filter"]} label="快捷查看" items={[{ label: "全部", href: statusHref(input), active: !status }, ...statuses.map(value => ({ label: statusLabel(value), href: statusHref(input, value), active: status === value, count: statusGroups.find(item => item.status === value)?._count._all || 0 }))]} />
    <ListFilter className={styles.filter}><FilterField label="查找任务" search><FilterTextField name="q" defaultValue={q} placeholder="输入 SO 或工厂名称" /></FilterField><FilterField label="运输状态"><FilterSelectField name="status" defaultValue={status || ""}><option value="">全部</option>{statuses.map(value => <option key={value} value={value}>{statusLabel(value)}</option>)}</FilterSelectField></FilterField><FilterActions className={styles.filterActions}><Button type="submit">查看任务</Button><FilterClearLink href="/transport" /></FilterActions></ListFilter>
    <ResultSummary className={styles.resultSummary}>共 {total} 个运输任务，第 {currentPage} / {totalPages} 页。</ResultSummary>
    <RecordCardList className={styles.list} density="compact">{tasks.length ? tasks.map(task => <RecordCard density="compact" className={task.etbImpactNeedsReview ? styles.attentionCard : undefined} key={task.id}>
      <RecordCardHeader density="compact" className={styles.header}><div><span className={styles.label}>订单 / 工厂</span><a href={`/orders/${task.loadingPlan.soOrder.id}`}>{task.loadingPlan.soOrder.soNumber}</a><b> · {task.loadingPlan.factory.name}</b></div><StatusBadge tone={statusTone(task.status)}>{statusLabel(task.status)}</StatusBadge></RecordCardHeader>
      <RecordCardFields density="compact" columns={3}><RecordCardField density="compact"><span className={styles.label}>计划装柜时间</span><b>{formatChinaDateTime(task.scheduledAt)}</b></RecordCardField><RecordCardField density="compact"><span className={styles.label}>运输段</span><b>{task.legs.length ? `${task.legs.length} 段` : "待补充"}</b></RecordCardField><RecordCardField density="compact"><span className={styles.label}>靠港时间影响</span>{task.etbImpactNeedsReview ? <span className={styles.attention}>需要确认</span> : <span>暂无</span>}</RecordCardField></RecordCardFields>
      {task.etbImpactNeedsReview ? <div className={styles.impact}><div><b>靠港时间变化可能影响已安排的运输</b><p>{task.etbImpactResolutionNote || "请核对后确认是否维持或调整当前派车安排。"}</p></div><ResolveEtbImpactButton taskId={task.id} /></div> : task.etbImpactResolutionNote ? <p className={styles.resolution}><b>已确认：</b>{task.etbImpactResolutionNote}</p> : null}
      <div className={styles.details}><h4>运输执行</h4><TransportLegEditorList taskId={task.id} status={task.status} legs={task.legs} factoryFallback="工厂待定" emptyMessage="尚未记录运输段，请先补充车辆和路线。"/></div>
      <div className={styles.cost}><TransportCostForm taskId={task.id} costs={task.costs} canManage={canManageCosts} /></div>
    </RecordCard>) : <EmptyState title="未找到运输任务">可尝试调整 SO、工厂或运输状态。</EmptyState>}</RecordCardList>
    <Pagination currentPage={currentPage} totalPages={totalPages} href={page => href(input, page)} label="运输任务分页"/>
  </>;
}
