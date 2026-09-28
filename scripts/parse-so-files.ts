import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFParse } from "pdf-parse";
import { PrismaClient } from "@prisma/client";
import { ParserRegistry } from "../src/lib/so-parser";
const db=new PrismaClient();
async function main(){const root=process.env.FILE_STORAGE_ROOT||"./uploads";const files=await db.soFileVersion.findMany({where:{parseStatus:"PENDING"},include:{soOrder:true}});for(const file of files){try{const pdf=new PDFParse({data:await readFile(join(root,file.storageKey))});const result=await pdf.getText();await pdf.destroy();const parsed=new ParserRegistry().parse({fileName:file.originalName,text:result.text});await db.$transaction([db.soFileVersion.update({where:{id:file.id},data:{parseStatus:"PARSED",rawExtraction:parsed as object}}),db.soOrder.update({where:{id:file.soOrderId!},data:{soNumber:parsed.soNumber||file.soOrder!.soNumber,carrier:parsed.carrier||file.soOrder!.carrier,parseStatus:"PARSED"}}),db.operationLog.create({data:{action:"SO_PARSED",entityType:"SoOrder",entityId:file.soOrderId!,after:parsed as object}})]);console.log(`parsed ${file.originalName}`)}catch(error){await db.soFileVersion.update({where:{id:file.id},data:{parseStatus:"FAILED"}});console.error(`failed ${file.originalName}`,error)}}}main().finally(()=>db.$disconnect());
