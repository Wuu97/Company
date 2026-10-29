import { z } from "zod";

const fields = ["soNumber", "carrier", "customerReference", "vesselName", "voyage", "loadPort", "dischargePort", "etdText", "etaText", "openingText", "siCutoffText", "vgmCutoffText", "portCutoffText", "emptyPickupLocation", "fullReturnLocation", "transportMode", "etbText"] as const;
export type AiSoField = (typeof fields)[number];
export type AiSoExtraction = { values: Partial<Record<AiSoField, string>>; evidence: Partial<Record<AiSoField, string>>; confidence: Partial<Record<AiSoField, number>>; containers: Array<{ containerType: string; quantity: number }>; model: string };

const schema = z.object({
  fields: z.record(z.string(), z.object({ value: z.string().nullable().optional(), evidence: z.string().nullable().optional(), confidence: z.number().min(0).max(1).optional() })).default({}),
  containers: z.array(z.object({
    containerType: z.union([z.string(), z.object({ value: z.string() })]).transform(value => typeof value === "string" ? value : value.value),
    quantity: z.union([z.number(), z.object({ value: z.union([z.number(), z.string()]) })]).transform(value => Number(typeof value === "number" ? value : value.value)).pipe(z.number().int().positive()),
  })).default([]),
});

const instruction = `You extract shipping-order data. Return JSON only. Never invent values. Dates must preserve the document's stated local date/time. Return exactly {"fields":{"soNumber":{"value":"...","evidence":"...","confidence":0.95}},"containers":[{"containerType":"40HC","quantity":1}]}. Omit unknown fields. Every field value must be a string. Every populated field needs its exact source snippet and confidence 0..1. Valid fields: ${fields.join(", ")}. ETB is only a printed ETB, never calculate it. openingText is cargo receiving/opening date, never calculate it.`;

export async function extractSoWithDeepSeek(input: { text: string; images: Array<{ mime: string; base64: string }> }): Promise<AiSoExtraction | undefined> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return undefined;
  // The legacy chat model cannot read page images; keep visual SO extraction
  // on Flash even if an old environment value remains configured.
  const configuredModel = process.env.DEEPSEEK_MODEL || "deepseek-flash";
  const model = configuredModel === "deepseek-chat" ? "deepseek-flash" : configuredModel;
  const content: Array<Record<string, unknown>> = [{ type: "text", text: `${instruction}\n\nLocal PDF text (may contain layout errors):\n${input.text.slice(0, 60_000)}` }];
  for (const image of input.images.slice(0, 3)) content.push({ type: "image_url", image_url: { url: `data:${image.mime};base64,${image.base64}`, detail: "high" } });
  const response = await fetch("https://api.deepseek.com/chat/completions", { signal: AbortSignal.timeout(60_000), method: "POST", headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" }, body: JSON.stringify({ model, temperature: 0, max_tokens: 2_000, thinking: { type: "disabled" }, response_format: { type: "json_object" }, messages: [{ role: "user", content }] }) });
  if (!response.ok) throw new Error(`DeepSeek 识别失败（HTTP ${response.status}）`);
  const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const raw = JSON.parse(body.choices?.[0]?.message?.content || "{}") as Record<string, unknown>;
  // Models occasionally return the requested fields at the JSON top level.
  // Normalize both formats before validation instead of discarding a valid answer.
  const fieldInput = (raw.fields && typeof raw.fields === "object" ? raw.fields : Object.fromEntries(fields.map(field => [field, raw[field]]))) as Record<string, unknown>;
  const normalizedFields = Object.fromEntries(Object.entries(fieldInput).filter(([, value]) => value != null).map(([key, value]) => [key, typeof value === "string" ? { value } : value]));
  const rawContainers = raw.containers;
  const normalizedContainers = Array.isArray(rawContainers) ? rawContainers : rawContainers && typeof rawContainers === "object" && Array.isArray((rawContainers as { value?: unknown }).value) ? (rawContainers as { value: unknown[] }).value : [];
  const parsed = schema.parse({ ...raw, fields: normalizedFields, containers: normalizedContainers });
  const values: Partial<Record<AiSoField, string>> = {}; const evidence: Partial<Record<AiSoField, string>> = {}; const confidence: Partial<Record<AiSoField, number>> = {};
  for (const field of fields) { const value = parsed.fields[field]?.value?.trim(); if (value) { values[field] = value; if (parsed.fields[field]?.evidence) evidence[field] = parsed.fields[field].evidence!; if (parsed.fields[field]?.confidence !== undefined) confidence[field] = parsed.fields[field].confidence!; } }
  return { values, evidence, confidence, containers: parsed.containers, model };
}
