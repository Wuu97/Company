import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { getEtbSourceConfig } from "../src/lib/etb-source-config";
import { acquireProfileLock, disableYantianBrowserPasswordSaving, formatYantianQueryDate, isYantianLoggedInPage, navigateYantian, protectedProfilePath, safeYantianUrl, shouldRetryYantianFailure, yantianVesselQuerySelectors } from "../src/lib/yantian-browser";
import { getDataSourceCredential } from "../src/lib/data-source-credentials";
import { isShekouLoggedInPage, isShekouPublicScheduleInitialized, isShekouScheduleFrameBlank, navigateShekou, safeShekouUrl, shouldRetryShekouFailure } from "../src/lib/shekou-browser";
import { assertShekouConditionsCleared, determineShekouClearStrategy } from "../src/lib/shekou-public-schedule";

function argument(name: string) { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : undefined; }
const sleep = (ms: number) => new Promise(done => setTimeout(done, ms));

async function clearShekouPublicScheduleConditions(frame: import("@playwright/test").Frame) {
  const inputs = frame.locator("input.ivu-input-with-suffix, input.vxe-input--inner");
  const before = await inputs.evaluateAll(nodes => nodes.filter(node => {
    const style = window.getComputedStyle(node);
    return style.display !== "none" && style.visibility !== "hidden";
  }).map((node, index) => ({ index, value: (node as HTMLInputElement).value || "", readOnly: (node as HTMLInputElement).readOnly, hasClearIcon: Boolean(node.parentElement?.querySelector(".ivu-icon-ios-close-circle, .ivu-icon-ios-close")) })));
  for (const input of before) {
    const strategy = determineShekouClearStrategy({ value: input.value, hasClearIcon: input.hasClearIcon, isReadOnly: input.readOnly });
    if (strategy === "INPUT_CLEAR_ICON") {
      await inputs.nth(input.index).locator("xpath=..").locator(".ivu-icon-ios-close-circle, .ivu-icon-ios-close").first().click({ timeout: 5_000 });
    } else if (strategy === "NORMAL_INPUT_CLEAR") {
      await inputs.nth(input.index).fill("");
    } else if (strategy === "RESET_FORM") {
      const reset = frame.getByRole("button", { name: "重置", exact: true });
      await reset.click({ timeout: 5_000 });
    }
  }
  const after = await inputs.evaluateAll(nodes => nodes.filter(node => {
    const style = window.getComputedStyle(node);
    return style.display !== "none" && style.visibility !== "hidden";
  }).map((node, index) => ({ [`field${index}`]: (node as HTMLInputElement).value || "" })).reduce((all, field) => ({ ...all, ...field }), {}));
  assertShekouConditionsCleared(after);
  return { before, after };
}

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

