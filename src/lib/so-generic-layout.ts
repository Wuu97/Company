import type { ContainerSummary } from "./so-parser";

export type ParsedFieldName = "soNumber" | "carrier" | "vesselName" | "voyage" | "loadPort" | "dischargePort" | "emptyPickupLocation" | "fullReturnLocation" | "etdText" | "etaText" | "containers";
export type FieldCandidate = { value: string; confidence: number; evidence: string };
export type FieldConflict = { values: string[]; confidence: number; evidence: string[] };
export type GenericLayoutResult = {
  fields: Partial<Record<Exclude<ParsedFieldName, "containers">, string>> & { containers: ContainerSummary[] };
  confidence: Partial<Record<ParsedFieldName, number>>;
  evidence: Partial<Record<ParsedFieldName, string>>;
  conflicts: Partial<Record<ParsedFieldName, FieldConflict>>;
};

const clean = (value: string) => value.replace(/\s+/g, " ").trim();
const date = /\b(?:\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2}|\d{1,2}[\/.-](?:\d{1,2}|[A-Z]{3,9})[\/.-]\d{2,4})(?:\s+\d{1,2}:\d{2})?\b/i;
const location = /(?:\b[A-Z]{5}\b(?:\s*\([^\n)]*\))?|\b[A-Z][A-Z ]{1,},\s*[A-Z]{2,}\b)/;
const loadPortLabel = /Port\s+Of\s+(?:Loading|Load)|(?:装货|起运|装运)港|\bPOL\b/i;
const dischargePortLabel = /Port\s+Of\s+Discharge|Discharge\s+Port|(?:卸货|目的|到达)港|\bPOD\b/i;
const knownHeading = /^(?:Freight & Charges|Hazardous cargo|Service Term|Remark|Kind of Seal)/i;

function candidatesForLabel(lines: string[], label: RegExp, valuePattern: RegExp): FieldCandidate[] {
  const candidates: FieldCandidate[] = [];
  lines.forEach((line, index) => {
    if (!label.test(line)) return;
    const same = line.match(valuePattern)?.[0];
    if (same) candidates.push({ value: clean(same), confidence: 0.98, evidence: line });
    for (let offset = 1; offset <= 2; offset += 1) {
      const below = lines[index + offset] ?? "";
      if (!below || knownHeading.test(below)) continue;
      const value = below.match(valuePattern)?.[0];
      if (value) candidates.push({ value: clean(value), confidence: offset === 1 ? 0.9 : 0.78, evidence: `${line} ↳ ${below}` });
    }
  });
  return candidates;
}

function pairedPortCandidates(lines: string[]) {
  const load: FieldCandidate[] = [];
  const discharge: FieldCandidate[] = [];
  lines.forEach((line, index) => {
    const hasLoad = loadPortLabel.test(line);
    const hasDischarge = dischargePortLabel.test(line);
    if (!hasLoad || !hasDischarge) return;
    const values = [...(lines[index + 1] ?? "").matchAll(new RegExp(location.source, "g"))].map(match => clean(match[0]));
    if (values.length < 2) return;
    load.push({ value: values[0], confidence: 0.96, evidence: `${line} ↳ ${lines[index + 1]}` });
    discharge.push({ value: values[1], confidence: 0.96, evidence: `${line} ↳ ${lines[index + 1]}` });
  });
  return { load, discharge };
}

/** Choose only an unambiguous strongest candidate; ties with differing values require review. */
export function selectFieldCandidate(candidates: FieldCandidate[]) {
  const unique = uniqueCandidates(candidates);
  if (!unique.length) return undefined;
  if (unique.length > 1 && unique[0].confidence === unique[1].confidence) return undefined;
  return unique[0];
}

function uniqueCandidates(candidates: FieldCandidate[]) {
  const byValue = new Map<string, FieldCandidate>();
  for (const candidate of candidates) {
    const key = candidate.value.toUpperCase();
    const previous = byValue.get(key);
    if (!previous || candidate.confidence > previous.confidence) byValue.set(key, candidate);
  }
  return [...byValue.values()].sort((left, right) => right.confidence - left.confidence);
}

/** Return tied top candidates so callers can surface an explicit manual-review task. */
export function detectFieldConflict(candidates: FieldCandidate[]): FieldConflict | undefined {
  const unique = uniqueCandidates(candidates);
  if (unique.length < 2 || unique[0].confidence !== unique[1].confidence) return undefined;
  const strongest = unique.filter(candidate => candidate.confidence === unique[0].confidence);
  return {
    values: strongest.map(candidate => candidate.value),
    confidence: strongest[0].confidence,
    evidence: strongest.map(candidate => candidate.evidence),
  };
}

