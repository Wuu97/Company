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

/** Converts a date/time written in the operations UI to an absolute timestamp. */
export function chinaLocalDateTimeToDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/);
  if (!match) return undefined;
  const [, year, month, day, hour, minute] = match;
  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00+08:00`);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}
