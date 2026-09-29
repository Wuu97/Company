import { prisma } from "@/lib/prisma";
import { recordEtbObservation } from "@/lib/services/etb";
import { EtbManualHandoffRequiredError, etbQueryFailureState } from "./etb-query-state";
import { etbCompletionState } from "./etb-query-completion";
import { uniqueEtbMatch } from "./etb-match";
import { invalidEtbEvidence, requiresEtbResultEvidence } from "./etb-evidence";

export { EtbManualHandoffRequiredError, etbQueryFailureState } from "./etb-query-state";

export type EtbQueryResult = {
  carrier: string;
  vesselName: string;
  voyage: string;
  etbAt: Date;
  sourceUrl?: string;
  screenshotStorageKey?: string;
};

export type EtbQueryAdapter = {
  source: string;
  query(input: { terminal: string; scheduledFor: Date }): Promise<EtbQueryResult[]>;
};

export { etbCompletionState } from "./etb-query-completion";

export async function completeEtbQueryRun(input: { runId: string; source: string; results: EtbQueryResult[] }) {
  const run = await prisma.etbQueryRun.findUnique({ where: { id: input.runId }, select: { id: true, terminal: true, status: true } });
  if (!run) throw new Error("ETB 查询任务不存在");
  if (!["RUNNING", "AWAITING_MANUAL"].includes(run.status)) throw new Error("该 ETB 查询任务不能再接收结果");
  if (requiresEtbResultEvidence(input.source) && invalidEtbEvidence(run.terminal, input.results)) {
    throw new EtbManualHandoffRequiredError("受控浏览器查询结果缺少合格的页面链接或 ETB 结果区域截图，不能作为 ETB 业务证据入库。", "MANUAL_HANDOFF_REQUIRED");
  }
  let matched = 0;
  const unmatched: EtbQueryResult[] = [];
  const candidates = await prisma.sailing.findMany({
    where: { terminal: run.terminal },
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
    await recordEtbObservation({
      sailingId: sailing.id, etbAt: result.etbAt, source: input.source,
      sourceUrl: result.sourceUrl, screenshotStorageKey: result.screenshotStorageKey,
    });
    matched += 1;
  }
  if (unmatched.length) {
    await prisma.etbUnmatchedResult.createMany({
      data: unmatched.map(result => ({
        queryRunId: run.id,
        carrier: result.carrier,
        vesselName: result.vesselName,
        voyage: result.voyage,
        etbAt: result.etbAt,
        sourceUrl: result.sourceUrl,
        screenshotStorageKey: result.screenshotStorageKey,
        matchNote: "自动匹配未命中",
      })),
    });
  }
  const completion = etbCompletionState(matched, unmatched.length);
  const completed = await prisma.etbQueryRun.update({
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
  await prisma.operationLog.create({ data: { action: "ETB_QUERY_WORKER_COMPLETED", entityType: "EtbQueryRun", entityId: run.id, after: { source: input.source, resultCount: input.results.length, matched, unmatched: unmatched.length, status: completion.status } } });
  return completed;
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
