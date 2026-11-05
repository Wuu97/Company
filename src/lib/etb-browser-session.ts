import type { BrowserContext } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Profile contains IndexedDB and browser metadata; state also preserves session cookies.
export async function restoreEtbSession(context: BrowserContext, profile: string) {
  let state: Awaited<ReturnType<BrowserContext["storageState"]>>;
  try { state = JSON.parse(await readFile(resolve(profile, "session-state.json"), "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return; throw error; }
  await context.addCookies(state.cookies.filter(cookie => cookie.expires === -1 || cookie.expires * 1000 > Date.now()));
  await context.addInitScript(origins => {
    const origin = origins.find(item => item.origin === location.origin);
    for (const item of origin?.localStorage || []) { if (localStorage.getItem(item.name) === null) localStorage.setItem(item.name, item.value); }
  }, state.origins);
}
export async function saveEtbSession(context: BrowserContext, profile: string) {
  const state = await context.storageState();
  await writeFile(resolve(profile, "session-state.json"), JSON.stringify(state), { mode: 0o600 });
}
