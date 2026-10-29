/** All operational cut-off values are interpreted in China Standard Time (UTC+08:00). */
export const OPERATION_TIME_ZONE = "Asia/Shanghai";
const CST_OFFSET_MS = 8 * 60 * 60 * 1000;

export function chinaDateParts(date: Date) {
  const cst = new Date(date.getTime() + CST_OFFSET_MS);
  return { year: cst.getUTCFullYear(), month: cst.getUTCMonth() + 1, day: cst.getUTCDate(), hour: cst.getUTCHours(), minute: cst.getUTCMinutes() };
}

export function formatChinaDateTime(date: Date) {
  const { year, month, day, hour, minute } = chinaDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** Formats an absolute timestamp for an HTML datetime-local input in China time. */
export function chinaDateTimeLocalValue(date: Date) {
  return formatChinaDateTime(date).replace(" ", "T");
}

/** Converts a date/time written in the operations UI to an absolute timestamp. */
export function chinaLocalDateTimeToDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/);
  if (!match) return undefined;
  const [, year, month, day, hour, minute] = match;
  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00+08:00`);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

/** Normalizes date strings extracted from carrier SO documents without changing their stated local time. */
export function formatOperationalTimeText(value: string) {
  const text = value.trim();
  const months: Record<string, string> = { JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06", JUL: "07", AUG: "08", SEP: "09", SEPT: "09", OCT: "10", NOV: "11", DEC: "12" };
  const named = text.match(/(\d{1,2})[-/]([A-Z]{3,4})[-/](\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/i);
  if (named) {
    const month = months[named[2].toUpperCase()];
    if (month) return `${named[3].length === 2 ? `20${named[3]}` : named[3]}-${month}-${named[1].padStart(2, "0")}${named[4] ? ` ${named[4].padStart(2, "0")}:${named[5]}` : ""}`;
  }
  const namedSpace = text.match(/(\d{1,2})\s+([A-Z]{3,9})\s+(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/i);
  if (namedSpace) {
    const month = months[namedSpace[2].slice(0, 4).toUpperCase()];
    if (month) return `${namedSpace[3]}-${month}-${namedSpace[1].padStart(2, "0")}${namedSpace[4] ? ` ${namedSpace[4].padStart(2, "0")}:${namedSpace[5]}` : ""}`;
  }
  const compactNamed = text.match(/(\d{1,2})\s*([A-Z]{3,4})\s*(\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/i);
  if (compactNamed) {
    const month = months[compactNamed[2].toUpperCase()];
    if (month) return `${compactNamed[3].length === 2 ? `20${compactNamed[3]}` : compactNamed[3]}-${month}-${compactNamed[1].padStart(2, "0")}${compactNamed[4] ? ` ${compactNamed[4].padStart(2, "0")}:${compactNamed[5]}` : ""}`;
  }
  const yearFirst = text.match(/(\d{4})[/.\-](\d{1,2})[/.\-](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (yearFirst) return `${yearFirst[1]}-${yearFirst[2].padStart(2, "0")}-${yearFirst[3].padStart(2, "0")}${yearFirst[4] ? ` ${yearFirst[4].padStart(2, "0")}:${yearFirst[5]}` : ""}`;
  const dayFirst = text.match(/(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (dayFirst) return `${dayFirst[3]}-${dayFirst[2].padStart(2, "0")}-${dayFirst[1].padStart(2, "0")}${dayFirst[4] ? ` ${dayFirst[4].padStart(2, "0")}:${dayFirst[5]}` : ""}`;
  return text;
}

/** Estimates the opening time as seven calendar days before the CY cut-off, preserving the stated local time when available. */
export function estimateOpeningFromPortCutoff(value?: string | null) {
  if (!value) return undefined;
  const normalized = formatOperationalTimeText(value);
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?$/);
  if (!match) return undefined;
  const [, year, month, day, hour = "", minute = ""] = match;
  const cutoff = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number.isNaN(cutoff.valueOf())) return undefined;
  cutoff.setUTCDate(cutoff.getUTCDate() - 7);
  const date = `${cutoff.getUTCFullYear()}-${String(cutoff.getUTCMonth() + 1).padStart(2, "0")}-${String(cutoff.getUTCDate()).padStart(2, "0")}`;
  return hour ? `${date} ${hour}:${minute}` : date;
}

/** Uses the opening time printed in the SO; otherwise estimates it from the CY cut-off. */
export function resolveOpeningTime(openingText?: string | null, portCutoffText?: string | null) {
  if (openingText?.trim()) return { value: formatOperationalTimeText(openingText), source: "SO" as const };
  const value = estimateOpeningFromPortCutoff(portCutoffText);
  return value ? { value, source: "SYSTEM_ESTIMATED" as const } : undefined;
}

/** @deprecated Use estimateOpeningFromPortCutoff. */
export const estimateEtbFromPortCutoff = estimateOpeningFromPortCutoff;
