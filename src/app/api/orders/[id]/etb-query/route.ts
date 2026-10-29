import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enqueueEtbQueryRun } from "@/lib/etb-query";
import { activeEtbRunStatuses } from "@/lib/etb-query-status";
import { getEtbSourceConfig } from "@/lib/etb-source-config";
import { actorFields } from "@/lib/audit";
import { inferEtbTerminal } from "@/lib/etb-terminal";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const order = await prisma.soOrder.findUnique({ where: { id: (await params).id }, select: { id: true, carrier: true, vesselName: true, voyage: true, loadPort: true, fullReturnLocation: true } });
  if (!order) return NextResponse.json({ error: "SO 不存在" }, { status: 404 });
  if (!order.vesselName || !order.voyage || !order.loadPort) return NextResponse.json({ error: "SO 缺少船名、航次或装货港，无法查询 ETB。" }, { status: 409 });
  const terminal = inferEtbTerminal(order.fullReturnLocation) ?? inferEtbTerminal(order.loadPort);
  if (!terminal) return NextResponse.json({ error: `无法从还柜地点或装货港识别 ETB 码头：${order.fullReturnLocation || order.loadPort}` }, { status: 409 });
  if (terminal === "大铲湾") return NextResponse.json({ error: "大铲湾不提供自动 ETB 查询；船期变更请根据客户通知后人工录入。" }, { status: 409 });
  const sailing = await prisma.$transaction(async tx => {
    const linked = await tx.sailing.upsert({ where: { terminal_carrier_vesselName_voyage: { terminal, carrier: order.carrier, vesselName: order.vesselName!, voyage: order.voyage! } }, create: { terminal, carrier: order.carrier, vesselName: order.vesselName!, voyage: order.voyage!, loadPort: order.loadPort! }, update: { loadPort: order.loadPort! } });
    await tx.soOrder.update({ where: { id: order.id }, data: { sailingId: linked.id } });
    return linked;
  });
  let source;
  try { source = getEtbSourceConfig(sailing.terminal).source; }
  catch { return NextResponse.json({ error: `暂不支持 ${sailing.terminal} 的 ETB 查询。` }, { status: 409 }); }
  const existing = await prisma.etbQueryRun.findFirst({ where: { targetSailingId: sailing.id, status: { in: [...activeEtbRunStatuses] } }, orderBy: { createdAt: "desc" } });
  if (existing) return NextResponse.json({ id: existing.id, status: existing.status, queued: false, message: "该船期已有正在处理的 ETB 查询任务。" });
  const run = await enqueueEtbQueryRun({ terminal: sailing.terminal, source, scheduledFor: new Date(), targetSailingId: sailing.id });
  await prisma.operationLog.create({ data: { action: "ETB_QUERY_MANUAL_REQUESTED", entityType: "SoOrder", entityId: order.id, ...actorFields(actor), after: { runId: run.id, sailingId: sailing.id, terminal: sailing.terminal, queryInput: { carrier: order.carrier, vesselName: order.vesselName, voyage: order.voyage } } } });
  return NextResponse.json({ id: run.id, status: run.status, queued: true });
}
