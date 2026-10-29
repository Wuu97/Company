import { extractGenericLayout, type FieldConflict, type ParsedFieldName } from "./so-generic-layout";
import { normalizeCarrierName } from "./carrier-name";
export type ContainerSummary = { containerType: string; quantity: number };
export type CargoItemSummary = { description: string; packagesText?: string; weightText?: string; volumeText?: string };

export type ParsedSO = {
  soNumber?: string; carrier?: string; customerReference?: string; vesselName?: string; voyage?: string;
  loadPort?: string; dischargePort?: string; etdText?: string; etaText?: string; cutoffText?: string;
  siCutoffText?: string; openingText?: string; vgmCutoffText?: string; portCutoffText?: string;
  emptyPickupLocation?: string; fullReturnLocation?: string; transportMode?: string;
  containers: ContainerSummary[]; cargoItems?: CargoItemSummary[]; raw: Record<string, string>;
  fieldConfidence?: Partial<Record<ParsedFieldName, number>>;
  fieldEvidence?: Partial<Record<ParsedFieldName, string>>;
  fieldConflicts?: Partial<Record<ParsedFieldName, FieldConflict>>;
  parseReview?: { missingCoreFields: ParsedFieldName[]; conflictingFields: ParsedFieldName[]; needsReview: boolean };
};
export type ParserInput = { fileName: string; text: string };
export interface SoParser { canParse(input: ParserInput): boolean; parse(input: ParserInput): ParsedSO }

const dateSource = "\\b\\d{1,2}[-/]\\w{3,4}[-/]\\d{2,4}\\s+\\d{1,2}:\\d{2}\\b|\\b\\d{1,2}[-/]\\d{1,2}[-/]\\d{2,4}\\s+\\d{1,2}:\\d{2}\\b";
const datePattern = new RegExp(dateSource, "i");
const allDatesPattern = new RegExp(dateSource, "gi");
const first = (text: string, pattern: RegExp) => text.match(pattern)?.[1]?.trim();
const oneDate = (text: string) => text.match(datePattern)?.[0] ?? "";
const allDates = (text: string) => text.match(allDatesPattern) ?? [];
const compactDate = (text: string) => text.match(/\b\d{1,2}\s?[A-Z]{3,4}\s?\d{2,4}\s+\d{1,2}:\d{2}\b/i)?.[0] ?? "";
const lineValue = (text: string, label: string) => first(text, new RegExp(`${label}\\s*[:：]\\s*([^\\n]+)`, "i"));

function valueBelowLabel(text: string, label: RegExp) {
  const lines = text.split(/\r?\n/);
  const index = lines.findIndex(line => label.test(line));
  return index < 0 ? "" : (lines[index + 1] ?? "").trim();
}

function locationValue(value: string) {
  return value.match(/\b[A-Z][A-Z ]{1,},\s*[A-Z]{2,}\b/)?.[0]?.replace(/\s+/g, " ").trim() ?? "";
}

function dateNearLabel(text: string, label: RegExp) {
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (label.test(lines[index])) {
      return oneDate(lines[index])
        || oneDate(lines[index - 1] ?? "")
        || oneDate(lines[index - 2] ?? "")
        || oneDate(lines[index + 1] ?? "");
    }
  }
  return "";
}

/** PDF text extraction can place CMA CGM's value column before its label column. */
function cmaSiCutoff(text: string) {
  const sameLine = text.split(/\r?\n/).find(line => /SI Cut-off Date\/Time/i.test(line));
  const directValue = sameLine ? oneDate(sameLine) : "";
  if (directValue) return directValue;
  const labelIndex = text.lastIndexOf("SI Cut-off Date/Time");
  if (labelIndex >= 0) {
    const before = text.slice(Math.max(0, labelIndex - 500), labelIndex);
    const candidates = [...before.matchAll(new RegExp(dateSource, "gi"))];
    const etdValue = before.match(new RegExp(`(${dateSource})\\s+ETD\\s*:`, "i"))?.[1];
    for (const candidate of candidates.reverse()) {
      const value = candidate[0];
      // The adjacent ETD value is commonly emitted immediately before the SI label.
      if (value !== etdValue) return value;
    }
  }
  return dateNearLabel(text, /SI Cut-off Date\/Time/i);
}

