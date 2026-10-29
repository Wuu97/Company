import { describe, expect, it } from "vitest";
import { parseChinaEtb } from "./etb-time";

describe("ETB 时间解析", () => {
  it("将页面显示的中国日期时间转换为绝对时间", () => {
    expect(parseChinaEtb("2026年10月02日 08:00")?.toISOString()).toBe("2026-10-02T00:00:00.000Z");
    expect(parseChinaEtb("2026/10/02T08:00")?.toISOString()).toBe("2026-10-02T00:00:00.000Z");
  });

  it("拒绝无效日期", () => {
    expect(parseChinaEtb("not a date")).toBeUndefined();
  });
});
