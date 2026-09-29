import { describe, expect, it } from "vitest";
import { chinaLocalDateTimeToDate, formatChinaDateTime } from "./time";

describe("业务时区",()=>{
  it("将 UI 时间按中国时区解释",()=>{expect(chinaLocalDateTimeToDate("2026-09-19T16:00")?.toISOString()).toBe("2026-09-19T08:00:00.000Z");});
  it("按中国时区格式化绝对时间",()=>{expect(formatChinaDateTime(new Date("2026-09-19T08:00:00.000Z"))).toBe("2026-09-19 16:00");});
});
