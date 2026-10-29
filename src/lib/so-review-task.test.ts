import { describe, expect, it } from "vitest";
import { soReviewReasons } from "./so-review-task";

describe("SO 复核任务", () => {
  it("turns parser uncertainty into concise operator-facing reasons", () => {
    expect(soReviewReasons({ needsReview: true, missingCoreFields: ["voyage"], conflictingFields: ["loadPort"] })).toEqual(["缺少：航次", "冲突：装货港"]);
    expect(soReviewReasons({ needsReview: false, missingCoreFields: ["voyage"] })).toEqual([]);
  });
});
