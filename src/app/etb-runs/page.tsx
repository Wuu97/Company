import { notFound } from "next/navigation";
import { EtbHandoffButton } from "@/components/etb-handoff-button";
import { EtbManualControl } from "@/components/etb-manual-control";
import { EtbUnmatchedMatchForm } from "@/components/etb-unmatched-match-form";
import { ButtonLink } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { WorkspaceMetrics } from "@/components/ui/workspace-metrics";
import { StatusBadge } from "@/components/ui/status-badge";
import { TABLE_EMPTY_MARKER } from "@/components/ui/table-placeholder";
import { currentUser } from "@/lib/auth";
import { etbNotificationBody } from "@/lib/notification-content";
import {
  etbOutcomeLabels,
  readEtbRunReport,
  type EtbRunResult,
} from "@/lib/etb-run-report";
import { prisma } from "@/lib/prisma";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { formatChinaDateTime } from "@/lib/time";
import { RetryButton } from "./retry-button";
import styles from "./page.module.css";

function runLabel(status: string) {
  return status === "SUCCEEDED"
    ? "已完成"
    : status === "PENDING"
      ? "等待执行"
      : statusLabel(status);
}

function EvidenceLink({ storageKey }: { storageKey: string }) {
  return (
    <ButtonLink
      variant="text"
      size="compact"
      href={`/api/evidence?key=${encodeURIComponent(storageKey)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      查看截图
    </ButtonLink>
  );
}

type Detail = EtbRunResult & { id: number; note?: string };
const detailColumns: DataTableColumn<Detail>[] = [
  {
    key: "so",
    title: "SO 编号",
    width: 180,
    render: (_, row) =>
      row.soNumbers.length ? (
        <span className={styles.wrapText}>{row.soNumbers.join("、")}</span>
      ) : (
        TABLE_EMPTY_MARKER
      ),
  },
  {
    key: "sailing",
    title: "船名 / 航次",
    minWidth: 215,
    render: (_, row) => (
      <span className={styles.wrapText}>
        {row.vessel} / {row.voyage}
      </span>
    ),
  },
  {
    key: "before",
    title: "原确认 ETB",
    width: 168,
    render: (_, row) =>
      row.before
        ? formatChinaDateTime(new Date(row.before))
        : TABLE_EMPTY_MARKER,
  },
  {
    key: "after",
    title: "本次查询 ETB",
    width: 168,
    render: (_, row) =>
      row.after ? formatChinaDateTime(new Date(row.after)) : TABLE_EMPTY_MARKER,
  },
  {
    key: "outcome",
    title: "比对结果",
    width: 135,
    render: (_, row) => (
      <StatusBadge
        tone={
          row.outcome === "changed" ||
          row.outcome === "unmatched" ||
          row.outcome === "no-etb"
            ? "warning"
            : "success"
        }
      >
        {row.note || etbOutcomeLabels[row.outcome]}
      </StatusBadge>
    ),
  },
  {
    key: "evidence",
    title: "凭证",
    width: 106,
    render: (_, row) =>
      row.screenshotStorageKey ? (
        <EvidenceLink storageKey={row.screenshotStorageKey} />
      ) : (
        TABLE_EMPTY_MARKER
      ),
  },
];

export default async function EtbRuns({
  searchParams,
}: {
  searchParams: Promise<{ run?: string; view?: string }>;
}) {
  const { run: runId, view } = await searchParams;
  if (view === "list") {
    const runs = await prisma.etbQueryRun.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 200,
      select: {
        id: true,
        terminal: true,
        scheduledFor: true,
        finishedAt: true,
        status: true,
      },
    });
    return (
      <>
        <PageHeader title="船期更新记录" />
        <PageContainer
          actions={
            <ButtonLink href="/sailings" variant="outline" size="toolbar">
              返回船期管理
            </ButtonLink>
          }
        >
          <DataTable
            aria-label="更新记录列表"
            dataSource={runs}
            rowKey="id"
            fitContainer
            empty={{ title: "暂无船期更新记录" }}
            columns={[
              {
                key: "terminal",
                title: "码头",
                dataIndex: "terminal",
                width: 120,
              },
              {
                key: "scheduled",
                title: "计划执行时间",
                minWidth: 170,
                render: (_, row) => formatChinaDateTime(row.scheduledFor),
              },
              {
                key: "finished",
                title: "完成时间",
                minWidth: 170,
                render: (_, row) =>
                  row.finishedAt
                    ? formatChinaDateTime(row.finishedAt)
                    : TABLE_EMPTY_MARKER,
              },
              {
                key: "status",
                title: "任务状态",
                width: 140,
                render: (_, row) => (
                  <StatusBadge tone={statusTone(row.status)}>
                    {runLabel(row.status)}
                  </StatusBadge>
                ),
              },
              {
                key: "details",
                title: "操作",
                width: 115,
                align: "center",
                render: (_, row) => (
                  <ButtonLink
                    variant="text"
                    size="compact"
                    href={`/etb-runs?run=${row.id}`}
                  >
                    查看报告
                  </ButtonLink>
                ),
              },
            ]}
          />
        </PageContainer>
      </>
    );
  }

  const [run, user] = await Promise.all([
    prisma.etbQueryRun.findFirst({
      where: runId ? { id: runId } : undefined,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        unmatchedResults: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
      },
    }),
    currentUser(),
  ]);
  if (runId && !run) notFound();
  if (!run)
    return (
      <>
        <PageHeader title="船期更新记录" />
        <PageContainer>
          <EmptyState title="暂无船期更新记录">
            查询执行后将在这里显示报告。
          </EmptyState>
        </PageContainer>
      </>
    );

  const unresolved = run.unmatchedResults.filter((item) => !item.resolvedAt);
  const [completion, candidates] = await Promise.all([
    prisma.operationLog.findFirst({
      where: {
        entityType: "EtbQueryRun",
        entityId: run.id,
        action: "ETB_QUERY_WORKER_COMPLETED",
        ...(run.startedAt ? { createdAt: { gte: run.startedAt } } : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: { after: true },
    }),
    run.status === "AWAITING_MANUAL" && unresolved.length
      ? prisma.sailing.findMany({
          where: { terminal: run.terminal },
          select: { id: true, carrier: true, vesselName: true, voyage: true },
        })
      : [],
  ]);
  const report = readEtbRunReport(run.comparisonReport ?? completion?.after);
  const rows: Detail[] = report?.results
    ? report.results.map((result, id) => ({ ...result, id }))
    : run.unmatchedResults.map((result, id) => ({
        id,
        vessel: result.vesselName,
        voyage: result.voyage,
        soNumbers: [],
        before: null,
        after: result.etbAt.toISOString(),
        outcome: "unmatched",
        note: result.resolvedAt ? "已人工关联" : undefined,
        screenshotStorageKey: result.screenshotStorageKey ?? undefined,
      }));
  const stats = [
    {
      label: "扫描总数",
      value: report?.scanned,
      description: "进入比对的结果数",
    },
    {
      label: "抓取成功数",
      value: report?.captured,
      description: "取得 ETB 的结果数",
    },
    {
      label: "船期变动数",
      value: report?.changed,
      description: "与原确认 ETB 不同",
    },
    {
      label: "异常数",
      value: report?.exceptions ?? (run.errorMessage ? 1 : null),
      description: "未匹配、缺少 ETB 或执行失败",
    },
  ];
  const canRetry =
    user?.role === "ADMIN" &&
    (run.status === "SUCCEEDED" || run.status === "FAILED") &&
    (run.terminal === "盐田" || run.terminal === "蛇口");

  return (
    <>
      <PageHeader
        title="船期更新记录"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink
              href="/etb-runs?view=list"
              variant="outline"
              size="toolbar"
            >
              返回列表
            </ButtonLink>
            <ButtonLink
              href={`/api/etb-runs/${run.id}/export`}
              variant="outline"
              size="toolbar"
            >
              导出日志
            </ButtonLink>
            {canRetry && <RetryButton key={run.id} runId={run.id} />}
          </div>
        }
      />
      <PageContainer className="p-0">
        <div className="dashboard-workspace flex min-h-full w-full flex-col xl:h-full">
          <WorkspaceMetrics
            metrics={stats.map(({ label, value, description }) => ({
              label,
              value: value ?? TABLE_EMPTY_MARKER,
              detail: description,
            }))}
          />
          <div className="flex min-h-[320px] flex-1 flex-col overflow-hidden xl:flex-row">
            <section
              className="min-w-0 flex-1 p-4 xl:overflow-y-auto"
              aria-labelledby="etb-results-title"
            >
              <header className="mb-3">
                <h2
                  id="etb-results-title"
                  className="m-0 text-sm font-semibold text-slate-800"
                >
                  更新结果明细
                </h2>
                <p className="m-0 mt-1 text-xs text-slate-500">
                  本次查询值由人工核对后同步到关联 SO。
                </p>
              </header>
              {!report?.results && report && (
                <FeedbackMessage>
                  这条历史记录仅保留汇总和可追溯的未匹配结果。
                </FeedbackMessage>
              )}
              <DataTable
                aria-label="ETB 比对明细"
                dataSource={rows}
                rowKey="id"
                columns={detailColumns}
                fitContainer
                empty={{
                  title: "暂无结果明细",
                  description:
                    run.status === "PENDING" || run.status === "RUNNING"
                      ? "任务执行完成后可刷新查看结果。"
                      : "本次记录没有可展示的逐条比对结果。",
                }}
              />
            </section>
            <aside
              className="flex w-full shrink-0 flex-col border-t border-slate-200/80 xl:w-[300px] xl:overflow-y-auto xl:border-l xl:border-t-0 2xl:w-[340px]"
              aria-label="任务概况与人工处理"
            >
              <section className="p-4" aria-labelledby="etb-summary-title">
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <h2
                    id="etb-summary-title"
                    className="m-0 text-sm font-semibold text-slate-800"
                  >
                    任务概况
                  </h2>
                  <StatusBadge tone={statusTone(run.status)} dot>
                    {runLabel(run.status)}
                  </StatusBadge>
                </header>
                <dl className="mt-3 mb-0 divide-y divide-slate-100 text-sm">
                  {[
                    { label: "查询码头", value: run.terminal },
                    {
                      label: "计划执行",
                      value: formatChinaDateTime(run.scheduledFor),
                    },
                    {
                      label: "开始时间",
                      value: run.startedAt
                        ? formatChinaDateTime(run.startedAt)
                        : TABLE_EMPTY_MARKER,
                    },
                    {
                      label: "完成时间",
                      value: run.finishedAt
                        ? formatChinaDateTime(run.finishedAt)
                        : TABLE_EMPTY_MARKER,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between gap-2 py-1.5 2xl:py-2.5"
                    >
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="m-0 text-right tabular-nums text-slate-700">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {(run.errorMessage || run.handoffReason) && (
                  <FeedbackMessage
                    tone={run.status === "FAILED" ? "error" : "warning"}
                  >
                    {etbNotificationBody(
                      run.handoffReason || run.errorMessage,
                      run.status === "AWAITING_MANUAL",
                    )}
                  </FeedbackMessage>
                )}
                {run.screenshotStorageKey && (
                  <EvidenceLink storageKey={run.screenshotStorageKey} />
                )}
              </section>
              {run.status === "AWAITING_MANUAL" && (
                <section
                  className="grid gap-3 border-t border-slate-200/80 p-4"
                  aria-labelledby="etb-manual-title"
                >
                  <h2
                    id="etb-manual-title"
                    className="m-0 text-sm font-semibold text-slate-800"
                  >
                    人工处理
                  </h2>
                  {unresolved.map((item) => (
                    <div key={item.id} className={styles.match}>
                      <b>
                        {item.vesselName} / {item.voyage} ·{" "}
                        {formatChinaDateTime(item.etbAt)}
                      </b>
                      <EtbUnmatchedMatchForm
                        runId={run.id}
                        resultId={item.id}
                        sailings={candidates.map((sailing) => ({
                          id: sailing.id,
                          label: `${sailing.carrier} / ${sailing.vesselName} / ${sailing.voyage}`,
                        }))}
                      />
                    </div>
                  ))}
                  <div className={styles.manualActions}>
                    {process.env.ETB_EXECUTION_MODE === "cloud" && (
                      <EtbManualControl id={run.id} />
                    )}
                    <EtbHandoffButton runId={run.id} />
                    {run.manualHandledAt && (
                      <span className="text-xs text-slate-500">
                        已记录处理 {formatChinaDateTime(run.manualHandledAt)}
                      </span>
                    )}
                  </div>
                </section>
              )}
            </aside>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
