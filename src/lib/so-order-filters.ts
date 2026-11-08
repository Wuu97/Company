import type { Prisma } from "@prisma/client";
import { chinaLocalDateTimeToDate, formatChinaDateTime, formatOperationalTimeText } from "./time";

export const cutoffOptions = [
  { value: "OPEN", label: "未截柜" },
  { value: "CLOSED", label: "已截柜" },
  { value: "UNKNOWN", label: "截柜时间待核对" },
] as const;

export function orderSearchConditions(q: string): Prisma.SoOrderWhereInput[] {
  const term = { contains: q, mode: "insensitive" } as const;
  return [
    { soNumber: term },
    { carrier: term },
    { vesselName: term },
    { voyage: term },
    { containers: { some: { active: true, OR: [{ containerNo: term }, { internalCode: term }] } } },
  ];
}

export function orderCutoffStatus(value: string | null, now: Date) {
  const cutoff = value ? formatOperationalTimeText(value) : "";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(cutoff);
  const localTime = dateOnly ? `${cutoff} 00:00` : cutoff;
  const date = chinaLocalDateTimeToDate(localTime);
  if (!date || formatChinaDateTime(date) !== localTime) return "UNKNOWN";
  // A date without a time is considered open through that calendar day.
  const passed = dateOnly ? formatChinaDateTime(now).slice(0, 10) > cutoff : now >= date;
  return passed ? "CLOSED" : "OPEN";
}
