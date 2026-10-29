import { prisma } from "@/lib/prisma";
import { notifyActiveUsers } from "@/lib/notifications";
import { DEFAULT_ETB_MANUAL_ESCALATION_MS, etbManualEscalationBefore } from "./etb-handoff-escalation";

export async function generateEtbHandoffEscalations(now = new Date()) {
  const configuredWaitMs = Number(process.env.ETB_MANUAL_ESCALATION_MS);
  const waitMs = Number.isFinite(configuredWaitMs) && configuredWaitMs > 0 ? configuredWaitMs : DEFAULT_ETB_MANUAL_ESCALATION_MS;
  const threshold = etbManualEscalationBefore(now, waitMs);
  const overdue = await prisma.etbQueryRun.findMany({
    where: { status: "AWAITING_MANUAL", manualHandledAt: null, OR: [{ finishedAt: { lt: threshold } }, { finishedAt: null, createdAt: { lt: threshold } }] },
    select: { id: true, terminal: true, handoffReason: true, errorMessage: true },
  });
  let notifications = 0;
  await prisma.$transaction(async tx => {
    for (const run of overdue) notifications += await notifyActiveUsers(tx, {
      kind: "ETB_MANUAL_HANDOFF_OVERDUE",
      title: `${run.terminal} ETB 人工接管超时`,
      body: run.handoffReason || run.errorMessage || "该查询任务长时间未处理，请检查后重新排队或记录处理结果。",
      href: "/etb-runs",
      dedupeKey: `etb-escalation:${run.id}`,
    });
  });
  return { overdue: overdue.length, notifications, waitMs };
}
