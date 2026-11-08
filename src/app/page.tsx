import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-container";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  ClipboardCheck,
  FileText,
  Settings2,
  Ship,
  Truck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import {
  chinaLocalDateTimeToDate,
  formatOperationalTimeText,
} from "@/lib/time";
import { DashboardActions } from "./dashboard-actions";
import {
  DashboardTasks,
  workflowSteps,
  type WorkflowRow,
} from "./dashboard-tasks";

const riskRules = [
  {
    key: "cutoff",
    label: "截港预警",
    detail: "未来 24 小时内截港且仍有柜未登记还柜",
  },
  {
    key: "pickup",
    label: "提柜异常",
    detail: "超过计划提柜时间且未登记实际提柜",
  },
  { key: "dispatch", label: "派车超时", detail: "超过调度时间且任务仍待派车" },
] as const;

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ risk?: string; step?: string }>;
}) {
  const todayInTokyo = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    dateStyle: "short",
  }).format(new Date());
  const dayStart = new Date(`${todayInTokyo}T00:00:00+09:00`);
  const [viewer, query, orders, activity] = await Promise.all([
    currentUser(),
    searchParams,
    prisma.soOrder.findMany({
      where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: {
        id: true,
        soNumber: true,
        createdAt: true,
        vesselName: true,
        voyage: true,
        parseStatus: true,
        customerId: true,
        portCutoffText: true,
        containers: {
          where: { active: true },
          select: {
            containerType: true,
            containerNo: true,
            planItems: {
              where: {
                active: true,
                loadingPlan: { status: { notIn: ["CANCELLED", "REPLACED"] } },
              },
              select: {
                loadingPlan: {
                  select: {
                    transportTask: {
                      select: {
                        status: true,
                        scheduledAt: true,
                        legs: {
                          where: { status: { not: "CANCELLED" } },
                          select: {
                            plannedPickupAt: true,
                            actualPickupAt: true,
                            actualReturnAt: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.etbQueryRun.findMany({
      where: {
        finishedAt: {
          gte: dayStart,
          lt: new Date(dayStart.getTime() + 86_400_000),
        },
        status: "SUCCEEDED",
      },
      orderBy: [{ finishedAt: "desc" }, { id: "desc" }],
      take: 3,
      select: { id: true, terminal: true, finishedAt: true, resultCount: true },
    }),
  ]);

  const now = new Date();
  const dayFormat = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Tokyo",
    dateStyle: "short",
  });
  const today = dayFormat.format(now);
  const rows = orders.map((order) => {
    const types = new Map<string, number>();
    const tasks = order.containers.flatMap((container) =>
      container.planItems.flatMap(({ loadingPlan }) =>
        loadingPlan.transportTask ? [loadingPlan.transportTask] : [],
      ),
    );
    const pendingDispatch = order.containers.filter(
      (container) =>
        !container.planItems.some(
          ({ loadingPlan }) =>
            loadingPlan.transportTask &&
            ["DISPATCHED", "IN_TRANSIT", "COMPLETED"].includes(
              loadingPlan.transportTask.status,
            ),
        ),
    ).length;
    const outstandingReturn = order.containers.some(
      (container) =>
        !container.planItems.some(({ loadingPlan }) => {
          const task = loadingPlan.transportTask;
          return (
            task &&
            task.legs.length > 0 &&
            task.legs.every((leg) => leg.actualReturnAt)
          );
        }),
    );
    const cutoff =
      order.portCutoffText &&
      chinaLocalDateTimeToDate(formatOperationalTimeText(order.portCutoffText));
    const cutoffMs = cutoff ? cutoff.getTime() - now.getTime() : Infinity;
    const risks = [
      outstandingReturn && cutoffMs >= 0 && cutoffMs <= 86_400_000,
      tasks.some(
        (task) =>
          task.status === "DISPATCHED" &&
          task.legs.some(
            (leg) =>
              leg.plannedPickupAt &&
              leg.plannedPickupAt < now &&
              !leg.actualPickupAt &&
              !leg.actualReturnAt,
          ),
      ),
      tasks.some((task) => task.status === "PLANNED" && task.scheduledAt < now),
    ];
    const steps = [
      order.parseStatus !== "VERIFIED",
      !order.customerId,
      !cutoff,
      pendingDispatch > 0,
    ];
    for (const box of order.containers)
      types.set(box.containerType, (types.get(box.containerType) ?? 0) + 1);
    return {
      id: order.id,
      soNumber: order.soNumber,
      vessel:
        [order.vesselName, order.voyage].filter(Boolean).join(" / ") || "—",
      cargo:
        Array.from(types, ([type, count]) => `${type} × ${count}`).join("、") ||
        "—",
      containers:
        order.containers
          .map((box) => box.containerNo)
          .filter(Boolean)
          .join("、") || "—",
      steps,
      risks,
      pendingDispatch,
      runningToday:
        dayFormat.format(order.createdAt) === today ||
        tasks.some(
          (task) =>
            task.status !== "CANCELLED" &&
            dayFormat.format(task.scheduledAt) === today,
        ),
    };
  });
  const counts = workflowSteps.map(
    (_, index) => rows.filter((row) => row.steps[index]).length,
  );
  const riskCounts = riskRules.map(
    (_, index) => rows.filter((row) => row.risks[index]).length,
  );
  const riskIndex = riskRules.findIndex((rule) => rule.key === query.risk);
  const stepIndex = workflowSteps.findIndex(
    (_, index) => String(index) === query.step,
  );
  const activeLabel = riskRules[riskIndex]?.label ?? workflowSteps[stepIndex];
  const visibleRows = rows.flatMap<WorkflowRow>((row) => {
    if (riskIndex >= 0)
      return row.risks[riskIndex]
        ? [{ ...row, blockers: [riskRules[riskIndex].label] }]
        : [];
    if (stepIndex >= 0 && !row.steps[stepIndex]) return [];
    const blockers = workflowSteps.filter((_, index) => row.steps[index]);
    return blockers.length ? [{ ...row, blockers }] : [];
  });
  const kpis = [
    {
      label: "今日运行订单",
      icon: FileText,
      count: rows.filter((row) => row.runningToday).length,
      detail: "今日创建或有运输计划的未结订单",
    },
    {
      label: "待确认流转",
      icon: ClipboardCheck,
      count: rows.filter((row) => row.steps[0] || row.steps[1]).length,
      detail: "待核对或待匹配的去重订单数",
    },
    {
      label: "待截港还柜",
      icon: Clock,
      count: riskCounts[0],
      detail: "24 小时内截港的待还柜订单",
    },
    {
      label: "待派车集装箱",
      icon: Truck,
      count: rows.reduce((sum, row) => sum + row.pendingDispatch, 0),
      detail: "尚未派车的有效集装箱数",
    },
  ];
  const syncTime = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Tokyo",
    timeStyle: "medium",
  }).format(now);

  return (
    <div className="mx-auto w-full max-w-[1920px]">
      <PageHeader
        title="调度工作台"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <p className="m-0 text-xs text-slate-500">
              数据同步于{" "}
              <time dateTime={now.toISOString()}>{syncTime} JST</time>
            </p>
            <DashboardActions />
          </div>
        }
      />
      <PageContainer className="p-0">
        <div className="dashboard-workspace flex min-h-full w-full flex-col xl:h-full">
          <dl className="m-0 grid w-full shrink-0 grid-cols-2 border-b border-slate-200/80 lg:grid-cols-4">
            {kpis.map(({ label, count, detail, icon: Icon }, index) => (
              <div
                key={label}
                className={`flex min-w-0 items-center justify-between gap-2 p-3.5 xl:p-4 2xl:p-5 ${index % 2 ? "border-l border-slate-100" : ""} ${index >= 2 ? "border-t border-slate-100 lg:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""}`}
              >
                <div className="min-w-0" title={detail}>
                  <dt className="text-xs font-medium text-slate-500">
                    {label}
                  </dt>
                  <dd className="mb-0 ml-0 mt-1 font-mono text-2xl font-bold tabular-nums text-slate-800">
                    {count}
                  </dd>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-500">
                  <Icon size={16} aria-hidden="true" />
                </span>
              </div>
            ))}
          </dl>
          <div className="flex min-h-[320px] flex-1 flex-col overflow-hidden xl:flex-row">
            <DashboardTasks
              rows={visibleRows}
              counts={counts}
              activeLabel={activeLabel}
            />
            <aside
              className="flex w-full shrink-0 flex-col border-t border-slate-200/80 xl:w-[300px] xl:overflow-y-auto xl:border-l xl:border-t-0 2xl:w-[340px]"
              aria-label="调度监控与快捷工具"
            >
              <section className="p-4" aria-labelledby="risk-title">
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <h2
                    id="risk-title"
                    className="m-0 text-sm font-semibold text-slate-800"
                  >
                    实时风险监控
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs ${riskCounts.some(Boolean) ? "text-amber-700" : "text-emerald-700"}`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-current"
                    />
                    {riskCounts.some(Boolean) ? "有风险待处理" : "运行正常"}
                  </span>
                </header>
                <ul className="mb-0 mt-2 list-none divide-y divide-slate-100 p-0">
                  {riskRules.map(({ key, label, detail }, index) => (
                    <li
                      key={key}
                      title={detail}
                      className="py-1.5 text-xs 2xl:py-2.5"
                    >
                      <Link
                        href={`/?risk=${key}#workflow`}
                        scroll={false}
                        aria-current={riskIndex === index ? "true" : undefined}
                        className={`flex justify-between gap-2 rounded-sm text-slate-700 no-underline hover:text-blue-700 ${riskIndex === index ? "font-semibold text-blue-700" : ""}`}
                      >
                        {label}
                        <span
                          className={`font-mono ${riskCounts[index] ? (index === 0 ? "text-amber-700" : "text-rose-700") : "text-slate-500"}`}
                        >
                          {riskCounts[index]} 项
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
              <section
                className="border-t border-slate-200/80 p-4"
                aria-labelledby="tools-title"
              >
                <h2
                  id="tools-title"
                  className="m-0 text-sm font-semibold text-slate-800"
                >
                  今日动态与快捷外链
                </h2>
                {activity.length ? (
                  <ul className="mb-0 mt-2 list-none space-y-1.5 p-0 text-xs text-slate-600">
                    {activity.map(
                      ({ id, terminal, finishedAt, resultCount }) => (
                        <li key={id} className="flex gap-2">
                          <time
                            className="shrink-0 font-mono text-slate-500"
                            dateTime={finishedAt?.toISOString()}
                          >
                            {finishedAt?.toLocaleTimeString("zh-CN", {
                              timeZone: "Asia/Tokyo",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                          <span>
                            {terminal} ETB 查询完成 · {resultCount} 条结果
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p className="mb-0 mt-2 text-xs text-slate-500">
                    今日暂无已完成的 ETB 查询
                  </p>
                )}
                <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
                  <Link
                    href="/sailings"
                    className="flex items-center gap-2 py-2 text-xs text-slate-700 no-underline hover:text-blue-700"
                  >
                    <Ship size={15} aria-hidden="true" /> 码头 ETB 实时查询{" "}
                    <ArrowUpRight
                      size={13}
                      className="ml-auto text-slate-400"
                      aria-hidden="true"
                    />
                  </Link>
                  {viewer?.role === "ADMIN" && (
                    <Link
                      href="/settings?tab=platforms"
                      className="flex items-center gap-2 py-2 text-xs text-slate-700 no-underline hover:text-blue-700"
                    >
                      <Settings2 size={15} aria-hidden="true" /> 船期监控设置{" "}
                      <ArrowUpRight
                        size={13}
                        className="ml-auto text-slate-400"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
