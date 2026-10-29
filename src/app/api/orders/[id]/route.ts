import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}) {
  const actor=await currentUser();
  if(!actor)return NextResponse.json({error:"请先登录"},{status:401});
  const {id}=await params;
  const order=await prisma.soOrder.findUnique({where:{id},include:{files:true,containers:true,confirmations:true,plans:true,milestones:true,contactTasks:true}});
  if(!order) return NextResponse.json({error:"SO 不存在"},{status:404});
  if(new URL(request.url).searchParams.get("pendingOnly")==="1"&&order.parseStatus!=="PENDING") return NextResponse.json({error:"该 SO 已进入识别流程，不能从上传区撤回。"},{status:409});
  if(order.containers.length||order.confirmations.length||order.plans.length||order.milestones.length||order.contactTasks.length) return NextResponse.json({error:"有关联业务记录，暂不能删除。"},{status:409});
  await prisma.$transaction(async tx=>{await tx.operationLog.create({data:{action:"SO_DELETED",entityType:"SoOrder",entityId:id,...actorFields(actor),before:{soNumber:order.soNumber,carrier:order.carrier}}});await tx.cargoItem.deleteMany({where:{soOrderId:id}});await tx.soVersionChange.deleteMany({where:{soOrderId:id}});await tx.soFileVersion.deleteMany({where:{soOrderId:id}});await tx.soOrder.delete({where:{id}});});
  await Promise.all(order.files.map(async file=>{try{await unlink(join(process.env.FILE_STORAGE_ROOT||"./uploads",file.storageKey));}catch(error){if((error as NodeJS.ErrnoException).code!=="ENOENT")await prisma.operationLog.create({data:{action:"SO_FILE_DELETE_PENDING",entityType:"SoFileVersion",entityId:file.id,...actorFields(actor),after:{storageKey:file.storageKey,error:error instanceof Error?error.message:"unknown"}}});}}));
  return NextResponse.json({ok:true});
}
