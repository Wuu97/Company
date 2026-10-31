import "dotenv/config";
import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { PDFParse } from "pdf-parse";
import { extractSoWithDeepSeek } from "../src/lib/deepseek-so-extractor";
import { ParserRegistry, type ParsedSO } from "../src/lib/so-parser";

const execFile = promisify(execFileCallback);
const documents = process.argv.slice(2);
if (!documents.length) throw new Error("请传入至少一份 SO PDF");
const fields = ["soNumber", "carrier", "vesselName", "voyage", "loadPort", "dischargePort", "etdText", "etaText", "etbText", "openingText", "siCutoffText", "portCutoffText", "emptyPickupLocation", "fullReturnLocation"] as const;

async function images(pdf: string) {
  const directory = await mkdtemp(join(tmpdir(), "so-ai-eval-"));
  try {
    const prefix = join(directory, "page");
    await execFile(process.env.PDFTOPPM_BIN || "pdftoppm", ["-f", "1", "-l", "6", "-r", "180", "-png", pdf, prefix], { timeout: 30_000 });
    const rows = await Promise.all([1, 2, 3, 4, 5, 6].map(async page => { try { return { page, mime: "image/png", base64: (await readFile(`${prefix}-${page}.png`)).toString("base64") }; } catch { return undefined; } }));
    return rows.filter((row): row is { mime: string; base64: string } => Boolean(row));
  } finally { await rm(directory, { recursive: true, force: true }); }
}

async function evaluate(pdfPath: string) {
  const pdf = new PDFParse({ data: await readFile(pdfPath) });
  const text = (await pdf.getText()).text;
  await pdf.destroy();
  const rule = new ParserRegistry().parse({ fileName: pdfPath.split("/").pop() || pdfPath, text });
  const ai = await extractSoWithDeepSeek({ text, images: await images(pdfPath) });
  if (!ai) throw new Error("未配置 DEEPSEEK_API_KEY");
  const ruleValues = Object.fromEntries(fields.map(field => [field, rule[field] || null]));
  const aiValues = Object.fromEntries(fields.map(field => [field, ai.values[field] || null]));
  const improved = fields.filter(field => !rule[field] && ai.values[field]);
  const conflicts = fields.filter(field => rule[field] && ai.values[field] && rule[field] !== ai.values[field]);
  return { file: pdfPath.split("/").pop(), model: ai.model, rule: { fields: ruleValues, containers: rule.containers, populated: fields.filter(field => Boolean(rule[field])).length }, ai: { fields: aiValues, containers: ai.containers, populated: fields.filter(field => Boolean(ai.values[field])).length, evidence: ai.evidence, confidence: ai.confidence }, improvement: { fieldsFilledOnlyByAi: improved, disagreements: conflicts, ruleCompleteness: `${fields.filter(field => Boolean(rule[field])).length}/${fields.length}`, aiCompleteness: `${fields.filter(field => Boolean(ai.values[field])).length}/${fields.length}` } };
}

async function main() {
  const rows = await Promise.all(documents.map(evaluate));
  const output = JSON.stringify(rows, null, 2);
  if (process.env.AI_EVAL_OUTPUT) await writeFile(process.env.AI_EVAL_OUTPUT, output);
  console.log(output);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
