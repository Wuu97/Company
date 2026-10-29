import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { activeEtbRunStatuses } from "@/lib/etb-query-status";
import { enqueueEtbQueryRun } from "@/lib/etb-query";
import { getEtbSourceConfig } from "@/lib/etb-source-config";
import { actorFields } from "@/lib/audit";

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
    if (existing) { skipped.push(...group.orderIds.map(orderId => ({ orderId, reason: "该船期已有进行中的查询任务" }))); continue; }
    const run = await enqueueEtbQueryRun({ terminal: group.terminal, source, scheduledFor: new Date(), targetSailingId: sailingId });
    queuedRunCount += 1; queuedOrderCount += group.orderIds.length; runIds.push(run.id);
  }
  await prisma.operationLog.create({ data: { action: "ETB_QUERY_BULK_MANUAL_REQUESTED", entityType: "SoOrder", entityId: orderIds.join(","), ...actorFields(actor), after: { orderIds, runIds, queuedRunCount, queuedOrderCount, skipped } } });
  return NextResponse.json({ queuedRunCount, queuedOrderCount, runIds, skipped });
}
