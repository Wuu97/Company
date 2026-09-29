import { describe, expect, it } from "vitest";
import { isLoginBlocked, mayDeactivateAdmin } from "./login-security";

describe("account safety controls", () => {
  it("blocks the sixth login attempt inside the rate-limit window", () => {
    expect(isLoginBlocked(4)).toBe(false);
    expect(isLoginBlocked(5)).toBe(true);
  });
  it("preserves at least one active administrator", () => {
    expect(mayDeactivateAdmin(1)).toBe(false);
    expect(mayDeactivateAdmin(2)).toBe(true);
  });
});
