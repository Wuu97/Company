export type ParseReview = { missingCoreFields?: string[]; conflictingFields?: string[]; needsReview?: boolean };

const labels: Record<string, string> = { soNumber: "SO 编号", carrier: "船公司", vesselName: "船名", voyage: "航次", loadPort: "装货港", dischargePort: "卸货港", emptyPickupLocation: "提空柜地点", fullReturnLocation: "交重柜地点", containers: "柜型/柜量" };

/** Converts parser uncertainty metadata into a concise, user-actionable review task. */
export function soReviewReasons(review: ParseReview | null | undefined) {
  if (!review?.needsReview) return [];
  const fieldNames = (fields: string[] | undefined) => (fields ?? []).map(field => labels[field] ?? field).join("、");
  return [
    review.missingCoreFields?.length ? `缺少：${fieldNames(review.missingCoreFields)}` : "",
    review.conflictingFields?.length ? `冲突：${fieldNames(review.conflictingFields)}` : "",
  ].filter(Boolean);
}
