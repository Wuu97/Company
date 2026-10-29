import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const schema = z.object({ description: z.string().trim().min(1).max(500), packagesText: z.string().trim().max(100).nullable(), weightText: z.string().trim().max(100).nullable(), volumeText: z.string().trim().max(100).nullable() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "货物明细资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id, itemId } = await params;
  try {
    const item = await prisma.$transaction(async tx => {
      const current = await tx.cargoItem.findFirst({ where: { id: itemId, soOrderId: id } });
      if (!current) throw new Error("货物明细不存在或不属于当前 SO");
      const updated = await tx.cargoItem.update({ where: { id: itemId }, data: input.data });
      await tx.operationLog.create({ data: { action: "CARGO_ITEM_UPDATED", entityType: "CargoItem", entityId: itemId, ...actorFields(actor), before: current, after: input.data } });
      return updated;
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "更新货物明细失败" }, { status: 409 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id, itemId } = await params;
  try {
    await prisma.$transaction(async tx => {
      const current = await tx.cargoItem.findFirst({ where: { id: itemId, soOrderId: id } });
      if (!current) throw new Error("货物明细不存在或不属于当前 SO");
      await tx.cargoItem.delete({ where: { id: itemId } });
      await tx.operationLog.create({ data: { action: "CARGO_ITEM_DELETED", entityType: "CargoItem", entityId: itemId, ...actorFields(actor), before: current } });
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "删除货物明细失败" }, { status: 409 });
  }
}
