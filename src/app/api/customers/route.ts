import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
const schema=z.object({code:z.string().min(1),name:z.string().min(1)});
export async function GET(){return NextResponse.json(await prisma.customer.findMany({include:{factories:true},orderBy:{name:"asc"}}))}
export async function POST(request:Request){const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"客户资料无效"},{status:400});const actor=await currentUser();if(!actor)return NextResponse.json({error:"请先登录"},{status:401});try{const customer=await prisma.$transaction(async tx=>{const created=await tx.customer.create({data:parsed.data});await tx.operationLog.create({data:{action:"CUSTOMER_CREATED",entityType:"Customer",entityId:created.id,...actorFields(actor),after:parsed.data}});return created});return NextResponse.json(customer,{status:201})}catch{return NextResponse.json({error:"客户代码已存在"},{status:409})}}
