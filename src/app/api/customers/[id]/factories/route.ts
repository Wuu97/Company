import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
const schema=z.object({name:z.string().min(1),address:z.string().min(1),contactName:z.string().optional(),contactPhone:z.string().optional()});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"工厂资料无效"},{status:400});const actor=await currentUser();if(!actor)return NextResponse.json({error:"请先登录"},{status:401});const {id}=await params;try{const factory=await prisma.$transaction(async tx=>{const created=await tx.factory.create({data:{customerId:id,...parsed.data}});await tx.operationLog.create({data:{action:"FACTORY_CREATED",entityType:"Factory",entityId:created.id,...actorFields(actor),after:{customerId:id,...parsed.data}}});return created});return NextResponse.json(factory,{status:201})}catch{return NextResponse.json({error:"客户不存在或工厂资料重复"},{status:409})}}
