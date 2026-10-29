import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const schema = z.object({ description: z.string().trim().min(1).max(500), packagesText: z.string().trim().max(100).nullable(), weightText: z.string().trim().max(100).nullable(), volumeText: z.string().trim().max(100).nullable() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "货物明细资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  try {
    const item = await prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${id} FOR UPDATE`;
      const order = await tx.soOrder.findUnique({ where: { id }, select: { id: true } });
      if (!order) throw new Error("SO 不存在");
      const last = await tx.cargoItem.aggregate({ where: { soOrderId: id }, _max: { sortOrder: true } });
      const created = await tx.cargoItem.create({ data: { soOrderId: id, sortOrder: (last._max.sortOrder ?? -1) + 1, ...input.data } });
      await tx.operationLog.create({ data: { action: "CARGO_ITEM_CREATED", entityType: "CargoItem", entityId: created.id, ...actorFields(actor), after: { soOrderId: id, ...input.data } } });
      return created;
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "新增货物明细失败" }, { status: 409 });
  }
}
