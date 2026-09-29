import { describe, expect, it } from "vitest";
import { getEtbSourceConfig } from "./etb-source-config";

describe("ETB source configuration", () => {
  it("keeps Yantian in technical-verification mode", () => {
    expect(getEtbSourceConfig("盐田")).toMatchObject({ source: "YANTIAN_CONTROLLED_BROWSER", authentication: "LOGIN_REQUIRED", credentialEnvPrefix: "ETB_YANTIAN", automationStatus: "PENDING_TECHNICAL_VERIFICATION" });
  });
  it("rejects unapproved terminals", () => {
    expect(() => getEtbSourceConfig("上海")).toThrow("仅支持盐田或蛇口");
  });
});
