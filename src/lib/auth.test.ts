import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./passwords";
import { assertSessionConfigured } from "./session-config";

describe("password hashing", () => {
  it("verifies a correct password without preserving it", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).not.toContain("correct horse");
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong", hash)).resolves.toBe(false);
  });
});

describe("session configuration", () => {
  it("rejects the deployment placeholder before an account is created", () => {
    expect(() => assertSessionConfigured("replace-with-a-long-random-secret")).toThrow("SESSION_SECRET");
  });
});