async function openYantianVesselQuery(page: import("@playwright/test").Page, context: import("@playwright/test").BrowserContext, homeUrl: string) {
  // 盐田 creates its short-lived query authorization only when its own public
  // homepage link is clicked. Do not reconstruct or log that parameter.
  const response = await page.goto(homeUrl, { waitUntil: "commit", timeout: 15_000 });
  await page.waitForTimeout(750);
  const bodyText = await page.locator("body").innerText().catch(() => "");
  const entryCandidates = await page.locator("a, button, [role=link]").evaluateAll(nodes => nodes.map((node: Element) => ({ text: (node.textContent || "").trim(), href: node.getAttribute("href") || "" })).filter(item => /船期公众查询|voyQuery/i.test(item.text + item.href))).catch(() => []);
  console.log(JSON.stringify({ terminal: "盐田", event: "query_entry_candidates", httpStatus: response?.status() ?? null, finalUrl: safeYantianUrl(page.url()), title: await page.title(), visibleText: bodyText.slice(0, 600), frames: page.frames().map(frame => safeYantianUrl(frame.url())), entryCandidates: entryCandidates.map(item => ({ ...item, href: safeYantianUrl(item.href) })), disconnected: !(context.browser()?.isConnected() ?? false) }));
  const entry = page.getByText(/船期公众查询\s*\(?船名航次\)?/).last();
  await entry.waitFor({ state: "visible", timeout: 15_000 });
  const popup = context.waitForEvent("page", { timeout: 15_000 });
  await entry.click({ timeout: 15_000 });
  const queryPage = await popup;
  const startedAt = Date.now();
  try {
    await queryPage.locator(yantianVesselQuerySelectors.vessel).waitFor({ state: "visible", timeout: 15_000 });
  } catch (error) {
    const visibleText = await queryPage.locator("body").innerText().catch(() => "");
    console.log(JSON.stringify({ terminal: "盐田", event: "query_page_not_ready", elapsedMs: Date.now() - startedAt, httpStatus: null, finalUrl: safeYantianUrl(queryPage.url()), title: await queryPage.title().catch(() => ""), visibleText: visibleText.slice(0, 1000), requestFailures: [], disconnected: !(context.browser()?.isConnected() ?? false) }));
    throw error;
  }
  console.log(JSON.stringify({ terminal: "盐田", event: "query_page_ready", elapsedMs: Date.now() - startedAt, httpStatus: null, finalUrl: safeYantianUrl(queryPage.url()), title: await queryPage.title(), disconnected: !(context.browser()?.isConnected() ?? false) }));
  return queryPage;
}

async function runAuthorizedYantianTestQuery(page: import("@playwright/test").Page, vessel: string, voyage: string, queryDate: Date, pauseBeforeSubmitMs = 0) {
  await page.locator(yantianVesselQuerySelectors.date).fill(formatYantianQueryDate(queryDate));
  await page.locator(yantianVesselQuerySelectors.vessel).fill(vessel);
  await page.locator(yantianVesselQuerySelectors.voyage).fill(voyage);
  console.log(JSON.stringify({ terminal: "盐田", event: "query_form_filled", queryDate: formatYantianQueryDate(queryDate), vessel, voyage, pauseBeforeSubmitMs }));
  if (pauseBeforeSubmitMs > 0) await page.waitForTimeout(pauseBeforeSubmitMs);
  const startedAt = Date.now();
  const queryResponses: Array<{ url: string; status: number }> = [];
  const observeResponse = (response: import("@playwright/test").Response) => {
    if (response.url().includes("voyQuery")) queryResponses.push({ url: safeYantianUrl(response.url()), status: response.status() });
  };
  page.on("response", observeResponse);
  await page.locator(yantianVesselQuerySelectors.submit).click();
  console.log(JSON.stringify({ terminal: "盐田", event: "query_submit_clicked", submittedAt: new Date().toISOString() }));
  await page.waitForTimeout(2_000);
  const rows = await page.locator(yantianVesselQuerySelectors.resultRows).allInnerTexts();
  page.off("response", observeResponse);
  if (rows.length <= 1) {
    const visibleText = await page.locator("body").innerText().catch(() => "");
    throw new Error(`盐田查询未返回数据行（可能无匹配或页面拒绝查询）；HTTP=${queryResponses.map(item => item.status).join(",") || "未观察到"}；${visibleText.match(/总记录数：\s*\d+/)?.[0] || "未找到记录数"}。未保存 ETB 数据。`);
  }
  const matchedRows = rows.filter(row => row.includes(vessel) && row.includes(voyage));
  if (!matchedRows.length) throw new Error("盐田查询已返回页面，但结果未包含授权测试船名和航次；未保存 ETB 数据。");
  const evidence = page.locator("table").filter({ hasText: vessel }).filter({ hasText: voyage }).first();
  await evidence.waitFor({ state: "visible", timeout: 5_000 });
  const evidenceRoot = resolve(process.env.ETB_EVIDENCE_ROOT || ".runtime/etb-evidence", "yantian");
  await mkdir(evidenceRoot, { recursive: true, mode: 0o700 });
  const screenshotPath = resolve(evidenceRoot, `authorized-test-${Date.now()}.png`);
  await evidence.screenshot({ path: screenshotPath });
  console.log(JSON.stringify({ terminal: "盐田", event: "authorized_test_query_verified", elapsedMs: Date.now() - startedAt, resultCount: matchedRows.length, screenshotPath, finalUrl: safeYantianUrl(page.url()), title: await page.title() }));
}

