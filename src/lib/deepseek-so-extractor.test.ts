import { describe, expect, it } from "vitest";
import { hasContainerEvidence, mergeAiSoFields, needsAiSoExtraction, verifiedAiSiRule, type AiSoExtraction } from "./deepseek-so-extractor";
import { resolveSiCutoff } from "./si-cutoff";

const parsed = { dischargePort: "NAGOYA, JAPAN", cutoffText: "22-Oct-2026 12:00", containers: [], raw: {} };
const ai: AiSoExtraction = {
  model: "deepseek-flash",
  values: {},
  evidence: {},
  confidence: {},
  containers: [],
  siRule: {
    status: "applicable",
    rule: "PREVIOUS_DAY_NOON",
    destinationEvidence: "PORT OF DISCHARGE: NAGOYA, JAPAN",
    clauseEvidence: "日本和NW1截关前一天的12点",
    cutoffEvidence: "CLOSING DATE: 22-Oct-2026 12:00",
    explanation: "日本航线适用，截关日为周四。",
  },
};
const document = [
  ai.siRule!.destinationEvidence,
  ai.siRule!.clauseEvidence,
  ai.siRule!.cutoffEvidence,
].join("\n");

describe("AI 补料条款核验", () => {
  it("根据核验过的 SO 条款计算补料时间", () => {
    const rule = verifiedAiSiRule(ai, parsed, document);
    expect(rule).toBe("PREVIOUS_DAY_NOON");
    expect(resolveSiCutoff({ rule: rule === "PREVIOUS_DAY_NOON" ? rule : undefined, latestDeadlineText: parsed.cutoffText }).effectiveText)
      .toBe("2026-10-21 12:00");
  });

  it("原文缺失或基准与订单不一致时要求核对", () => {
    expect(verifiedAiSiRule(ai, parsed, document.replace(ai.siRule!.clauseEvidence, ""))).toBe("NEEDS_REVIEW");
    expect(verifiedAiSiRule(ai, { ...parsed, cutoffText: "23-Oct-2026 12:00" }, document)).toBe("NEEDS_REVIEW");
  });
});

describe("SO 字段优先级", () => {
  const opening = "RECEIVING DATE: 16-Oct-2026 00:00";
  const original = { ...parsed, portCutoffText: "22-Oct-2026 12:00", containers: [{ containerType: "45GP", quantity: 1 }] };
  const extracted: AiSoExtraction = {
    ...ai,
    values: { openingText: "16-Oct-2026 00:00", portCutoffText: "24-Oct-2026 12:00" },
    evidence: { openingText: opening, portCutoffText: "FCL delivery cut-off: 24-Oct-2026 12:00" },
    containers: [{ containerType: "40HC", quantity: 1 }],
  };

  it("AI 补齐有原文证据的开仓时间，保留明确的截关和柜型", () => {
    expect(mergeAiSoFields(original, extracted, `${document}\n${opening}\nSummary: 1x45GP`)).toMatchObject({
      openingText: "16-Oct-2026 00:00",
      portCutoffText: original.portCutoffText,
      containers: original.containers,
    });
  });

  it("未能在原文定位 AI 证据时保留规则结果", () => {
    expect(mergeAiSoFields(original, extracted, document)).toEqual(original);
  });

  it("陌生版式和缺关键字段的票需要 AI", () => {
    expect(needsAiSoExtraction(original, document)).toBe(true);
    expect(needsAiSoExtraction(original, `HAPAG-LLOYD\nOur Reference: 123\nDeadline Location Date / Time\n${document}\nSummary: 1x45GP`)).toBe(true);
  });
  it("已验证版式且必需字段都有原文依据时跳过 AI", () => {
    const complete = {
      ...original, carrier: "HAPAG-LLOYD", soNumber: "12345", vesselName: "DEMO VESSEL",
      voyage: "001N", loadPort: "SHEKOU", openingText: "16-Oct-2026 00:00",
      siCutoffText: "21-Oct-2026 12:00", etdText: "23-Oct-2026 12:00", etaText: "27-Oct-2026 12:00",
    };
    const text = [
      "HAPAG-LLOYD", "Our Reference: 12345", "Deadline Location Date / Time", "Summary: 1x45GP",
      "DEMO VESSEL 001N", "SHEKOU", "NAGOYA, JAPAN", opening, "SI CUT-OFF: 21-Oct-2026 12:00",
      "FCL delivery cut-off: 22-Oct-2026 12:00", "ETD: 23-Oct-2026 12:00", "ETA: 27-Oct-2026 12:00",
    ].join("\n");
    expect(needsAiSoExtraction(complete, text)).toBe(false);
    expect(needsAiSoExtraction(complete, text.replace("Summary: 1x45GP", "Summary: 1x40HC"))).toBe(true);
  });

});

it("核验 OOCL 的原文柜型和箱量，保留 HQ 后缀", () => {
  const text = "DESPATCH QUANTITY FCL QTY SIZE/TYPE : 1 X 40HQ";
  expect(hasContainerEvidence(text, [{ containerType: "40HQ", quantity: 1 }])).toBe(true);
  expect(hasContainerEvidence(text, [{ containerType: "40HQ", quantity: 2 }])).toBe(false);
  expect(hasContainerEvidence(text, [{ containerType: "40HC", quantity: 1 }])).toBe(false);
});
