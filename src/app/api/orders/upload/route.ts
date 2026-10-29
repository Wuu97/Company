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
  const bytes=Buffer.from(await file.arrayBuffer());
  // Browser-provided MIME values are not reliable for files selected from disk.
  // Check the PDF header instead, so valid PDFs with an empty or generic MIME type
  // are not rejected solely because of the browser's metadata.
  if(!bytes.subarray(0,1024).includes(Buffer.from("%PDF-")))
    return NextResponse.json({error:"所选文件不是有效的 PDF 文件，请重新选择。"},{status:400});
  const storage=new LocalFileStorage();
  const saved=await storage.put({bytes,originalName:file.name});
  const existing=await prisma.soFileVersion.findUnique({where:{sha256:saved.sha256},include:{soOrder:true}});
  // A staged file can disappear from the current browser batch after a refresh,
  // but it is still eligible for recognition. Re-selecting it should restore it
  // to the current batch instead of making it impossible to identify.
  if(existing && !existing.soOrderId && ["PENDING", "FAILED"].includes(existing.parseStatus))
    return NextResponse.json({id:existing.id,parseStatus:existing.parseStatus,reused:true});
  if(existing) return NextResponse.json({error:"该原始文件已上传",soOrderId:existing.soOrderId},{status:409});
  // Uploads are staged until the user explicitly starts recognition. This keeps
  // unfinished uploads out of the SO list.
  const parseStatus:"PENDING"="PENDING";
  let stagedFile;
  try {
    stagedFile=await prisma.$transaction(async tx=>{
      if (!soOrderId) {
        const staged=await tx.soFileVersion.create({data:{storageKey:saved.key,originalName:file.name,sha256:saved.sha256,version:1,parseStatus}});
        await tx.operationLog.create({data:{action:"SO_FILE_UPLOADED",entityType:"SoFileVersion",entityId:staged.id,...actorFields(actor),after:{file:saved.key,parseStatus,staged:true}}});
        return staged;
      }
      const so=await tx.soOrder.findUnique({where:{id:soOrderId}});
      if(!so)throw new Error("SO 不存在");
      await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${so.id} FOR UPDATE`;
      const latest=await tx.soFileVersion.aggregate({where:{soOrderId:so.id},_max:{version:true}});
      const version=(latest._max.version||0)+1;
      const versionFile=await tx.soFileVersion.create({data:{soOrderId:so.id,storageKey:saved.key,originalName:file.name,sha256:saved.sha256,version,parseStatus}});
      if(so.parseStatus!=="VERIFIED")await tx.soOrder.update({where:{id:so.id},data:{parseStatus:"PENDING"}});
      await tx.operationLog.create({data:{action:"SO_FILE_VERSION_UPLOADED",entityType:"SoOrder",entityId:so.id,...actorFields(actor),after:{file:saved.key,version,parseStatus}}});
      return versionFile;
    });
  } catch (error) {
    if (saved.created) await storage.remove(saved.key).catch(() => undefined);
    throw error;
  }
  return NextResponse.json({id:stagedFile.id,parseStatus:stagedFile.parseStatus},{status:201});
}
