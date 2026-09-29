import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
const schema=z.object({terminal:z.string().min(1),carrier:z.string().min(1),vesselName:z.string().min(1),voyage:z.string().min(1),loadPort:z.string().optional()});
export async function POST(request:Request){const input=schema.safeParse(await request.json());if(!input.success)return NextResponse.json({error:"船期资料无效"},{status:400});const actor=await currentUser();if(!actor)return NextResponse.json({error:"请先登录"},{status:401});try{const sailing=await prisma.sailing.create({data:input.data});await prisma.operationLog.create({data:{action:"SAILING_CREATED",entityType:"Sailing",entityId:sailing.id,...actorFields(actor),after:input.data}});return NextResponse.json(sailing,{status:201});}catch{return NextResponse.json({error:"相同码头、船公司、船名及航次的船期已存在"},{status:409});}}
