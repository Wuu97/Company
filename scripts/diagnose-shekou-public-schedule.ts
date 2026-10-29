import { chromium, type ConsoleMessage, type Frame, type Page } from "@playwright/test";
import { resolve } from "node:path";
import { acquireProfileLock, disableYantianBrowserPasswordSaving } from "../src/lib/yantian-browser";
import { isShekouLoggedInPage, safeShekouUrl } from "../src/lib/shekou-browser";

const schedulePath = /scct-query\/VesselSchedule/;
const homeUrl = "https://wk-eport.cmp1872.com/#/main/home";
const now = () => new Date().toISOString();
const arg = (name: string) => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1]; };
const log = (event: string, data: Record<string, unknown> = {}) => console.log(JSON.stringify({ terminal: "蛇口", diagnostic: true, at: now(), event, ...data }));

function attach(page: Page) {
  page.on("frameattached", frame => log("frame_attached", { url: safeShekouUrl(frame.url()) }));
  page.on("framenavigated", frame => log("frame_navigated", { url: safeShekouUrl(frame.url()), isSchedule: schedulePath.test(frame.url()) }));
  page.on("framedetached", frame => log("frame_detached", { url: safeShekouUrl(frame.url()) }));
  page.on("requestfailed", request => log("request_failed", { url: safeShekouUrl(request.url()), error: request.failure()?.errorText || "unknown", resourceType: request.resourceType() }));
  page.on("response", response => {
    if (schedulePath.test(response.url()) || /scct-query|VesselSchedule/.test(response.url())) log("schedule_resource_response", { url: safeShekouUrl(response.url()), status: response.status(), resourceType: response.request().resourceType() });
  });
  page.on("pageerror", error => log("page_error", { message: error.message }));
  page.on("console", (message: ConsoleMessage) => {
    if (["error", "warning"].includes(message.type())) log("console", { type: message.type(), text: message.text().slice(0, 1000), location: message.location() });
  });
}

async function waitForScheduleFrame(page: Page, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const frame = page.frames().find(candidate => schedulePath.test(candidate.url()));
    if (frame) return frame;
    await page.waitForTimeout(250);
  }
  return undefined;
}

async function inspectFrame(frame: Frame | undefined, mode: string) {
  if (!frame) return log("schedule_frame_missing", { mode });
  const html = await frame.locator("body").innerHTML().catch(() => "");
  const controls = await frame.locator("input, button, [role=button]").evaluateAll(nodes => nodes.filter(node => {
    const style = window.getComputedStyle(node); return style.display !== "none" && style.visibility !== "hidden";
  }).map(node => ({ tag: node.tagName, text: (node.textContent || "").trim(), value: (node as HTMLInputElement).value || "", readOnly: (node as HTMLInputElement).readOnly, className: node.className })).slice(0, 40)).catch(() => []);
  const hasVessel = controls.some(control => /ivu-input-with-suffix/.test(String(control.className)) && !control.readOnly);
  const hasQuery = controls.some(control => control.text === "查询");
  const hasResultRegion = await frame.locator(".vxe-table--body-wrapper, .vxe-grid, table").count().catch(() => 0) > 0;
  log("schedule_frame_inspected", { mode, url: safeShekouUrl(frame.url()), htmlLength: html.length, hasVessel, hasQuery, hasResultRegion, controls, initialized: hasVessel && hasQuery && hasResultRegion });
}

async function openByMenu(page: Page) {
  await page.goto(homeUrl, { waitUntil: "commit", timeout: 15_000 });
  await page.waitForFunction(() => /我的主页|常用功能/.test(document.body?.innerText || ""), undefined, { timeout: 15_000 });
  const homeTab = page.getByText("我的主页", { exact: true }).filter({ visible: true }).first();
  if (await homeTab.isVisible().catch(() => false)) await homeTab.click();
  const entry = page.getByText("公共船期查询", { exact: true }).filter({ visible: true }).first();
  await entry.waitFor({ state: "visible", timeout: 15_000 });
  await entry.click();
}

async function main() {
  const mode = arg("--mode") || "menu";
  const headless = process.argv.includes("--headless");
  const directUrl = arg("--direct-url");
  if (!['menu', 'direct'].includes(mode)) throw new Error("--mode 仅支持 menu 或 direct");
  if (mode === "direct" && !directUrl) throw new Error("直接访问诊断必须提供已由平台菜单产生的 --direct-url；不会构造地址。");
  const profile = resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles", "蛇口");
  const release = await acquireProfileLock(profile);
  let context: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | undefined;
  try {
    await disableYantianBrowserPasswordSaving(profile);
    context = await chromium.launchPersistentContext(profile, { executablePath: process.env.ETB_CHROME_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless, viewport: { width: 1440, height: 960 }, args: ["--disable-save-password-bubble", "--disable-features=PasswordManagerOnboarding"] });
    const page = context.pages()[0] || await context.newPage();
    attach(page);
    await page.goto(homeUrl, { waitUntil: "commit", timeout: 15_000 });
    await page.waitForFunction(() => /我的主页|常用功能|工作台|登录\/注册|账号登录|用户名|验证码|安全验证/.test(document.body?.innerText || ""), undefined, { timeout: 15_000 }).catch(() => undefined);
    const text = await page.locator("body").innerText().catch(() => "");
    const loggedIn = isShekouLoggedInPage(text);
    log("session_checked", { headless, loggedIn, finalUrl: safeShekouUrl(page.url()), title: await page.title(), bodyText: text.slice(0, 1000), disconnected: !(context.browser()?.isConnected() ?? false) });
    if (!loggedIn) throw new Error(/验证码|安全验证/.test(text) ? "平台要求人工验证码；诊断停止。" : "未观察到已登录业务特征；可能会话失效或工作台初始化失败，诊断停止。");
    if (mode === "menu") await openByMenu(page); else await page.goto(directUrl!, { waitUntil: "commit", timeout: 15_000 });
    const frame = await waitForScheduleFrame(page, 15_000);
    await inspectFrame(frame, mode);
  } finally { await context?.close().catch(() => undefined); await release(); }
}
main().catch(error => { log("diagnostic_failed", { message: error instanceof Error ? error.message : String(error) }); process.exitCode = 1; });
