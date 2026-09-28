import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const schema=z.object({soNumber:z.string().min(1),carrier:z.string().min(1),containers:z.array(z.object({containerType:z.string().min(1),quantity:z.number().int().min(1).default(1),containerNo:z.string().optional()}))});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 const data=schema.safeParse(await request.json());if(!data.success)return NextResponse.json({error:"核对资料无效"},{status:400});const {id}=await params;
 const order=await prisma.$transaction(async tx=>{const before=await tx.soOrder.findUniqueOrThrow({where:{id}});const updated=await tx.soOrder.update({where:{id},data:{soNumber:data.data.soNumber,carrier:data.data.carrier,parseStatus:"VERIFIED"}});const existing=await tx.containerUnit.count({where:{soOrderId:id}});await tx.containerUnit.createMany({data:data.data.containers.flatMap(c=>Array.from({length:c.quantity},()=>({soOrderId:id,containerType:c.containerType,containerNo:c.containerNo||null}))).map((c,i)=>({...c,internalCode:`IC-${id.slice(-6).toUpperCase()}-${String(existing+i+1).padStart(3,"0")}`}))});await tx.operationLog.create({data:{action:"SO_REVIEWED",entityType:"SoOrder",entityId:id,before:{soNumber:before.soNumber,carrier:before.carrier},after:data.data}});return updated});return NextResponse.json(order);
}
