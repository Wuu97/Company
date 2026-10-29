import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireFinancialAccess } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const amount = z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/, "金额最多两位小数");
const schema = z.object({ category: z.string().trim().min(1).max(80), amount, currency: z.string().trim().length(3).default("CNY"), vendorName: z.string().trim().max(200).nullable(), note: z.string().trim().max(500).nullable() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "费用资料无效" }, { status: 400 });
  let actor;
  try { actor = await requireFinancialAccess(); } catch (error) { return authErrorResponse(error); }
  const { id } = await params;
  try {
    const cost = await prisma.$transaction(async tx => {
      const task = await tx.transportTask.findUnique({ where: { id }, select: { id: true } }); if (!task) throw new Error("运输任务不存在");
      const created = await tx.transportCost.create({ data: { transportTaskId: id, ...input.data, currency: input.data.currency.toUpperCase() } });
      await tx.operationLog.create({ data: { action: "TRANSPORT_COST_CREATED", entityType: "TransportCost", entityId: created.id, ...actorFields(actor), after: { transportTaskId: id, ...input.data } } }); return created;
    });
    return NextResponse.json(cost, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "新增费用失败" }, { status: 409 }); }
}
