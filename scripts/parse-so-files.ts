import "dotenv/config";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PDFParse } from "pdf-parse";
import { ParserRegistry } from "../src/lib/so-parser";
import { formatOperationalTimeText } from "../src/lib/time";
import { resolveSiCutoff } from "../src/lib/si-cutoff";
import { extractSoWithDeepSeek, hasContainerEvidence, mergeAiSoFields, needsAiSoExtraction, verifiedAiSiRule } from "../src/lib/deepseek-so-extractor";

const execFile = promisify(execFileCallback);

const db = new PrismaClient();
const fields = ["soNumber", "carrier", "customerReference", "vesselName", "voyage", "loadPort", "dischargePort", "etdText", "etaText", "etbText", "cutoffText", "openingText", "vgmCutoffText", "portCutoffText", "emptyPickupLocation", "fullReturnLocation", "transportMode", "siCutoffText", "siCutoffSource", "siCutoffOriginalText", "siCutoffEstimatedFromText"] as const;
type Field = (typeof fields)[number];

async function pdfPageImages(path: string) {
  const directory = await mkdtemp(join(tmpdir(), "so-ai-"));
  try {
    const prefix = join(directory, "page");
    await execFile(process.env.PDFTOPPM_BIN || "pdftoppm", ["-f", "1", "-l", "6", "-r", "180", "-png", path, prefix], { timeout: 25_000 });
    const images = await Promise.all([1, 2, 3, 4, 5, 6].map(async page => {
      try { return { page, mime: "image/png", base64: (await readFile(`${prefix}-${page}.png`)).toString("base64") }; } catch { return undefined; }
    }));
    return images.filter((image): image is { mime: string; base64: string } => Boolean(image));
  } catch { return []; } finally { await rm(directory, { recursive: true, force: true }); }
}

