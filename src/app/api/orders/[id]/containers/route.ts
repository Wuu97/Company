import { NextResponse } from "next/server";
import { createContainer } from "@/lib/services/orders";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
const schema=z.object({containerType:z.string().min(1)});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const value=schema.safeParse(await request.json());if(!value.success)return NextResponse.json({error:"柜子资料无效"},{status:400});const actor=await currentUser();if(!actor)return NextResponse.json({error:"请先登录"},{status:401});try{return NextResponse.json(await createContainer((await params).id,value.data.containerType,actor),{status:201})}catch{return NextResponse.json({error:"内部柜子创建失败"},{status:409})}}
