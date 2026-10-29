import { describe, expect, it } from "vitest";
import { etbRunAlert } from "./etb-run-alert";

describe("ETB task alerts", () => {
  it("creates deduplicated notifications for manual handoff and failures", () => {
    expect(etbRunAlert({ terminal: "蛇口", runId: "run-1", status: "AWAITING_MANUAL", reason: "需要验证码" })).toMatchObject({ kind: "ETB_MANUAL_HANDOFF", title: "蛇口 ETB 查询需要人工接管", dedupeKey: "etb-run:run-1:AWAITING_MANUAL" });
    expect(etbRunAlert({ terminal: "盐田", runId: "run-2", status: "FAILED" }).kind).toBe("ETB_QUERY_FAILED");
  });
});