async function parseFile(file: { storageKey: string; originalName: string }) {
  const path = join(process.env.FILE_STORAGE_ROOT || "./uploads", file.storageKey);
  const pdf = new PDFParse({ data: await readFile(path) });
  const result = await pdf.getText();
  await pdf.destroy();
  const parsed = new ParserRegistry().parse({ fileName: file.originalName, text: result.text });
  const text = result.text;
  const useAi = Boolean(process.env.DEEPSEEK_API_KEY) && needsAiSoExtraction(parsed, text);
  const runAi = (images: Awaited<ReturnType<typeof pdfPageImages>>, thinking = false) =>
    extractSoWithDeepSeek({ text, images, thinking, timeoutMs: thinking ? 35_000 : 20_000 })
      .catch(error => ({ error: error instanceof Error ? error.message : "AI 识别失败" }));
  let ai = useAi ? await runAi([]) : undefined;
  let aiResult = ai && !("error" in ai) ? ai : undefined;
  let merged = mergeAiSoFields(parsed, aiResult, text);

  if (useAi && (!text.trim() || parsed.parseReview?.missingCoreFields.some(field =>
    field === "containers" ? !merged.containers.length : !merged[field]))) {
    const images = await pdfPageImages(path);
    if (images.length) {
      const visual = await runAi(images);
      if (visual && !("error" in visual)) {
        ai = aiResult = visual;
        merged = mergeAiSoFields(merged, visual, text);
      }
    }
  }

  let aiRule = aiResult && verifiedAiSiRule(aiResult, merged, text);
  const hasRelativeSi = /(?:補料|补料|shipping instruction|\bSI\b)[^\n]{0,80}(?:截[关關]前|before (?:the )?closing)|截[关關]前[^\n]{0,80}(?:補料|补料)/i.test(text);
  if (useAi && aiResult && !merged.siCutoffText && (aiRule === "NEEDS_REVIEW" || (!aiRule && !merged.siCutoffRule && hasRelativeSi))) {
    const reasoning = await runAi([], true);
    if (reasoning && !("error" in reasoning) && verifiedAiSiRule(reasoning, merged, text) === "PREVIOUS_DAY_NOON") {
      aiResult = { ...aiResult!, siRule: reasoning.siRule, siRuleInvalid: false };
      ai = aiResult;
      aiRule = "PREVIOUS_DAY_NOON";
    }
  }
  const useAiRule = !merged.siCutoffText && aiRule === "PREVIOUS_DAY_NOON";
  const resolvedSi = resolveSiCutoff({
    originalSiText: useAiRule ? undefined : merged.siCutoffText,
    rule: useAiRule ? aiRule : merged.siCutoffRule,
    latestDeadlineText: aiRule === "NEEDS_REVIEW" && !merged.siCutoffText && !merged.siCutoffRule ? undefined : merged.cutoffText,
    otherCutoffTexts: [merged.portCutoffText, merged.vgmCutoffText],
  });
  const shippingLineSi = useAiRule && resolvedSi.effectiveText
    ? { ...resolvedSi, source: "AI_RULE" as const }
    : resolvedSi;
  const values = { ...merged, siCutoffText: shippingLineSi.effectiveText ?? null, siCutoffSource: shippingLineSi.source, siCutoffOriginalText: shippingLineSi.originalText ?? null, siCutoffEstimatedFromText: shippingLineSi.estimatedFromText ?? null };
  const requiredRouting = ["dischargePort", "etdText", "etaText"] as const;
  const missingCoreFields = [...new Set([...parsed.parseReview!.missingCoreFields, ...requiredRouting])]
    .filter(field => field === "containers" ? !merged.containers.length : !merged[field]);
  const aiConflicts = fields.filter(field => {
    const previous = parsed[field as keyof typeof parsed];
    const current = merged[field as keyof typeof merged];
    if (typeof previous !== "string" || typeof current !== "string") return false;
    return field.endsWith("Text")
      ? formatOperationalTimeText(previous) !== formatOperationalTimeText(current)
      : previous.trim().toUpperCase() !== current.trim().toUpperCase();
  });
  const conflictingFields = [...new Set([...parsed.parseReview!.conflictingFields, ...aiConflicts, ...(aiResult?.containers.length && !hasContainerEvidence(text, aiResult.containers) ? ["containers"] : []), ...((aiRule === "NEEDS_REVIEW" || (useAiRule && shippingLineSi.source === "NEEDS_REVIEW")) ? ["siCutoffText"] : [])])];
  const review = { missingCoreFields, conflictingFields, needsReview: Boolean(missingCoreFields.length || conflictingFields.length) };
  return { parsed: { ...merged, parseReview: review }, siCutoff: { shippingLine: shippingLineSi }, values, extraction: { ...merged, parseReview: review, siCutoff: { shippingLine: shippingLineSi }, ai: ai && "error" in ai ? ai : ai ? { model: ai.model, evidence: ai.evidence, confidence: ai.confidence, values: ai.values, containers: ai.containers, siRule: ai.siRule, siRuleStatus: aiRule } : { skipped: process.env.DEEPSEEK_API_KEY ? "已核验规则字段齐全" : "DEEPSEEK_API_KEY 未配置" }, raw: { ...merged.raw, extractedText: result.text } } };
}