async function runYantianWorker() {
  const config = getEtbSourceConfig("盐田");
  const profileRoot = resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles");
  const profilePath = protectedProfilePath(profileRoot);
  const release = await acquireProfileLock(profilePath);
  const executablePath = process.env.ETB_CHROME_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  let context: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | undefined;
  try {
    await disableYantianBrowserPasswordSaving(profilePath);
    context = await chromium.launchPersistentContext(profilePath, {
      executablePath,
      headless: false,
      viewport: { width: 1440, height: 960 },
      // Platform credentials are encrypted by this application. Chrome must not
      // create a second, browser-managed copy or show an overlay that can
      // intercept controlled-page clicks.
      args: ["--disable-save-password-bubble", "--disable-features=PasswordManagerOnboarding"],
    });
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
        console.log(JSON.stringify({ terminal: "盐田", event: "credential_login_finished", loggedIn, finalUrl: safeYantianUrl(page.url()), title: await page.title() }));
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
    console.log(JSON.stringify({ terminal: "盐田", event: "logged_in_feature_verified", finalUrl: safeYantianUrl(page.url()), title: await page.title() }));
    const vessel = argument("--test-vessel"), voyage = argument("--test-voyage"), testDate = argument("--test-date"), inspectQuery = process.argv.includes("--inspect-query");
    const pauseBeforeSubmitMs = Number(argument("--pause-before-submit-ms") || "0");
    if (!Number.isInteger(pauseBeforeSubmitMs) || pauseBeforeSubmitMs < 0 || pauseBeforeSubmitMs > 60_000) throw new Error("--pause-before-submit-ms 必须为 0 至 60000 的整数。");
    if (Boolean(vessel) !== Boolean(voyage)) throw new Error("真实盐田测试必须同时提供 --test-vessel 与 --test-voyage；未提交查询。");
    if (inspectQuery && (vessel || voyage)) throw new Error("--inspect-query 仅检查查询页，不能与真实查询参数同时使用。");
    if (inspectQuery) await openYantianVesselQuery(page, context, config.queryLandingUrl || config.homeUrl);
    if (vessel && voyage) {
      const queryDate = testDate ? new Date(`${testDate}T00:00:00+08:00`) : new Date();
      if (Number.isNaN(queryDate.getTime())) throw new Error("--test-date 必须为 YYYY-MM-DD；未提交查询。");
      const queryPage = await openYantianVesselQuery(page, context, config.queryLandingUrl || config.homeUrl);
      await runAuthorizedYantianTestQuery(queryPage, vessel, voyage, queryDate, pauseBeforeSubmitMs);
    }
  } finally { await context?.close().catch(() => undefined); await release(); }
}