function normalizeContainerType(value: string) {
  const upper = value.toUpperCase();
  if (/20.*(?:HC|HQ|HIGH\s*CUBE)/.test(upper)) return "20HC";
  if (/40.*(?:HC|HQ|HIGH\s*CUBE)/.test(upper)) return "40HC";
  return upper.replace(/\s+|'/g, "");
}

/** Extract a labelled multi-line depot or terminal address without treating it as a port of discharge. */
function addressBelowLabel(text: string, label: RegExp) {
  const lines = text.split(/\r?\n/).map(line => line.trim());
  const index = lines.findIndex(line => label.test(line));
  if (index < 0) return "";
  const values: string[] = [];
  const inline = lines[index].replace(label, "").replace(/^[:：\-\s]+/, "").trim();
  if (inline) values.push(inline);
  for (let offset = 1; offset <= 8; offset += 1) {
    const value = lines[index + offset]?.trim();
    if (!value) {
      if (values.length) break;
      continue;
    }
    if (/^(?:Export|Import)\s+(?:empty|terminal|cargo|delivery|pick)/i.test(value)) break;
    values.push(value);
    if (/^Tel\.?/i.test(value)) break;
  }
  return values.join(" ").replace(/\s+/g, " ").trim();
}

/** Only accept explicitly labelled cargo fields; never infer a commodity from arbitrary PDF prose. */
function labelledCargoItems(text: string): CargoItemSummary[] {
  const description = first(text, /(?:^|\n)\s*(?:Description\s+of\s+Goods|Cargo\s+Description|Commodity|Goods\s+Description|货物名称|货物描述|品名)\s*[:：]\s*([^\n]+)/i);
  if (!description || description.length < 2) return [];
  const packagesText = first(text, /(?:^|\n)\s*(?:(?:No\.?\s*of\s*)?Packages?|件数)\s*[:：]\s*([^\n]+)/i);
  const weightText = first(text, /(?:^|\n)\s*(?:(?:Gross\s*)?Weight|重量)\s*[:：]\s*([^\n]+)/i);
  const volumeText = first(text, /(?:^|\n)\s*(?:Measurement|Volume|体积)\s*[:：]\s*([^\n]+)/i);
  return [{ description, packagesText, weightText, volumeText }];
}

/** Common labels are authoritative; carrier parsers only fill omitted fields. */
export class GenericSoParser implements SoParser {
  canParse() { return true; }
  parse({ text }: ParserInput): ParsedSO {
    const layout = extractGenericLayout(text);
    const vesselBelow = text.match(/(?:Ocean\s+)?Vessel\s*\/?\s*(?:Voy(?:age)?|航次)?[^\n]*\n\s*([^/\n]+?)\s*\/\s*([^\s\n]+)/i);
    const standardContainer = text.match(/\b(20|40|45)\s*'?\s*(HC|HQ|GP|DC|DV)\s*(?:X|×)\s*(\d+)\b/i);
    const reversedContainer = text.match(/\b(\d+)\s*(?:X|×)\s*(20|40|45)\s*'?\s*(HC|HQ|GP|DC|DV)\b/i);
    const containers = standardContainer ? [{ containerType: normalizeContainerType(`${standardContainer[1]}${standardContainer[2]}`), quantity: Number(standardContainer[3]) }]
      : reversedContainer ? [{ containerType: normalizeContainerType(`${reversedContainer[2]}${reversedContainer[3]}`), quantity: Number(reversedContainer[1]) }] : [];
    const dateBelow = (label: RegExp) => {
      const lines = text.split(/\r?\n/); const index = lines.findIndex(line => label.test(line));
      // Keep inline dates for carrier-specific parsers: their layouts can put
      // ETD and ETA on a single row, whereas this generic rule is for values
      // rendered underneath a label in a PDF table.
      return index < 0 ? "" : (lines.slice(index + 1, index + 4).join(" ").match(/\b\d{4}\/\d{1,2}\/\d{1,2}\b/)?.[0] ?? "");
    };
    return {
      soNumber: first(text, /(?:^|\n)\s*(?:S\/?O\s*(?:NO\.?|NUMBER)?|BOOKING\s*(?:NO\.?|NUMBER))\s*(?:[:#]|\([^\n]*\))?\s*([A-Z0-9-]+)/i) ?? layout.fields.soNumber,
      carrier: first(text, /(?:^|\n)\s*(?:CARRIER|SHIPPING\s*LINE|船公司|承运人)\s*[:：]\s*([^\n]+)/i) ?? valueBelowLabel(text, /^\s*(?:CARRIER|SHIPPING\s*LINE|船公司|承运人)\s*(?:[:：]|$)/i),
      customerReference: first(text, /(?:^|\n)\s*(?:CUSTOMER|SHIPPER)\s*(?:REF(?:ERENCE)?\.?(?:\s*NO\.?)?)?\s*[:：]\s*([^\n]+)/i),
      vesselName: layout.fields.vesselName ?? first(text, /(?:^|\n)\s*(?:VESSEL|船名)\s*[:：]\s*([^\n/]+)/i) ?? vesselBelow?.[1]?.trim(),
      voyage: layout.fields.voyage ?? first(text, /(?:^|\n)\s*(?:VOYAGE|航次|VOY\.\s*NO\.?)\s*[:：]\s*([^\n/]+)/i) ?? vesselBelow?.[2]?.trim(),
      loadPort: layout.fields.loadPort ?? first(text, /(?:^|\n)\s*(?:PORT OF LOAD|LOAD PORT|装货港)\s*[:：]\s*([^\n]+)/i) ?? locationValue(valueBelowLabel(text, /(?:Port\s+Of\s+Loading|Port\s+Of\s+Load|装货港)/i)),
      dischargePort: layout.fields.dischargePort ?? first(text, /(?:^|\n)\s*(?:PORT OF DISCHARGE|DISCHARGE PORT|卸货港)\s*[:：]\s*([^\n]+)/i) ?? locationValue(valueBelowLabel(text, /(?:Port\s+Of\s+Discharge|Discharge\s+Port|卸货港)/i)),
      emptyPickupLocation: addressBelowLabel(text, /Export\s+empty\s+pick\s*up\s+depot\(s\)/i) || undefined,
      fullReturnLocation: addressBelowLabel(text, /Export\s+terminal\s+delivery\s+address/i) || undefined,
      etdText: layout.fields.etdText ?? dateBelow(/\bETD\b|预计开船日/i), etaText: layout.fields.etaText ?? dateBelow(/\bETA\b|预计到卸货港日/i), containers: layout.fields.containers.length ? layout.fields.containers : containers, cargoItems: labelledCargoItems(text), raw: {}, fieldConfidence: layout.confidence, fieldEvidence: layout.evidence, fieldConflicts: layout.conflicts,
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
    const siCutoffText = cmaSiCutoff(text);
    const etdText = dateNearLabel(text, /\bETD\s*:/i);
    const loadPort = lineValue(text, "Port of Loading") ?? lineValue(text, "Port of Load");
    const dischargePort = lineValue(text, "Port of Discharge");
    return { soNumber: first(text, /Shipping Order No\.:\s*([A-Z0-9-]+)/i), carrier: "CMA CGM", vesselName: vessel?.[1]?.trim(), voyage: vessel?.[2]?.trim(), loadPort, dischargePort, etdText, openingText, vgmCutoffText, portCutoffText, siCutoffText, containers: containerType ? [{ containerType, quantity }] : [], raw: { opening: openingText, etd: etdText, vgmCutoff: vgmCutoffText, portCutoff: portCutoffText, siCutoff: siCutoffText } };
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
    const pairedPorts = text.match(/Port of Load\s*:\s*Port of Discharge\s*:\s*([A-Z][A-Z ]+?)\s+([A-Z]{3,})\s*$/im);
    const portCutoffText = lineValue(text, "Load Port ETA Cut off");
    return { soNumber: first(text, /Book No\.\s*:\s*([A-Z0-9-]+)/i), carrier: "TAILWIND", vesselName: vessel?.[1]?.trim(), voyage: vessel?.[2]?.trim(), customerReference: lineValue(text, "Shipper Ref\\. No\\."), loadPort: pairedPorts?.[1]?.trim() ?? lineValue(text, "Port of Load"), dischargePort: pairedPorts?.[2]?.trim() ?? lineValue(text, "Port of Discharge"), etdText: oneDate(etd), etaText: allDates(eta)[1] ?? allDates(eta)[0] ?? "", cutoffText: portCutoffText, portCutoffText, emptyPickupLocation: lineValue(text, "Pick Empty at"), fullReturnLocation: lineValue(text, "Deliver To"), transportMode: lineValue(text, "Transport Mode"), containers: containerType ? [{ containerType, quantity: quantity || 1 }] : [], raw: { etd, eta } };
  }
}

/** OOCL booking acknowledgements use labelled English fields rather than an SO form table. */
export class OoclParser implements SoParser {
  canParse({ text }: ParserInput) { return /\bOOCL\b|BOOKING ACKNOWLEDGEMENT/i.test(text); }
  parse({ text }: ParserInput): ParsedSO {
    const dateValue = (label: string) => first(text, new RegExp(`${label}\\s*:\\s*(\\d{1,2}\\s+[A-Z]{3,9}\\s+\\d{4}(?:\\s+\\d{1,2}:\\d{2})?)`, "i")) ?? "";
    const vessel = text.match(/INTENDED\s+VESSEL\/VOYAGE\s*:\s*([^\n]+?)\s+([A-Z0-9]{2,})\s*$/im);
    const containers = text.match(/DESPATCH\s+QUANTITY\s+FCL\s+QTY\s+SIZE\/TYPE\s*:\s*(\d+)\s*X\s*(20|40|45)\s*(HC|HQ|GP|DC|DV)/i);
    const loadPort = first(text, /PORT\s+OF\s+LOADING\s*:\s*([^\n]+?)(?:\s+ETA\s*:|$)/i);
    const dischargePort = first(text, /PORT\s+OF\s+DISCHARGE\s*:\s*([^\n]+)/i);
    return {
      soNumber: first(text, /BOOKING\s+NUMBER\s*:\s*([A-Z0-9-]+)/i),
      carrier: "OOCL",
      vesselName: vessel?.[1]?.trim(), voyage: vessel?.[2]?.trim(),
      loadPort, dischargePort,
      etdText: dateValue("ETD"), etaText: dateValue("ETA"),
      portCutoffText: dateValue("INTENDED\\s+FCL\\s+CONTAINER\\s+DELIVERY\\s+CUT-OFF"),
      vgmCutoffText: dateValue("INTENDED\\s+VGM\\s+CUT-OFF"),
      siCutoffText: dateValue("INTENDED\\s+(?:ELECTRONIC\\s+)?SHIPPING\\s+INSTRUCTION\\s+CUT-OFF"),
      containers: containers ? [{ quantity: Number(containers[1]), containerType: normalizeContainerType(`${containers[2]}${containers[3]}`) }] : [],
      raw: {},
    };
  }
}

/** T.S. Lines release orders present routing data as a horizontal table. */
export class TsLinesReleaseOrderParser implements SoParser {
  canParse({ text }: ParserInput) { return /RELEASE\s+ORDER/i.test(text) && /T\.?\s*S\.?\s*(?:LINES|SHIPPING)|TSLINES/i.test(text); }
  parse({ text }: ParserInput): ParsedSO {
    const routing = text.match(/LEG\s+VESSEL\s+VESSEL\s+NAME\s+VOYAGE\s+POL\s+POD\s*\n\s*\d+\s+([A-Z0-9-]+)\s+(.+?)\s+([A-Z0-9-]{3,})\s+([A-Z]{3,})\s+([^\n]+)/i);
    const container = text.match(/CONT\.\s*QTY\s*\/\s*TYPE\s*:\s*(\d+)\s*[x×]\s*(20|40|45)\s*(HC|HQ|GP|DC|DV)/i);
    const closingText = oneDate(first(text, /CLOSING\s+DATE\s*:\s*([^\n]+)/i) ?? "");
    const loadPort = first(text, /PORT\s+OF\s+LOADING\s*:\s*([^\n]+)/i);
    const dischargePort = first(text, /PORT\s+OF\s+DISCHARGE\s*:\s*([^\n]+)/i);
    const fullReturnLocation = first(text, /RETURN\s+INTO\s*:\s*([^\n]+?)(?:\s+RECEIVING\s+DATE\s*:|$)/i);
    return {
      soNumber: first(text, /BOOKING\s+NO\.\s*:\s*([A-Z0-9-]+)/i),
      carrier: "TS LINES",
      vesselName: routing?.[2]?.trim(), voyage: routing?.[3]?.trim(),
      loadPort, dischargePort, fullReturnLocation,
      cutoffText: closingText, portCutoffText: closingText,
      containers: container ? [{ quantity: Number(container[1]), containerType: normalizeContainerType(`${container[2]}${container[3]}`) }] : [],
      raw: { vesselCode: routing?.[1]?.trim() ?? "", closingDate: closingText },
    };
  }
}

/** KMTC's bilingual booking note renders each value below its English/Chinese label. */
export class KmtcParser implements SoParser {
  canParse({ text }: ParserInput) { return /\bKMTC\b|KOREA MARINE TRANSPORT/i.test(text); }
  parse({ text }: ParserInput): ParsedSO {
    const vessel = text.match(/Ocean Vessel\/Voy\([^\n]*\)\s*\n?\s*([^/\n]+?)\s*\/\s*([^\s\n]+)/i);
    const below = (label: string) => text.match(new RegExp(`${label}[^\\n]*\\n\\s*([^\\n]+)`, "i"))?.[1]?.replace(/\s+(?:Freight & Charges|Hazardous cargo).*$/i, "").trim();
    const container = text.match(/\b(20|40|45)\s*(HC|HQ|GP|DC)\s*X\s*(\d+)\b/i);
    const etd = text.match(/ETD\([^\n]*\)[\s\S]{0,120}?(\d{4}\/\d{1,2}\/\d{1,2})/i)?.[1] ?? "";
    const eta = text.match(/ETA\([^\n]*\)[\s\S]{0,160}?(\d{4}\/\d{1,2}\/\d{1,2})/i)?.[1] ?? "";
    const portCutoffText = text.match(/CY Closing Date\/Time[\s\S]{0,120}?(\d{4}\/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{2})/i)?.[1] ?? "";
    const vgmCutoffText = text.match(/Customs Voucher Closing Date\/Time[\s\S]{0,140}?(\d{4}\/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{2})/i)?.[1] ?? "";
    return {
      soNumber: text.match(/S\/O No\.\([^\n]*\)\s*([A-Z0-9-]+)/i)?.[1], carrier: "KMTC",
      vesselName: vessel?.[1]?.trim(), voyage: vessel?.[2]?.trim(),
      customerReference: below("Shipper\\(Full Name & Address\\)\\(托运人\\)"),
      loadPort: below("Port Of Loading\\(装货港\\)"), dischargePort: below("Port Of Discharge\\(卸货港\\)"),
      etdText: etd, etaText: eta, portCutoffText, vgmCutoffText,
      containers: container ? [{ containerType: normalizeContainerType(`${container[1]}${container[2]}`), quantity: Number(container[3]) }] : [],
      raw: { etd, eta, portCutoff: portCutoffText, vgmCutoff: vgmCutoffText },
    };
  }
}

export class HapagLloydParser implements SoParser {
  canParse({ text }: ParserInput) { return /HAPAG[- ]LLOYD|Our Reference|DP Voyage/i.test(text); }
  parse({ text }: ParserInput): ParsedSO {
    const summary = text.match(/Summary([\s\S]*?)(?:Deadline|Routing|Additional Information|$)/i)?.[1] ?? "";
    const containers = [...summary.matchAll(/(?:^|\n|\s)(\d+)\s*(?:X|x)?\s*(20|40|45)\s*'?\s*(DC|DV|GP|HC|HQ|HIGH\s*CUBE)/gi)].map(match => ({ quantity: Number(match[1]), containerType: normalizeContainerType(`${match[2]}${match[3]}`) }));
    const tableContainer = first(text, /No\.\s+Type[\s\S]{0,300}?\n\s*\d+\s+(\d{2}[A-Z]{2})\b/i);
    if (!containers.length && tableContainer) containers.push({ quantity: 1, containerType: normalizeContainerType(tableContainer) });
    const deadline = text.match(/Deadline([\s\S]*?)(?:Summary|Routing|Additional Information|$)/i)?.[1] ?? "";
    const deadlineDates = allDates(deadline);
    const deadlineValue = (label: RegExp) => {
      const start = deadline.search(label);
      if (start < 0) return dateNearLabel(deadline, label);
      const block = deadline.slice(start, start + 180);
      const date = oneDate(block).replace(/\s+/g, " ").trim();
      if (date) return date;
      const time = block.match(/\b\d{1,2}:\d{2}\b/)?.[0];
      return time ? time : dateNearLabel(deadline, label);
    };
    const vesselFromRouting = first(text, /Vessel\s*\n\s*([^\n]+)\s*\n\s*DP Voyage\s*:/i);
    const loadPort = first(text, /From\s+(?:To\s+)?(?:By\s+)?(?:ETD\s+)?(?:ETA\s*)?\n\s*([A-Z][A-Z ]+)/i);
    const dischargePort = first(text, /\n\s*([A-Z][A-Z ]+)\s*\n\s*RIJEKA\s+GATEWAY/i);
    return {
      soNumber: first(text, /Our Reference\s*:\s*([^\t\n]+)/i) ?? lineValue(text, "Our Reference"),
      carrier: "HAPAG-LLOYD",
      vesselName: vesselFromRouting ?? lineValue(text, "DP Voyage") ?? lineValue(text, "Vessel"),
      voyage: first(text, /Voy\.?\s*No\.?\s*[:：]\s*([^\n]+)/i) ?? lineValue(text, "Voyage"),
      loadPort, dischargePort,
      siCutoffText: deadlineValue(/Shipping Instruction|SI Deadline/i),
      vgmCutoffText: deadlineValue(/VGM/i),
      portCutoffText: deadlineValue(/FCL delivery cut-off|Port Cut-off/i),
      openingText: deadlineValue(/Earliest container delivery date|Cargo Receiving Date/i),
      cutoffText: deadlineDates[0] ?? "",
      containers,
      raw: { deadline },
    };
  }
}

/** ONE booking notices frequently flatten the vessel/voyage and route labels onto one text row. */
export class OneParser implements SoParser {
  canParse({ text }: ParserInput) { return /Ocean Network Express|\bONE\b|ONEYSZ/i.test(text); }
  parse({ text }: ParserInput): ParsedSO {
    const vessel = text.match(/Vessel\s+Voyage\s+Dir\s*:\s*([^\n]+?)\s+([A-Z0-9]{2,})\s+Latest\s+ETA/i);
    const loadPort = first(text, /P\s*o\s*r\s*t\s+o\s*f\s+L\s*o\s*a\s*d\s*i\s*n\s*g\s*:\s*([^\n]+?)(?:\s+Terminal\s*:|$)/i);
    const dischargePort = first(text, /Port\s+of\s+Discharge\s*:\s*([^\n]+?)(?:\s+Terminal\s*:|$)/i);
    const container = text.match(/EQ\s*Type\s*\/\s*Q'?ty\s*:\s*(20|40|45)'?\s*(?:DRY\s*)?(HC|HQ|GP|DC|DV)[^.\n-]*[.\-]+\s*(\d+)/i);
    const etdEta = text.match(/Latest\s+ETA\s*\/\s*ETD\s*:\s*(\d{1,2}\s?[A-Z]{3,4}\s?\d{2,4})\s*\/\s*(\d{1,2}\s?[A-Z]{3,4}\s?\d{2,4})/i);
    const labelledCompactDate = (label: RegExp) => {
      const line = text.split(/\r?\n/).find(value => label.test(value)) ?? "";
      return compactDate(line) || compactDate(text.slice(text.search(label), text.search(label) + 180));
    };
    const siCutoffText = labelledCompactDate(/Doc\s+Cut-off/i);
    const vgmCutoffText = labelledCompactDate(/VGM\s+Cut-off/i);
    const portCutoffText = compactDate(text.match(/Full\s+Return\s+CY\s+Cut-off\s*:\s*\n[^\n]*\n([^\n]+)/i)?.[1] ?? "");
    return {
      soNumber: first(text, /(?:Booking|S\/?O)\s*(?:No\.?|Number)\s*[:：]\s*([A-Z0-9-]+)/i),
      carrier: "ONE", vesselName: vessel?.[1]?.trim(), voyage: vessel?.[2]?.trim(), loadPort, dischargePort,
      etaText: etdEta?.[1], etdText: etdEta?.[2], siCutoffText, vgmCutoffText, portCutoffText,
      containers: container ? [{ containerType: normalizeContainerType(`${container[1]}${container[2]}`), quantity: Number(container[3]) }] : [], raw: {},
    };
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
  constructor(private readonly generic = new GenericSoParser(), private readonly carrierParsers: SoParser[] = [new CmaCgmParser(), new TailwindParser(), new OoclParser(), new TsLinesReleaseOrderParser(), new HapagLloydParser(), new KmtcParser(), new OneParser()]) {}
  parse(input: ParserInput) {
    const parsed = this.carrierParsers.filter(parser => parser.canParse(input)).reduce((result, parser) => {
      const carrierParsed = parser.parse(input);
      const carrierOwnsLayout = parser instanceof CmaCgmParser || parser instanceof TailwindParser || parser instanceof OoclParser || parser instanceof TsLinesReleaseOrderParser || parser instanceof HapagLloydParser || parser instanceof KmtcParser || parser instanceof OneParser;
      if (!carrierOwnsLayout) return mergeParsed(result, carrierParsed);
      // Keep generic fields (for example a booking number) when the carrier
      // layout has no equivalent label, then replace only the carrier-owned
      // layout values below.
      const authoritative = mergeParsed(result, carrierParsed) as ParsedSO;
      const layoutFields: Array<keyof ParsedSO> = ["carrier", "vesselName", "voyage", "loadPort", "dischargePort", "etdText", "etaText", "cutoffText", "siCutoffText", "openingText", "vgmCutoffText", "portCutoffText", "emptyPickupLocation", "fullReturnLocation", "transportMode", "customerReference"];
      for (const key of layoutFields) {
        if (carrierParsed[key] !== undefined && carrierParsed[key] !== "") (authoritative as Record<string, unknown>)[key] = carrierParsed[key];
      }
      // A carrier-specific parser only yields an SO number from that carrier's
      // explicit label.  It is therefore more reliable than generic layout
      // candidates (which may also capture a reference number elsewhere in
      // the PDF), and resolves any generic SO-number ambiguity.
      if (carrierParsed.soNumber) authoritative.soNumber = carrierParsed.soNumber;
      const fieldConflicts = { ...result.fieldConflicts };
      if (carrierParsed.soNumber) delete fieldConflicts.soNumber;
      for (const key of layoutFields) if (carrierParsed[key] !== undefined && carrierParsed[key] !== "") delete fieldConflicts[key as ParsedFieldName];
      return { ...authoritative, fieldConflicts, containers: carrierParsed.containers.length ? carrierParsed.containers : result.containers, raw: { ...result.raw, ...carrierParsed.raw } };
    }, this.generic.parse(input));
    // Some carrier SOs only state the loading port, not a named empty-container
    // depot.  In that case the port is the most useful operational pickup value;
    // never replace an explicitly extracted depot.
    const withPickupFallback: ParsedSO = {
      ...parsed,
      emptyPickupLocation: parsed.emptyPickupLocation || parsed.loadPort || undefined,
    };
    const coreFields: ParsedFieldName[] = ["soNumber", "carrier", "vesselName", "voyage", "loadPort", "containers"];
    const missingCoreFields = coreFields.filter(field => field === "containers" ? !withPickupFallback.containers.length : !withPickupFallback[field]);
    // These locations are operationally important, but many SO templates do
    // not print them. Flag a missing value only when its own label appears in
    // the source and extraction failed; never substitute a destination port.
    if (/Export\s+empty\s+pick\s*up\s+depot\(s\)/i.test(input.text) && !withPickupFallback.emptyPickupLocation) missingCoreFields.push("emptyPickupLocation");
    if (/Export\s+terminal\s+delivery\s+address/i.test(input.text) && !withPickupFallback.fullReturnLocation) missingCoreFields.push("fullReturnLocation");
    const conflictingFields = Object.keys(withPickupFallback.fieldConflicts ?? {}) as ParsedFieldName[];
    return { ...withPickupFallback, carrier: withPickupFallback.carrier ? normalizeCarrierName(withPickupFallback.carrier) : undefined, parseReview: { missingCoreFields, conflictingFields, needsReview: missingCoreFields.length > 0 || conflictingFields.length > 0 } };
  }
}
