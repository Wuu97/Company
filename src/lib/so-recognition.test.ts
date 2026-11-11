import { describe, expect, it, vi } from "vitest";
import { normalizeSoCarrier, decodeSoReply, calculateSoDeadline, normalizeSoContainers, recognizeSoDocument, type SoCandidate, type SoDocument } from "./so-recognition";

function document(lines: string[]): SoDocument {
  return { text: lines.join("\n"), rows: lines.map((text, index) => ({ page: 1, y: 700 - index * 15, cells: [{ x: 10, text }] })), images: [] };
}
function candidate(field: SoCandidate["field"], value: string, quote: string, row: number, basis: SoCandidate["basis"] = "explicit"): SoCandidate {
  return { field, value, quote, rowIds: [row], basis };
}
const identity = candidate("soNumber", "DEMO123456", "Booking No: DEMO123456", 1);

describe("AI SO recognition workflow", () => {
  it("rechecks a printed pickup region misreported as absent and preserves its query note", async () => {
    const doc = document(["Booking No: DEMO123456", "Pick up Place: YANTIAN", "请在平台查询提柜地点"]);
    const absentFields = ["carrier", "vesselName", "voyage", "loadPort", "dischargePort", "containers", "openingText", "siCutoffText", "portCutoffText", "cutoffText", "emptyPickupLocation", "fullReturnLocation"];
    const request = vi.fn()
      .mockResolvedValueOnce({ candidates: [identity], absentFields })
      .mockResolvedValueOnce({ candidates: [{ ...candidate("emptyPickupLocation", "YANTIAN（盐田，具体堆场需查询）", "Pick up Place: YANTIAN...请在平台查询提柜地点", 2), rowIds: [2, 3] }] });
    const result = await recognizeSoDocument(doc, request);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[1][0].thinking).toBe(true);
    expect(result.values.emptyPickupLocation).toBe("YANTIAN（盐田，具体堆场需查询）");
    expect(result.extraction.decisions.emptyPickupLocation.status).toBe("source");
    expect(request.mock.calls[0][0].system).toContain("including a city, port, or region");
  });

  it("prefers latest departures, preserves date precision, and normalizes equipment", async () => {
    const doc = document(["Booking No: DEMO123456", "Proforma ETD: 29Sep26", "Latest ETD: 02Oct26", "Summary: 1x45GP", "Hapag-Lloyd"]);
    const request = vi.fn().mockResolvedValue({
      candidates: [identity, candidate("carrier", "HAPAG-LLOYD", "Hapag-Lloyd", 5),
        candidate("etdText", "2026-09-29", "Proforma ETD: 29Sep26", 2, "proforma"),
        candidate("etdText", "2026-10-02", "Latest ETD: 02Oct26", 3, "latest"),
        candidate("containers", "1x45GP", "Summary: 1x45GP", 4)],
      absentFields: ["carrier", "vesselName", "voyage", "loadPort", "dischargePort", "openingText", "siCutoffText", "portCutoffText", "cutoffText", "emptyPickupLocation", "fullReturnLocation"],
    });
    const result = await recognizeSoDocument(doc, request);
    expect(result.values.etdText).toBe("2026-10-02");
    expect(result.values.containers).toEqual([{ containerType: "40HC", quantity: 1 }]);
    expect(result.extraction.ai.values.etdText).toBe("2026-10-02");
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("thinks through a conditional deadline and recomputes its date", async () => {
    const clause = "台湾航线请于周五12点前补料";
    const doc = document(["Booking No: DEMO123456", "CLOSING DATE: 14-Nov-2026 12:00", clause]);
    const requiredAbsent = ["carrier", "vesselName", "voyage", "loadPort", "dischargePort", "containers", "openingText", "cutoffText", "emptyPickupLocation", "fullReturnLocation"];
    const request = vi.fn()
      .mockResolvedValueOnce({ candidates: [identity, candidate("portCutoffText", "2026-11-14 12:00", doc.rows[1].cells[0].text, 2)], absentFields: requiredAbsent, unresolved: ["siCutoffText"] })
      .mockResolvedValueOnce({ candidates: [{ field: "siCutoffText", value: "2026-11-13 12:00", basis: "clause", quote: clause, rowIds: [3],
        calculation: { anchor: "portCutoffText", kind: "weekday_on_or_before", weekday: 5, time: "12:00" } }] });
    const result = await recognizeSoDocument(doc, request);
    expect(request.mock.calls[1][0].thinking).toBe(true);
    expect(result.values.siCutoffText).toBe("2026-11-13 12:00");
    expect(result.values.siCutoffSource).toBe("AI_RULE");
    expect(result.extraction.decisions.openingText.status).toBe("estimated");
    expect(result.values.openingText).toBe("2026-11-07 12:00");
  });

  it("does not replace failed clause reasoning with the two-day default", async () => {
    const doc = document(["Booking No: DEMO123456", "CY Closing: 14-Nov-2026 12:00", "台湾周五12点前补料"]);
    const request = vi.fn()
      .mockResolvedValueOnce({ candidates: [identity, candidate("portCutoffText", "2026-11-14 12:00", doc.rows[1].cells[0].text, 2)], unresolved: ["siCutoffText"] })
      .mockRejectedValueOnce(new Error("timeout"));
    const result = await recognizeSoDocument(doc, request);
    expect(result.values.siCutoffText).toBeNull();
    expect(result.extraction.parseReview.conflictingFields).toContain("siCutoffText");
    expect(result.extraction.attempts[1].error).toBe("timeout");
  });

  it("retries malformed first-pass output without falling back to legacy extraction", async () => {
    const request = vi.fn().mockResolvedValueOnce({ fields: {} }).mockResolvedValueOnce({ candidates: [identity],
      absentFields: ["carrier", "vesselName", "voyage", "loadPort", "dischargePort", "containers", "openingText", "siCutoffText", "portCutoffText", "cutoffText", "emptyPickupLocation", "fullReturnLocation"] });
    expect((await recognizeSoDocument(document(["Booking No: DEMO123456"]), request)).values.soNumber).toBe("DEMO123456");
    expect(request).toHaveBeenCalledTimes(2);
    await expect(recognizeSoDocument(document(["Booking No: DEMO123456"]), vi.fn().mockRejectedValue(new Error("offline")))).rejects.toThrow("offline");
  });
});


it("normalizes equipment codes, quantity order, and duplicate equipment entries", () => {
  expect(normalizeSoCarrier("T.S. LINES")).toBe("TS LINES");
  expect(normalizeSoCarrier("Ocean Network Express (East Asia) Ltd. - Hong Kong")).toBe("ONE");
  expect(normalizeSoContainers("40' DRY HC x 1")).toEqual([{ containerType: "40HC", quantity: 1 }]);
  expect(normalizeSoContainers("1 x 4H")).toEqual([{ containerType: "40HC", quantity: 1 }]);
  expect(normalizeSoContainers("1 x 40HQ; 2 x 40HC")).toEqual([{ containerType: "40HC", quantity: 3 }]);
  expect(normalizeSoContainers("1x45GP", "HAPAG-LLOYD")).toEqual([{ containerType: "40HC", quantity: 1 }]);
  expect(normalizeSoContainers("forty boxes")).toBeUndefined();
});

it("rejects a computed value that disagrees with its operation", () => {
  const proposal: SoCandidate = { field: "vgmCutoffText", value: "2026-10-08 12:00", quote: "截重前12小时", rowIds: [1], basis: "clause",
    calculation: { anchor: "portCutoffText", kind: "hour_offset", hours: -12 } };
  const decisions = { portCutoffText: { status: "source" as const, value: "2026-10-08 08:00", evidence: [], rowIds: [] } };
  expect(calculateSoDeadline(proposal, decisions)).toBeUndefined();
  expect(calculateSoDeadline({ ...proposal, value: "2026-10-07 20:00" }, decisions)?.value).toBe("2026-10-07 20:00");
});

it("computes explicit hour clauses with no model-proposed timestamp", () => {
  const proposal: SoCandidate = { field: "vgmCutoffText", value: null, quote: "截重前12小时", rowIds: [1], basis: "clause",
    calculation: { anchor: "portCutoffText", kind: "hour_offset", hours: -12 } };
  expect(calculateSoDeadline(proposal, {
    portCutoffText: { status: "source", value: "2026-10-08 08:00", evidence: [], rowIds: [] },
  })?.value).toBe("2026-10-07 20:00");
});

it("keeps first-pass evidence and triggers specialist review for same-rank conflicts", async () => {
  const doc = document(["Booking No: DEMO123456", "CY Closing: 14-Nov-2026 12:00", "CY Closing: 15-Nov-2026 12:00"]);
  const request = vi.fn()
    .mockResolvedValueOnce({ candidates: [identity,
      candidate("portCutoffText", "2026-11-14 12:00", doc.rows[1].cells[0].text, 2),
      candidate("portCutoffText", "2026-11-15 12:00", doc.rows[2].cells[0].text, 3)] })
    .mockResolvedValueOnce({ candidates: [], unresolved: ["portCutoffText"] });
  const result = await recognizeSoDocument(doc, request);
  expect(request.mock.calls[1][0].thinking).toBe(true);
  expect(result.values.portCutoffText).toBeUndefined();
  expect(result.extraction.parseReview.conflictingFields).toContain("portCutoffText");
  expect(result.extraction.candidates).toHaveLength(3);
});

it("accepts a page-cited visual fact and ignores malformed optional metadata", () => {
  const doc = { ...document(["Booking No: DEMO123456"]), images: ["data:image/png;base64,test"] };
  const reply = decodeSoReply({
    candidates: [{ field: "carrier", value: "TS LINES", quote: "T.S. LINES", basis: "explicit", page: 1, rowIds: [] }],
    unresolved: ["SI needs route-specific interpretation", "siCutoffText"],
    absentFields: [{ field: "emptyPickupLocation" }],
  }, doc);
  expect(reply.candidates[0].value).toBe("TS LINES");
  expect(reply.unresolved).toEqual(["siCutoffText"]);
  expect(reply.absentFields).toEqual(["emptyPickupLocation"]);
  expect(decodeSoReply({ candidates: [{ ...reply.candidates[0], page: 2 }] }, doc).rejected).toHaveLength(1);
});

it("supports the model's compact hour-offset calculation shape", () => {
  const doc = document(["VGM 截止时间：截重前12个小时"]);
  const reply = decodeSoReply({ candidates: [{
    field: "vgmCutoffText", basis: "clause", value: null, quote: doc.text,
    rowIds: [1], calculation: { anchor: "portCutoffText", hours: -12 },
  }] }, doc);
  expect(reply.candidates[0].calculation).toMatchObject({ kind: "hour_offset", hours: -12 });
});
