import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ findUnique: vi.fn(), decrypt: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { dataSourceCredential: { findUnique: mocks.findUnique } } }));
vi.mock("@/lib/credential-crypto", () => ({ decryptCredential: mocks.decrypt }));
import { getDataSourceCredential } from "./data-source-credentials";
beforeEach(() => vi.clearAllMocks());
describe("platform activation", () => {
  it("rejects disabled accounts before decrypting a password", async () => {
    mocks.findUnique.mockResolvedValue({ active: false, username: "account" });
    await expect(getDataSourceCredential("盐田")).rejects.toThrow("已停用");
    expect(mocks.decrypt).not.toHaveBeenCalled();
  });
  it("allows enabled accounts", async () => {
    mocks.findUnique.mockResolvedValue({ active: true, username: "account" });
    mocks.decrypt.mockReturnValue("password");
    await expect(getDataSourceCredential("盐田")).resolves.toEqual({ username: "account", password: "password" });
  });
});
