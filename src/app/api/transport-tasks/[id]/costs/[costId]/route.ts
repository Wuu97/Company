import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireFinancialAccess } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const amount = z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/, "金额最多两位小数");
const schema = z.object({ category: z.string().trim().min(1).max(80), amount, currency: z.string().trim().length(3), vendorName: z.string().trim().max(200).nullable(), note: z.string().trim().max(500).nullable() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; costId: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "费用资料无效" }, { status: 400 });
  let actor;
  try { actor = await requireFinancialAccess(); } catch (error) { return authErrorResponse(error); }
  const { id, costId } = await params;
  try {
    const cost = await prisma.$transaction(async tx => {
      const before = await tx.transportCost.findFirst({ where: { id: costId, transportTaskId: id } });
      if (!before) throw new Error("费用明细不存在或不属于当前运输任务");
      const updated = await tx.transportCost.update({ where: { id: costId }, data: { ...input.data, currency: input.data.currency.toUpperCase() } });
      await tx.operationLog.create({ data: { action: "TRANSPORT_COST_UPDATED", entityType: "TransportCost", entityId: costId, ...actorFields(actor), before, after: input.data } });
      return updated;
    });
    return NextResponse.json(cost);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "更新费用失败" }, { status: 409 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; costId: string }> }) {
  let actor;
  try { actor = await requireFinancialAccess(); } catch (error) { return authErrorResponse(error); }
  const { id, costId } = await params;
  try {
    await prisma.$transaction(async tx => { const cost = await tx.transportCost.findFirst({ where: { id: costId, transportTaskId: id } }); if (!cost) throw new Error("费用明细不存在或不属于当前运输任务"); await tx.transportCost.delete({ where: { id: costId } }); await tx.operationLog.create({ data: { action: "TRANSPORT_COST_DELETED", entityType: "TransportCost", entityId: costId, ...actorFields(actor), before: cost } }); });
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "删除费用失败" }, { status: 409 }); }
}