async function runShekouWorker() {
  const config = getEtbSourceConfig("蛇口");
  const profileRoot = resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles");
  const profilePath = resolve(profileRoot, "蛇口");
  const release = await acquireProfileLock(profilePath);
  const executablePath = process.env.ETB_CHROME_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const inspectQuery = process.argv.includes("--inspect-query");
  let context: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | undefined;
  try {
    await disableYantianBrowserPasswordSaving(profilePath);
    context = await chromium.launchPersistentContext(profilePath, { executablePath, headless: false, viewport: { width: 1440, height: 960 }, args: ["--disable-save-password-bubble", "--disable-features=PasswordManagerOnboarding"] });
    const page = context.pages()[0] || await context.newPage();
    let diagnostic;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try { diagnostic = await navigateShekou(page, () => context?.browser()?.isConnected() ?? false, inspectQuery ? (config.queryLandingUrl || config.homeUrl) : config.homeUrl); break; }
      catch (error) {
        if (attempt === 1 || !shouldRetryShekouFailure(error)) throw error;
        console.log(JSON.stringify({ terminal: "蛇口", event: "navigation_retry", attempt: attempt + 1, reason: error instanceof Error ? error.message : String(error) }));
      }
    }
    if (!diagnostic) throw new Error("蛇口页面导航未返回诊断信息");
    const visibleText = await page.locator("body").innerText().catch(() => "");
    console.log(JSON.stringify({ terminal: "蛇口", source: config.source, event: "page_ready", diagnostic, loggedIn: isShekouLoggedInPage(visibleText) }));
    if (diagnostic.pageState === "EXCEPTION") throw new Error("蛇口 ePort 未进入可用业务页面；不提交登录或查询。请人工在受控浏览器选择“蛇口集装箱码头”服务后再继续技术验证。");
    let loggedIn = isShekouLoggedInPage(visibleText);
    if (!loggedIn && process.argv.includes("--login")) {
      const credential = await getDataSourceCredential("蛇口");
      const username = page.locator('input[placeholder="请输入用户名"]:not([disabled])').first();
      const password = page.locator('input[placeholder="请输入密码"]:not([disabled])').first();
      await username.waitFor({ state: "visible", timeout: 15_000 });
      await password.waitFor({ state: "visible", timeout: 15_000 });
      await username.fill(credential.username);
      await password.fill(credential.password);
      const agreement = page.locator("label.ivu-checkbox-wrapper", { hasText: "阅读条款并同意" }).first();
      await agreement.waitFor({ state: "visible", timeout: 10_000 });
      if (!await agreement.locator("input.ivu-checkbox-input").isChecked().catch(() => false)) await agreement.click({ timeout: 10_000 });
      await page.getByRole("button", { name: /^登录$/ }).click({ timeout: 15_000 });
      console.log(JSON.stringify({ terminal: "蛇口", event: "credential_login_submitted", finalUrl: safeShekouUrl(page.url()), title: await page.title(), reason: "已预填账号密码并提交；若出现图形验证码，请员工在受控浏览器手动完成。" }));
    }
    if (!loggedIn) {
      if (process.argv.includes("--no-await-login")) return;
      const deadline = Date.now() + 15 * 60_000;
      while (Date.now() < deadline && !page.isClosed()) {
        await sleep(2000);
        const text = await page.locator("body").innerText().catch(() => "");
        if (/机器人|人机验证|验证码|安全验证/i.test(text)) console.log(JSON.stringify({ terminal: "蛇口", event: "captcha_manual_action_required", finalUrl: safeShekouUrl(page.url()), title: await page.title() }));
        if (isShekouLoggedInPage(text)) { loggedIn = true; console.log(JSON.stringify({ terminal: "蛇口", event: "manual_login_verified", finalUrl: safeShekouUrl(page.url()), title: await page.title() })); break; }
      }
      if (!loggedIn) throw new Error("等待蛇口人工登录验证超时；未尝试绕过验证码，保留待验收状态。");
    }
    if (!inspectQuery) return;
    await page.waitForFunction(() => {
      const text = document.body?.innerText || "";
      return !/\bLoading\b/i.test(text) && (/我的主页|常用功能|工作台/.test(text));
    }, undefined, { timeout: 30_000 }).catch(() => undefined);
    const homeTab = page.getByText("我的主页", { exact: true }).filter({ visible: true }).first();
    if (await homeTab.isVisible().catch(() => false)) {
      await homeTab.click({ timeout: 15_000 });
      await page.getByText("公共船期查询", { exact: true }).filter({ visible: true }).first().waitFor({ state: "visible", timeout: 20_000 });
    }
    const entry = page.getByText("公共船期查询", { exact: true }).filter({ visible: true }).first();
    if (!await entry.isVisible().catch(() => false)) {
      const bodyText = (await page.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ").trim();
      const frames = page.frames().map(frame => safeShekouUrl(frame.url()));
      const visibleInputs = await page.locator("input:visible, textarea:visible, select:visible").evaluateAll(nodes => nodes.map(node => ({
        placeholder: node.getAttribute("placeholder"), name: node.getAttribute("name"), className: node.getAttribute("class"), value: (node as HTMLInputElement).value?.slice(0, 120),
      })).slice(0, 30));
      const activeTab = await page.getByText("开舱/截关时间查询", { exact: true }).evaluate(node => ({
        outer: node.parentElement?.outerHTML.slice(0, 4000),
        ancestor: node.parentElement?.parentElement?.outerHTML.slice(0, 5000),
      })).catch(() => null);
      const clickable = await page.locator("a, button, [role=button], .ivu-menu-item, .ivu-card, [onclick]").evaluateAll(nodes => nodes.map(node => ({
        text: (node.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 160),
        tag: node.tagName.toLowerCase(),
        href: node.getAttribute("href"),
        className: node.getAttribute("class"),
      })).filter(item => item.text).slice(0, 120));
      console.log(JSON.stringify({ terminal: "蛇口", event: "public_schedule_entry_not_visible", finalUrl: safeShekouUrl(page.url()), title: await page.title(), bodyText: bodyText.slice(0, 3000), frames, visibleInputs, activeTab, clickable, disconnected: !(context.browser()?.isConnected() ?? false) }));
      throw new Error("蛇口首页未找到可见的公共船期查询入口；已记录可点击项，未尝试猜测点击。");
    }
    await entry.click({ timeout: 15_000 });
    const frameDeadline = Date.now() + 15_000;
    let scheduleFrame = page.frames().find(frame => /scct-query\/VesselSchedule/.test(frame.url()));
    while (!scheduleFrame && Date.now() < frameDeadline && !page.isClosed()) {
      await sleep(250);
      scheduleFrame = page.frames().find(frame => /scct-query\/VesselSchedule/.test(frame.url()));
    }
    if (!scheduleFrame) throw new Error("公共船期查询 iframe 未加载；未提交查询。");
    try {
      await scheduleFrame.locator("input.ivu-input-with-suffix:not([readonly])").first().waitFor({ state: "visible", timeout: 30_000 });
    } catch (error) {
      const bodyHtml = await scheduleFrame.locator("body").innerHTML().catch(() => "");
      const blankFrame = isShekouScheduleFrameBlank(bodyHtml);
      console.log(JSON.stringify({ terminal: "蛇口", event: blankFrame ? "public_schedule_frame_blank_manual_handoff_required" : "query_form_not_ready", finalUrl: safeShekouUrl(page.url()), title: await page.title(), visibleText: (await scheduleFrame.locator("body").innerText().catch(() => "")).slice(0, 3000), bodyHtml: bodyHtml.slice(0, 10_000), frames: page.frames().map(frame => safeShekouUrl(frame.url())), disconnected: !(context.browser()?.isConnected() ?? false), retryAllowed: false }));
      if (blankFrame && process.argv.includes("--manual-handoff")) {
        const deadline = Date.now() + 15 * 60_000;
        console.log(JSON.stringify({ terminal: "蛇口", event: "manual_handoff_browser_open", deadline: new Date(deadline).toISOString(), instruction: "请员工在此受控浏览器手动进入公共船期查询并完成一次查询；Worker 不会填写、点击或保存数据。" }));
        while (Date.now() < deadline && !page.isClosed()) {
          await sleep(2_000);
          const activeFrame = page.frames().find(frame => /scct-query\/VesselSchedule/.test(frame.url()));
          const hasResultRegion = activeFrame ? await activeFrame.locator(".vxe-table, .vxe-table--body-wrapper, .vxe-grid, [role=grid], table").count().then(Boolean).catch(() => false) : false;
          if (hasResultRegion) {
            console.log(JSON.stringify({ terminal: "蛇口", event: "manual_handoff_result_region_detected", finalUrl: safeShekouUrl(page.url()), frameUrl: safeShekouUrl(activeFrame!.url()) }));
            return;
          }
        }
        throw new Error("蛇口人工接管等待超时；未自动操作页面，未提交或保存 ETB。");
      }
      if (blankFrame) throw new Error("蛇口公共船期 iframe 为空，平台未完成页面渲染；已停止自动重试并需人工接管，未提交查询或保存 ETB。");
      throw error;
    }
    const formFields = await scheduleFrame.locator("input, select, textarea, button, [role=combobox]").evaluateAll(nodes => nodes.filter(node => {
      const style = window.getComputedStyle(node);
      return style.display !== "none" && style.visibility !== "hidden" && node.getAttribute("type") !== "hidden";
    }).map((node: Element) => ({ tag: node.tagName.toLowerCase(), placeholder: node.getAttribute("placeholder"), name: node.getAttribute("name"), type: node.getAttribute("type"), className: node.className, parentText: (node.parentElement?.parentElement?.innerText || "").trim().slice(0, 120), outer: node.outerHTML.slice(0, 500), container: node.closest(".ivu-form-item, .vxe-form--item, .vxe-form--item-inner, .ivu-select, .vxe-input, .vxe-table--filter-wrapper")?.outerHTML.slice(0, 3000) || node.parentElement?.parentElement?.parentElement?.outerHTML.slice(0, 3000) })).slice(0, 20));
    const initialized = isShekouPublicScheduleInitialized({ hasVessel: await scheduleFrame.locator("input.ivu-input-with-suffix:not([readonly])").count().then(Boolean), hasQuery: await scheduleFrame.getByRole("button", { name: "查询", exact: true }).count().then(Boolean), hasResultRegion: await scheduleFrame.locator(".vxe-table, .vxe-table--body-wrapper, .vxe-grid, [role=grid], table").count().then(Boolean) });
    console.log(JSON.stringify({ terminal: "蛇口", event: initialized ? "public_schedule_form_ready" : "public_schedule_partial_render_manual_handoff_required", finalUrl: safeShekouUrl(page.url()), title: await page.title(), frameUrls: page.frames().map(frame => safeShekouUrl(frame.url())), frameText: (await scheduleFrame.locator("body").innerText()).slice(0, 5000), formFields, initialized, disconnected: !(context.browser()?.isConnected() ?? false) }));
    if (!initialized) throw new Error("蛇口公共船期页面未完成业务初始化；不清空条件、不输入或提交查询，转人工接管。");
    const vesselProbe = argument("--test-vessel");
    if (!vesselProbe) return;
    const cleared = await clearShekouPublicScheduleConditions(scheduleFrame);
    console.log(JSON.stringify({ terminal: "蛇口", event: "query_conditions_cleared", ...cleared }));
    const vesselInput = scheduleFrame.locator("input.ivu-input-with-suffix:not([readonly])").first();
    await vesselInput.fill(vesselProbe);
    await page.waitForTimeout(5_000);
    const voyageCandidates = await scheduleFrame.locator(".ivu-select-dropdown:visible, .vxe-select--option:visible, .vxe-pulldown--content:visible").allTextContents().catch(() => []);
    const vesselControl = await vesselInput.evaluate(node => ({ parent: node.parentElement?.outerHTML.slice(0, 2000), grandparent: node.parentElement?.parentElement?.outerHTML.slice(0, 3000) }));
    console.log(JSON.stringify({ terminal: "蛇口", event: "vessel_filled_for_voyage_probe", vessel: vesselProbe, voyageCandidates: voyageCandidates.map(value => value.slice(0, 1500)), vesselControl, finalUrl: safeShekouUrl(page.url()) }));
  } finally { await context?.close().catch(() => undefined); await release(); }
}

async function main() { const terminal = argument("--terminal"); if (!terminal) throw new Error("用法：tsx scripts/open-etb-browser-worker.ts --terminal 盐田|蛇口 [--login] [--no-await-login]"); if (terminal === "盐田") return runYantianWorker(); if (terminal === "蛇口") return runShekouWorker(); throw new Error("仅支持盐田或蛇口"); }
main().catch(error => { console.error(error); process.exitCode = 1; });
