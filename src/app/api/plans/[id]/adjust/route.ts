import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const schema = z.object({ scheduledAt: z.string().datetime(), reason: z.string().min(1) });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "调整资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  try {
    const id = (await params).id;
    const next = await prisma.$transaction(async tx => {
      const target = await tx.loadingPlan.findUniqueOrThrow({ where: { id }, select: { soOrderId: true } });
      await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${target.soOrderId} FOR UPDATE`;
      const old = await tx.loadingPlan.findUniqueOrThrow({ where: { id }, include: { items: { where: { active: true } } } });
      if (!["DRAFT", "CONFIRMED"].includes(old.status)) throw new Error("当前计划不能调整");
      const items = old.items.filter(item => item.active);
      if (!items.length) throw new Error("原计划没有有效柜子");
      await tx.loadingPlanItem.updateMany({ where: { loadingPlanId: id, active: true }, data: { active: false } });
      await tx.loadingPlan.update({ where: { id }, data: { status: "REPLACED" } });
      const replacement = await tx.loadingPlan.create({ data: { soOrderId: old.soOrderId, factoryId: old.factoryId, scheduledAt: new Date(input.data.scheduledAt), status: "CONFIRMED", reason: input.data.reason, replacesPlanId: id, items: { create: items.map(item => ({ containerUnitId: item.containerUnitId })) } } });
      await tx.loadingPlanChange.create({ data: { fromPlanId: id, toPlanId: replacement.id, reason: input.data.reason } });
      await tx.operationLog.create({ data: { action: "LOADING_PLAN_ADJUSTED", entityType: "LoadingPlan", entityId: replacement.id, ...actorFields(actor), before: { planId: id }, after: input.data } });
      return replacement;
    });
    return NextResponse.json(next);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "调整失败" }, { status: 409 }); }
}
