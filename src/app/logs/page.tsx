import { Prisma } from "@prisma/client";
import businessStyles from "@/components/business.module.css";
import { prisma } from "@/lib/prisma";
import { auditActionLabel, auditEntityLabel } from "@/lib/audit";
import { FilterActions, FilterClearLink, FilterField, FilterSelectField, FilterTextField, ListFilter, Pagination, ResultSummary } from "@/components/ui/list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Disclosure } from "@/components/ui/disclosure";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./page.module.css";

const pageSize = 100;
type Search = {
  q?: string;
  action?: string;
  entityType?: string;
  page?: string;
};
const fieldLabels: Record<string, string> = {
  status: "状态",
  soNumber: "SO 编号",
  carrier: "船公司",
  vesselName: "船名",
  voyage: "航次",
  containerType: "柜型",
  containerNo: "实际柜号",
  internalCode: "内部柜号",
  quantity: "数量",
  scheduledAt: "计划时间",
  expectedLoadingAt: "预计装柜时间",
  etbAt: "预计靠港时间",
  source: "信息来源",
  note: "备注",
  customerId: "客户",
  factoryId: "工厂",
  loadingPlanId: "装柜计划",
  transportTaskId: "运输任务",
  vehicleNo: "车牌",
  driverName: "司机",
  driverPhone: "联系电话",
  amount: "金额",
  currency: "币种",
  category: "费用类型",
  active: "启用状态",
};
function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "未填写";
  if (typeof value === "boolean") return value ? "是" : "否";
  if (Array.isArray(value)) return value.length ? value.join("、") : "无";
  if (typeof value === "object") return "已更新";
  return String(value);
}
function changeRows(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value as Record<string, unknown>).map(
    ([key, item]) => ({
      label: fieldLabels[key] || key,
      value: displayValue(item),
    }),
  );
}
function entityLink(entityType: string, entityId: string) {
  if (entityType === "SoOrder")
    return <a href={`/orders/${entityId}`}>查看订单</a>;
  if (entityType === "Sailing")
    return <a href={`/sailings/${entityId}`}>查看船期</a>;
  return null;
}
function changeDetail(before: unknown, after: unknown, entityId: string) {
  const beforeRows = changeRows(before);
  const afterRows = changeRows(after);
  if (!beforeRows.length && !afterRows.length)
    return <span className={businessStyles["muted"]}>本次未记录字段变化</span>;
  return (
    <Disclosure className={styles.changeDetail} title="查看变更摘要">
      <div className={styles.changeContent}>
        {beforeRows.length ? (
          <div>
            <span>变更前</span>
            {beforeRows.map((row) => (
              <p key={`before-${row.label}`}>
                <b>{row.label}</b>
                {row.value}
              </p>
            ))}
          </div>
        ) : null}
        {afterRows.length ? (
          <div>
            <span>变更后</span>
            {afterRows.map((row) => (
              <p key={`after-${row.label}`}>
                <b>{row.label}</b>
                {row.value}
              </p>
            ))}
          </div>
        ) : null}
        <small>记录编号：{entityId}</small>
      </div>
    </Disclosure>
  );
}
function href(input: Search, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input))
    if (value && key !== "page") params.set(key, value);
  params.set("page", String(page));
  return `/logs?${params}`;
}

export default async function Logs({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const input = await searchParams;
  const q = input.q?.trim() || "";
  const page = Math.max(1, Number(input.page) || 1);
  const activeFilterCount = [q, input.action, input.entityType].filter(
    Boolean,
  ).length;
  const where: Prisma.OperationLogWhereInput = {
    ...(input.action ? { action: input.action } : {}),
    ...(input.entityType ? { entityType: input.entityType } : {}),
    ...(q
      ? {
          OR: [
            { actorName: { contains: q, mode: "insensitive" } },
            { entityId: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [total, actionRows, entityRows] = await Promise.all([
    prisma.operationLog.count({ where }),
    prisma.operationLog.findMany({
      distinct: ["action"],
      select: { action: true },
      orderBy: { action: "asc" },
    }),
    prisma.operationLog.findMany({
      distinct: ["entityType"],
      select: { entityType: true },
      orderBy: { entityType: "asc" },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const logs = await prisma.operationLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  return (
    <>
      <PageHeader title="操作日志" description="查看业务操作和系统处理记录。展开“查看变更摘要”可核对本次修改的业务字段。" />
      <ListFilter className={styles.filter}>
        <FilterField label="查找操作人或记录编号" search>
          <FilterTextField name="q" defaultValue={q} placeholder="输入姓名或记录编号" />
        </FilterField>
        <Disclosure className={styles.advanced} title="按操作类型或业务对象筛选" open={Boolean(input.action || input.entityType)}>
          <div>
            <FilterField label="操作类型">
              <FilterSelectField name="action" defaultValue={input.action || ""}>
                <option value="">全部</option>
                {actionRows.map((item) => (
                  <option key={item.action} value={item.action}>
                    {auditActionLabel(item.action)}
                  </option>
                ))}
              </FilterSelectField>
            </FilterField>
            <FilterField label="业务对象">
              <FilterSelectField name="entityType" defaultValue={input.entityType || ""}>
                <option value="">全部</option>
                {entityRows.map((item) => (
                  <option key={item.entityType} value={item.entityType}>
                    {auditEntityLabel(item.entityType)}
                  </option>
                ))}
              </FilterSelectField>
            </FilterField>
          </div>
        </Disclosure>
        <FilterActions className={styles.filterActions}>
          <Button type="submit">查看记录</Button>
          <FilterClearLink href="/logs" />
        </FilterActions>
      </ListFilter>
      <ResultSummary className={styles.resultSummary}>
        {activeFilterCount ? `已使用 ${activeFilterCount} 个筛选条件，` : ""}共{" "}
        {total} 条，第 {currentPage} / {totalPages} 页。
      </ResultSummary>
      <DataTable>
          <thead>
            <tr>
              <th>时间</th>
              <th>操作人</th>
              <th>操作</th>
              <th>业务对象</th>
              <th>变更内容</th>
            </tr>
          </thead>
          <tbody>
            {logs.length ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.createdAt.toLocaleString("zh-CN")}</td>
                  <td>
                    {log.actorName
                      ? `${log.actorName}（${log.actorRole === "ADMIN" ? "负责人" : "成员"}）`
                      : "系统处理"}
                  </td>
                  <td>
                    <StatusBadge tone="muted" size="small">
                      {auditActionLabel(log.action)}
                    </StatusBadge>
                  </td>
                  <td>
                    <div className={styles.entity}>
                      <span>{auditEntityLabel(log.entityType)}</span>
                      {entityLink(log.entityType, log.entityId)}
                    </div>
                  </td>
                  <td>{changeDetail(log.before, log.after, log.entityId)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>暂无符合条件的操作记录。</td>
              </tr>
            )}
          </tbody>
      </DataTable>
      <Pagination currentPage={currentPage} totalPages={totalPages} href={page => href(input, page)} label="操作日志分页"/>
    </>
  );
}
