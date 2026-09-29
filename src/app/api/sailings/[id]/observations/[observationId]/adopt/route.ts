import { NextResponse } from "next/server";
import { z } from "zod";
import { adoptEtbObservation } from "@/lib/services/etb";
import { currentUser } from "@/lib/auth";
const schema=z.object({note:z.string().optional()});
export async function POST(request:Request,{params}:{params:Promise<{id:string;observationId:string}>}){const input=schema.safeParse(await request.json());if(!input.success)return NextResponse.json({error:"采用备注无效"},{status:400});const actor=await currentUser();if(!actor)return NextResponse.json({error:"请先登录"},{status:401});const {id,observationId}=await params;try{return NextResponse.json(await adoptEtbObservation(id,observationId,input.data.note,actor));}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"ETB 采用失败"},{status:409});}}
