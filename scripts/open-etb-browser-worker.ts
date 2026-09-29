import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import { getEtbSourceConfig } from "../src/lib/etb-source-config";
import { acquireProfileLock, isYantianLoggedInPage, navigateYantian, protectedProfilePath, shouldRetryYantianFailure } from "../src/lib/yantian-browser";
import { getDataSourceCredential } from "../src/lib/data-source-credentials";

function argument(name: string) { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : undefined; }
const sleep = (ms: number) => new Promise(done => setTimeout(done, ms));

async function fillYantianLogin(page: import("@playwright/test").Page) {
  const credential = await getDataSourceCredential("盐田");
  const loginEntry = page.getByText(/立即登录|登录/).first();
  await loginEntry.click({ timeout: 10_000 });
  const username = page.locator('input[placeholder*="用户名"], input[name*="user" i], input[id*="user" i]').first();
  const password = page.locator('input[type="password"]').first();
  const submit = page.getByRole("button", { name: /^登录$/ }).first();
  await username.waitFor({ state: "visible", timeout: 10_000 });
  await password.waitFor({ state: "visible", timeout: 10_000 });
  await submit.waitFor({ state: "visible", timeout: 10_000 });
  await username.fill(credential.username);
  await password.fill(credential.password);
  await submit.click();
}

async function runYantianWorker() {
  const config = getEtbSourceConfig("盐田");
  const profileRoot = resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles");
  const profilePath = protectedProfilePath(profileRoot);
  const release = await acquireProfileLock(profilePath);
  const executablePath = process.env.ETB_CHROME_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  let context: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | undefined;
  try {
    context = await chromium.launchPersistentContext(profilePath, { executablePath, headless: false, viewport: { width: 1440, height: 960 } });
    const page = context.pages()[0] || await context.newPage();
    let diagnostic;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try { diagnostic = await navigateYantian(page, () => context?.browser()?.isConnected() ?? false, config.queryUrl || config.homeUrl); break; }
      catch (error) {
        if (attempt === 1 || !shouldRetryYantianFailure(error)) throw error;
        console.log(JSON.stringify({ terminal: "盐田", event: "navigation_retry", attempt: attempt + 1, reason: error instanceof Error ? error.message : String(error) }));
      }
    }
    if (!diagnostic) throw new Error("盐田页面导航未返回诊断信息");
    let visibleText = await page.locator("body").innerText();
    let loggedIn = isYantianLoggedInPage(visibleText);
    console.log(JSON.stringify({ terminal: "盐田", source: config.source, event: "page_ready", diagnostic, loggedIn }));
    if (diagnostic.pageState === "ROBOT_VERIFICATION_REQUIRED") throw new Error("盐田平台要求验证码或机器人验证；请由员工在该受控浏览器完成后再运行验证。");
    if (!loggedIn) {
      if (process.argv.includes("--login")) {
        console.log(JSON.stringify({ terminal: "盐田", event: "credential_login_started" }));
        await fillYantianLogin(page);
        await page.waitForTimeout(1500);
        visibleText = await page.locator("body").innerText();
        if (/机器人|人机验证|验证码|安全验证/i.test(visibleText)) throw new Error("盐田平台要求人工完成验证码；Worker 未尝试绕过。");
        loggedIn = isYantianLoggedInPage(visibleText);
        console.log(JSON.stringify({ terminal: "盐田", event: "credential_login_finished", loggedIn, finalUrl: page.url(), title: await page.title() }));
      }
    }
    if (!loggedIn) {
      console.log("盐田页面尚未显示已登录特征。请由员工在打开的受控浏览器手动完成登录及验证码；Worker 不会填写或记录凭据。");
      if (process.argv.includes("--no-await-login")) return;
      const deadline = Date.now() + 15 * 60_000;
      while (Date.now() < deadline && !page.isClosed()) {
        await sleep(2000);
        const text = await page.locator("body").innerText().catch(() => "");
        if (isYantianLoggedInPage(text)) { console.log(JSON.stringify({ terminal: "盐田", event: "manual_login_verified", verifiedAt: new Date().toISOString() })); return; }
        if (/机器人|人机验证|验证码|安全验证/i.test(text)) throw new Error("登录流程需要人工完成验证码；未尝试绕过。");
      }
      throw new Error("等待人工登录验证超时；保留待验收状态。");
    }
    console.log(JSON.stringify({ terminal: "盐田", event: "logged_in_feature_verified", finalUrl: page.url(), title: await page.title() }));
    const vessel = argument("--test-vessel"), voyage = argument("--test-voyage");
    if (vessel || voyage) throw new Error("盐田查询选择器及结果字段尚待真实已登录页面确认；未执行测试船名/航次查询，也未模拟成功结果。");
  } finally { await context?.close().catch(() => undefined); await release(); }
}

async function runLegacyWorker(terminal: string) {
  // 蛇口保留现有人工受控入口，不受盐田独立 Worker 改造影响。
  const config = getEtbSourceConfig(terminal);
  const profileRoot = resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles");
  const context = await chromium.launchPersistentContext(resolve(profileRoot, config.terminal), { headless: false, viewport: { width: 1440, height: 960 } });
  const page = context.pages()[0] || await context.newPage();
  await page.goto(config.queryUrl || config.homeUrl, { waitUntil: "domcontentloaded" });
  console.log(JSON.stringify({ terminal: config.terminal, source: config.source, automationStatus: config.automationStatus }));
  await new Promise<void>(done => context.on("close", () => done()));
}

async function main() { const terminal = argument("--terminal"); if (!terminal) throw new Error("用法：tsx scripts/open-etb-browser-worker.ts --terminal 盐田|蛇口 [--login] [--no-await-login]"); if (terminal === "盐田") return runYantianWorker(); return runLegacyWorker(terminal); }
main().catch(error => { console.error(error); process.exitCode = 1; });
