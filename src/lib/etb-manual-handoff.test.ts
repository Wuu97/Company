import { describe, expect, it } from "vitest";
import { manualHandoffUpdate } from "./etb-manual-handoff";

describe("ETB 人工接管恢复", () => {
  it("only requeues after an explicit resume action", () => {
    expect(manualHandoffUpdate("已完成验证码", true)).toMatchObject({ status: "PENDING", startedAt: null, errorMessage: null });
    expect(manualHandoffUpdate("已完成验证码", false)).toMatchObject({ handoffReason: "已完成验证码" });
  });
});
