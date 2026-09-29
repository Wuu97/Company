import { prisma } from "@/lib/prisma";
import { nextInternalContainerCode, validatePlanAssignment } from "@/lib/business";
import { actorFields, type AuditActor } from "@/lib/audit";

export type CreateLoadingPlanInput = {
  soOrderId: string;
  factoryId: string;
  scheduledAt: string;
  containerUnitIds: string[];
  reason?: string;
  customerConfirmationId?: string;
  actor?: AuditActor;
};

export type AdjustContainersInput = {
  orderId: string;
  containers: Array<{ containerType: string; quantity: number }>;
  reason: string;
  actor?: AuditActor;
};

export async function createContainer(orderId:string, containerType:string, containerNo?:string, actor?:AuditActor) {
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${orderId} FOR UPDATE`;
    const count=await tx.containerUnit.count({where:{soOrderId:orderId}});
    const container=await tx.containerUnit.create({data:{soOrderId:orderId,containerType,containerNo:containerNo||null,internalCode:nextInternalContainerCode(orderId,count+1)}});
    await tx.operationLog.create({data:{action:"CONTAINER_CREATED",entityType:"ContainerUnit",entityId:container.id,...actorFields(actor),after:{soOrderId:orderId,containerType,containerNo:containerNo||null,internalCode:container.internalCode}}});
    return container;
  });
}

export async function addPlanItem(planId:string, containerUnitId:string) {
  return prisma.$transaction(async tx => {
    const existing=await tx.loadingPlanItem.findMany({where:{containerUnitId,active:true},select:{id:true}});
    validatePlanAssignment(existing.map(x=>x.id));
    return tx.loadingPlanItem.create({data:{loadingPlanId:planId,containerUnitId}});
  });
}

/** Creates a confirmed loading plan after validating the whole SO/factory/container relationship. */
export async function createLoadingPlan(input: CreateLoadingPlanInput) {
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${input.soOrderId} FOR UPDATE`;
    const order = await tx.soOrder.findUnique({
      where: { id: input.soOrderId },
      select: { customerId: true },
    });
    if (!order) throw new Error("SO 不存在");

    const factory = await tx.factory.findUnique({
      where: { id: input.factoryId },
      select: { customerId: true },
    });
    if (!factory || factory.customerId !== order.customerId) {
      throw new Error("工厂不属于当前 SO 客户");
    }

    const scheduledAt = new Date(input.scheduledAt);
    const nearbyPlans = await tx.loadingPlan.findMany({ where: { factoryId: input.factoryId, status: { in: ["DRAFT", "CONFIRMED"] }, scheduledAt: { gte: new Date(scheduledAt.valueOf() - 2 * 60 * 60 * 1000), lte: new Date(scheduledAt.valueOf() + 2 * 60 * 60 * 1000) } }, select: { id: true, scheduledAt: true } });
    if (nearbyPlans.length && !input.reason?.trim()) throw new Error("该工厂前后两小时内已有有效装柜计划；如确认可并行安排，请填写调整原因。");

    const containers = await tx.containerUnit.findMany({
      where: { id: { in: input.containerUnitIds }, soOrderId: input.soOrderId, active: true },
      select: { id: true },
    });
    if (containers.length !== input.containerUnitIds.length) {
      throw new Error("存在不属于当前 SO 的内部柜子");
    }

    if (input.customerConfirmationId) {
      const confirmation = await tx.customerConfirmation.findUnique({ where: { id: input.customerConfirmationId }, select: { soOrderId: true, quantity: true, status: true } });
      if (!confirmation || confirmation.soOrderId !== input.soOrderId || !["PARTIAL", "CONFIRMED"].includes(confirmation.status)) throw new Error("客户确认批次不属于当前 SO 或尚未有效确认");
      const allocated = await tx.loadingPlanItem.count({ where: { active: true, loadingPlan: { customerConfirmationId: input.customerConfirmationId, status: { in: ["DRAFT", "CONFIRMED"] } } } });
      if (allocated + input.containerUnitIds.length > confirmation.quantity) throw new Error("计划柜量超过该客户确认批次的可用柜量");
    }

    const assignments = await tx.loadingPlanItem.findMany({
      where: { containerUnitId: { in: input.containerUnitIds }, active: true },
      select: { id: true },
    });
    validatePlanAssignment(assignments.map(item => item.id));

    const plan = await tx.loadingPlan.create({
      data: {
        soOrderId: input.soOrderId,
        factoryId: input.factoryId,
        scheduledAt,
        status: "CONFIRMED",
        reason: input.reason,
        customerConfirmationId: input.customerConfirmationId,
      },
    });
    await tx.loadingPlanItem.createMany({
      data: input.containerUnitIds.map(containerUnitId => ({
        loadingPlanId: plan.id,
        containerUnitId,
      })),
    });
    await tx.operationLog.create({
      data: {
        action: "LOADING_PLAN_CREATED",
        entityType: "LoadingPlan",
        entityId: plan.id,
        ...actorFields(input.actor),
        after: { ...input, schedulingConflicts: nearbyPlans.map(plan => ({ id: plan.id, scheduledAt: plan.scheduledAt.toISOString() })) },
      },
    });
    return plan;
  });
}

