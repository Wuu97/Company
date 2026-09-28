export type ContainerSummary = { containerType: string; quantity: number };

export type ParsedSO = {
  soNumber?: string; carrier?: string; customerReference?: string; vesselName?: string; voyage?: string;
  loadPort?: string; dischargePort?: string; etdText?: string; etaText?: string; cutoffText?: string;
  siCutoffText?: string; openingText?: string; vgmCutoffText?: string; portCutoffText?: string;
  emptyPickupLocation?: string; fullReturnLocation?: string; transportMode?: string;
  containers: ContainerSummary[]; raw: Record<string, string>;
};
export type ParserInput = { fileName: string; text: string };
export interface SoParser { canParse(input: ParserInput): boolean; parse(input: ParserInput): ParsedSO }

const dateSource = "\\b\\d{1,2}[-/]\\w{3,4}[-/]\\d{2,4}\\s+\\d{1,2}:\\d{2}\\b|\\b\\d{1,2}[-/]\\d{1,2}[-/]\\d{2,4}\\s+\\d{1,2}:\\d{2}\\b";
const datePattern = new RegExp(dateSource, "i");
const allDatesPattern = new RegExp(dateSource, "gi");
const first = (text: string, pattern: RegExp) => text.match(pattern)?.[1]?.trim();
const oneDate = (text: string) => text.match(datePattern)?.[0] ?? "";
const allDates = (text: string) => text.match(allDatesPattern) ?? [];
const lineValue = (text: string, label: string) => first(text, new RegExp(`${label}\\s*[:：]\\s*([^\\n]+)`, "i"));

function dateNearLabel(text: string, label: RegExp) {
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (label.test(lines[index])) return oneDate(lines[index]) || oneDate(lines[index - 1] ?? "") || oneDate(lines[index + 1] ?? "");
  }
  return "";
}

