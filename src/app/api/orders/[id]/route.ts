import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "node:fs/promises";
import { join } from "node:path";

export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  const order=await prisma.soOrder.findUnique({where:{id},include:{files:true,containers:true,confirmations:true,plans:true}});
  if(!order) return NextResponse.json({error:"SO 不存在"},{status:404});
  if(order.containers.length||order.confirmations.length||order.plans.length) return NextResponse.json({error:"该 SO 已有关联柜子、客户确认或装柜计划，不能删除。"},{status:409});
  await prisma.$transaction(async tx=>{await tx.operationLog.create({data:{action:"SO_DELETED",entityType:"SoOrder",entityId:id,before:{soNumber:order.soNumber,carrier:order.carrier}}});await tx.soFileVersion.deleteMany({where:{soOrderId:id}});await tx.soOrder.delete({where:{id}});});
  await Promise.all(order.files.map(async file=>{try{await unlink(join(process.env.FILE_STORAGE_ROOT||"./uploads",file.storageKey));}catch(error){if((error as NodeJS.ErrnoException).code!=="ENOENT")await prisma.operationLog.create({data:{action:"SO_FILE_DELETE_PENDING",entityType:"SoFileVersion",entityId:file.id,after:{storageKey:file.storageKey,error:error instanceof Error?error.message:"unknown"}}});}}));
  return NextResponse.json({ok:true});
}
