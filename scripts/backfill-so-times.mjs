import {readFile} from "node:fs/promises";
import {join} from "node:path";
import {PDFParse} from "pdf-parse";
import {PrismaClient} from "@prisma/client";
import {ParserRegistry} from "../src/lib/so-parser.ts";
import {resolveSiCutoff} from "../src/lib/si-cutoff.ts";
const db=new PrismaClient();
try{const files=await db.soFileVersion.findMany({where:{parseStatus:"PARSED"},include:{soOrder:true}});for(const f of files){if(!f.soOrder||f.soOrder.parseStatus==="VERIFIED")continue;const pdf=new PDFParse({data:await readFile(join(process.env.FILE_STORAGE_ROOT||"./uploads",f.storageKey))});const text=await pdf.getText();await pdf.destroy();const p=new ParserRegistry().parse({fileName:f.originalName,text:text.text});const siCutoff=resolveSiCutoff({originalSiText:p.siCutoffText,latestDeadlineText:p.cutoffText,otherCutoffTexts:[p.portCutoffText,p.vgmCutoffText]});await db.soOrder.update({where:{id:f.soOrderId},data:{openingText:p.openingText||null,vgmCutoffText:p.vgmCutoffText||null,portCutoffText:p.portCutoffText||null,siCutoffText:siCutoff.effectiveText||null,siCutoffSource:siCutoff.source,siCutoffOriginalText:siCutoff.originalText||null,siCutoffEstimatedFromText:siCutoff.estimatedFromText||null}});console.log(`BACKFILLED ${f.originalName}`)}}finally{await db.$disconnect()}
