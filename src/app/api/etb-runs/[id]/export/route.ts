import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { readEtbRunReport } from "@/lib/etb-run-report";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await currentUser()))
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  const run = await prisma.etbQueryRun.findUnique({
    where: { id },
    include: { unmatchedResults: true },
  });
  if (!run)
    return NextResponse.json({ error: "未找到更新记录" }, { status: 404 });
  const completion = await prisma.operationLog.findFirst({
    where: {
      entityType: "EtbQueryRun",
      entityId: id,
      action: "ETB_QUERY_WORKER_COMPLETED",
      ...(run.startedAt ? { createdAt: { gte: run.startedAt } } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: { after: true },
  });
  return NextResponse.json(
    { run, report: readEtbRunReport(run.comparisonReport ?? completion?.after) },
    {
      headers: {
        "Content-Disposition": `attachment; filename="etb-${run.id}.json"`,
        "Cache-Control": "private, no-store",
      },
    },
  );
}
