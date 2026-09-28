import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LocalFileStorage } from "@/lib/storage";

export async function POST(request:Request) {
  const form=await request.formData();
  const file=form.get("file");
  const customerId=form.get("customerId");
  const soNumber=form.get("soNumber");
  const carrier=form.get("carrier");
  if(!(file instanceof File)||typeof customerId!=="string"||typeof soNumber!=="string"||typeof carrier!=="string")
    return NextResponse.json({error:"请提供 PDF、客户、SO 编号和船公司"},{status:400});
  if(file.type!=="application/pdf") return NextResponse.json({error:"仅支持 PDF 文件"},{status:400});
  const storage=new LocalFileStorage();
  const saved=await storage.put({bytes:Buffer.from(await file.arrayBuffer()),originalName:file.name});
  const existing=await prisma.soFileVersion.findUnique({where:{sha256:saved.sha256},include:{soOrder:true}});
  if(existing) return NextResponse.json({error:"该原始文件已上传",soOrderId:existing.soOrderId},{status:409});
  // PDF extraction runs in a dedicated worker in the next iteration; upload must never lose the original file.
  const parsed=undefined;const parseStatus:"PENDING"="PENDING";
  const order=await prisma.$transaction(async tx=>{
    const so=await tx.soOrder.create({data:{customerId,soNumber,carrier,parseStatus}});
    await tx.soFileVersion.create({data:{soOrderId:so.id,storageKey:saved.key,originalName:file.name,sha256:saved.sha256,version:1,parseStatus,rawExtraction:parsed as object|undefined}});
    await tx.operationLog.create({data:{action:"SO_FILE_UPLOADED",entityType:"SoOrder",entityId:so.id,after:{soNumber,carrier,file:saved.key,parseStatus}}});
    return so;
  });
  return NextResponse.json({id:order.id,parseStatus:order.parseStatus,parsed},{status:201});
}
