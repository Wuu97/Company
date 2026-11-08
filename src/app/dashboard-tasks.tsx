import { TABLE_EMPTY_MARKER } from "@/components/ui/table-placeholder";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";

export const workflowSteps = [
  "待核对 SO",
  "待匹配客户",
  "待确认截港",
  "待派车调度",
] as const;

export type WorkflowRow = {
  id: string;
  soNumber: string;
  vessel: string;
  cargo: string;
  containers: string;
  blockers: readonly string[];
};

const columns: DataTableColumn<WorkflowRow>[] = [
  {
    key: "so",
    title: "SO 编号 / 提单号",
    width: 150,
    render: (_, row) => (
      <span className="block whitespace-normal [overflow-wrap:anywhere]">
        {row.soNumber}
      </span>
    ),
  },
  {
    key: "vessel",
    title: "船名航次",
    width: 150,
    render: (_, row) => row.vessel === TABLE_EMPTY_MARKER ? TABLE_EMPTY_MARKER : (
      <span className="block whitespace-normal [overflow-wrap:anywhere]">
        {row.vessel}
      </span>
    ),
  },
  { key: "cargo", title: "箱型箱量", dataIndex: "cargo", width: 85 },
  { key: "container", title: "柜号", dataIndex: "containers", width: 100 },
  {
    key: "blocker",
    title: "当前卡点",
    width: 125,
    render: (_, row) => (
      <span title={row.blockers.join("、")}>
        <StatusBadge tone="warning">
          {row.blockers[0]}
          {row.blockers.length > 1 ? ` +${row.blockers.length - 1}` : ""}
        </StatusBadge>
      </span>
    ),
  },
  {
    key: "action",
    title: "操作",
    width: 68,
    render: (_, row) => (
      <Link
        href={`/orders/${row.id}`}
        className="text-xs text-blue-700 no-underline"
      >
        查看
      </Link>
    ),
  },
];

export function DashboardTasks({
  rows,
  counts,
  activeLabel,
}: {
  rows: WorkflowRow[];
  counts: number[];
  activeLabel?: string;
}) {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="flex min-h-[320px] w-full min-w-0 flex-1 flex-col xl:min-h-0"
    >
      <header className="shrink-0 border-b border-slate-100 p-3.5 xl:p-4 2xl:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="workflow-title"
            className="m-0 text-sm font-semibold text-slate-800"
          >
            业务流转待办概览
          </h2>
          {activeLabel && (
            <Link
              href="/#workflow"
              scroll={false}
              className="text-xs text-blue-700 no-underline"
            >
              清除筛选
            </Link>
          )}
        </div>
        <nav aria-label="流转筛选" className="mt-3 flex flex-wrap gap-2">
          {workflowSteps.map((label, index) => (
            <span key={label} className="inline-flex items-center gap-2">
              {index > 0 && (
                <ChevronRight
                  size={13}
                  className="text-slate-400"
                  aria-hidden="true"
                />
              )}
              <Link
                href={`/?step=${index}#workflow`}
                scroll={false}
                aria-current={activeLabel === label ? "true" : undefined}
                className={`rounded-full px-2.5 py-1 text-xs font-medium no-underline ${activeLabel === label ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {label} <span className="font-mono">({counts[index]})</span>
              </Link>
            </span>
          ))}
        </nav>
        {activeLabel && (
          <p className="mb-0 mt-3 text-xs text-slate-500">
            当前筛选 · {activeLabel}
          </p>
        )}
      </header>
      <div className="dashboard-task-table flex min-h-0 flex-1 flex-col">
        <DataTable
          columns={columns}
          dataSource={rows}
          rowKey="id"
          fitContainer
          mobileHint={null}
          maxHeight="100%"
          empty={{
            title: "暂无待处理调度任务",
            description: "",
          }}
        />
      </div>
    </section>
  );
}
