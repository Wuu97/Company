import { prisma } from "@/lib/prisma";
import businessStyles from "@/components/business.module.css";
import { currentUser } from "@/lib/auth";
import { PlanForm } from "@/components/plan-form";
import { PlanAdjustForm } from "@/components/plan-adjust-form";
import { TransportTaskForm } from "@/components/transport-task-form";
import { TransportLegEditorList } from "@/components/transport-leg-editor-list";
import { TransportCostForm } from "@/components/transport-cost-form";
import { ResolveEtbImpactButton } from "@/components/resolve-etb-impact-button";
import { LoadingCompletionForm } from "@/components/loading-completion-form";
import { statusLabel, statusTone } from "@/lib/status-labels";
import { formatChinaDateTime } from "@/lib/time";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import {
  RecordCard,
  RecordCardField,
  RecordCardFields,
  RecordCardHeader,
  RecordCardList,
} from "@/components/ui/record-card";
import styles from "./page.module.css";

export default async function Plans() {
  const user = await currentUser();
  const canManageCosts = user?.role === "ADMIN";
  const [plans, orders, factories, containers, confirmations] =
    await Promise.all([
      prisma.loadingPlan.findMany({
        include: {
          soOrder: true,
          factory: true,
          items: {
            include: {
              containerUnit: {
                select: {
                  id: true,
                  internalCode: true,
                  containerType: true,
                  containerNo: true,
                  loadedAt: true,
                },
              },
            },
          },
          transportTask: {
            include: {
              legs: { orderBy: { sequence: "asc" } },
              costs: { orderBy: { createdAt: "asc" } },
            },
          },
        },
        orderBy: { scheduledAt: "asc" },
      }),
      prisma.soOrder.findMany({ select: { id: true, soNumber: true } }),
      prisma.factory.findMany({ select: { id: true, name: true } }),
      prisma.containerUnit.findMany({
        where: { active: true },
        select: {
          id: true,
          internalCode: true,
          containerNo: true,
          soOrderId: true,
        },
      }),
      prisma.customerConfirmation.findMany({
        where: { status: { in: ["PARTIAL", "CONFIRMED"] } },
        select: {
          id: true,
          soOrderId: true,
          quantity: true,
          expectedLoadingAt: true,
        },
      }),
    ]);

  return (
    <>
      <PageHeader
        title="装柜与运输"
        description="从装柜计划、派车、换车到实际还柜在同一条执行链路中管理；每个计划对应一项运输任务。"
      />
      <PlanForm
        orders={orders.map((o) => ({ id: o.id, label: o.soNumber }))}
        factories={factories.map((f) => ({ id: f.id, label: f.name }))}
        containers={containers.map((c) => ({
          id: c.id,
          orderId: c.soOrderId,
          label: `${c.internalCode} · ${c.containerNo ? "已登记柜号" : "待装柜"}`,
        }))}
        confirmations={confirmations.map((c) => ({
          id: c.id,
          orderId: c.soOrderId,
          quantity: c.quantity,
          label: `已确认 ${c.quantity} 柜${c.expectedLoadingAt ? ` · 预计 ${formatChinaDateTime(c.expectedLoadingAt)}` : ""}`,
        }))}
      />
      <RecordCardList className={styles.list} density="compact">
        {plans.length ? (
          plans.map((plan) => {
            const task = plan.transportTask;
            return (
              <RecordCard
                density="compact"
                className={
                  plan.status === "CONFIRMED" ? styles.confirmed : undefined
                }
                key={plan.id}
              >
                <RecordCardHeader density="compact" className={styles.header}>
                  <div>
                    <span className={styles.label}>订单 / 工厂</span>
                    <b>
                      {plan.soOrder.soNumber} · {plan.factory.name}
                    </b>
                  </div>
                  <StatusBadge tone={statusTone(plan.status)}>{statusLabel(plan.status)}</StatusBadge>
                </RecordCardHeader>
                <RecordCardFields density="compact" columns={3}>
                  <RecordCardField density="compact">
                    <span className={styles.label}>计划装柜时间</span>
                    <b>{formatChinaDateTime(plan.scheduledAt)}</b>
                  </RecordCardField>
                  <RecordCardField density="compact">
                    <span className={styles.label}>已安排柜子</span>
                    <b>{plan.items.length} 个</b>
                  </RecordCardField>
                  <RecordCardField density="compact">
                    <span className={styles.label}>运输状态</span>
                    {task ? (
                      <StatusBadge tone={statusTone(task.status)}>{statusLabel(task.status)}</StatusBadge>
                    ) : (
                      <span className={styles.pending}>尚未派车</span>
                    )}
                  </RecordCardField>
                </RecordCardFields>
                {plan.status === "CONFIRMED" && (
                  <div className={styles.actions}>
                    <div>
                      <LoadingCompletionForm
                        planId={plan.id}
                        containers={plan.items.map(
                          (item) => item.containerUnit,
                        )}
                      />
                      {!task ? (
                        <>
                          <h4>1. 派车</h4>
                          <p className={businessStyles["muted"]}>
                            填写计划提柜时间，创建后可持续记录换车与实际还柜。
                          </p>
                          <TransportTaskForm planId={plan.id} />
                        </>
                      ) : (
                        <section className={businessStyles["plan-transport-chain"]}>
                          <div className={businessStyles["plan-transport-chain__heading"]}>
                            <div>
                              <h4>执行链路</h4>
                              <p>装柜 → 派车 → 换车/甩挂 → 实际还柜</p>
                            </div>
                            <StatusBadge tone={statusTone(task.status)}>
                              {statusLabel(task.status)}
                            </StatusBadge>
                          </div>
                          <div className={businessStyles["plan-transport-chain__summary"]}>
                            <div>
                              <span>计划提柜</span>
                              <b>{formatChinaDateTime(task.scheduledAt)}</b>
                            </div>
                            <div>
                              <span>运输段</span>
                              <b>{task.legs.length} 段</b>
                            </div>
                            <div>
                              <span>实际还柜</span>
                              <b>
                                {task.legs.some((leg) => leg.actualReturnAt)
                                  ? "已记录"
                                  : "待记录"}
                              </b>
                            </div>
                          </div>
                          {task.etbImpactNeedsReview ? (
                            <div className={styles.impact}>
                              <div>
                                <b>靠港时间变化可能影响此运输安排</b>
                                <p>
                                  {task.etbImpactResolutionNote ||
                                    "请核对后确认是否维持或调整当前派车安排。"}
                                </p>
                              </div>
                              <ResolveEtbImpactButton taskId={task.id} />
                            </div>
                          ) : null}
                          <div className={businessStyles["plan-transport-chain__legs"]}>
                            <TransportLegEditorList
                              taskId={task.id}
                              status={task.status}
                              legs={task.legs}
                              factoryFallback="装柜工厂待定"
                            />
                          </div>
                          <TransportCostForm
                            taskId={task.id}
                            costs={task.costs}
                            canManage={canManageCosts}
                          />
                        </section>
                      )}
                    </div>
                    <div>
                      <h4>调整计划</h4>
                      <p className={businessStyles["muted"]}>调整后会保留原计划作为历史记录。</p>
                      <PlanAdjustForm planId={plan.id} />
                    </div>
                  </div>
                )}
              </RecordCard>
            );
          })
        ) : (
          <EmptyState title="暂无装柜计划">
            客户确认柜量后，即可在上方创建计划并安排运输。
          </EmptyState>
        )}
      </RecordCardList>
    </>
  );
}
