import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LocalFileStorage } from "@/lib/storage";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

export async function POST(request:Request) {
  const actor=await currentUser();
  if(!actor)return NextResponse.json({error:"请先登录"},{status:401});
  const form=await request.formData();
  const file=form.get("file");
  const soOrderId=typeof form.get("soOrderId")==="string"?String(form.get("soOrderId")):undefined;
  if(!(file instanceof File))
    return NextResponse.json({error:"请选择 SO PDF 文件"},{status:400});
  if(file.type!=="application/pdf") return NextResponse.json({error:"仅支持 PDF 文件"},{status:400});
  const storage=new LocalFileStorage();
  const saved=await storage.put({bytes:Buffer.from(await file.arrayBuffer()),originalName:file.name});
  const existing=await prisma.soFileVersion.findUnique({where:{sha256:saved.sha256},include:{soOrder:true}});
  if(existing) return NextResponse.json({error:"该原始文件已上传",soOrderId:existing.soOrderId},{status:409});
  // PDF extraction runs in a dedicated worker in the next iteration; upload must never lose the original file.
  const parsed=undefined;const parseStatus:"PENDING"="PENDING";
  const order=await prisma.$transaction(async tx=>{
    const so=soOrderId?await tx.soOrder.findUnique({where:{id:soOrderId}}):await tx.soOrder.create({data:{soNumber:"待解析",carrier:"待解析",parseStatus}});
    if(!so)throw new Error("SO 不存在");
    // Serialize version allocation for an existing order.
    await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${so.id} FOR UPDATE`;
    const latest=await tx.soFileVersion.aggregate({where:{soOrderId:so.id},_max:{version:true}});
    const version=(latest._max.version||0)+1;
    await tx.soFileVersion.create({data:{soOrderId:so.id,storageKey:saved.key,originalName:file.name,sha256:saved.sha256,version,parseStatus,rawExtraction:parsed as object|undefined}});
    if(!soOrderId||so.parseStatus!=="VERIFIED")await tx.soOrder.update({where:{id:so.id},data:{parseStatus:"PENDING"}});
    await tx.operationLog.create({data:{action:soOrderId?"SO_FILE_VERSION_UPLOADED":"SO_FILE_UPLOADED",entityType:"SoOrder",entityId:so.id,...actorFields(actor),after:{file:saved.key,version,parseStatus}}});
    return so;
  });
  return NextResponse.json({id:order.id,parseStatus:order.parseStatus,parsed},{status:201});
}
