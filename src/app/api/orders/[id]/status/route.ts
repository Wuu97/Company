import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { orderStatuses, validateOrderStatusTransition } from "@/lib/business";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
const schema=z.object({status:z.enum(orderStatuses)});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const body=schema.safeParse(await request.json());if(!body.success)return NextResponse.json({error:"订单状态无效"},{status:400});const actor=await currentUser();if(!actor)return NextResponse.json({error:"请先登录"},{status:401});const {id}=await params;try{const order=await prisma.$transaction(async tx=>{const current=await tx.soOrder.findUnique({where:{id},select:{status:true}});if(!current)throw new Error("SO 不存在");validateOrderStatusTransition(current.status,body.data.status);const updated=await tx.soOrder.update({where:{id},data:{status:body.data.status}});await tx.operationLog.create({data:{action:"SO_STATUS_CHANGED",entityType:"SoOrder",entityId:id,...actorFields(actor),before:{status:current.status},after:{status:body.data.status}}});return updated;});return NextResponse.json(order);}catch(error){const message=error instanceof Error?error.message:"状态更新失败";return NextResponse.json({error:message},{status:message==="SO 不存在"?404:409});}}
