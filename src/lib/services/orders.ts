import { prisma } from "@/lib/prisma";
import { nextInternalContainerCode, validatePlanAssignment } from "@/lib/business";

export type CreateLoadingPlanInput = {
  soOrderId: string;
  factoryId: string;
  scheduledAt: string;
  containerUnitIds: string[];
  reason?: string;
};

export async function createContainer(orderId:string, containerType:string, containerNo?:string) {
  return prisma.$transaction(async tx => {
    const count=await tx.containerUnit.count({where:{soOrderId:orderId}});
    return tx.containerUnit.create({data:{soOrderId:orderId,containerType,containerNo:containerNo||null,internalCode:nextInternalContainerCode(orderId,count+1)}});
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

    const containers = await tx.containerUnit.findMany({
      where: { id: { in: input.containerUnitIds }, soOrderId: input.soOrderId },
      select: { id: true },
    });
    if (containers.length !== input.containerUnitIds.length) {
      throw new Error("存在不属于当前 SO 的内部柜子");
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
        scheduledAt: new Date(input.scheduledAt),
        status: "CONFIRMED",
        reason: input.reason,
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
        after: input,
      },
    });
    return plan;
  });
}
