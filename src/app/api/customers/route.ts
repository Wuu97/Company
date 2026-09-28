import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
const schema=z.object({code:z.string().min(1),name:z.string().min(1)});
export async function GET(){return NextResponse.json(await prisma.customer.findMany({include:{factories:true},orderBy:{name:"asc"}}))}
export async function POST(request:Request){const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"客户资料无效"},{status:400});const customer=await prisma.customer.create({data:parsed.data});return NextResponse.json(customer,{status:201})}
