import { describe, expect, it } from "vitest";
import { inferEtbTerminal } from "./etb-terminal";

describe("ETB 码头推断", () => {
  it("supports terminal names and UN/LOCODE values extracted from SO files", () => {
    expect(inferEtbTerminal("SHEKOU, CHINA")).toBe("蛇口");
    expect(inferEtbTerminal("CNSHK")).toBe("蛇口");
    expect(inferEtbTerminal("CNYTN (YANTIAN)")).toBe("盐田");
    expect(inferEtbTerminal("DA CHAN BAY")).toBe("大铲湾");
    expect(inferEtbTerminal("KRINC")).toBeUndefined();
  });
});
