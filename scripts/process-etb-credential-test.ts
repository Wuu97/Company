import { acceptShekouAgreement } from "../src/lib/shekou-login";
import { chromium, type BrowserContext, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { getDataSourceCredential } from "../src/lib/data-source-credentials";
import { getEtbSourceConfig } from "../src/lib/etb-source-config";
import { restoreEtbSession, saveEtbSession } from "../src/lib/etb-browser-session";
import { acquireProfileLock, disableYantianBrowserPasswordSaving, isYantianLoggedInPage } from "../src/lib/yantian-browser";
import { isShekouLoggedInPage } from "../src/lib/shekou-browser";
import { prisma } from "../src/lib/prisma";

function argument(name: string) { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : undefined; }
async function screenshot(page: Page, id: string) {
  const root = resolve(process.env.FILE_STORAGE_ROOT || "uploads", "etb-credential-tests");
  await mkdir(root, { recursive: true });
  const key = `etb-credential-tests/${id}.png`;
  await page.screenshot({ path: resolve(process.env.FILE_STORAGE_ROOT || "uploads", key), fullPage: true });
  return key;
}
export async function processCredentialTestRun(id: string) {
  const claimed = await prisma.etbCredentialTestRun.updateMany({ where: { id, status: "PENDING" }, data: { status: "RUNNING", startedAt: new Date() } });
  if (claimed.count !== 1) return;
  const run = await prisma.etbCredentialTestRun.findUnique({ where: { id }, include: { credential: true } });
  if (!run) throw new Error("测试任务不存在");
  let context: BrowserContext | undefined;
  let page: Page | undefined;
  let release: (() => Promise<void>) | undefined;
  try {
    const config = getEtbSourceConfig(run.terminal);
    // Snake-port verification and ETB queries share the same protected profile.
    const profile = run.terminal === "蛇口"
      ? resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles", "蛇口")
      : resolve(".runtime/etb-credential-tests", id);
    release = await acquireProfileLock(profile);
    await disableYantianBrowserPasswordSaving(profile);
    context = await chromium.launchPersistentContext(profile, { executablePath: process.env.ETB_CHROME_EXECUTABLE_PATH || undefined, headless: run.terminal === "盐田", viewport: { width: 1200, height: 800 } });
    if (run.terminal === "蛇口") await restoreEtbSession(context, profile);
    page = context.pages()[0] || await context.newPage();
    page.setDefaultTimeout(15_000);
    const credential = await getDataSourceCredential(config.terminal);
    await page.goto(config.homeUrl, { waitUntil: "domcontentloaded" });
    const alreadyLoggedIn = (run.terminal === "盐田" ? isYantianLoggedInPage : isShekouLoggedInPage)(await page.locator("body").innerText());
    if (!alreadyLoggedIn) {
    const loginLink = page.getByText(/立即登录|登录/).first();
    if (run.terminal === "盐田" && await loginLink.count()) await loginLink.click();
    const username = page.locator('input[placeholder*="用户名"], input[placeholder*="账号"], input[name*="user" i], input[id*="user" i]').first();
    const password = page.locator('input[type="password"]').first();
    const submit = page.getByRole("button", { name: /^登录$/ }).first();
    await password.waitFor({ state: "visible", timeout: 15_000 });
    if (!await username.count() || !await password.count() || !await submit.count()) throw new Error("无法识别登录表单；该平台选择器尚未完成技术验证");
    await username.fill(credential.username); await password.fill(credential.password);
    if (run.terminal === "蛇口") {
      await acceptShekouAgreement(page);
    }
    await submit.click(); await page.waitForTimeout(3000);
    const image = await screenshot(page, id);
    const body = await page.locator("body").innerText();
    if (/机器人|人机验证|验证码|安全验证|请依次点击|拖动滑块|滑动验证/.test(body) || (run.terminal === "蛇口" && !isShekouLoggedInPage(body))) {
      if (run.terminal === "盐田") throw new Error("盐田平台本次要求人工验证，无头验证无法继续，请使用可视化浏览器完成登录");
      await prisma.etbCredentialTestRun.update({ where: { id }, data: { status: "AWAITING_MANUAL", errorMessage: "请在验证浏览器中确认登录协议并完成人工验证码", screenshotStorageKey: image } });
      await prisma.operationLog.create({ data: { action: "ETB_CREDENTIAL_TEST_AWAITING_MANUAL", entityType: "EtbCredentialTestRun", entityId: id, after: { terminal: run.terminal } } });
      console.log("需要人工验证；请在打开的 Worker 浏览器完成验证，系统确认后会自动保存会话并关闭浏览器。");
      const deadline = Date.now() + 5 * 60_000;
      while (Date.now() < deadline && !page.isClosed()) {
        const text = await page.locator("body").innerText();
        if ((run.terminal === "盐田" ? isYantianLoggedInPage : isShekouLoggedInPage)(text)) break;
        await page.waitForTimeout(1500);
      }
    }
    }
    if (page.isClosed()) throw new Error("验证浏览器已关闭，请重新测试连接");
    const finalText = await page.locator("body").innerText();
    if (!(run.terminal === "盐田" ? isYantianLoggedInPage : isShekouLoggedInPage)(finalText)) throw new Error("未确认登录成功，请检查账号密码或完成人工验证后重试");
    if (run.terminal === "蛇口") await saveEtbSession(context, profile);
    const finalImage = await screenshot(page, id);
    await prisma.etbCredentialTestRun.update({ where: { id }, data: { status: "SUCCEEDED", errorMessage: null, screenshotStorageKey: finalImage, finishedAt: new Date() } });
    await prisma.operationLog.create({ data: { action: "ETB_CREDENTIAL_TEST_SUCCEEDED", entityType: "EtbCredentialTestRun", entityId: id, after: { terminal: run.terminal } } });
  } catch (error) {
    const image = page ? await screenshot(page, id).catch(() => undefined) : undefined;
    await prisma.etbCredentialTestRun.update({ where: { id }, data: { status: "FAILED", errorMessage: error instanceof Error ? error.message : "未知登录测试失败", screenshotStorageKey: image, finishedAt: new Date() } });
    throw error;
  } finally { if (context) await context.close().catch(() => undefined); await release?.(); }
}
async function main() {
  const id = argument("--run");
  if (!id) throw new Error("用法：tsx scripts/process-etb-credential-test.ts --run <测试任务ID>");
  await processCredentialTestRun(id);
}
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
