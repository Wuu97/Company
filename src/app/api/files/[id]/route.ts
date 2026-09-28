import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const file=await prisma.soFileVersion.findUnique({where:{id:(await params).id}});if(!file)return new NextResponse("未找到文件",{status:404});try{const root=process.env.FILE_STORAGE_ROOT||"./uploads";const bytes=await readFile(join(root,file.storageKey));return new NextResponse(bytes,{headers:{"content-type":"application/pdf","content-disposition":`inline; filename="${encodeURIComponent(file.originalName)}"`}})}catch{return new NextResponse("文件不可用",{status:404})}}
