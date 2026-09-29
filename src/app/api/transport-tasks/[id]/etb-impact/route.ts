import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
const schema=z.object({note:z.string().min(1)});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const input=schema.safeParse(await request.json());if(!input.success)return NextResponse.json({error:"请填写运输影响处理说明"},{status:400});const actor=await currentUser();if(!actor)return NextResponse.json({error:"请先登录"},{status:401});const {id}=await params;const result=await prisma.transportTask.updateMany({where:{id,etbImpactNeedsReview:true},data:{etbImpactNeedsReview:false,etbImpactResolvedAt:new Date(),etbImpactResolutionNote:input.data.note}});if(result.count!==1)return NextResponse.json({error:"待处理的运输影响不存在"},{status:409});await prisma.operationLog.create({data:{action:"TRANSPORT_ETB_IMPACT_RESOLVED",entityType:"TransportTask",entityId:id,...actorFields(actor),after:input.data}});return NextResponse.json({ok:true});}
