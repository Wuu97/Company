import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auditActionLabel, auditEntityLabel, auditFieldLabel, auditFieldValue } from "@/lib/audit";
import { FilterActions, FilterClearLink, FilterField, FilterSelectField, FilterTextField, ListFilter, ResultSummary } from "@/components/ui/list";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { currentUser } from "@/lib/auth";
import { ClearLogsButton } from "@/components/clear-logs-button";
import styles from "./page.module.css";
import { AuditExpandedRow } from "@/components/audit-expanded-row";

type Search = {
  pageSize?: string;
  q?: string;
  action?: string;
  entityType?: string;
  month?: string;
  showSystem?: string;
  page?: string;
};
function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "未填写";
  if (typeof value === "boolean") return value ? "是" : "否";
  if (Array.isArray(value)) return value.length ? value.join("、") : "无";
  if (typeof value === "object") return "已更新";
  return auditFieldValue(String(value));
}
function recordValue(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function displayFieldLabel(key: string) {
  return auditFieldLabel(key);
}
function comparableValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return JSON.stringify(value.map(comparableValue));
  if (value && typeof value === "object" && "toString" in value) {
    const text = String(value);
    if (text !== "[object Object]") return text;
  }
  return JSON.stringify(value);
}
function changeRows(before: unknown, after: unknown) {
  const beforeValue = recordValue(before);
  const afterValue = recordValue(after);
  return Object.keys(afterValue).filter(key => comparableValue(beforeValue[key]) !== comparableValue(afterValue[key])).map(key => ({ key, label: displayFieldLabel(key), before: displayValue(beforeValue[key]), after: displayValue(afterValue[key]) }));
}
function objectRows(entityType: string, before: unknown, after: unknown, entityId: string, business?: Record<string, unknown>) {
  const values = { ...business, ...recordValue(before), ...recordValue(after) };
  if (entityType === "SoOrder" && values.soNumber) return [{ label: "SO 编号", value: `${values.soNumber}${values.carrier ? ` (${values.carrier})` : ""}` }];
  if (entityType === "System") return [{ label: "任务", value: entityId === "so-parser" ? `SO 批量解析${values.processedCount !== undefined ? `（共 ${values.processedCount} 份文件）` : ""}` : "系统自动处理" }];
  if (entityType === "Route" && (values.name || values.origin || values.destination)) return [{ label: "路线", value: String(values.name || `${values.origin || "未记录起点"} ➔ ${values.destination || "未记录终点"}`) }];
  const keys = entityType === "Route"
    ? ["code", "name", "origin", "destination"]
    : entityType === "SettlementBill"
      ? ["billNo", "settlementMonth"]
      : ["soNumber", "carrier", "containerNo", "internalCode", "billNo", "code", "plateNumber"];
  const labels: Record<string, string> = {
    code: "编号",
    name: "名称",
    origin: "起点",
    destination: "终点",
    billNo: "结算单",
    settlementMonth: "结算月份",
    plateNumber: "车牌",
  };
  const rows = keys.flatMap(key => values[key] === undefined || values[key] === null || values[key] === ""
    ? []
    : [{ label: labels[key] || displayFieldLabel(key), value: displayValue(values[key]) }]);
  return rows.length ? rows.slice(0, 2) : [{ label: auditEntityLabel(entityType), value: entityType === "SoOrder" ? "(未关联单号)" : "—" }];
}
function hasChangeDetail(before: unknown, after: unknown) {
  return Object.keys(recordValue(before)).length > 0 && Object.keys(recordValue(after)).length > 0 && changeRows(before, after).length > 0;
}
function changeDetail(before: unknown, after: unknown) {
  const rows = changeRows(before, after);
  return (
    <div>
      <div className={styles.changeContent}>
        <div className={styles.diffHeader}><span>字段</span><span>变更前</span><span>变更后</span></div>
        {rows.map(row => <div className={styles.diffRow} key={row.key}>
          <b title={row.key}>{row.label}</b>
          <span className={styles.beforeValue} title={row.before}>{row.before}</span>
          <span className={styles.afterValue} title={row.after}>{row.after}</span>
        </div>)}
      </div>
    </div>
  );
}
function href(input: Search, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input))
    if (value && key !== "page") params.set(key, value);
  params.set("page", String(page));
  return `/logs?${params}`;
}
function monthLabel(value: string) {
  const [year, month] = value.split("-");
  return `${year} 年 ${Number(month)} 月`;
}

