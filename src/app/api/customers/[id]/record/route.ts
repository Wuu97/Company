import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
const schema = z.object({ name: z.string().trim().min(1).max(200), factory: z.object({ id: z.string().min(1), name: z.string().trim().min(1).max(200), address: z.string().trim().min(1).max(500), contactName: z.string().trim().max(200).nullable(), contactPhone: z.string().trim().max(200).nullable() }).optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{id: string}> }) {
 const actor = await currentUser(); if (!actor) return NextResponse.json({error:"请先登录"},{status:401});
 const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({error:"请检查客户和工厂资料"},{status:400});
 const { id } = await params;
 try {
  await prisma.$transaction(async tx => {
   const before = await tx.customer.findUnique({where:{id}}); if (!before) throw new Error("客户不存在");
   const factory = parsed.data.factory;
   const previous = factory ? await tx.factory.findFirst({where:{id:factory.id,customerId:id}}) : null;
   if (factory && !previous) throw new Error("工厂不存在或不属于该客户");
   await tx.customer.update({where:{id},data:{name:parsed.data.name}});
   await tx.operationLog.create({data:{action:"CUSTOMER_UPDATED",entityType:"Customer",entityId:id,...actorFields(actor),before:{name:before.name},after:{name:parsed.data.name}}});
   if (factory && previous) {
    const {id:factoryId,...data}=factory;
    await tx.factory.update({where:{id:factoryId},data});
    await tx.operationLog.create({data:{action:"FACTORY_UPDATED",entityType:"Factory",entityId:factoryId,...actorFields(actor),before:{name:previous.name,address:previous.address,contactName:previous.contactName,contactPhone:previous.contactPhone},after:data}});
   }
  }); return NextResponse.json({ok:true});
 } catch(error) {return NextResponse.json({error:error instanceof Error ? error.message : "保存失败"},{status:409});}
}
