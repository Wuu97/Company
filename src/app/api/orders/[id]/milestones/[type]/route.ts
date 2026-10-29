import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
import { orderMilestoneTypes } from "@/lib/order-milestones";

const schema = z.object({ status: z.enum(["PENDING", "COMPLETED", "NOT_REQUIRED"]), note: z.string().trim().max(1000).nullable() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; type: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "单证节点资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id, type } = await params;
  if (!orderMilestoneTypes.includes(type as (typeof orderMilestoneTypes)[number])) return NextResponse.json({ error: "不支持的单证节点" }, { status: 400 });
  try {
    const milestone = await prisma.$transaction(async tx => {
      const order = await tx.soOrder.findUnique({ where: { id }, select: { id: true } });
      if (!order) throw new Error("SO 不存在");
      const before = await tx.orderMilestone.findUnique({ where: { soOrderId_type: { soOrderId: id, type } } });
      const completedAt = input.data.status === "COMPLETED" ? before?.completedAt || new Date() : null;
      const updated = await tx.orderMilestone.upsert({ where: { soOrderId_type: { soOrderId: id, type } }, create: { soOrderId: id, type, ...input.data, completedAt }, update: { ...input.data, completedAt } });
      await tx.operationLog.create({ data: { action: "ORDER_MILESTONE_UPDATED", entityType: "OrderMilestone", entityId: updated.id, ...actorFields(actor), before: before ? { status: before.status, note: before.note, completedAt: before.completedAt?.toISOString() ?? null } : undefined, after: { type, ...input.data, completedAt: completedAt?.toISOString() ?? null } } });
      return updated;
    });
    return NextResponse.json(milestone);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "更新单证节点失败" }, { status: 409 });
  }
}