export default async function Logs({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const input = await searchParams;
  const pageSize = [10, 20, 50].includes(Number(input.pageSize)) ? Number(input.pageSize) : 10;
  const q = input.q?.trim() || "";
  const month = /^\d{4}-\d{2}$/.test(input.month || "") ? input.month! : "";
  const monthStart = month ? new Date(`${month}-01T00:00:00.000Z`) : undefined;
  const monthEnd = monthStart ? new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1) : undefined;
  const page = Math.max(1, Number(input.page) || 1);
  const activeFilterCount = [q, input.action, input.entityType, month, input.showSystem].filter(
    Boolean,
  ).length;
  // Resolve empty edits in SQL before both COUNT and pagination. JSON scalar
  // text comparison treats null, missing and empty strings as equivalent,
  // matching the detail view's comparison rules.
  const emptyEdits = await prisma.$queryRaw<{ id: string }[]>`
    SELECT l.id FROM "OperationLog" l
    WHERE l.action ~ '(_UPDATED|_CHANGED)$'
      AND jsonb_typeof(l.before) = 'object' AND l.before <> '{}'::jsonb
      AND jsonb_typeof(l.after) = 'object' AND l.after <> '{}'::jsonb
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_each(
          CASE WHEN jsonb_typeof(l.after) = 'object' THEN l.after ELSE '{}'::jsonb END
        ) AS changed(key, value)
        WHERE COALESCE(l.before ->> changed.key, '')
          IS DISTINCT FROM COALESCE(l.after ->> changed.key, '')
      )
  `;
  const where: Prisma.OperationLogWhereInput = {
    ...(emptyEdits.length ? { id: { notIn: emptyEdits.map(log => log.id) } } : {}),
    ...(input.action ? { action: input.action } : {}),
    ...(input.entityType ? { entityType: input.entityType } : {}),
    ...(monthStart && monthEnd ? { createdAt: { gte: monthStart, lt: monthEnd } } : {}),
    ...(input.showSystem === "1" ? {} : { actorUserId: { not: null } }),
    ...(q
      ? {
          OR: [
            { actorName: { contains: q, mode: "insensitive" } },
            { entityId: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [total, actionRows, entityRows, user, allLogTotal, monthRows] = await Promise.all([
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
    currentUser(),
    prisma.operationLog.count(),
    prisma.$queryRaw<{ month: string }[]>`SELECT DISTINCT to_char("createdAt", 'YYYY-MM') AS month FROM "OperationLog" ORDER BY month DESC`,
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const logs = await prisma.operationLog.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });
  const ids = (type: string) => logs.filter(log => log.entityType === type).map(log => log.entityId);
  const [soOrders, routes, bills] = await Promise.all([
    prisma.soOrder.findMany({ where: { id: { in: ids("SoOrder") } }, select: { id: true, soNumber: true, carrier: true } }),
    prisma.route.findMany({ where: { id: { in: ids("Route") } }, select: { id: true, name: true, origin: true, destination: true } }),
    prisma.settlementBill.findMany({ where: { id: { in: ids("SettlementBill") } }, select: { id: true, billNo: true, settlementMonth: true } }),
  ]);
  const businessById = new Map<string, Record<string, unknown>>([
    ...soOrders.map(row => [`SoOrder:${row.id}`, row] as const),
    ...routes.map(row => [`Route:${row.id}`, row] as const),
    ...bills.map(row => [`SettlementBill:${row.id}`, row] as const),
  ]);
  const visibleLogs = logs;
  return (
    <>
      <PageHeader title="操作日志" />
      <ListFilter className={styles.filter}>
        <FilterField label="操作人 / 业务单号" search>
          <FilterTextField name="q" defaultValue={q} placeholder="输入姓名、SO 单号等" />
        </FilterField>
        <FilterField label="操作类型">
          <FilterSelectField name="action" defaultValue={input.action || ""}>
            <option value="">全部操作</option>
            {actionRows.map((item) => (
              <option key={item.action} value={item.action}>
                {auditActionLabel(item.action)}
              </option>
            ))}
          </FilterSelectField>
        </FilterField>
        <FilterField label="业务对象">
          <FilterSelectField name="entityType" defaultValue={input.entityType || ""}>
            <option value="">全部对象</option>
            {entityRows.map((item) => (
              <option key={item.entityType} value={item.entityType}>
                {auditEntityLabel(item.entityType)}
              </option>
            ))}
          </FilterSelectField>
        </FilterField>
        <FilterField label="操作月份">
          <FilterSelectField name="month" defaultValue={month}>
            <option value="">全部月份</option>
            {monthRows.map(item => <option key={item.month} value={item.month}>{monthLabel(item.month)}</option>)}
          </FilterSelectField>
        </FilterField>
        <label className={styles.systemLogToggle}><input type="checkbox" name="showSystem" value="1" defaultChecked={input.showSystem === "1"} /><span>包含系统自动日志</span></label>
        <FilterActions className={styles.filterActions}>
          <FilterClearLink href="/logs" />
          {user?.role === "ADMIN" && <ClearLogsButton total={allLogTotal} />}
        </FilterActions>
      </ListFilter>
      <ResultSummary className={styles.resultSummary}>
        {activeFilterCount ? `已使用 ${activeFilterCount} 个筛选条件，` : ""}共{" "}
        {total} 条，第 {currentPage} / {totalPages} 页。
      </ResultSummary>
      {visibleLogs.length ? <section className={styles.auditList} aria-label="操作记录">
        <div className={styles.tableHeader}><span>操作时间</span><span>操作人</span><span>操作内容</span><span>业务对象 / 标识</span><span>字段变化</span></div>
        {visibleLogs.map((log) => <AuditExpandedRow key={log.id} detail={hasChangeDetail(log.before, log.after) ? changeDetail(log.before, log.after) : null}>
          <time className={styles.time}><span>{log.createdAt.toLocaleDateString("zh-CN")}</span><b>{log.createdAt.toLocaleTimeString("zh-CN", { hour12: false })}</b></time>
          <div className={styles.actor}>
            <b>{log.actorName || "系统处理"}</b>
            {log.actorName && <small>{log.actorRole === "ADMIN" ? "管理员" : "业务成员"}</small>}
          </div>
          <div className={styles.action}>
            <StatusBadge tone="muted" size="small">{auditActionLabel(log.action)}</StatusBadge>
          </div>
          <div className={styles.objectTags}>{objectRows(log.entityType, log.before, log.after, log.entityId, businessById.get(`${log.entityType}:${log.entityId}`)).map(item => <span key={item.label} data-missing={item.value === "(未关联单号)" || item.value === "—" || undefined} title={`${item.label}：${item.value}`}><b>{item.label}</b>{item.value}</span>)}</div>
        </AuditExpandedRow>)}
      </section> : <section className={styles.empty}>暂无符合条件的操作记录。请调整筛选条件后重试。</section>}
      <Pagination currentPage={currentPage} totalPages={totalPages} total={total} pageSize={pageSize} href={page => href(input, page)} label="操作日志分页"/>
    </>
  );
}
