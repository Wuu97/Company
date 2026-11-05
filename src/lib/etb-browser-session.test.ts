import { describe, it, expect, vi, afterEach } from "vitest";
import { mkdtemp, writeFile, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { BrowserContext } from "@playwright/test";
import { restoreEtbSession, saveEtbSession } from "./etb-browser-session";

const dirs: string[] = [];
afterEach(async () => { await Promise.all(dirs.splice(0).map(path => rm(path, { recursive: true, force: true }))); });
async function directory() { const dir = await mkdtemp(join(tmpdir(), "etb-session-")); dirs.push(dir); return dir; }
describe("ETB persistent session", () => {
  it("restores session cookies but omits expired cookies", async () => {
    const dir = await directory();
    const cookies = [{ name: "session", expires: -1 }, { name: "expired", expires: 1 }];
    const origins = [{ origin: "https://eport.cmp1872.com", localStorage: [{ name: "session", value: "test" }] }];
    await writeFile(join(dir, "session-state.json"), JSON.stringify({ cookies, origins }));
    const context = { addCookies: vi.fn(), addInitScript: vi.fn() };
    await restoreEtbSession(context as unknown as BrowserContext, dir);
    expect(context.addCookies).toHaveBeenCalledWith([cookies[0]]);
    expect(context.addInitScript.mock.calls[0][1]).toEqual(origins);
  });
  it("allows a first login without any stored state", async () => {
    const context = { addCookies: vi.fn() };
    await restoreEtbSession(context as unknown as BrowserContext, await directory());
    expect(context.addCookies).not.toHaveBeenCalled();
  });
  it("saves session state with restricted file permissions", async () => {
    const dir = await directory();
    const state = { cookies: [], origins: [] };
    await saveEtbSession({ storageState: vi.fn().mockResolvedValue(state) } as unknown as BrowserContext, dir);
    expect(JSON.parse(await readFile(join(dir, "session-state.json"), "utf8"))).toEqual(state);
    expect((await stat(join(dir, "session-state.json"))).mode & 0o777).toBe(0o600);
  });
});
