import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const text = z.string().trim().max(500).optional();
const date = z.string().datetime().optional();
const schema = z.object({
  settlementCarrierType: z.enum(["OWN_FLEET", "PARTNER_MONTHLY", "TEMP_CASH", "UNRESOLVED"]).default("UNRESOLVED"),
  vehicleNo: text, fleetOwnerName: text, driverName: text, driverPhone: text,
  pickupTerminal: text, factoryLocation: text, returnTerminal: text,
  plannedPickupAt: date, note: text,
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "运输段资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  try {
    const leg = await prisma.$transaction(async tx => {
      const task = await tx.transportTask.findUnique({ where: { id }, include: { legs: { select: { sequence: true } } } });
      if (!task) throw new Error("运输任务不存在");
      if (["COMPLETED", "CANCELLED"].includes(task.status)) throw new Error("已结束的运输任务不能新增运输段");
      const sequence = Math.max(0, ...task.legs.map(item => item.sequence)) + 1;
      const created = await tx.transportLeg.create({ data: { transportTaskId: id, sequence, status: task.status, ...input.data, plannedPickupAt: input.data.plannedPickupAt ? new Date(input.data.plannedPickupAt) : undefined } });
      await tx.operationLog.create({ data: { action: "TRANSPORT_LEG_CREATED", entityType: "TransportTask", entityId: id, ...actorFields(actor), after: { legId: created.id, sequence, ...input.data } } });
      return created;
    });
    return NextResponse.json(leg, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "创建运输段失败" }, { status: 409 });
  }
}
