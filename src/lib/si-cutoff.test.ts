import { describe, expect, it } from "vitest";
import { resolveSiCutoff } from "./si-cutoff";

describe("SI 截止时间来源", () => {
  it("优先使用 SO 原始 SI 时间", () => {
    expect(resolveSiCutoff({ originalSiText: "17-SEP-2026 16:00", latestDeadlineText: "18-SEP-2026 12:00" })).toMatchObject({ effectiveText: "17-SEP-2026 16:00", source: "SO_ORIGINAL" });
  });

  it("从唯一明确最晚截止时间提前三天推算", () => {
    expect(resolveSiCutoff({ latestDeadlineText: "19/09/2026 16:00" })).toMatchObject({ effectiveText: "2026-09-16 16:00", estimatedFromText: "19/09/2026 16:00", source: "SYSTEM_ESTIMATED" });
  });

  it("多个不同截止时间时要求人工核对", () => {
    expect(resolveSiCutoff({ latestDeadlineText: "19/09/2026 16:00", otherCutoffTexts: ["18/09/2026 12:00"] })).toEqual({ source: "NEEDS_REVIEW" });
  });
});
