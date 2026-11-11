import { describe, expect, it } from "vitest";
import { soReviewReasons } from "./so-review-task";

describe("SO 复核任务", () => {
  it("turns parser uncertainty into concise operator-facing reasons", () => {
    expect(soReviewReasons({ needsReview: true, missingCoreFields: ["voyage"], conflictingFields: ["loadPort"] })).toEqual(["缺少：航次", "冲突：装货港"]);
    expect(soReviewReasons({ needsReview: false, missingCoreFields: ["voyage"] })).toEqual([]);
  });
});

it("忽略缺失的船期，并按订单当前值提醒四项操作时间", () => {
  const review = { needsReview: true, missingCoreFields: ["etbText", "etaText", "etdText", "portCutoffText"] };
  const filled = {
    parseStatus: "PARSED",
    openingText: "2026-11-03 00:01",
    siCutoffText: "2026-11-05 16:00",
    portCutoffText: "2026-11-07 22:00",
    cutoffText: "2026-11-08 10:00",
    carrier: "CMA CGM",
    vesselName: "CMA CGM RIO GRANDE",
    voyage: "0R11OW1MA",
    emptyPickupLocation: "YANTIAN DEPOT",
    fullReturnLocation: "YANTIAN TERMINAL",
  };
  expect(soReviewReasons(review, filled)).toEqual([]);
  expect(soReviewReasons(review, { ...filled, cutoffText: null })).toEqual(["缺少：截放行／截关时间"]);
  expect(soReviewReasons(undefined, { ...filled, openingText: null, siCutoffText: null, portCutoffText: null, cutoffText: null })).toEqual([
    "缺少：开舱时间、补料时间、截重柜时间（CY）、截放行／截关时间",
  ]);
  expect(soReviewReasons(undefined, { ...filled, emptyPickupLocation: null, fullReturnLocation: "" })).toEqual([
    "缺少：放行／提空柜地点、还柜地点",
  ]);
  expect(soReviewReasons(undefined, { ...filled, carrier: "待解析", vesselName: " ", voyage: null })).toEqual([
    "缺少：船公司、船名、航次",
  ]);
  expect(soReviewReasons(undefined, { parseStatus: "PENDING" })).toEqual([]);
});
