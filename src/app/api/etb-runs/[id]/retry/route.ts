import { NextResponse } from "next/server";
import { actorFields } from "@/lib/audit";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { enqueueEtbQueryRun } from "@/lib/etb-query";
import { getEtbSourceConfig } from "@/lib/etb-source-config";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await requireAdmin();
    const { id } = await params;
    const run = await prisma.etbQueryRun.findUnique({ where: { id } });
    if (!run)
      return NextResponse.json({ error: "未找到更新记录" }, { status: 404 });
    if (run.status !== "FAILED" && run.status !== "SUCCEEDED") {
      return NextResponse.json(
        { error: "请等待任务完成，或先处理人工接管事项" },
        { status: 409 },
      );
    }
    if (run.terminal !== "盐田" && run.terminal !== "蛇口") {
      return NextResponse.json(
        { error: "该码头暂不支持重新触发" },
        { status: 400 },
      );
    }
    const queued = await enqueueEtbQueryRun({
      terminal: run.terminal,
      source: getEtbSourceConfig(run.terminal).source,
      targetSailingId: run.targetSailingId ?? undefined,
      batchOffset: run.batchOffset,
      scheduledFor: new Date(),
    });
    await prisma.operationLog.create({
      data: {
        action: "ETB_QUERY_RETRIGGERED",
        entityType: "EtbQueryRun",
        entityId: id,
        ...actorFields(actor),
        after: { queuedRunId: queued.id },
      },
    });
    return NextResponse.json({ id: queued.id });
  } catch (error) {
    return authErrorResponse(error);
  }
}