async function main() {
  const isReparse = process.env.REPARSE_PARSED === "1";
  const leaseTimeoutMs = Number(process.env.PARSE_LEASE_TIMEOUT_MS || 15 * 60_000);
  const staleBefore = new Date(Date.now() - leaseTimeoutMs);
  const eligible = isReparse
    ? { parseStatus: "PARSED" }
    : process.env.RETRY_FAILED === "1"
      ? { parseStatus: "FAILED" }
      : { OR: [{ parseStatus: "PENDING" }, { parseStatus: "FAILED" }, { parseStatus: "PROCESSING", processingStartedAt: { lt: staleBefore } }] };
  const requestedIds = process.env.SO_FILE_VERSION_IDS?.split(",").filter(Boolean);
  const files = await db.soFileVersion.findMany({ where: { ...eligible, ...(requestedIds?.length ? { id: { in: requestedIds } } : process.env.SO_FILE_VERSION_ID ? { id: process.env.SO_FILE_VERSION_ID } : {}) }, include: { soOrder: true } });
  let processedCount = 0; let failedCount = 0;
  for (const file of files) {
    let processingToken: string | undefined;
    try {
      processingToken = randomUUID();
      const claimable = file.parseStatus === "PROCESSING" ? { processingStartedAt: { lt: staleBefore } } : { parseStatus: file.parseStatus };
      const claimed = await db.soFileVersion.updateMany({ where: { id: file.id, ...claimable }, data: { parseStatus: "PROCESSING", processingStartedAt: new Date(), processingToken } });
      if (claimed.count !== 1) continue;
      if (file.parseStatus === "PROCESSING") await db.operationLog.create({ data: { action: "SO_PARSE_LEASE_RECOVERED", entityType: "SoFileVersion", entityId: file.id, after: { leaseTimeoutMs } } });
      const { parsed, siCutoff, values, extraction } = await parseFile(file);
      if (process.env.PARSE_DELAY_MS) await new Promise(resolve => setTimeout(resolve, Number(process.env.PARSE_DELAY_MS)));
      await db.$transaction(async tx => {
        const orderId = file.soOrderId || (await tx.soOrder.create({ data: { soNumber: "待解析", carrier: "待解析", parseStatus: "PENDING" } })).id;
        if (!file.soOrderId) await tx.soFileVersion.update({ where: { id: file.id }, data: { soOrderId: orderId } });
        await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${orderId} FOR UPDATE`;
        const currentOrder = await tx.soOrder.findUniqueOrThrow({ where: { id: orderId }, include: { containers: { where: { active: true } }, cargoItems: true } });
        // A normal parse preserves manually entered values. An explicit
        // reparse is different: its purpose is to make the order match the
        // newest source-document extraction, including clearing stale values
        // that the source no longer provides.
        const reparseValues = Object.fromEntries(fields.map(key => [key, values[key] ?? null]));
        const effectiveValues = isReparse
          ? reparseValues
          : values;
        const changes: Record<string, unknown> = Object.fromEntries(fields.filter(key => effectiveValues[key] !== undefined && effectiveValues[key] !== currentOrder[key]).map(key => [key, { from: currentOrder[key], to: effectiveValues[key] }]));
        const oldTypes = currentOrder.containers.reduce<Record<string, number>>((all, container) => ({ ...all, [container.containerType]: (all[container.containerType] || 0) + 1 }), {});
        const newTypes = parsed.containers.reduce<Record<string, number>>((all, container) => ({ ...all, [container.containerType]: (all[container.containerType] || 0) + container.quantity }), {});
        if (JSON.stringify(oldTypes) !== JSON.stringify(newTypes)) changes.containers = { from: oldTypes, to: newTypes };
        const completed = await tx.soFileVersion.updateMany({ where: { id: file.id, parseStatus: "PROCESSING", processingToken }, data: { parseStatus: "PARSED", processingStartedAt: null, processingToken: null, rawExtraction: extraction as object } });
        if (completed.count !== 1) throw new Error("解析任务租约已失效");
        if (currentOrder.parseStatus === "VERIFIED" && !isReparse) {
          if (Object.keys(changes).length) await tx.soVersionChange.create({ data: { soOrderId: orderId, soFileVersionId: file.id, changes } });
        } else {
          const data = isReparse
            ? effectiveValues
            : Object.fromEntries(fields.filter(key => effectiveValues[key] !== undefined && effectiveValues[key] !== null && effectiveValues[key] !== "").map(key => [key, effectiveValues[key]]));
          // ETB itself is not printed in every SO. When it was entered
          // manually, clear it so the card falls back to the newly parsed
          // cutoff-based estimate instead of retaining an old manual time.
          const resetManualEtb = isReparse && currentOrder.etbSource === "MANUAL"
            ? { etbSource: null, etbObservedAt: null, etbNeedsReview: false }
            : {};
          await tx.soOrder.update({ where: { id: orderId }, data: { ...data, ...resetManualEtb, parseStatus: "PARSED" } });
          // Cargo data is only synchronized when a PDF contains an explicit
          // cargo label.  An absent/ambiguous label never erases manually
          // maintained cargo details.
          if (parsed.cargoItems?.length) {
            await tx.cargoItem.deleteMany({ where: { soOrderId: orderId } });
            await tx.cargoItem.createMany({ data: parsed.cargoItems.map((item, sortOrder) => ({ soOrderId: orderId, sortOrder, ...item })) });
          }
        }
        await tx.operationLog.create({ data: { action: "SO_PARSED", entityType: "SoOrder", entityId: orderId, after: { fileVersion: file.version, changes, siCutoff } } });
      });
      processedCount += 1;
    } catch (error) {
      failedCount += 1;
      if (processingToken) await db.soFileVersion.updateMany({ where: { id: file.id, processingToken }, data: { parseStatus: "FAILED", processingStartedAt: null, processingToken: null } });
      console.error(`failed ${file.originalName}`, error);
    }
  }
  console.log(`PARSE_SUMMARY=${JSON.stringify({ processedCount, failedCount })}`);
}

main().finally(() => db.$disconnect());
