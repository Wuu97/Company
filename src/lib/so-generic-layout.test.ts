import { describe, expect, it } from "vitest";
import { detectFieldConflict, extractGenericLayout, selectFieldCandidate } from "./so-generic-layout";

describe("generic SO table layout extraction", () => {
  it("extracts labelled values below a bilingual table header with evidence", () => {
    const result = extractGenericLayout("S/O No.(订舱号) CN07017228\nOcean Vessel/Voy(船名/航次)\nKMTC OSAKA / 2610N\nPort Of Loading(装货港)\nSHEKOU,CHINA Freight & Charges\nPort Of Discharge(卸货港)\nINCHEON,KOREA Hazardous cargo\n40 HC X 1\nETD(预计开船日)\n2026/10/09");
    expect(result.fields).toMatchObject({ soNumber: "CN07017228", vesselName: "KMTC OSAKA", voyage: "2610N", loadPort: "SHEKOU,CHINA", dischargePort: "INCHEON,KOREA", etdText: "2026/10/09", containers: [{ containerType: "40HC", quantity: 1 }] });
    expect(result.confidence.vesselName).toBeGreaterThan(0.9);
    expect(result.evidence.loadPort).toContain("SHEKOU,CHINA");
  });
  it("does not pick one of two equally strong conflicting candidates", () => {
    const candidates = [{ value: "A", confidence: 0.9, evidence: "a" }, { value: "B", confidence: 0.9, evidence: "b" }];
    expect(selectFieldCandidate(candidates)).toBeUndefined();
    expect(detectFieldConflict(candidates)).toMatchObject({ values: ["A", "B"], confidence: 0.9 });
  });
  it("retains ambiguous label values for manual review instead of filling the field", () => {
    const result = extractGenericLayout("Port Of Loading(装货港)\nSHEKOU,CHINA\nPort Of Loading(装货港)\nYANTIAN,CHINA");
    expect(result.fields.loadPort).toBeUndefined();
    expect(result.conflicts.loadPort).toMatchObject({ values: ["SHEKOU,CHINA", "YANTIAN,CHINA"], confidence: 0.9 });
  });
  it("supports inline values and common Chinese shipping labels", () => {
    const result = extractGenericLayout("订舱编号：BK-26001\n船名/航次：EVER ACE / 123E\n起运港：YANTIAN, CHINA\n目的港：HAMBURG, GERMANY\nETD：2026-11-03\nETA：2026-11-28");
    expect(result.fields).toMatchObject({ soNumber: "BK-26001", vesselName: "EVER ACE", voyage: "123E", loadPort: "YANTIAN, CHINA", dischargePort: "HAMBURG, GERMANY", etdText: "2026-11-03", etaText: "2026-11-28" });
  });
  it("extracts month-name dates and flattened container table rows", () => {
    const result = extractGenericLayout("Booking No: BK-26002\nVessel/Voyage: OCEAN STAR / 8W12\nETD: 03-NOV-2026 18:30\nETA\n28.11.2026\nContainer summary\n2 40HQ\n1 20GP");
    expect(result.fields).toMatchObject({ etdText: "03-NOV-2026 18:30", etaText: "28.11.2026", containers: [{ containerType: "40HC", quantity: 2 }, { containerType: "20GP", quantity: 1 }] });
  });
  it("keeps side-by-side loading and discharge ports distinct in flattened tables", () => {
    const result = extractGenericLayout("Port Of Loading(装货港)   Port Of Discharge(卸货港)\nSHEKOU, CHINA   INCHEON, KOREA");
    expect(result.fields).toMatchObject({ loadPort: "SHEKOU, CHINA", dischargePort: "INCHEON, KOREA" });
    expect(result.confidence.loadPort).toBe(0.96);
  });
  it("recognizes POL/POD columns that contain only UN/LOCODE values", () => {
    const result = extractGenericLayout("POL    POD\nCNSHK  KRINC");
    expect(result.fields).toMatchObject({ loadPort: "CNSHK", dischargePort: "KRINC" });
  });
});
