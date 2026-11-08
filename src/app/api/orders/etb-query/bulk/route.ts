import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { activeEtbRunStatuses } from "@/lib/etb-query-status";
import { enqueueEtbQueryRun } from "@/lib/etb-query";
import { getEtbSourceConfig } from "@/lib/etb-source-config";
import { actorFields } from "@/lib/audit";

export const runtime = "nodejs";

async function dispatchLocalRuns(ids: string[]) {
  if (!ids.length || process.env.ETB_EXECUTION_MODE === "cloud") return;
  await new Promise<void>((done, reject) => {
    const child = spawn(process.execPath, ["--import", "tsx", resolve("scripts/process-next-etb-query.ts"), "--runs", ids.join(",")], {
      cwd: process.cwd(), env: process.env, detached: true, stdio: "ignore",
    });
    child.once("error", reject);
    child.once("spawn", () => { child.unref(); done(); });
  });
}

const schema = z.object({ orderIds: z.array(z.string().cuid()).min(1).max(50) });

export async function POST(request: Request) {
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "请选择 1 至 50 个 SO" }, { status: 400 });
  const orderIds = [...new Set(input.data.orderIds)];
  const orders = await prisma.soOrder.findMany({ where: { id: { in: orderIds } }, include: { sailing: { select: { id: true, terminal: true } } } });
  const byId = new Map(orders.map(order => [order.id, order]));
  const skipped: Array<{ orderId: string; reason: string }> = [];
  const sailingOrders = new Map<string, { terminal: string; orderIds: string[] }>();
  for (const orderId of orderIds) {
    const order = byId.get(orderId);
    if (!order) { skipped.push({ orderId, reason: "SO 不存在" }); continue; }
    if (!order.sailing) { skipped.push({ orderId, reason: "尚未关联船期" }); continue; }
    const group = sailingOrders.get(order.sailing.id) ?? { terminal: order.sailing.terminal, orderIds: [] };
    group.orderIds.push(orderId); sailingOrders.set(order.sailing.id, group);
  }
  let queuedRunCount = 0; let queuedOrderCount = 0;
  const runIds: string[] = [];
  for (const [sailingId, group] of sailingOrders) {
    if (group.terminal === "大铲湾") {
      skipped.push(...group.orderIds.map(orderId => ({ orderId, reason: "大铲湾不提供自动 ETB 查询；请按客户通知人工录入" })));
      continue;
    }
    let source: string;
    try { source = getEtbSourceConfig(group.terminal).source; }
    catch { skipped.push(...group.orderIds.map(orderId => ({ orderId, reason: `暂不支持 ${group.terminal} 的 ETB 查询` }))); continue; }
    const existing = await prisma.etbQueryRun.findFirst({ where: { targetSailingId: sailingId, status: { in: [...activeEtbRunStatuses] } }, orderBy: { createdAt: "desc" } });
    if (existing && (existing.status !== "PENDING" || process.env.ETB_EXECUTION_MODE === "cloud")) {
      const reason = existing.status === "PENDING" ? "该船期已有查询任务排队中" : "该船期已有进行中的查询任务";
      skipped.push(...group.orderIds.map(orderId => ({ orderId, reason })));
      continue;
    }
    const run = existing ?? await enqueueEtbQueryRun({ terminal: group.terminal, source, scheduledFor: new Date(), targetSailingId: sailingId });
    queuedRunCount += 1; queuedOrderCount += group.orderIds.length; runIds.push(run.id);
  }
  await prisma.operationLog.create({ data: { action: "ETB_QUERY_BULK_MANUAL_REQUESTED", entityType: "SoOrder", entityId: orderIds.join(","), ...actorFields(actor), after: { orderIds, runIds, queuedRunCount, queuedOrderCount, skipped } } });
  try {
    await dispatchLocalRuns(runIds);
  } catch (error) {
    console.error("启动本地 ETB Worker 失败", error);
    return NextResponse.json({ error: "查询任务已排队，启动失败，请重试" }, { status: 503 });
  }
  return NextResponse.json({ queuedRunCount, queuedOrderCount, runIds, skipped });
}
