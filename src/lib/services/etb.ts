import { prisma } from "@/lib/prisma";
import { formatChinaDateTime } from "@/lib/time";
import { notifyActiveUsers } from "@/lib/notifications";
import { actorFields, type AuditActor } from "@/lib/audit";

export async function recordEtbObservation(input:{sailingId:string;etbAt:Date;source:string;sourceUrl?:string;screenshotStorageKey?:string;note?:string;actor?:AuditActor}){
 return prisma.$transaction(async tx=>{
  await tx.$queryRaw`SELECT id FROM "Sailing" WHERE id=${input.sailingId} FOR UPDATE`;
  const sailing=await tx.sailing.findUnique({where:{id:input.sailingId},select:{id:true,adoptedEtbAt:true}});
  if(!sailing)throw new Error("船期不存在");
  const isSame=sailing.adoptedEtbAt?.valueOf()===input.etbAt.valueOf();
  const {note,...observationInput}=input;
  const observation=await tx.sailingObservation.create({data:{...observationInput,status:isSame?"IGNORED":"PENDING",reviewNote:note}});
  if(!isSame){
   await tx.sailing.update({where:{id:sailing.id},data:{pendingEtbAt:input.etbAt,pendingEtbSource:input.source,pendingEtbObservedAt:new Date(),etbNeedsReview:true}});
   const orders=await tx.soOrder.findMany({where:{sailingId:sailing.id},select:{id:true}});
   await tx.soOrder.updateMany({where:{sailingId:sailing.id},data:{etbNeedsReview:true}});
   await notifyActiveUsers(tx,{kind:"ETB_CHANGE",title:"船期 ETB 变化待核实",body:`${input.etbAt.toISOString()} 的 ETB 观测已到达，关联 ${orders.length} 个 SO；在人工采用前不会修改业务计划。`,href:`/sailings/${sailing.id}`});
   await tx.operationLog.createMany({data:orders.map(order=>({action:"ETB_CHANGE_DETECTED",entityType:"SoOrder",entityId:order.id,...actorFields(input.actor),after:{sailingId:sailing.id,etbAt:input.etbAt.toISOString(),source:input.source}}))});
   const tasks=await tx.transportTask.findMany({where:{loadingPlan:{soOrder:{sailingId:sailing.id}},status:{in:["DISPATCHED","IN_TRANSIT"]}},select:{id:true}});
   if(tasks.length){await tx.transportTask.updateMany({where:{id:{in:tasks.map(task=>task.id)}},data:{etbImpactNeedsReview:true,etbImpactResolvedAt:null,etbImpactResolutionNote:null}});await tx.operationLog.createMany({data:tasks.map(task=>({action:"ETB_IMPACTED_DISPATCHED_TRANSPORT",entityType:"TransportTask",entityId:task.id,...actorFields(input.actor),after:{sailingId:sailing.id,etbAt:input.etbAt.toISOString(),source:input.source}}))});}
  }
  await tx.operationLog.create({data:{action:"ETB_OBSERVED",entityType:"Sailing",entityId:sailing.id,...actorFields(input.actor),after:{etbAt:input.etbAt.toISOString(),source:input.source,status:observation.status}}});
  return observation;
 });
}

export async function adoptEtbObservation(sailingId:string,observationId:string,note?:string,actor?:AuditActor){
 return prisma.$transaction(async tx=>{
  await tx.$queryRaw`SELECT id FROM "Sailing" WHERE id=${sailingId} FOR UPDATE`;
  const observation=await tx.sailingObservation.findFirst({where:{id:observationId,sailingId,status:"PENDING"}});
  if(!observation)throw new Error("待核实的 ETB 观测不存在");
  await tx.sailingObservation.updateMany({where:{sailingId,status:"PENDING",id:{not:observationId}},data:{status:"SUPERSEDED",reviewedAt:new Date(),reviewNote:"被新的人工采用值取代"}});
  await tx.sailingObservation.update({where:{id:observationId},data:{status:"ADOPTED",reviewedAt:new Date(),reviewNote:note}});
  const adoptedAt=new Date();
  await tx.sailing.update({where:{id:sailingId},data:{adoptedEtbAt:observation.etbAt,adoptedEtbSource:observation.source,adoptedEtbAtConfirmedAt:adoptedAt,pendingEtbAt:null,pendingEtbSource:null,pendingEtbObservedAt:null,etbNeedsReview:false}});
  const orders=await tx.soOrder.findMany({where:{sailingId},select:{id:true}});
  await tx.soOrder.updateMany({where:{sailingId},data:{etbText:formatChinaDateTime(observation.etbAt),etbSource:observation.source,etbObservedAt:observation.observedAt,etbNeedsReview:false}});
  await tx.operationLog.createMany({data:orders.map(order=>({action:"ETB_ADOPTED",entityType:"SoOrder",entityId:order.id,...actorFields(actor),after:{sailingId,observationId,etbAt:observation.etbAt.toISOString(),source:observation.source,note}}))});
  return observation;
 });
}
