import { describe, expect, it } from "vitest";
import { chinaDateTimeLocalValue, chinaLocalDateTimeToDate, estimateEtbFromPortCutoff, formatChinaDateTime, formatOperationalTimeText } from "./time";

describe("业务时区",()=>{
  it("将 UI 时间按中国时区解释",()=>{expect(chinaLocalDateTimeToDate("2026-09-19T16:00")?.toISOString()).toBe("2026-09-19T08:00:00.000Z");});
  it("按中国时区格式化绝对时间",()=>{expect(formatChinaDateTime(new Date("2026-09-19T08:00:00.000Z"))).toBe("2026-09-19 16:00");});
  it("为本地日期时间控件按中国时区回填",()=>{expect(chinaDateTimeLocalValue(new Date("2026-09-19T08:00:00.000Z"))).toBe("2026-09-19T16:00");});
  it("统一 SO 中不同的日期文本格式",()=>{expect(formatOperationalTimeText("2026/10/09")).toBe("2026-10-09");expect(formatOperationalTimeText("20-SEP-2026 16:00")).toBe("2026-09-20 16:00");expect(formatOperationalTimeText("17/09/2026 08:05")).toBe("2026-09-17 08:05");expect(formatOperationalTimeText("24 Oct 2026 12:00")).toBe("2026-10-24 12:00");});
  it("按 CY 截关时间提前七天估算 ETB",()=>{expect(estimateEtbFromPortCutoff("2026-10-24 12:00")).toBe("2026-10-17 12:00");expect(estimateEtbFromPortCutoff("2026/01/05")).toBe("2025-12-29");expect(estimateEtbFromPortCutoff("待核对")).toBeUndefined();});
});
