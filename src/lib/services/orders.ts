import { prisma } from "@/lib/prisma";
import { nextInternalContainerCode, validatePlanAssignment } from "@/lib/business";

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
