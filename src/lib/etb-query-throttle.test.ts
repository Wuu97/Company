import { describe, expect, it } from "vitest";
import { isRetryableEtbError, retryDelayMs } from "./etb-query-throttle";

describe("ETB 查询节流", () => {
  const throttle = { batchMaxSailings: 10, queryIntervalMs: 2000, maxAttempts: 2, retryBaseDelayMs: 4000 };
  it("对短暂故障使用指数退避", () => {
    expect(retryDelayMs(throttle, 1)).toBe(4000);
    expect(retryDelayMs(throttle, 2)).toBe(8000);
    expect(isRetryableEtbError(new Error("net::ERR_CONNECTION_RESET"))).toBe(true);
    expect(isRetryableEtbError(new Error("没有完全匹配结果"))).toBe(false);
  });
});
