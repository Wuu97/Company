import { z } from "zod";
import type { ParsedSO } from "./so-parser";
import { normalizeCarrierName } from "./carrier-name";
import { formatOperationalTimeText, validOperationalDateInput } from "./time";

const siRuleSchema = z.object({
  status: z.enum(["applicable", "needs_review"]),
  rule: z.literal("PREVIOUS_DAY_NOON").optional(),
  destinationEvidence: z.string().trim().min(1),
  clauseEvidence: z.string().trim().min(1),
  cutoffEvidence: z.string().trim().min(1),
  explanation: z.string().trim().min(1),
});
export type AiSiRule = z.infer<typeof siRuleSchema>;

const fields = ["soNumber", "carrier", "customerReference", "vesselName", "voyage", "loadPort", "dischargePort", "etdText", "etaText", "cutoffText", "openingText", "siCutoffText", "vgmCutoffText", "portCutoffText", "emptyPickupLocation", "fullReturnLocation", "transportMode", "etbText"] as const;
export type AiSoField = (typeof fields)[number];
export type AiSoExtraction = { values: Partial<Record<AiSoField, string>>; evidence: Partial<Record<AiSoField, string>>; confidence: Partial<Record<AiSoField, number>>; containers: Array<{ containerType: string; quantity: number }>; model: string; siRule?: AiSiRule; siRuleInvalid?: boolean };

const schema = z.object({
  fields: z.record(z.string(), z.object({ value: z.string().nullable().optional(), evidence: z.string().nullable().optional(), confidence: z.number().min(0).max(1).optional() })).default({}),
  containers: z.array(z.object({
    containerType: z.union([z.string(), z.object({ value: z.string() })]).transform(value => typeof value === "string" ? value : value.value),
    quantity: z.union([z.number(), z.object({ value: z.union([z.number(), z.string()]) })]).transform(value => Number(typeof value === "number" ? value : value.value)).pipe(z.number().int().positive()),
  })).default([]),
});

const instruction = `You extract shipping-order data. Return JSON only. The output shape is {"fields":{},"containers":[]}, with an optional top-level siRule object. Never invent values. Dates must preserve the document's stated local date/time. Omit unknown fields. Each populated entry in fields must contain a string value, a verbatim evidence snippet, and a confidence number from 0 to 1. Valid fields: ${fields.join(", ")}. ETB is only a printed ETB, never calculate it. openingText is cargo receiving/opening date, never calculate it. cutoffText is the printed general closing date, and portCutoffText is the printed CY or full-container return cutoff.

Each containers entry must contain containerType (string) and quantity (positive integer). Read both from the same booking summary or container-detail entry. Preserve the stated size and equipment type. Leave containers empty if the document does not establish both values.

For siCutoffText, extract a directly printed SI deadline only. Separately, read all SI clauses, identify this shipment's discharge destination and closing date, and check route conditions and exceptions, including weekend cutoffs. The optional siRule object contains status, rule, destinationEvidence, clauseEvidence, cutoffEvidence, and explanation. Use status "applicable" and rule "PREVIOUS_DAY_NOON" when the applicable rule requires noon on the calendar day before the closing date. Do not calculate a date. Use status "needs_review" and omit rule if clauses conflict, evidence is incomplete, or the applicable rule has a different calculation. Omit siRule if the document contains no relative SI clause. The three evidence fields must quote the relevant original text, preserving its language. Explain the route match and any exception in Chinese.

Business normalization rules: emptyPickupLocation must be a named empty-container depot. Do not use a city or country shown under RELEASE FROM as an empty pickup location. If no named depot is printed, return the loadPort as emptyPickupLocation, with evidence showing the release location and the load port. fullReturnLocation is the named RETURN INTO terminal. Preserve explicit equipment codes exactly as printed, including the HC or HQ suffix.`;

