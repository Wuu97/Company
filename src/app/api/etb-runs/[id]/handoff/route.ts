import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const schema = z.object({ note: z.string().trim().min(2).max(1000) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "请说明人工接管结果" }, { status: 400 });
  const { id } = await params;
  const run = await prisma.etbQueryRun.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!run) return NextResponse.json({ error: "ETB 查询任务不存在" }, { status: 404 });
  if (run.status !== "AWAITING_MANUAL") return NextResponse.json({ error: "只有待人工接管任务可以处理" }, { status: 409 });
  const updated = await prisma.etbQueryRun.update({
    where: { id },
    data: { handoffReason: input.data.note, manualHandledAt: new Date() },
  });
  await prisma.operationLog.create({ data: { action: "ETB_QUERY_MANUAL_HANDOFF", entityType: "EtbQueryRun", entityId: id, ...actorFields(admin), after: { note: input.data.note } } });
  return NextResponse.json(updated);
}
