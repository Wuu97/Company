import {PrismaClient} from "@prisma/client";
const db=new PrismaClient();
const id=()=>`concurrency_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
try{
 const seed=await db.soOrder.findFirst({where:{customerId:{not:null}},include:{customer:true}});
 if(!seed) throw new Error("没有可用测试 SO");
 const factory=await db.factory.findFirst({where:{customerId:seed.customerId}});
 if(!factory) throw new Error("没有可用客户工厂");
 const containerId=id(), planA=id(), planB=id();
 await db.containerUnit.create({data:{id:containerId,soOrderId:seed.id,internalCode:`TEST-${containerId}`,containerType:"40HC"}});
 await db.loadingPlan.createMany({data:[{id:planA,soOrderId:seed.id,factoryId:factory.id,scheduledAt:new Date(),status:"CONFIRMED"},{id:planB,soOrderId:seed.id,factoryId:factory.id,scheduledAt:new Date(),status:"CONFIRMED"}]});
 const attempt=plan=>db.$transaction(async tx=>tx.loadingPlanItem.create({data:{loadingPlanId:plan,containerUnitId:containerId}}));
 const results=await Promise.allSettled([attempt(planA),attempt(planB)]);
 const fulfilled=results.filter(x=>x.status==="fulfilled").length;
 if(fulfilled!==1) throw new Error(`并发结果错误：成功 ${fulfilled} 次`);
 console.log("PLAN_CONCURRENCY_PASS",JSON.stringify(results.map(x=>x.status)));
}finally{
 await db.loadingPlanItem.deleteMany({where:{loadingPlanId:{startsWith:"concurrency_"}}});
 await db.loadingPlan.deleteMany({where:{id:{startsWith:"concurrency_"}}});
 await db.containerUnit.deleteMany({where:{id:{startsWith:"concurrency_"}}});
 await db.$disconnect();
}