export async function adjustContainers(input: AdjustContainersInput) {
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${input.orderId} FOR UPDATE`;
    const [order, activePlanItems, confirmations, current] = await Promise.all([
      tx.soOrder.findUniqueOrThrow({ where: { id: input.orderId } }),
      tx.loadingPlanItem.count({ where: { containerUnit: { soOrderId: input.orderId }, active: true } }),
      tx.customerConfirmation.aggregate({ where: { soOrderId: input.orderId, status: { in: ["PARTIAL", "CONFIRMED"] } }, _sum: { quantity: true } }),
      tx.containerUnit.findMany({ where: { soOrderId: input.orderId, active: true }, orderBy: { internalCode: "asc" } }),
    ]);
    if (activePlanItems) throw new Error("存在生效装柜计划；请先调整或取消计划后再调整柜量。");

    const desiredTotal = input.containers.reduce((total, item) => total + item.quantity, 0);
    if (desiredTotal < (confirmations._sum.quantity ?? 0)) throw new Error("调整后的柜量不能少于已确认柜量。");

    const desired = input.containers.reduce((totals, item) => {
      totals.set(item.containerType, (totals.get(item.containerType) ?? 0) + item.quantity);
      return totals;
    }, new Map<string, number>());
    const keepIds = new Set<string>();
    for (const [containerType, quantity] of desired) {
      current.filter(container => container.containerType === containerType).slice(0, quantity).forEach(container => keepIds.add(container.id));
    }
    const toDeactivate = current.filter(container => !keepIds.has(container.id));
    const additions = [...desired].flatMap(([containerType, quantity]) => Array.from(
      { length: Math.max(0, quantity - current.filter(container => container.containerType === containerType).length) },
      () => containerType,
    ));
    if (toDeactivate.some(container => container.containerNo)) throw new Error("带实际柜号的内部柜子不能自动移除，请人工处理。");

    if (toDeactivate.length) await tx.containerUnit.updateMany({ where: { id: { in: toDeactivate.map(container => container.id) } }, data: { active: false } });
    if (additions.length) {
      const total = await tx.containerUnit.count({ where: { soOrderId: input.orderId } });
      await tx.containerUnit.createMany({ data: additions.map((containerType, index) => ({
        soOrderId: input.orderId, containerType,
        internalCode: nextInternalContainerCode(input.orderId, total + index + 1),
      })) });
    }
    await tx.operationLog.create({ data: { action: "SO_CONTAINERS_ADJUSTED", entityType: "SoOrder", entityId: order.id, ...actorFields(input.actor), after: input } });
    return { added: additions.length, removed: toDeactivate.length };
  });
}