export async function extractSoWithDeepSeek(input: { text: string; images: Array<{ page: number; mime: string; base64: string }>; thinking?: boolean; timeoutMs?: number }): Promise<AiSoExtraction | undefined> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return undefined;
  // The legacy chat model cannot read page images; keep visual SO extraction
  // on Flash even if an old environment value remains configured.
  const configuredModel = process.env.DEEPSEEK_MODEL || "deepseek-flash";
  const model = configuredModel === "deepseek-chat" ? "deepseek-flash" : configuredModel;
  const content: Array<Record<string, unknown>> = [{ type: "text", text: `${instruction}\n\nAccuracy rules: examine every supplied page; ETD/ETA must be chronologically valid, and ETA must be for the stated final discharge port. For ETA, quote a continuous routing snippet containing both the destination and its ETA. Do not use document issue date as a shipping date.\n\nLocal PDF text (may contain layout errors):\n${input.text.slice(0, 60_000)}` }];
  for (const image of input.images.slice(0, 6)) { content.push({ type: "text", text: `PDF page ${image.page}:` }); content.push({ type: "image_url", image_url: { url: `data:${image.mime};base64,${image.base64}`, detail: "high" } }); }
  const response = await fetch("https://api.deepseek.com/chat/completions", { signal: AbortSignal.timeout(input.timeoutMs ?? 90_000), method: "POST", headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" }, body: JSON.stringify({ model, temperature: 0, max_tokens: 8_000, ...(input.thinking ? { thinking: { type: "enabled" }, reasoning_effort: "high" } : { thinking: { type: "disabled" } }), response_format: { type: "json_object" }, messages: [{ role: "user", content }] }) });
  if (!response.ok) throw new Error(`DeepSeek 识别失败（HTTP ${response.status}）`);
  const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const responseContent = body.choices?.[0]?.message?.content;
  if (!responseContent?.trim()) throw new Error("DeepSeek 未返回结构化内容");
  const raw = JSON.parse(responseContent) as Record<string, unknown>;
  // Models occasionally return the requested fields at the JSON top level.
  // Normalize both formats before validation instead of discarding a valid answer.
  const fieldInput = (raw.fields && typeof raw.fields === "object" ? raw.fields : Object.fromEntries(fields.map(field => [field, raw[field]]))) as Record<string, unknown>;
  const normalizedFields = Object.fromEntries(Object.entries(fieldInput).filter(([, value]) => value != null).map(([key, value]) => [key, typeof value === "string" ? { value } : value]));
  const rawContainers = raw.containers;
  const normalizedContainers = Array.isArray(rawContainers) ? rawContainers : rawContainers && typeof rawContainers === "object" && Array.isArray((rawContainers as { value?: unknown }).value) ? (rawContainers as { value: unknown[] }).value : [];
  const parsed = schema.parse({ ...raw, fields: normalizedFields, containers: normalizedContainers });
  const values: Partial<Record<AiSoField, string>> = {}; const evidence: Partial<Record<AiSoField, string>> = {}; const confidence: Partial<Record<AiSoField, number>> = {};
  for (const field of fields) { const value = parsed.fields[field]?.value?.trim(); if (value) { values[field] = value; if (parsed.fields[field]?.evidence) evidence[field] = parsed.fields[field].evidence!; if (parsed.fields[field]?.confidence !== undefined) confidence[field] = parsed.fields[field].confidence!; } }
  const siRule = siRuleSchema.safeParse(raw.siRule);
  return { values, evidence, confidence, containers: parsed.containers, model, siRule: siRule.data, siRuleInvalid: raw.siRule != null && !siRule.success };
}

const compact = (text: string) => text.replace(/\s+/g, "").toUpperCase();

export function verifiedAiSiRule(ai: AiSoExtraction, parsed: ParsedSO, text: string) {
  const candidate = ai.siRule;
  if (!candidate && !ai.siRuleInvalid) return undefined;
  if (candidate?.status !== "applicable" || !candidate.rule || !parsed.cutoffText || !parsed.dischargePort) return "NEEDS_REVIEW";
  const document = compact(text);
  const { destinationEvidence, clauseEvidence, cutoffEvidence } = candidate;
  if (
    ![destinationEvidence, clauseEvidence, cutoffEvidence].every(evidence => document.includes(compact(evidence))) ||
    ![compact(parsed.dischargePort), `PORTOFDISCHARGE:${compact(parsed.dischargePort)}`].includes(compact(destinationEvidence)) ||
    formatOperationalTimeText(cutoffEvidence) !== formatOperationalTimeText(parsed.cutoffText) ||
    !/截[关關]前(?:一|1)天的?(?:中午|12[:：]00|12[点點])/.test(compact(clauseEvidence))
  ) return "NEEDS_REVIEW";
  return candidate.rule;
}

const timeLabels = {
  openingText: /receiving date|earliest container delivery date|opening date|開倉|开仓/i,
  siCutoffText: /shipping instruction|\bSI\b|doc[ .-]*cut|補料|补料/i,
  vgmCutoffText: /VGM/i,
  portCutoffText: /FCL delivery cut|CY closing|port cut|closing date|full return/i,
  cutoffText: /closing date|general cut|截關|截关/i,
  etdText: /\bETD\b|estimated time of departure/i,
  etaText: /\bETA\b|estimated time of arrival/i,
  etbText: /\bETB\b|estimated time of berth/i,
};

export function hasContainerEvidence(text: string, items: ParsedSO["containers"]) {
  if (!items.length) return false;
  const signature = (entries: ParsedSO["containers"]) => entries
    .map(({ quantity, containerType }) => `${quantity}:${containerType.toUpperCase()}`)
    .sort().join(",");
  const summaries = text.split(/\r?\n/)
    .filter(line => /summary\s*:|cont\.\s*qty\s*\/\s*type\s*:|despatch\s+quantity\s+fcl\s+qty\s+size\s*\/\s*type\s*:/i.test(line))
    .map(line => [...line.matchAll(/\b(\d+)\s*[x×]\s*(\d{2})\s*'?\s*(GP|HC|HQ|DC|DV|RF)\b/gi)]
      .map(([, quantity, size, type]) => ({ quantity: Number(quantity), containerType: size + type })))
    .filter(entries => entries.length);
  return summaries.length > 0 && summaries.every(entries => signature(entries) === signature(items));
}

const requiredFields = ["soNumber", "carrier", "vesselName", "voyage", "loadPort", "dischargePort", "openingText", "siCutoffText", "portCutoffText", "etdText", "etaText"] as const;

function hasLabelledTime(text: string, field: keyof typeof timeLabels, value: string) {
  const date = formatOperationalTimeText(value);
  if (!validOperationalDateInput(date)) return false;
  const labels = Object.values(timeLabels);
  return text.split(/\r?\n/).some((line, index, lines) => {
    if (!timeLabels[field].test(line)) return false;
    const nextLines = lines.slice(index + 1, index + 3);
    const boundary = nextLines.findIndex(next => labels.some(label => label.test(next)));
    return formatOperationalTimeText([line, ...nextLines.slice(0, boundary < 0 ? undefined : boundary)].join(" ")) === date;
  });
}

export function needsAiSoExtraction(parsed: ParsedSO, text: string) {
  // These signatures have real SO examples. A carrier name alone is insufficient.
  const knownLayout = /HAPAG[- ]LLOYD/i.test(text) && /Our Reference:/i.test(text) && /Deadline\s+Location\s+Date \/ Time/i.test(text)
    || /RELEASE\s+ORDER/i.test(text) && /LEG\s+VESSEL\s+VESSEL\s+NAME\s+VOYAGE\s+POL\s+POD/i.test(text) && parsed.carrier === "TS LINES";
  if (!knownLayout || parsed.parseReview?.needsReview || !hasContainerEvidence(text, parsed.containers)) return true;
  return requiredFields.some(field => {
    const value = parsed[field];
    if (!value) return true;
    if (field === "carrier" && parsed.carrier === "TS LINES") return false;
    if (!(field in timeLabels)) return !compact(text).includes(compact(value));
    return !hasLabelledTime(text, field as keyof typeof timeLabels, value);
  });
}

export function mergeAiSoFields(parsed: ParsedSO, ai: AiSoExtraction | undefined, text: string): ParsedSO {
  if (!ai) return parsed;
  const merged = { ...parsed };
  const document = compact(text);
  for (const field of fields) {
    const value = ai.values[field]?.trim();
    const evidence = ai.evidence[field]?.trim();
    if (!value || !evidence || !document.includes(compact(evidence))) continue;
    const timeLabel = timeLabels[field as keyof typeof timeLabels];
    if (timeLabel) {
      const date = formatOperationalTimeText(value);
      const evidenceLines = evidence.split(/\r?\n/);
      const dateMatches = field === "etaText"
        ? evidenceLines.some((_, index) => formatOperationalTimeText(evidenceLines.slice(index).join(" ")) === date)
        : formatOperationalTimeText(evidence) === date;
      if (!validOperationalDateInput(date) || !dateMatches) continue;
      // Preserve a labelled rule value. AI may supply dates in routing tables
      // whose headers are outside the quoted row.
      if (parsed[field] && hasLabelledTime(text, field as keyof typeof timeLabels, parsed[field])) continue;
      if (!["etdText", "etaText"].includes(field) && !timeLabel.test(evidence)) continue;
      if (field === "etaText" && merged.dischargePort && !compact(evidence).includes(compact(merged.dischargePort))) continue;
    } else {
      if (parsed[field] && !parsed.fieldConflicts?.[field as keyof NonNullable<ParsedSO["fieldConflicts"]>]) continue;
      if (field !== "carrier" && !compact(evidence).includes(compact(value))) continue;
    }
    merged[field] = field === "carrier" ? normalizeCarrierName(value) : value;
  }
  if (!hasContainerEvidence(text, parsed.containers) && hasContainerEvidence(text, ai.containers)) merged.containers = ai.containers;
  return merged;
}
