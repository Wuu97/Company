import { describe, expect, it } from "vitest";
import { decryptCredential, encryptCredential } from "./credential-crypto";

describe("source credential encryption", () => {
  it("encrypts and authenticates a password", () => {
    const before = process.env.ETB_CREDENTIAL_ENCRYPTION_KEY;
    process.env.ETB_CREDENTIAL_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64url");
    const encrypted = encryptCredential("secret-password");
    expect(encrypted.ciphertext).not.toContain("secret-password");
    expect(decryptCredential(encrypted)).toBe("secret-password");
    if (before === undefined) delete process.env.ETB_CREDENTIAL_ENCRYPTION_KEY; else process.env.ETB_CREDENTIAL_ENCRYPTION_KEY = before;
  });
});
