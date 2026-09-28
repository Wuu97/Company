import {readFile} from "node:fs/promises";
import {PDFParse} from "pdf-parse";
import {ParserRegistry} from "../src/lib/so-parser.ts";
for (const file of process.argv.slice(2)) {
  const pdf=new PDFParse({data:await readFile(file)});
  const text=await pdf.getText(); await pdf.destroy();
  const parsed=new ParserRegistry().parse({fileName:file,text:text.text});
  console.log(JSON.stringify({file,soNumber:parsed.soNumber,carrier:parsed.carrier,vesselName:parsed.vesselName,voyage:parsed.voyage,containers:parsed.containers,etdText:parsed.etdText,etaText:parsed.etaText,cutoffText:parsed.cutoffText,siCutoffText:parsed.siCutoffText},null,2));
}
