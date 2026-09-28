import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFParse } from "pdf-parse";
import { PrismaClient } from "@prisma/client";
import { ParserRegistry } from "../src/lib/so-parser";

const db=new PrismaClient();

async function main(){
  const root=process.env.FILE_STORAGE_ROOT||"./uploads";
  const files=await db.soFileVersion.findMany({where:{parseStatus:"PENDING"},include:{soOrder:true}});
  let processedCount=0;
  let failedCount=0;
  for(const file of files){
    try{
      const pdf=new PDFParse({data:await readFile(join(root,file.storageKey))});
      const result=await pdf.getText();
      await pdf.destroy();
      const parsed=new ParserRegistry().parse({fileName:file.originalName,text:result.text});
      const extraction={...parsed,raw:{...parsed.raw,extractedText:result.text}};
      await db.$transaction([
        db.soFileVersion.update({where:{id:file.id},data:{parseStatus:"PARSED",rawExtraction:extraction as object}}),
        db.soOrder.update({where:{id:file.soOrderId!},data:{soNumber:parsed.soNumber||file.soOrder!.soNumber,carrier:parsed.carrier||file.soOrder!.carrier,customerReference:parsed.customerReference||file.soOrder!.customerReference,vesselName:parsed.vesselName||file.soOrder!.vesselName,voyage:parsed.voyage||file.soOrder!.voyage,loadPort:parsed.loadPort||file.soOrder!.loadPort,dischargePort:parsed.dischargePort||file.soOrder!.dischargePort,etdText:parsed.etdText||file.soOrder!.etdText,etaText:parsed.etaText||file.soOrder!.etaText,cutoffText:parsed.cutoffText||file.soOrder!.cutoffText,emptyPickupLocation:parsed.emptyPickupLocation||file.soOrder!.emptyPickupLocation,fullReturnLocation:parsed.fullReturnLocation||file.soOrder!.fullReturnLocation,transportMode:parsed.transportMode||file.soOrder!.transportMode,siCutoffText:parsed.raw.siCutoff||file.soOrder!.siCutoffText,parseStatus:"PARSED"}}),
        db.operationLog.create({data:{action:"SO_PARSED",entityType:"SoOrder",entityId:file.soOrderId!,after:extraction as object}})
      ]);
      processedCount++;
      console.log(`parsed ${file.originalName}`);
    }catch(error){
      failedCount++;
      await db.$transaction([
        db.soFileVersion.update({where:{id:file.id},data:{parseStatus:"FAILED"}}),
        ...(file.soOrderId?[db.soOrder.update({where:{id:file.soOrderId},data:{parseStatus:"FAILED"}})]:[])
      ]);
      console.error(`failed ${file.originalName}`,error);
    }
  }
  console.log(`PARSE_SUMMARY=${JSON.stringify({processedCount,failedCount})}`);
}
main().finally(()=>db.$disconnect());
