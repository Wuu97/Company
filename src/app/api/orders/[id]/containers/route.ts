import { NextResponse } from "next/server";
import { createContainer } from "@/lib/services/orders";
import { z } from "zod";
const schema=z.object({containerType:z.string().min(1),containerNo:z.string().optional()});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const value=schema.safeParse(await request.json());if(!value.success)return NextResponse.json({error:"柜子资料无效"},{status:400});try{return NextResponse.json(await createContainer((await params).id,value.data.containerType,value.data.containerNo),{status:201})}catch{return NextResponse.json({error:"实际柜号已存在或订单不存在"},{status:409})}}
