import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const optionalText = z.string().trim().max(200).nullable();
const schema = z.object({ name: z.string().trim().min(1).max(200), address: z.string().trim().min(1).max(500), contactName: optionalText, contactPhone: optionalText });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; factoryId: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "工厂资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id, factoryId } = await params;
  try {
    const factory = await prisma.$transaction(async tx => {
      const before = await tx.factory.findFirst({ where: { id: factoryId, customerId: id } });
      if (!before) throw new Error("工厂不存在或不属于当前客户");
      const updated = await tx.factory.update({ where: { id: factoryId }, data: input.data });
      await tx.operationLog.create({ data: { action: "FACTORY_UPDATED", entityType: "Factory", entityId: factoryId, ...actorFields(actor), before: { name: before.name, address: before.address, contactName: before.contactName, contactPhone: before.contactPhone }, after: input.data } });
      return updated;
    });
    return NextResponse.json(factory);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && /Unique constraint/.test(error.message) ? "该客户下已有同名工厂" : error instanceof Error ? error.message : "更新工厂失败" }, { status: 409 });
  }
}
