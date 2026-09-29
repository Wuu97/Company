import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const schema = z.object({
  customerId: z.string().min(1).optional(),
  soNumber: z.string().min(1),
  carrier: z.string().min(1),
  siCutoffText: z.string().optional(),
  containers: z.array(z.object({
    containerType: z.string().min(1),
    quantity: z.number().int().min(1).default(1),
    containerNo: z.string().optional(),
  })),
});

function summarizeContainers(items: Array<{ containerType: string; quantity: number }>) {
  return Object.fromEntries(Object.entries(items.reduce<Record<string, number>>(
    (total, item) => ({ ...total, [item.containerType]: (total[item.containerType] || 0) + item.quantity }),
    {},
  )).sort());
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "核对资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  try {
    const order = await prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${id} FOR UPDATE`;
      const before = await tx.soOrder.findUniqueOrThrow({ where: { id } });
      if (input.data.customerId) {
        const customer = await tx.customer.findUnique({ where: { id: input.data.customerId }, select: { id: true } });
        if (!customer) throw new Error("客户不存在");
      }

      const current = await tx.containerUnit.findMany({
        where: { soOrderId: id, active: true },
        select: { containerType: true },
      });
      const requested = summarizeContainers(input.data.containers);
      const existing = summarizeContainers(current.map(item => ({ containerType: item.containerType, quantity: 1 })));
      if (current.length && JSON.stringify(requested) !== JSON.stringify(existing)) {
        throw new Error("柜型或柜量与已创建内部柜子不一致；请使用柜量调整流程。");
      }

      const manualSiCutoff = input.data.siCutoffText?.trim();
      const updated = await tx.soOrder.update({
        where: { id },
        data: {
          customerId: input.data.customerId || before.customerId,
          soNumber: input.data.soNumber,
          carrier: input.data.carrier,
          siCutoffText: manualSiCutoff || before.siCutoffText,
          siCutoffSource: manualSiCutoff ? "MANUAL" : before.siCutoffSource,
          siCutoffEstimatedFromText: manualSiCutoff ? null : before.siCutoffEstimatedFromText,
          parseStatus: "VERIFIED",
        },
      });

      if (!current.length) {
        const historicalCount = await tx.containerUnit.count({ where: { soOrderId: id } });
        const rows = input.data.containers.flatMap(item => Array.from(
          { length: item.quantity },
          () => ({ soOrderId: id, containerType: item.containerType, containerNo: item.containerNo || null }),
        ));
        await tx.containerUnit.createMany({
          data: rows.map((row, index) => ({
            ...row,
            internalCode: `IC-${id.slice(-6).toUpperCase()}-${String(historicalCount + index + 1).padStart(3, "0")}`,
          })),
        });
      }

      await tx.operationLog.create({
        data: {
          action: "SO_REVIEWED",
          entityType: "SoOrder",
          entityId: id,
          ...actorFields(actor),
          before: { soNumber: before.soNumber, carrier: before.carrier, siCutoffText: before.siCutoffText },
          after: input.data,
        },
      });
      return updated;
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SO 核对失败" },
      { status: 409 },
    );
  }
}
