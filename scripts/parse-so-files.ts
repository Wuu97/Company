import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PDFParse } from "pdf-parse";
import { ParserRegistry } from "../src/lib/so-parser";
import { resolveSiCutoff } from "../src/lib/si-cutoff";

const db = new PrismaClient();
const fields = ["soNumber", "carrier", "customerReference", "vesselName", "voyage", "loadPort", "dischargePort", "etdText", "etaText", "cutoffText", "openingText", "vgmCutoffText", "portCutoffText", "emptyPickupLocation", "fullReturnLocation", "transportMode", "siCutoffText", "siCutoffSource", "siCutoffOriginalText", "siCutoffEstimatedFromText"] as const;
type Field = (typeof fields)[number];

async function parseFile(file: { storageKey: string; originalName: string }) {
  const pdf = new PDFParse({ data: await readFile(join(process.env.FILE_STORAGE_ROOT || "./uploads", file.storageKey)) });
  const result = await pdf.getText();
  await pdf.destroy();
  const parsed = new ParserRegistry().parse({ fileName: file.originalName, text: result.text });
  const siCutoff = resolveSiCutoff({ originalSiText: parsed.siCutoffText, latestDeadlineText: parsed.cutoffText, otherCutoffTexts: [parsed.portCutoffText, parsed.vgmCutoffText] });
  const values = { ...parsed, siCutoffText: siCutoff.effectiveText ?? null, siCutoffSource: siCutoff.source, siCutoffOriginalText: siCutoff.originalText ?? null, siCutoffEstimatedFromText: siCutoff.estimatedFromText ?? null };
  return { parsed, siCutoff, values, extraction: { ...parsed, siCutoff, raw: { ...parsed.raw, extractedText: result.text } } };
}

async function main() {
  const files = await db.soFileVersion.findMany({ where: { parseStatus: process.env.RETRY_FAILED === "1" ? "FAILED" : "PENDING", ...(process.env.SO_FILE_VERSION_ID ? { id: process.env.SO_FILE_VERSION_ID } : {}) }, include: { soOrder: { include: { containers: true } } } });
  let processedCount = 0; let failedCount = 0;
  for (const file of files) {
    try {
      const claimed = await db.soFileVersion.updateMany({ where: { id: file.id, parseStatus: file.parseStatus }, data: { parseStatus: "PROCESSING" } });
      if (claimed.count !== 1) continue;
      const order = file.soOrder;
      if (!order) throw new Error("文件未关联 SO");
      const { parsed, siCutoff, values, extraction } = await parseFile(file);
      const changes: Record<string, unknown> = Object.fromEntries(fields.filter(key => values[key] !== undefined && values[key] !== order[key]).map(key => [key, { from: order[key], to: values[key] }]));
      const oldTypes = order.containers.filter(container => container.active).reduce<Record<string, number>>((all, container) => ({ ...all, [container.containerType]: (all[container.containerType] || 0) + 1 }), {});
      const newTypes = parsed.containers.reduce<Record<string, number>>((all, container) => ({ ...all, [container.containerType]: (all[container.containerType] || 0) + container.quantity }), {});
      if (JSON.stringify(oldTypes) !== JSON.stringify(newTypes)) changes.containers = { from: oldTypes, to: newTypes };
      await db.$transaction(async tx => {
        await tx.soFileVersion.update({ where: { id: file.id }, data: { parseStatus: "PARSED", rawExtraction: extraction as object } });
        if (order.parseStatus === "VERIFIED") {
          if (Object.keys(changes).length) await tx.soVersionChange.create({ data: { soOrderId: order.id, soFileVersionId: file.id, changes } });
        } else {
          const data = Object.fromEntries(fields.filter(key => values[key] !== undefined && values[key] !== null && values[key] !== "").map(key => [key, values[key]]));
          await tx.soOrder.update({ where: { id: order.id }, data: { ...data, parseStatus: "PARSED" } });
        }
        await tx.operationLog.create({ data: { action: "SO_PARSED", entityType: "SoOrder", entityId: order.id, after: { fileVersion: file.version, changes, siCutoff } } });
      });
      processedCount += 1;
    } catch (error) {
      failedCount += 1;
      await db.soFileVersion.update({ where: { id: file.id }, data: { parseStatus: "FAILED" } });
      console.error(`failed ${file.originalName}`, error);
    }
  }
  console.log(`PARSE_SUMMARY=${JSON.stringify({ processedCount, failedCount })}`);
}

main().finally(() => db.$disconnect());
