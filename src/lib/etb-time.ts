/**
 * Parses the date/time strings explicitly displayed by terminal schedule pages
 * as China Standard Time. Callers retain responsibility for terminal-specific
 * validation and error handling.
 */
export function parseChinaEtb(raw: string): Date | undefined {
  const normalized = raw.trim().replace(/年|\//g, "-").replace(/月/g, "-").replace(/日/g, "");
  const value = new Date(normalized.includes("T") ? normalized : `${normalized.replace(" ", "T")}+08:00`);
  return Number.isNaN(value.valueOf()) ? undefined : value;
}
