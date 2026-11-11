import { resolveOpeningTime } from "./time";

export type ParseReview = { missingCoreFields?: string[]; conflictingFields?: string[]; needsReview?: boolean };

const labels: Record<string, string> = { soNumber: "SO 编号", carrier: "船公司", customerReference: "客户参考号", vesselName: "船名", voyage: "航次", loadPort: "装货港", dischargePort: "卸货港", emptyPickupLocation: "放行／提空柜地点", fullReturnLocation: "还柜地点", containers: "柜型/柜量",
  etdText: "ETD",
  etaText: "ETA",
  etbText: "预计靠泊时间（ETB）",
  openingText: "开舱时间",
  siCutoffText: "补料时间",
  portCutoffText: "截重柜时间（CY）",
  cutoffText: "截放行／截关时间",
  vgmCutoffText: "VGM 截止时间",
};

export const requiredSoReviewFields = [
  "openingText", "siCutoffText", "portCutoffText", "cutoffText",
  "carrier", "vesselName", "voyage", "emptyPickupLocation", "fullReturnLocation",
] as const;
type SoReviewOrder = { parseStatus: string } & Partial<Record<(typeof requiredSoReviewFields)[number], string | null>>;

const optionalScheduleFields = new Set(["etbText", "etaText", "etdText"]);

/** Converts parser uncertainty and the current order fields into a user-facing review task. */
export function soReviewReasons(
  review: ParseReview | null | undefined,
  order?: SoReviewOrder,
) {
  const missing = new Set((review?.needsReview ? review.missingCoreFields ?? [] : [])
    .filter(field => !optionalScheduleFields.has(field)));
  if (order?.parseStatus === "PARSED" || order?.parseStatus === "VERIFIED") {
    for (const field of requiredSoReviewFields) {
      missing.delete(field);
      const value = field === "openingText"
        ? order.openingText?.trim() || (!review?.conflictingFields?.includes(field) ? resolveOpeningTime(undefined, order.portCutoffText, order.cutoffText)?.value : undefined)
        : order[field]?.trim();
      if (!value || (field === "carrier" && value === "待解析")) missing.add(field);
    }
  }
  const conflicts = review?.needsReview ? review.conflictingFields ?? [] : [];
  const fieldNames = (fields: Iterable<string>) => [...fields].map(field => labels[field] ?? field).join("、");
  return [
    missing.size ? `缺少：${fieldNames(missing)}` : "",
    conflicts.length ? `冲突：${fieldNames(conflicts)}` : "",
  ].filter(Boolean);
}
