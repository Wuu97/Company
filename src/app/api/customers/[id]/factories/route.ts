import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const schema=z.object({name:z.string().min(1),address:z.string().min(1),contactName:z.string().optional(),contactPhone:z.string().optional()});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"工厂资料无效"},{status:400});const {id}=await params;return NextResponse.json(await prisma.factory.create({data:{customerId:id,...parsed.data}}),{status:201})}
