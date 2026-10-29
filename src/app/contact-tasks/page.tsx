import type { ContactTaskStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ContactTaskActions } from "@/components/contact-task-actions";
import { formatChinaDateTime } from "@/lib/time";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterActions, FilterClearLink, FilterField, FilterSelectField, FilterTextField, ListFilter, Pagination, ResultSummary } from "@/components/ui/list";
import { RecordCard, RecordCardHeader } from "@/components/ui/record-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./page.module.css";
const pageSize = 50;
type Search = { q?: string; status?: string; page?: string };
const href = (input: Search, page: number) => {
  const params = new URLSearchParams();
  if (input.q) params.set("q", input.q);
  if (input.status) params.set("status", input.status);
  params.set("page", String(page));
  return `/contact-tasks?${params}`;
};
export default async function ContactTasks({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const input = await searchParams;
  const q = input.q?.trim() || "";
  const status: ContactTaskStatus | undefined =
    input.status === "COMPLETED"
      ? "COMPLETED"
      : input.status === "OPEN"
        ? "OPEN"
        : undefined;
  const page = Math.max(1, Number(input.page) || 1);
  const where: Prisma.CustomerContactTaskWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? { soOrder: { soNumber: { contains: q, mode: "insensitive" } } }
      : {}),
  };
  const total = await prisma.customerContactTask.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const tasks = await prisma.customerContactTask.findMany({
    where,
    include: {
      soOrder: {
        include: {
          containers: { where: { active: true } },
          confirmations: {
            where: { status: { in: ["PARTIAL", "CONFIRMED"] } },
          },
        },
      },
    },
    orderBy: { dueAt: "asc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  return (
    <>
      <PageHeader title="客户联系待办" description="在开仓后联系客户确认柜量。可分批确认，再按已确认柜量安排装柜。" />
      <ListFilter className={styles.filter}>
        <FilterField label="查找订单" search>
          <FilterTextField name="q" defaultValue={q} placeholder="输入 SO 编号" />
        </FilterField>
        <FilterField label="待办状态">
          <FilterSelectField name="status" defaultValue={status || ""}>
            <option value="">全部</option>
            <option value="OPEN">待联系</option>
            <option value="COMPLETED">已完成</option>
          </FilterSelectField>
        </FilterField>
        <FilterActions className={styles.filterActions}>
          <Button type="submit">查看待办</Button>
          <FilterClearLink href="/contact-tasks" />
        </FilterActions>
      </ListFilter>
      <ResultSummary className={styles.resultSummary}>
        共 {total} 条，第 {currentPage} / {totalPages} 页。
      </ResultSummary>
      <div className={styles.list}>
        {tasks.length ? (
          tasks.map((task) => {
            const confirmed = task.soOrder.confirmations.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );
            const totalContainers = task.soOrder.containers.length;
            return (
              <RecordCard
                className={`${styles.task}${task.status === "OPEN" ? ` ${styles.open}` : ""}`}
                key={task.id}
              >
                <RecordCardHeader className={styles.header}>
                  <div>
                    <span className={styles.label}>开仓时间</span>
                    <b>{formatChinaDateTime(task.dueAt)}</b>
                  </div>
                  <StatusBadge tone={statusTone(task.status)}>{statusLabel(task.status)}</StatusBadge>
                </RecordCardHeader>
                <div className={styles.body}>
                  <div>
                    <span className={styles.label}>订单</span>
                    <a href={`/orders/${task.soOrder.id}`}>
                      {task.soOrder.soNumber}
                    </a>
                  </div>
                  <div>
                    <span className={styles.label}>已确认柜量</span>
                    <b>
                      {confirmed} / {totalContainers || "—"}
                    </b>
                  </div>
                  {task.note && (
                    <div className={styles.note}>
                      <span className={styles.label}>联系记录</span>
                      <p>{task.note}</p>
                    </div>
                  )}
                </div>
                {task.status === "OPEN" && (
                  <ContactTaskActions taskId={task.id} />
                )}
              </RecordCard>
            );
          })
        ) : (
          <EmptyState title="暂无符合条件的待办">客户确认事项会在开仓后显示在这里。</EmptyState>
        )}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} href={page => href(input, page)} label="客户联系待办分页"/>
    </>
  );
}
