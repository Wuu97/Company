import { describe, expect, it } from "vitest";
import { evaluateRiskAlerts } from "./risk-alerts";
const now=new Date("2026-09-29T00:00:00.000Z");
describe("业务风险预警",()=>{it("识别待核实 ETB 与临近截止",()=>{const alerts=evaluateRiskAlerts([{id:"so1",soNumber:"SO-1",etbNeedsReview:true,openingText:null,siCutoffText:"29/09/2026 14:00",vgmCutoffText:null,portCutoffText:null,plans:[]}],now);expect(alerts.map(alert=>alert.type)).toEqual(["DEADLINE","ETB_REVIEW"]);expect(alerts[0].severity).toBe("CRITICAL");});it("不为远期或无法解析时间误报",()=>expect(evaluateRiskAlerts([{id:"so1",soNumber:"SO-1",etbNeedsReview:false,openingText:"unknown",siCutoffText:"01/10/2026 20:00",vgmCutoffText:null,portCutoffText:null,plans:[]}],now)).toEqual([]));});
