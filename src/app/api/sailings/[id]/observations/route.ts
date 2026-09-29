import { NextResponse } from "next/server";
import { z } from "zod";
import { recordEtbObservation } from "@/lib/services/etb";
import { currentUser } from "@/lib/auth";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

const schema=z.object({etbAt:z.string().datetime(),source:z.string().min(1),sourceUrl:z.string().url().optional(),note:z.string().max(1000).optional()});
const imageTypes=new Set(["image/png","image/jpeg","image/webp"]);

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const form=await request.formData();
  const input=schema.safeParse({etbAt:form.get("etbAt"),source:form.get("source"),sourceUrl:form.get("sourceUrl")||undefined,note:form.get("note")||undefined});
  if(!input.success)return NextResponse.json({error:"ETB 观测资料无效"},{status:400});
  const actor=await currentUser();if(!actor)return NextResponse.json({error:"请先登录"},{status:401});
  const evidence=form.get("evidence");
  if(evidence instanceof File&&evidence.size&&(evidence.size>5*1024*1024||!imageTypes.has(evidence.type)))return NextResponse.json({error:"截图仅支持 PNG、JPG 或 WebP，且不能超过 5MB"},{status:400});
  let storageKey:string|undefined;
  try{
    if(evidence instanceof File&&evidence.size){const extension=evidence.type==="image/png"?"png":evidence.type==="image/webp"?"webp":"jpg";storageKey=`etb/manual/${randomUUID()}.${extension}`;const path=resolve(process.env.FILE_STORAGE_ROOT||"./uploads",storageKey);await mkdir(dirname(path),{recursive:true});await writeFile(path,Buffer.from(await evidence.arrayBuffer()));}
    const observation=await recordEtbObservation({sailingId:(await params).id,...input.data,etbAt:new Date(input.data.etbAt),screenshotStorageKey:storageKey,actor});
    return NextResponse.json(observation,{status:201});
  }catch(error){if(storageKey)await unlink(resolve(process.env.FILE_STORAGE_ROOT||"./uploads",storageKey)).catch(()=>undefined);return NextResponse.json({error:error instanceof Error?error.message:"ETB 保存失败"},{status:409});}
}