function normalizeContainerType(value: string) {
  const upper = value.toUpperCase();
  if (/20.*(?:HC|HQ|HIGH\s*CUBE)/.test(upper)) return "20HC";
  if (/40.*(?:HC|HQ|HIGH\s*CUBE)/.test(upper)) return "40HC";
  return upper.replace(/\s+|'/g, "");
}

/** Common labels are authoritative; carrier parsers only fill omitted fields. */
export class GenericSoParser implements SoParser {
  canParse() { return true; }
  parse({ text }: ParserInput): ParsedSO {
    return {
      soNumber: first(text, /(?:^|\n)\s*(?:SO\s*(?:NO\.?|NUMBER)?|BOOKING\s*(?:NO\.?|NUMBER))\s*[:#]?\s*([A-Z0-9-]+)/i),
      carrier: first(text, /(?:^|\n)\s*(?:CARRIER|船公司)\s*[:：]?\s*([^\n]+)/i),
      customerReference: first(text, /(?:^|\n)\s*(?:CUSTOMER|SHIPPER)\s*(?:REF(?:ERENCE)?\.?(?:\s*NO\.?)?)?\s*[:：]\s*([^\n]+)/i),
      vesselName: first(text, /(?:^|\n)\s*(?:VESSEL|船名)\s*[:：]\s*([^\n/]+)/i),
      voyage: first(text, /(?:^|\n)\s*(?:VOYAGE|航次|VOY\.\s*NO\.?)\s*[:：]\s*([^\n/]+)/i),
      loadPort: first(text, /(?:^|\n)\s*(?:PORT OF LOAD|LOAD PORT|装货港)\s*[:：]\s*([^\n]+)/i),
      dischargePort: first(text, /(?:^|\n)\s*(?:PORT OF DISCHARGE|DISCHARGE PORT|卸货港)\s*[:：]\s*([^\n]+)/i),
      containers: [], raw: {},
    };
  }
}

export class CmaCgmParser implements SoParser {
  canParse({ text }: ParserInput) { return /CMA CGM|Shipping Order No/i.test(text); }
  parse({ text }: ParserInput): ParsedSO {
    const vessel = text.match(/Vessel\/Voyage:\s*([^/\n]+)\s*\/\s*([^\s\n]+)/i);
    const containerType = first(text, /Container Type\s*\/\s*Size[\s\S]*?\n\s*(\d{2}[A-Z]{2})/i);
    const quantity = Number(first(text, /\bX(\d+)\b/i) ?? 1);
    const openingText = dateNearLabel(text, /Cargo Receiving Date/i);
    const vgmCutoffText = dateNearLabel(text, /VGM Cut-Off Date\/Time/i);
    const portCutoffText = dateNearLabel(text, /Port Cut-off Date\/Time/i);
    const siCutoffText = oneDate(text.split(/\r?\n/).find(line => /SI Cut-off Date\/Time/i.test(line)) ?? "");
    return { soNumber: first(text, /Shipping Order No\.:\s*([A-Z0-9-]+)/i), carrier: "CMA CGM", vesselName: vessel?.[1]?.trim(), voyage: vessel?.[2]?.trim(), openingText, vgmCutoffText, portCutoffText, siCutoffText, containers: containerType ? [{ containerType, quantity }] : [], raw: { opening: openingText, vgmCutoff: vgmCutoffText, portCutoff: portCutoffText, siCutoff: siCutoffText } };
  }
}

export class TailwindParser implements SoParser {
  canParse({ text }: ParserInput) { return /TAILWIND|Book No\./i.test(text); }
  parse({ text }: ParserInput): ParsedSO {
    const vessel = text.match(/Vessel\s*\/\s*Voyage\s*:\s*([^/\n]+)\s*\/\s*([^\s\n]+)/i);
    const containerRow = text.match(/S\.No\.\s+Quantity\s+Size[\s\S]*?\n\s*\d+\s+(\d+)\s+(\d{2}[A-Z]{2})/i);
    const containerType = containerRow?.[2] ?? first(text, /Container Summary Details[\s\S]*?\b(\d{2}[A-Z]{2})\b/i);
    const quantity = Number(containerRow?.[1] ?? first(text, /Container Summary Details[\s\S]*?Quantity\s*\n?\s*(\d+)/i) ?? 0);
    const etd = lineValue(text, "Load Port ETD") ?? "";
    const eta = lineValue(text, "Discharge Port ETA") ?? "";
    return { soNumber: first(text, /Book No\.\s*:\s*([A-Z0-9-]+)/i), carrier: "TAILWIND", vesselName: vessel?.[1]?.trim(), voyage: vessel?.[2]?.trim(), customerReference: lineValue(text, "Shipper Ref\\. No\\."), loadPort: lineValue(text, "Port of Load"), dischargePort: lineValue(text, "Port of Discharge"), etdText: oneDate(etd), etaText: allDates(eta)[1] ?? allDates(eta)[0] ?? "", cutoffText: lineValue(text, "Load Port ETA Cut off"), emptyPickupLocation: lineValue(text, "Pick Empty at"), fullReturnLocation: lineValue(text, "Deliver To"), transportMode: lineValue(text, "Transport Mode"), containers: containerType ? [{ containerType, quantity: quantity || 1 }] : [], raw: { etd, eta } };
  }
}

export class HapagLloydParser implements SoParser {
  canParse({ text }: ParserInput) { return /HAPAG[- ]LLOYD|Our Reference|DP Voyage/i.test(text); }
  parse({ text }: ParserInput): ParsedSO {
    const summary = text.match(/Summary([\s\S]*?)(?:Deadline|Routing|Additional Information|$)/i)?.[1] ?? "";
    const containers = [...summary.matchAll(/(?:^|\n|\s)(\d+)\s*(?:X|x)?\s*(20|40)\s*'?\s*(DC|DV|GP|HC|HQ|HIGH\s*CUBE)/gi)].map(match => ({ quantity: Number(match[1]), containerType: normalizeContainerType(`${match[2]}${match[3]}`) }));
    const deadline = text.match(/Deadline([\s\S]*?)(?:Summary|Routing|Additional Information|$)/i)?.[1] ?? "";
    const deadlineDates = allDates(deadline);
    return { soNumber: lineValue(text, "Our Reference"), carrier: "HAPAG-LLOYD", vesselName: lineValue(text, "DP Voyage") ?? lineValue(text, "Vessel"), voyage: lineValue(text, "Voy\\. No\\.") ?? lineValue(text, "Voyage"), siCutoffText: dateNearLabel(deadline, /Shipping Instruction|SI Deadline/i), vgmCutoffText: dateNearLabel(deadline, /VGM/i), cutoffText: deadlineDates[0] ?? "", containers, raw: { deadline } };
  }
}

function mergeParsed(base: ParsedSO, fallback: ParsedSO): ParsedSO {
  const merged = { ...base } as ParsedSO;
  for (const key of Object.keys(fallback) as Array<keyof ParsedSO>) {
    if (key === "raw" || key === "containers") continue;
    if (merged[key] === undefined || merged[key] === "") (merged as Record<string, unknown>)[key] = fallback[key];
  }
  return { ...merged, containers: base.containers.length ? base.containers : fallback.containers, raw: { ...fallback.raw, ...base.raw } };
}

export class ParserRegistry {
  constructor(private readonly generic = new GenericSoParser(), private readonly carrierParsers: SoParser[] = [new CmaCgmParser(), new TailwindParser(), new HapagLloydParser()]) {}
  parse(input: ParserInput) { return this.carrierParsers.filter(parser => parser.canParse(input)).reduce((parsed, parser) => mergeParsed(parsed, parser.parse(input)), this.generic.parse(input)); }
}
