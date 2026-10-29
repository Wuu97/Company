import { NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";

const schema = z.object({
  loadedAt: z.string().datetime(),
  containers: z.array(z.object({ containerUnitId: z.string().cuid(), containerNo: z.string().trim().min(1).max(30) })).min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "装柜完成资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.$transaction(async tx => {
      const plan = await tx.loadingPlan.findUnique({ where: { id }, include: { items: { where: { active: true }, select: { containerUnitId: true } } } });
      if (!plan || plan.status !== "CONFIRMED") throw new Error("仅已确认的装柜计划可以登记装柜结果");
      const plannedIds = plan.items.map(item => item.containerUnitId).sort();
      const submittedIds = input.data.containers.map(item => item.containerUnitId).sort();
      if (plannedIds.length !== submittedIds.length || plannedIds.some((item, index) => item !== submittedIds[index])) throw new Error("请为该装柜计划中的每个内部柜登记实际柜号");
      const normalized = input.data.containers.map(item => ({ ...item, containerNo: item.containerNo.toUpperCase().replace(/\s+/g, "") }));
      if (new Set(normalized.map(item => item.containerNo)).size !== normalized.length) throw new Error("实际柜号不能重复");
      const duplicate = await tx.containerUnit.findFirst({ where: { containerNo: { in: normalized.map(item => item.containerNo) }, id: { notIn: plannedIds } }, select: { id: true } });
      if (duplicate) throw new Error("存在已被其他内部柜使用的实际柜号");
      const loadedAt = new Date(input.data.loadedAt);
      for (const item of normalized) await tx.containerUnit.update({ where: { id: item.containerUnitId }, data: { containerNo: item.containerNo, loadedAt } });
      await tx.operationLog.create({ data: { action: "CONTAINER_LOADING_COMPLETED", entityType: "LoadingPlan", entityId: id, ...actorFields(actor), after: { loadedAt: loadedAt.toISOString(), containers: normalized } } });
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "登记装柜结果失败" }, { status: 409 });
  }
}
