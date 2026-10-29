import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
import { assertTransportStatusTransition } from "@/lib/transport-status";

const text = z.string().trim().max(500).optional();
const date = z.string().datetime().optional();
const schema = z.object({ legId: z.string().cuid(), status: z.enum(["PLANNED", "DISPATCHED", "IN_TRANSIT", "COMPLETED", "CANCELLED"]), settlementCarrierType: z.enum(["OWN_FLEET", "PARTNER_MONTHLY", "TEMP_CASH", "UNRESOLVED"]), vehicleNo: text, fleetOwnerName: text, driverName: text, driverPhone: text, pickupTerminal: text, factoryLocation: text, returnTerminal: text, plannedPickupAt: date, actualPickupAt: date, actualFactoryArrivedAt: date, actualReturnAt: date, trailerSwapNote: text, overnightNote: text, exceptionNote: text, note: text });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json()); if (!input.success) return NextResponse.json({ error: "运输状态资料无效" }, { status: 400 });
  const actor = await currentUser(); if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  try {
    const task = await prisma.$transaction(async tx => {
      const current = await tx.transportTask.findUnique({ where: { id }, include: { legs: { orderBy: { sequence: "asc" }, include: { settlementLines: { include: { bill: { select: { confirmationStatus: true } } } } } }, loadingPlan: { select: { id: true, soOrderId: true } } } });
      if (!current) throw new Error("运输任务不存在");
      const leg = current.legs.find(item => item.id === input.data.legId); if (!leg) throw new Error("运输段不属于当前任务");
      if (leg.settlementCarrierType !== input.data.settlementCarrierType && leg.settlementLines.some(line => line.bill.confirmationStatus === "CONFIRMED")) throw new Error("已确认账单引用该运输段，不能直接修改结算承运类型");
      assertTransportStatusTransition(current.status, input.data.status);
      const { plannedPickupAt, actualPickupAt, actualFactoryArrivedAt, actualReturnAt, legId, ...legData } = input.data;
      const actualReturnAtValue = actualReturnAt ? new Date(actualReturnAt) : leg.actualReturnAt;
      const allLegsReturned = current.legs.every(item => item.id === legId ? Boolean(actualReturnAtValue) : Boolean(item.actualReturnAt));
      if (input.data.status === "COMPLETED" && !allLegsReturned) throw new Error("请先记录所有运输段的实际还柜时间，再完成运输任务");
      const now = new Date();
      await tx.transportLeg.update({ where: { id: legId }, data: { ...legData, plannedPickupAt: plannedPickupAt ? new Date(plannedPickupAt) : undefined, actualPickupAt: actualPickupAt ? new Date(actualPickupAt) : undefined, actualFactoryArrivedAt: actualFactoryArrivedAt ? new Date(actualFactoryArrivedAt) : undefined, actualReturnAt: actualReturnAtValue } });
      await tx.transportLeg.updateMany({ where: { transportTaskId: id }, data: { status: input.data.status } });
      const updated = await tx.transportTask.update({ where: { id }, data: { status: input.data.status, dispatchedAt: input.data.status === "DISPATCHED" ? now : current.dispatchedAt, completedAt: input.data.status === "COMPLETED" ? now : current.completedAt, note: input.data.note ?? current.note } });
      if (input.data.status === "COMPLETED") { await tx.loadingPlan.update({ where: { id: current.loadingPlan.id }, data: { status: "COMPLETED" } }); const plans = await tx.loadingPlan.findMany({ where: { soOrderId: current.loadingPlan.soOrderId }, select: { status: true } }); if (plans.length && plans.every(plan => plan.status === "COMPLETED")) await tx.soOrder.updateMany({ where: { id: current.loadingPlan.soOrderId, status: { not: "CANCELLED" } }, data: { status: "COMPLETED" } }); }
      await tx.operationLog.create({ data: { action: "TRANSPORT_TASK_STATUS_CHANGED", entityType: "TransportTask", entityId: id, ...actorFields(actor), before: { status: current.status, settlementCarrierType: leg.settlementCarrierType }, after: input.data } });
      return updated;
    });
    return NextResponse.json(task);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "运输状态更新失败" }, { status: 409 }); }
}
