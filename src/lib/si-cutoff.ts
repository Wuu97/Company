import { formatChinaDateTime } from "./time";
export const siCutoffSources = ["SO_ORIGINAL", "SYSTEM_ESTIMATED", "NEEDS_REVIEW", "MANUAL"] as const;
export type SiCutoffSource = (typeof siCutoffSources)[number];

export type SiCutoffResolution = {
  effectiveText?: string;
  source: Exclude<SiCutoffSource, "MANUAL">;
  originalText?: string;
  estimatedFromText?: string;
};

function subtractDays(text: string, days: number) {
  const numeric = text.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})\s+(\d{1,2}):(\d{2})/);
  const named = text.match(/(\d{1,2})[-/]([A-Z]{3,4})[-/](\d{2,4})\s+(\d{1,2}):(\d{2})/i);
  const compactNamed = text.match(/(\d{1,2})\s*([A-Z]{3,4})\s*(\d{2,4})\s+(\d{1,2}):(\d{2})/i);
  let date: Date | undefined;

  if (numeric) {
    date = new Date(Date.UTC(Number(numeric[3]), Number(numeric[2]) - 1, Number(numeric[1]), Number(numeric[4]), Number(numeric[5])) - 8 * 60 * 60 * 1000);
  } else if (named) {
    const months: Record<string, number> = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, SEPT: 8, OCT: 9, NOV: 10, DEC: 11 };
    const month = months[named[2].toUpperCase()];
    const year = Number(named[3].length === 2 ? `20${named[3]}` : named[3]);
    if (month !== undefined) date = new Date(Date.UTC(year, month, Number(named[1]), Number(named[4]), Number(named[5])) - 8 * 60 * 60 * 1000);
  } else if (compactNamed) {
    const months: Record<string, number> = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, SEPT: 8, OCT: 9, NOV: 10, DEC: 11 };
    const month = months[compactNamed[2].toUpperCase()];
    const year = Number(compactNamed[3].length === 2 ? `20${compactNamed[3]}` : compactNamed[3]);
    if (month !== undefined) date = new Date(Date.UTC(year, month, Number(compactNamed[1]), Number(compactNamed[4]), Number(compactNamed[5])) - 8 * 60 * 60 * 1000);
  }
  if (!date || Number.isNaN(date.valueOf())) return undefined;
  date = new Date(date.valueOf() - days * 24 * 60 * 60 * 1000);
  return formatChinaDateTime(date);
}

export function resolveSiCutoff(input: {
  originalSiText?: string;
  latestDeadlineText?: string;
  otherCutoffTexts?: Array<string | undefined>;
  fallbackDays?: number;
}): SiCutoffResolution {
  if (input.originalSiText) {
    return { effectiveText: input.originalSiText, originalText: input.originalSiText, source: "SO_ORIGINAL" };
  }

  const conflictingDeadlines = (input.otherCutoffTexts ?? []).filter(text => text && text !== input.latestDeadlineText);
  if (!input.latestDeadlineText || conflictingDeadlines.length) return { source: "NEEDS_REVIEW" };

  const effectiveText = subtractDays(input.latestDeadlineText, input.fallbackDays ?? 2);
  return effectiveText
    ? { effectiveText, estimatedFromText: input.latestDeadlineText, source: "SYSTEM_ESTIMATED" }
    : { source: "NEEDS_REVIEW" };
}
