import { chromium, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { getDataSourceCredential } from "../src/lib/data-source-credentials";
import { getEtbSourceConfig } from "../src/lib/etb-source-config";
import { prisma } from "../src/lib/prisma";

function argument(name: string) { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : undefined; }
async function screenshot(page: Page, id: string) {
  const root = resolve(process.env.FILE_STORAGE_ROOT || "uploads", "etb-credential-tests");
  await mkdir(root, { recursive: true });
  const key = `etb-credential-tests/${id}.png`;
  await page.screenshot({ path: resolve(process.env.FILE_STORAGE_ROOT || "uploads", key), fullPage: true });
  return key;
}
async function loginFormVisible(page: Page) { return (await page.locator('input[type="password"]').count()) > 0; }
export async function processCredentialTestRun(id: string) {
  const claimed = await prisma.etbCredentialTestRun.updateMany({ where: { id, status: "PENDING" }, data: { status: "RUNNING", startedAt: new Date() } });
  if (claimed.count !== 1) throw new Error("测试任务不存在或已被其他 Worker 领取");
  const run = await prisma.etbCredentialTestRun.findUnique({ where: { id }, include: { credential: true } });
  if (!run) throw new Error("测试任务不存在");
  const config = getEtbSourceConfig(run.terminal);
  const profile = resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles", config.terminal);
  const context = await chromium.launchPersistentContext(profile, { headless: false, viewport: { width: 1440, height: 960 } });
  const page = context.pages()[0] || await context.newPage();
  try {
    const credential = await getDataSourceCredential(config.terminal);
    await page.goto(config.homeUrl, { waitUntil: "domcontentloaded" });
    const loginLink = page.getByRole("link", { name: /登录/ }).first();
    if (await loginLink.count()) await loginLink.click();
    const username = page.locator('input[placeholder*="用户名"], input[name*="user" i], input[id*="user" i]').first();
    const password = page.locator('input[type="password"]').first();
    const submit = page.getByRole("button", { name: /^登录$/ }).first();
    if (!await username.count() || !await password.count() || !await submit.count()) throw new Error("无法识别登录表单；该平台选择器尚未完成技术验证");
    await username.fill(credential.username); await password.fill(credential.password); await submit.click(); await page.waitForTimeout(1800);
    const image = await screenshot(page, id);
    const body = await page.locator("body").innerText();
    if (/机器人|人机验证|验证码|安全验证/.test(body)) {
      await prisma.etbCredentialTestRun.update({ where: { id }, data: { status: "AWAITING_MANUAL", errorMessage: "平台要求人工完成验证码或机器人验证", screenshotStorageKey: image } });
      await prisma.operationLog.create({ data: { action: "ETB_CREDENTIAL_TEST_AWAITING_MANUAL", entityType: "EtbCredentialTestRun", entityId: id, after: { terminal: run.terminal } } });
      console.log("需要人工验证；请在打开的 Worker 浏览器完成验证后关闭浏览器。");
      await new Promise<void>(done => context.on("close", () => done()));
      return;
    }
    if (await loginFormVisible(page)) throw new Error("登录未成功，请核对账号密码或页面选择器");
    await prisma.etbCredentialTestRun.update({ where: { id }, data: { status: "SUCCEEDED", screenshotStorageKey: image, finishedAt: new Date() } });
    await prisma.operationLog.create({ data: { action: "ETB_CREDENTIAL_TEST_SUCCEEDED", entityType: "EtbCredentialTestRun", entityId: id, after: { terminal: run.terminal } } });
  } catch (error) {
    const image = await screenshot(page, id).catch(() => undefined);
    await prisma.etbCredentialTestRun.update({ where: { id }, data: { status: "FAILED", errorMessage: error instanceof Error ? error.message : "未知登录测试失败", screenshotStorageKey: image, finishedAt: new Date() } });
    throw error;
  } finally { if (context.pages().length) await context.close().catch(() => undefined); }
}
async function main() {
  const id = argument("--run");
  if (!id) throw new Error("用法：tsx scripts/process-etb-credential-test.ts --run <测试任务ID>");
  await processCredentialTestRun(id);
}
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
