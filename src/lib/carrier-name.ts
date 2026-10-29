/** Stable carrier identity used for SO-to-terminal matching and sailing keys. */
const aliases: Record<string, string> = {
  "CMA CGM": "CMA CGM", "CMACGM": "CMA CGM",
  "MAERSK": "MAERSK", "MAERSK LINE": "MAERSK", "AP MOLLER MAERSK": "MAERSK",
  "COSCO": "COSCO", "COSCO SHIPPING": "COSCO",
  "HAPAG LLOYD": "HAPAG-LLOYD", "HAPAGLLOYD": "HAPAG-LLOYD",
  "MSC": "MSC", "MEDITERRANEAN SHIPPING COMPANY": "MSC",
  "OOCL": "OOCL", "ORIENT OVERSEAS CONTAINER LINE": "OOCL",
  "ONE": "ONE", "OCEAN NETWORK EXPRESS": "ONE",
  "EVERGREEN": "EVERGREEN", "EVERGREEN MARINE": "EVERGREEN",
  "KMTC": "KMTC", "KOREA MARINE TRANSPORT": "KMTC",
  "ZIM": "ZIM", "ZIM INTEGRATED SHIPPING": "ZIM",
  "YANG MING": "YANG MING", "WAN HAI": "WAN HAI", "PIL": "PIL",
  "TS LINES": "TS LINES", "TSLINES": "TS LINES",
};

function aliasKey(value: string) {
  return value.normalize("NFKC").trim().toUpperCase().replace(/[._\-/]+/g, " ").replace(/\s+/g, " ");
}

export function normalizeCarrierName(value: string) {
  const normalized = aliasKey(value);
  return aliases[normalized] || normalized;
}

export function sameCarrierName(left?: string | null, right?: string | null) {
  return Boolean(left && right && normalizeCarrierName(left) === normalizeCarrierName(right));
}
