import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
const schema=z.object({status:z.enum(["COMPLETED","CANCELLED"]),note:z.string().min(1)});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const input=schema.safeParse(await request.json());if(!input.success)return NextResponse.json({error:"请填写处理说明"},{status:400});const actor=await currentUser();if(!actor)return NextResponse.json({error:"请先登录"},{status:401});const {id}=await params;const task=await prisma.customerContactTask.updateMany({where:{id,status:"OPEN"},data:{status:input.data.status,note:input.data.note,completedAt:new Date()}});if(task.count!==1)return NextResponse.json({error:"待办不存在或已处理"},{status:409});await prisma.operationLog.create({data:{action:"CUSTOMER_CONTACT_TASK_RESOLVED",entityType:"CustomerContactTask",entityId:id,...actorFields(actor),after:input.data}});return NextResponse.json({ok:true});}
