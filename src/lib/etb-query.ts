import { prisma } from "@/lib/prisma";
import { recordEtbObservation } from "@/lib/services/etb";
import { EtbManualHandoffRequiredError, etbQueryFailureState } from "./etb-query-state";

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

export async function completeEtbQueryRun(input: { runId: string; source: string; results: EtbQueryResult[] }) {
  const run = await prisma.etbQueryRun.findUnique({ where: { id: input.runId }, select: { id: true, terminal: true, status: true } });
  if (!run) throw new Error("ETB 查询任务不存在");
  if (!["RUNNING", "AWAITING_MANUAL"].includes(run.status)) throw new Error("该 ETB 查询任务不能再接收结果");
  let matched = 0;
  let screenshotStorageKey: string | undefined;
  for (const result of input.results) {
    screenshotStorageKey ||= result.screenshotStorageKey;
    const sailing = await prisma.sailing.findUnique({
      where: { terminal_carrier_vesselName_voyage: { terminal: run.terminal, carrier: result.carrier, vesselName: result.vesselName, voyage: result.voyage } },
      select: { id: true },
    });
    if (!sailing) continue;
    await recordEtbObservation({
      sailingId: sailing.id, etbAt: result.etbAt, source: input.source,
      sourceUrl: result.sourceUrl, screenshotStorageKey: result.screenshotStorageKey,
    });
    matched += 1;
  }
  const completed = await prisma.etbQueryRun.update({
    where: { id: run.id },
    data: { source: input.source, status: "SUCCEEDED", sessionState: "ACTIVE", resultCount: matched, screenshotStorageKey, errorMessage: null, finishedAt: new Date() },
  });
  await prisma.operationLog.create({ data: { action: "ETB_QUERY_WORKER_COMPLETED", entityType: "EtbQueryRun", entityId: run.id, after: { source: input.source, resultCount: input.results.length, matched } } });
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