function containerType(size: string, kind: string) {
  const upper = `${size}${kind}`.toUpperCase();
  if (/^(20|40|45)(HC|HQ)$/.test(upper)) return `${upper.slice(0, 2)}HC`;
  return upper;
}

export function extractGenericLayout(text: string): GenericLayoutResult {
  const lines = text.split(/\r?\n/).map(clean).filter(Boolean);
  const result: GenericLayoutResult = { fields: { containers: [] }, confidence: {}, evidence: {}, conflicts: {} };
  const add = (field: Exclude<ParsedFieldName, "containers">, candidates: FieldCandidate[]) => {
    const conflict = detectFieldConflict(candidates);
    if (conflict) result.conflicts[field] = conflict;
    const candidate = selectFieldCandidate(candidates);
    if (!candidate) return;
    result.fields[field] = candidate.value;
    result.confidence[field] = candidate.confidence;
    result.evidence[field] = candidate.evidence;
  };
  add("soNumber", candidatesForLabel(lines, /(?:(?:S\/?O)\s*(?:No\.?|Number)?|Booking\s*(?:No\.?|Number)|订舱(?:号|编号|单号))/i, /\b[A-Z]{2,}[A-Z0-9-]{4,}\b/));

  const vesselVoyage: FieldCandidate[] = [];
  lines.forEach((line, index) => {
    const vesselLabel = /(?:(?:Ocean[ \t]+)?Vessel|船名)[ \t]*\/?[ \t]*(?:Voy(?:age)?|航次)?/i;
    if (!vesselLabel.test(line)) return;
    // A bilingual label can itself contain a slash, e.g. "Ocean Vessel/Voy(船名/航次)".
    // Treat text as an inline value only when a value separator is actually present.
    const inlineValue = /[:：]/.test(line) ? line.replace(vesselLabel, "").replace(/^\s*[:：-]\s*/, "") : "";
    const value = inlineValue || lines[index + 1] || "";
    const match = value.match(/^([^/]+?)\s*\/\s*([^\s/]+)/);
    if (match) {
      vesselVoyage.push({ value: clean(match[1]), confidence: 0.94, evidence: `${line} ↳ ${value}` });
      vesselVoyage.push({ value: clean(match[2]), confidence: 0.94, evidence: `${line} ↳ ${value}` });
    }
  });
  const vessel = vesselVoyage.filter(candidate => /[A-Z]/i.test(candidate.value) && /\s/.test(candidate.value));
  const voyage = vesselVoyage.filter(candidate => /^[A-Z0-9-]{2,}$/i.test(candidate.value) && !/\s/.test(candidate.value));
  add("vesselName", vessel);
  add("voyage", voyage);
  const pairedPorts = pairedPortCandidates(lines);
  add("loadPort", [...pairedPorts.load, ...candidatesForLabel(lines, loadPortLabel, location)]);
  add("dischargePort", [...pairedPorts.discharge, ...candidatesForLabel(lines, dischargePortLabel, location)]);
  add("etdText", candidatesForLabel(lines, /\bETD\b|预计(?:开船|离港)日/i, date));
  add("etaText", candidatesForLabel(lines, /\bETA\b|预计(?:到卸货港|到港)日/i, date));

  const inlineContainers = [...text.matchAll(/\b(\d+)\s*(?:X|×)\s*(20|40|45)\s*'?\s*(HC|HQ|GP|DC|DV)\b|\b(20|40|45)\s*'?\s*(HC|HQ|GP|DC|DV)\s*(?:X|×)\s*(\d+)\b/gi)]
    .map(match => match[1] ? { quantity: Number(match[1]), containerType: containerType(match[2], match[3]) } : { quantity: Number(match[6]), containerType: containerType(match[4], match[5]) });
  // Many PDF extractors flatten a table row to "2 40HC" and omit the visual column divider.
  const tableContainers = lines.flatMap(line => [...line.matchAll(/(?:^|\s)(\d+)\s+(20|40|45)\s*'?\s*(HC|HQ|GP|DC|DV)\b/gi)]
    .map(match => ({ quantity: Number(match[1]), containerType: containerType(match[2], match[3]) })));
  const containers = inlineContainers.length ? inlineContainers : tableContainers;
  if (containers.length) {
    result.fields.containers = containers;
    result.confidence.containers = 0.95;
    result.evidence.containers = containers.map(item => `${item.quantity}×${item.containerType}`).join("；");
  }
  return result;
}
