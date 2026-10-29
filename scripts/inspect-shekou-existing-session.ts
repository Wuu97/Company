import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import { acquireProfileLock, disableYantianBrowserPasswordSaving } from "../src/lib/yantian-browser";
import { safeShekouUrl } from "../src/lib/shekou-browser";

async function main() {
  const profile = resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles", "蛇口");
  const release = await acquireProfileLock(profile);
  let context: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | undefined;
  try {
    await disableYantianBrowserPasswordSaving(profile);
    context = await chromium.launchPersistentContext(profile, { executablePath: process.env.ETB_CHROME_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: false, viewport: { width: 1440, height: 960 }, args: ["--disable-save-password-bubble", "--disable-features=PasswordManagerOnboarding"] });
    const pages = context.pages();
    const report = await Promise.all(pages.map(async page => ({
      url: safeShekouUrl(page.url()), title: await page.title().catch(() => ""),
      frames: await Promise.all(page.frames().map(async frame => ({
        url: safeShekouUrl(frame.url()),
        controls: await frame.locator("input, button, .vxe-table, table").evaluateAll(nodes => nodes.map(node => ({ tag: node.tagName, text: (node.textContent || "").trim().slice(0, 80), value: (node as HTMLInputElement).value || "", className: node.className })).slice(0, 80)).catch(() => []),
      }))),
    })));
    console.log(JSON.stringify({ terminal: "蛇口", event: "existing_session_dom_sample", report, disconnected: !(context.browser()?.isConnected() ?? false) }));
  } finally { await context?.close().catch(() => undefined); await release(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
