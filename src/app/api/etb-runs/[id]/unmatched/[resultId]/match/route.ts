import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { recordEtbObservation } from "@/lib/services/etb";
import { actorFields } from "@/lib/audit";

const schema = z.object({ sailingId: z.string().cuid() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string; resultId: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "请选择要关联的船期" }, { status: 400 });
  const { id, resultId } = await params;
  const result = await prisma.etbUnmatchedResult.findFirst({ where: { id: resultId, queryRunId: id, resolvedAt: null }, include: { queryRun: { select: { terminal: true, source: true } } } });
  if (!result) return NextResponse.json({ error: "待匹配 ETB 结果不存在或已处理" }, { status: 404 });
  const sailing = await prisma.sailing.findFirst({ where: { id: input.data.sailingId, terminal: result.queryRun.terminal }, select: { id: true } });
  if (!sailing) return NextResponse.json({ error: "只能关联到同一码头的船期" }, { status: 409 });
  try {
    const observation = await recordEtbObservation({ sailingId: sailing.id, etbAt: result.etbAt, source: result.queryRun.source, sourceUrl: result.sourceUrl || undefined, screenshotStorageKey: result.screenshotStorageKey || undefined, note: `人工确认匹配：${result.carrier} / ${result.vesselName} / ${result.voyage}`, actor: admin });
    const resolved = await prisma.etbUnmatchedResult.updateMany({ where: { id: result.id, resolvedAt: null }, data: { resolvedAt: new Date(), resolvedSailingId: sailing.id, matchNote: "管理员已确认匹配" } });
    if (resolved.count !== 1) return NextResponse.json({ error: "该结果已被其他操作处理" }, { status: 409 });
    const remaining = await prisma.etbUnmatchedResult.count({ where: { queryRunId: id, resolvedAt: null } });
    if (remaining === 0) await prisma.etbQueryRun.update({ where: { id }, data: { status: "SUCCEEDED", sessionState: "ACTIVE", handoffReason: "所有 ETB 未匹配结果均已由管理员确认。", finishedAt: new Date() } });
    await prisma.operationLog.create({ data: { action: "ETB_UNMATCHED_RESULT_MATCHED", entityType: "EtbQueryRun", entityId: id, ...actorFields(admin), after: { resultId, sailingId: sailing.id, observationId: observation.id } } });
    return NextResponse.json({ ok: true, observationId: observation.id });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "确认匹配失败" }, { status: 409 }); }
}
