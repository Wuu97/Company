import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const schema = z.object({ code: z.string().trim().min(1).max(80), name: z.string().trim().min(1).max(200), active: z.boolean() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "客户资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  try {
    const customer = await prisma.$transaction(async tx => {
      const before = await tx.customer.findUnique({ where: { id } });
      if (!before) throw new Error("客户不存在");
      const updated = await tx.customer.update({ where: { id }, data: input.data });
      await tx.operationLog.create({ data: { action: "CUSTOMER_UPDATED", entityType: "Customer", entityId: id, ...actorFields(actor), before: { code: before.code, name: before.name, active: before.active }, after: input.data } });
      return updated;
    });
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && /Unique constraint/.test(error.message) ? "客户编码已存在" : error instanceof Error ? error.message : "更新客户失败" }, { status: 409 });
  }
}
