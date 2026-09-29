import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  try {
    const plan = await prisma.$transaction(async tx => {
      const target = await tx.loadingPlan.findUnique({ where: { id }, select: { soOrderId: true } });
      if (!target) throw new Error("装柜计划不存在");
      await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${target.soOrderId} FOR UPDATE`;
      const found = await tx.loadingPlan.findUniqueOrThrow({ where: { id }, include: { items: { where: { active: true } } } });
      if (!["DRAFT", "CONFIRMED"].includes(found.status)) throw new Error("当前计划不能取消");
      await tx.loadingPlanItem.updateMany({ where: { loadingPlanId: id, active: true }, data: { active: false } });
      const updated = await tx.loadingPlan.update({ where: { id }, data: { status: "CANCELLED" } });
      await tx.operationLog.create({ data: { action: "LOADING_PLAN_CANCELLED", entityType: "LoadingPlan", entityId: id, ...actorFields(actor), before: { status: found.status }, after: { status: "CANCELLED" } } });
      return updated;
    });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "取消失败" }, { status: 409 });
  }
}
