import { prisma } from "@/lib/prisma";
import { recordEtbObservationInTransaction } from "@/lib/services/etb";
import { EtbManualHandoffRequiredError, etbQueryFailureState } from "./etb-query-state";
import { etbCompletionState } from "./etb-query-completion";
import { uniqueEtbMatch } from "./etb-match";
import { invalidEtbEvidence, requiresEtbResultEvidence } from "./etb-evidence";
import { activeEtbRunStatuses } from "./etb-query-status";

export { EtbManualHandoffRequiredError, etbQueryFailureState } from "./etb-query-state";

export type EtbQueryResult = {
  carrier: string;
  vesselName: string;
  voyage: string;
  etbAt?: Date;
  portCutoffText?: string;
  sourceUrl?: string;
  screenshotStorageKey?: string;
};

export type EtbQueryAdapter = {
  source: string;
  query(input: { terminal: string; scheduledFor: Date }): Promise<EtbQueryResult[]>;
};

export { activeEtbRunStatuses } from "./etb-query-status";

export { etbCompletionState } from "./etb-query-completion";

/**
 * Creates work for the isolated browser host.  The web/scheduler process must
 * never open a staff browser profile itself.  A Worker claims this row before
 * it starts the controlled browser and submits results through the protected
 * worker endpoint.
 */
export async function enqueueEtbQueryRun(input: { terminal: string; source: string; scheduledFor: Date; targetSailingId?: string }) {
  // Scheduled jobs are batch-wide. Do not stack a second browser run while the
  // previous batch is pending, running, or awaiting a staff CAPTCHA action.
  return prisma.$transaction(async tx => {
    // A transaction-scoped advisory lock makes the check/create sequence safe
    // even though PostgreSQL cannot express this partial uniqueness rule in
    // Prisma's schema.
    const queueKey = input.targetSailingId ? `etb-target:${input.targetSailingId}` : `etb-batch:${input.terminal}`;
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${queueKey}))`;
    const existing = await tx.etbQueryRun.findFirst({
      where: input.targetSailingId
        ? { targetSailingId: input.targetSailingId, status: { in: [...activeEtbRunStatuses] } }
        : { terminal: input.terminal, targetSailingId: null, status: { in: [...activeEtbRunStatuses] } },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return existing;
    return tx.etbQueryRun.create({
      data: { terminal: input.terminal, source: input.source, scheduledFor: input.scheduledFor, targetSailingId: input.targetSailingId, status: "PENDING" },
    });
  });
}

export async function completeEtbQueryRun(input: { runId: string; source: string; results: EtbQueryResult[] }) {
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM "EtbQueryRun" WHERE id=${input.runId} FOR UPDATE`;
    const run = await tx.etbQueryRun.findUnique({ where: { id: input.runId }, select: { id: true, terminal: true, status: true, targetSailingId: true } });
    if (!run) throw new Error("ETB 查询任务不存在");
    // A worker may submit exactly once per claim.  A resumed manual task is
    // claimed as RUNNING again, so accepting AWAITING_MANUAL here only creates
    // a duplicate-completion window.
    if (run.status !== "RUNNING") throw new Error("该 ETB 查询任务不能再接收结果");
    if (requiresEtbResultEvidence(input.source) && invalidEtbEvidence(run.terminal, input.results)) {
      throw new EtbManualHandoffRequiredError("受控浏览器查询结果缺少合格的页面链接或 ETB 结果区域截图，不能作为 ETB 业务证据入库。", "MANUAL_HANDOFF_REQUIRED");
    }
    let matched = 0;
    const unmatched: EtbQueryResult[] = [];
    const candidates = await tx.sailing.findMany({
      where: run.targetSailingId ? { id: run.targetSailingId, terminal: run.terminal } : { terminal: run.terminal },
      select: { id: true, carrier: true, vesselName: true, voyage: true },
    });
    let screenshotStorageKey: string | undefined;
    for (const result of input.results) {
      screenshotStorageKey ||= result.screenshotStorageKey;
      const sailing = uniqueEtbMatch(result, candidates);
      if (!sailing) {
        unmatched.push(result);
        continue;
      }
      if (result.portCutoffText) await tx.soOrder.updateMany({ where: { sailingId: sailing.id }, data: { portCutoffText: result.portCutoffText } });
      if (result.etbAt) await recordEtbObservationInTransaction(tx, {
        sailingId: sailing.id, etbAt: result.etbAt, source: input.source,
        sourceUrl: result.sourceUrl, screenshotStorageKey: result.screenshotStorageKey,
      });
      else if (result.portCutoffText) await tx.soOrder.updateMany({ where: { sailingId: sailing.id }, data: { etbText: null, etbSource: null, etbObservedAt: new Date() } });
      matched += 1;
    }
    if (unmatched.length) {
      await tx.etbUnmatchedResult.createMany({
        data: unmatched.filter(result => result.etbAt).map(result => ({
          queryRunId: run.id,
          carrier: result.carrier,
          vesselName: result.vesselName,
          voyage: result.voyage,
          etbAt: result.etbAt!,
          sourceUrl: result.sourceUrl,
          screenshotStorageKey: result.screenshotStorageKey,
          matchNote: "自动匹配未命中",
        })),
      });
    }
    const completion = etbCompletionState(matched, unmatched.length);
    const completed = await tx.etbQueryRun.update({
      where: { id: run.id },
      data: {
        source: input.source,
        status: completion.status,
        sessionState: completion.sessionState,
        handoffReason: completion.handoffReason,
        resultCount: matched,
        screenshotStorageKey,
        errorMessage: null,
        finishedAt: new Date(),
      },
    });
    await tx.operationLog.create({ data: { action: "ETB_QUERY_WORKER_COMPLETED", entityType: "EtbQueryRun", entityId: run.id, after: { source: input.source, resultCount: input.results.length, matched, unmatched: unmatched.length, status: completion.status } } });
    return completed;
  });
}

export async function runEtbQuery(input: { terminal: string; source: string; scheduledFor: Date; adapter?: EtbQueryAdapter }) {
  const run = await prisma.etbQueryRun.create({
    data: { terminal: input.terminal, source: input.source, scheduledFor: input.scheduledFor, status: "RUNNING", startedAt: new Date() },
  });
  try {
    if (!input.adapter) {
      throw new EtbManualHandoffRequiredError(
        "尚未完成真实数据源验证或配置。请由员工在受控浏览器完成登录/验证后重试，或人工录入观测结果。",
        "MANUAL_HANDOFF_REQUIRED",
      );
    }
    const results = await input.adapter.query({ terminal: input.terminal, scheduledFor: input.scheduledFor });
    return await completeEtbQueryRun({ runId: run.id, source: input.adapter.source, results });
  } catch (error) {
    return prisma.etbQueryRun.update({ where: { id: run.id }, data: { ...etbQueryFailureState(error), finishedAt: new Date() } });
  }
}
