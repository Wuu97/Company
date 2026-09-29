import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { getEtbSourceConfig } from "../src/lib/etb-source-config";
import { getDataSourceCredential } from "../src/lib/data-source-credentials";

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const terminal = argument("--terminal");
  if (!terminal) throw new Error("用法：tsx scripts/open-etb-browser-worker.ts --terminal 盐田|蛇口");
  const config = getEtbSourceConfig(terminal);
  const automaticLogin = process.argv.includes("--login");
  const profileRoot = resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles");
  const profilePath = resolve(profileRoot, config.terminal);
  await mkdir(profilePath, { recursive: true });

  // Deliberately headed: a staff member must complete the site's login or robot check.
  const context = await chromium.launchPersistentContext(profilePath, { headless: false, viewport: { width: 1440, height: 960 } });
  const page = context.pages()[0] || await context.newPage();
  await page.goto(automaticLogin ? config.homeUrl : (config.queryUrl || config.homeUrl), { waitUntil: "domcontentloaded" });
  if (automaticLogin) {
    const { username, password } = await getDataSourceCredential(config.terminal);

    const loginLink = page.getByRole("link", { name: /登录/ }).first();
    if (await loginLink.count()) await loginLink.click();
    const userInput = page.locator('input[placeholder*="用户名"], input[name*="user" i], input[id*="user" i]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    if (!await userInput.count() || !await passwordInput.count()) throw new Error("未找到可验证的登录表单；请先完成该平台的选择器技术验证。");
    await userInput.fill(username);
    await passwordInput.fill(password);
    const submit = page.getByRole("button", { name: /^登录$/ }).first();
    if (!await submit.count()) throw new Error("未找到登录提交按钮；请先完成该平台的选择器技术验证。");
    await submit.click();
    await page.waitForTimeout(1500);
    const visibleText = await page.locator("body").innerText();
    if (/机器人|人机验证|验证码|安全验证/.test(visibleText)) {
      console.log(JSON.stringify({ status: "AWAITING_MANUAL", reason: "站点要求机器人或验证码验证，Worker 已保留页面等待员工处理。" }));
    }
  }
  console.log(JSON.stringify({ terminal: config.terminal, source: config.source, profilePath, automaticLogin, automationStatus: config.automationStatus }));
  console.log("机器人验证、验证码和扫码必须由员工完成；不要保存密码到浏览器。完成后关闭浏览器，持久化会话将仅保存在该 Worker 的配置目录。");
  await new Promise<void>(resolve => context.on("close", () => resolve()));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
