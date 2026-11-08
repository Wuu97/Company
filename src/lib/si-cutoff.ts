import { formatChinaDateTime, formatOperationalTimeText } from "./time";
export const siCutoffSources = ["SO_ORIGINAL", "AI_RULE", "SYSTEM_ESTIMATED", "NEEDS_REVIEW", "MANUAL"] as const;
export type SiCutoffSource = (typeof siCutoffSources)[number];

export type SiCutoffResolution = {
  effectiveText?: string;
  source: Exclude<SiCutoffSource, "MANUAL">;
  originalText?: string;
  estimatedFromText?: string;
};

function subtractDays(text: string, days: number) {
  const normalized = formatOperationalTimeText(text);
  const iso = normalized.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  if (iso) {
    const date = new Date(`${normalized.replace(" ", "T")}:00+08:00`);
    return Number.isNaN(date.valueOf()) ? undefined : formatChinaDateTime(new Date(date.valueOf() - days * 86400000));
  }
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
  rule?: "PREVIOUS_DAY_NOON";
  fallbackDays?: number;
}): SiCutoffResolution {
  if (input.originalSiText) {
    return { effectiveText: input.originalSiText, originalText: input.originalSiText, source: "SO_ORIGINAL" };
  }

  const conflictingDeadlines = (input.otherCutoffTexts ?? []).filter(text => text && formatOperationalTimeText(text) !== formatOperationalTimeText(input.latestDeadlineText ?? ""));
  if (!input.latestDeadlineText || (!input.rule && conflictingDeadlines.length)) return { source: "NEEDS_REVIEW" };

  const previousDay = input.rule === "PREVIOUS_DAY_NOON" ? subtractDays(input.latestDeadlineText, 1) : undefined;
  // The notice also includes a separate weekend rule. Leave weekend cutoffs
  // for review rather than applying the weekday rule to them.
  if (input.rule && (!previousDay || [5, 6].includes(new Date(previousDay.slice(0, 10)).getUTCDay()))) {
    return { source: "NEEDS_REVIEW" };
  }
  const effectiveText = previousDay
    ? `${previousDay.slice(0, 10)} 12:00`
    : subtractDays(input.latestDeadlineText, input.fallbackDays ?? 2);
  return effectiveText
    ? { effectiveText, estimatedFromText: input.latestDeadlineText, source: "SYSTEM_ESTIMATED" }
    : { source: "NEEDS_REVIEW" };
}
