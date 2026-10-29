import { chromium, type Frame, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { prisma } from "@/lib/prisma";
import { EtbManualHandoffRequiredError, etbQueryFailureState, type EtbQueryResult } from "@/lib/etb-query";
import { getEtbSourceConfig } from "@/lib/etb-source-config";
import { acquireProfileLock, disableYantianBrowserPasswordSaving, formatYantianQueryDate, isYantianLoggedInPage, protectedProfilePath, yantianVesselQuerySelectors } from "@/lib/yantian-browser";
import { parseYantianEtb, parseYantianScheduleTable, uniqueExactYantianScheduleMatch } from "@/lib/yantian-schedule-result";
import { isShekouLoggedInPage, navigateShekou, requiresShekouManualHandoff } from "@/lib/shekou-browser";
import { assertShekouConditionsCleared, assertShekouResultRefreshed, determineShekouClearStrategy, resultFingerprint, selectExactShekouVessel, uniqueExactShekouScheduleMatch } from "@/lib/shekou-public-schedule";
import { parseShekouEtb, parseShekouScheduleTable } from "@/lib/shekou-schedule-result";
import { DEFAULT_ETB_RUN_LEASE_MS, staleEtbRunBefore } from "@/lib/etb-query-lease";
import { notifyActiveUsers } from "@/lib/notifications";
import { etbRunAlert } from "@/lib/etb-run-alert";
import { isRetryableEtbError, retryDelayMs } from "@/lib/etb-query-throttle";

type Run = { id: string; terminal: string; source: string; targetSailingId: string | null; batchOffset: number };
type Sailing = { id: string; carrier: string; vesselName: string; voyage: string };
const arg = (name: string) => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1]; };
const captchaPattern = /机器人|人机验证|验证码|安全验证|请依次点击|滑动验证/i;
const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

async function recoverStaleRunningRuns() {
  const configuredLeaseMs = Number(process.env.ETB_RUN_LEASE_MS);
  const leaseMs = Number.isFinite(configuredLeaseMs) && configuredLeaseMs > 0 ? configuredLeaseMs : DEFAULT_ETB_RUN_LEASE_MS;
  const recovered = await prisma.etbQueryRun.updateMany({
    where: { status: "RUNNING", startedAt: { lt: staleEtbRunBefore(new Date(), leaseMs) } },
    data: { status: "PENDING", startedAt: null, sessionState: "NOT_REQUIRED", errorMessage: "Worker 租约超时，已自动重新排队。", handoffReason: null, retryAfter: null },
  });
  if (recovered.count) console.log(JSON.stringify({ event: "stale_etb_runs_requeued", count: recovered.count, leaseMs }));
}

async function claim(terminal?: string): Promise<Run | undefined> {
  const run = await prisma.etbQueryRun.findFirst({ where: { status: "PENDING", ...(terminal ? { terminal } : {}) }, select: { id: true, terminal: true, source: true, targetSailingId: true, batchOffset: true }, orderBy: { createdAt: "asc" } });
  if (!run) return undefined;
  const updated = await prisma.etbQueryRun.updateMany({ where: { id: run.id, status: "PENDING" }, data: { status: "RUNNING", startedAt: new Date(), errorMessage: null, handoffReason: null } });
  return updated.count === 1 ? run : undefined;
}

async function openQuery(page: Page) {
  const config = getEtbSourceConfig("盐田");
  await page.goto(config.queryLandingUrl || config.homeUrl, { waitUntil: "commit", timeout: 20_000 });
  const entry = page.getByText(/船期公众查询\s*\(?船名航次\)?/).last();
  await entry.waitFor({ state: "visible", timeout: 20_000 });
  const popup = page.context().waitForEvent("page", { timeout: 20_000 });
  await entry.click({ timeout: 20_000 });
  const query = await popup;
  await query.locator(yantianVesselQuerySelectors.vessel).waitFor({ state: "visible", timeout: 20_000 });
  return query;
}

async function readTables(page: Page) {
  return page.locator("table").evaluateAll(tables => tables.map(table => {
    const rows = Array.from(table.querySelectorAll("tr")).map(row => Array.from(row.querySelectorAll("th,td")).map(cell => (cell.textContent || "").replace(/\s+/g, " ").trim()));
    const headerIndex = rows.findIndex(row => row.some(cell => /船名|航次|ETB|预计靠泊|预计停靠/.test(cell)));
    return headerIndex < 0 ? null : { headers: rows[headerIndex], values: rows.slice(headerIndex + 1).filter(row => row.length) };
  }).filter((item): item is { headers: string[]; values: string[][] } => Boolean(item)));
}

async function queryOne(page: Page, run: Run, sailing: Sailing, index: number): Promise<EtbQueryResult> {
  await page.locator(yantianVesselQuerySelectors.date).fill(formatYantianQueryDate(new Date()));
  await page.locator(yantianVesselQuerySelectors.vessel).fill(sailing.vesselName);
  await page.locator(yantianVesselQuerySelectors.voyage).fill(sailing.voyage);
  // A result must visibly refresh after this specific submission.  Reading a
  // matching row left over from the preceding vessel is never acceptable.
  const before = JSON.stringify(await readTables(page));
  const revision = await page.evaluate(() => {
    const key = "__etbResultRevision" as keyof Window;
    const observed = "__etbResultObserver" as keyof Window;
    const target = window as Window & Record<string, unknown>;
    if (!target[observed]) {
      target[key] = 0;
      target[observed] = new MutationObserver(() => { target[key] = Number(target[key] || 0) + 1; });
      (target[observed] as MutationObserver).observe(document.body, { childList: true, subtree: true, characterData: true });
    }
    return Number(target[key] || 0);
  });
  await page.locator(yantianVesselQuerySelectors.submit).click();
  await page.waitForFunction(previous => Number((window as Window & Record<string, unknown>).__etbResultRevision || 0) > previous, revision, { timeout: 20_000 });
  let current = await readTables(page);
  for (let attempt = 0; attempt < 20 && JSON.stringify(current) === before; attempt += 1) {
    await page.waitForTimeout(250);
    current = await readTables(page);
  }
  if (JSON.stringify(current) === before) throw new Error("盐田结果区域未刷新，禁止读取上一笔 ETB 结果。");
  const rows = current.flatMap(table => parseYantianScheduleTable(table.headers, table.values));
  const match = uniqueExactYantianScheduleMatch(rows, sailing);
  const evidence = page.locator("table").filter({ hasText: sailing.vesselName }).filter({ hasText: sailing.voyage }).first();
  await evidence.waitFor({ state: "visible", timeout: 8_000 });
  const root = resolve(process.env.FILE_STORAGE_ROOT || "./uploads");
  const key = `etb/yantian/${run.id}-${index}.png`;
  await mkdir(resolve(root, "etb", "yantian"), { recursive: true, mode: 0o700 });
  await evidence.screenshot({ path: resolve(root, key) });
  return { carrier: sailing.carrier, vesselName: sailing.vesselName, voyage: sailing.voyage, etbAt: parseYantianEtb(match.etb), sourceUrl: getEtbSourceConfig("盐田").queryLandingUrl, screenshotStorageKey: key };
}

async function submit(run: Run, results: EtbQueryResult[]) {
  const base = process.env.ETB_APP_BASE_URL, token = process.env.ETB_WORKER_TOKEN;
  if (!base || !token) throw new Error("缺少 ETB_APP_BASE_URL 或 ETB_WORKER_TOKEN，无法回传结果。");
  const response = await fetch(new URL(`/api/etb-runs/${run.id}/results`, base), { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ source: run.source, results }) });
  if (!response.ok) throw new Error(`ETB 回传失败：HTTP ${response.status}`);
}

async function queryWithRetry<T>(run: Run, sailing: Sailing, query: () => Promise<T>) {
  const throttle = getEtbSourceConfig(run.terminal).throttle;
  for (let attempt = 1; ; attempt += 1) {
    try { return await query(); }
    catch (error) {
      if (attempt >= throttle.maxAttempts || !isRetryableEtbError(error)) throw error;
      const delayMs = retryDelayMs(throttle, attempt);
      console.warn(JSON.stringify({ event: "etb_query_retry", terminal: run.terminal, runId: run.id, sailingId: sailing.id, attempt, delayMs }));
      await pause(delayMs);
    }
  }
}

async function queueContinuation(run: Run, queried: number, hasMore: boolean) {
  if (run.targetSailingId || !hasMore) return;
  await prisma.etbQueryRun.create({ data: { terminal: run.terminal, source: run.source, scheduledFor: new Date(), batchOffset: run.batchOffset + queried } });
  console.log(JSON.stringify({ event: "etb_batch_continuation_queued", terminal: run.terminal, runId: run.id, nextOffset: run.batchOffset + queried }));
}

/**
 * We deliberately never read the image, calculate click points, or click a
 * verification widget.  The visible isolated browser stays open for an
 * operator; once they complete the challenge, the same authenticated session
 * can continue without re-running the preceding task.
 */
async function awaitManualCaptcha(page: Page, run: Run, terminal: "盐田" | "蛇口") {
  const text = await page.locator("body").innerText().catch(() => "");
  if (!captchaPattern.test(text)) return;
  const root = resolve(process.env.FILE_STORAGE_ROOT || "./uploads");
  const key = `etb/${terminal === "盐田" ? "yantian" : "shekou"}/${run.id}-captcha.png`;
  await mkdir(resolve(root, "etb", terminal === "盐田" ? "yantian" : "shekou"), { recursive: true, mode: 0o700 });
  await page.screenshot({ path: resolve(root, key) });
  const deadline = Date.now() + 15 * 60_000;
  await prisma.etbQueryRun.update({ where: { id: run.id }, data: { status: "AWAITING_MANUAL", sessionState: "ROBOT_VERIFICATION_REQUIRED", errorMessage: "平台要求人工完成图形/点击验证；受控浏览器已保持打开。", handoffReason: "请在受控浏览器完成验证码，Worker 会在验证消失后自动继续。", screenshotStorageKey: key, retryAfter: new Date(deadline) } });
  console.log(JSON.stringify({ event: "captcha_manual_action_required", terminal, runId: run.id, deadline: new Date(deadline).toISOString(), screenshotStorageKey: key }));
  while (Date.now() < deadline && !page.isClosed()) {
    await page.waitForTimeout(1_000);
    const current = await page.locator("body").innerText().catch(() => "");
    if (!captchaPattern.test(current)) {
      await prisma.etbQueryRun.update({ where: { id: run.id, status: "AWAITING_MANUAL" }, data: { status: "RUNNING", sessionState: "ACTIVE", errorMessage: null, handoffReason: null, retryAfter: null } });
      console.log(JSON.stringify({ event: "captcha_manual_action_completed", terminal, runId: run.id }));
      return;
    }
  }
  throw new EtbManualHandoffRequiredError("等待人工完成验证码超时；未尝试自动点击验证内容。", "ROBOT_VERIFICATION_REQUIRED", { screenshotStorageKey: key, retryAfter: new Date(Date.now() + 15 * 60_000) });
}

async function processYantian(run: Run) {
  const throttle = getEtbSourceConfig("盐田").throttle;
  const candidates = await prisma.sailing.findMany({ where: { terminal: "盐田", ...(run.targetSailingId ? { id: run.targetSailingId } : { orders: { some: {} } }) }, select: { id: true, carrier: true, vesselName: true, voyage: true }, orderBy: [{ carrier: "asc" }, { vesselName: "asc" }, { voyage: "asc" }], ...(run.targetSailingId ? {} : { skip: run.batchOffset, take: throttle.batchMaxSailings + 1 }) });
  const hasMore = !run.targetSailingId && candidates.length > throttle.batchMaxSailings;
  const sailings = hasMore ? candidates.slice(0, throttle.batchMaxSailings) : candidates;
  if (!sailings.length) throw new EtbManualHandoffRequiredError("没有可查询的盐田船期，未向平台提交空查询。", "MANUAL_HANDOFF_REQUIRED");
  const profile = protectedProfilePath(resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles"));
  const release = await acquireProfileLock(profile);
  let context: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | undefined;
  try {
    await disableYantianBrowserPasswordSaving(profile);
    context = await chromium.launchPersistentContext(profile, { executablePath: process.env.ETB_CHROME_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: false, viewport: { width: 1440, height: 960 }, args: ["--disable-save-password-bubble", "--disable-features=PasswordManagerOnboarding"] });
    const page = context.pages()[0] || await context.newPage();
    await page.goto(getEtbSourceConfig("盐田").homeUrl, { waitUntil: "domcontentloaded", timeout: 20_000 });
    await awaitManualCaptcha(page, run, "盐田");
    const verifiedText = await page.locator("body").innerText().catch(() => "");
    if (!isYantianLoggedInPage(verifiedText)) throw new EtbManualHandoffRequiredError("盐田受控浏览器会话失效，请人工重新登录。", "EXPIRED");
    const query = await openQuery(page);
    const results: EtbQueryResult[] = [];
    for (const [index, sailing] of sailings.entries()) {
      if (index) await pause(throttle.queryIntervalMs);
      results.push(await queryWithRetry(run, sailing, () => queryOne(query, run, sailing, index)));
    }
    await submit(run, results);
    await queueContinuation(run, sailings.length, hasMore);
  } finally { await context?.close().catch(() => undefined); await release(); }
}

async function openShekouQuery(page: Page): Promise<Frame> {
  const config = getEtbSourceConfig("蛇口");
  await page.goto(config.queryLandingUrl || config.homeUrl, { waitUntil: "commit", timeout: 20_000 });
  await page.waitForFunction(() => /我的主页|常用功能|工作台/.test(document.body?.innerText || ""), undefined, { timeout: 20_000 });
  const home = page.getByText("我的主页", { exact: true }).filter({ visible: true }).first();
  if (await home.isVisible().catch(() => false)) await home.click({ timeout: 10_000 });
  const entry = page.getByText("公共船期查询", { exact: true }).filter({ visible: true }).first();
  await entry.waitFor({ state: "visible", timeout: 20_000 });
  await entry.click({ timeout: 20_000 });
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const frame = page.frames().find(candidate => /scct-query\/VesselSchedule/.test(candidate.url()));
    if (frame && await frame.locator("body").count()) return frame;
    await page.waitForTimeout(250);
  }
  throw new EtbManualHandoffRequiredError("蛇口公共船期 iframe 未加载，不能提交查询。", "MANUAL_HANDOFF_REQUIRED");
}

async function clearShekouConditions(frame: Frame) {
  const inputs = frame.locator("input.ivu-input-with-suffix, input.vxe-input--inner");
  const values = await inputs.evaluateAll(nodes => nodes.filter(node => {
    const style = window.getComputedStyle(node);
    return style.display !== "none" && style.visibility !== "hidden";
  }).map((node, index) => ({ index, value: (node as HTMLInputElement).value || "", readOnly: (node as HTMLInputElement).readOnly, hasClearIcon: Boolean(node.parentElement?.querySelector(".ivu-icon-ios-close-circle, .ivu-icon-ios-close")) })));
  for (const value of values) {
    const strategy = determineShekouClearStrategy(value);
    if (strategy === "INPUT_CLEAR_ICON") await inputs.nth(value.index).locator("xpath=..").locator(".ivu-icon-ios-close-circle, .ivu-icon-ios-close").first().click({ timeout: 5_000 });
    if (strategy === "NORMAL_INPUT_CLEAR") await inputs.nth(value.index).fill("");
    if (strategy === "RESET_FORM") await frame.getByRole("button", { name: "重置", exact: true }).click({ timeout: 5_000 });
  }
  const remaining = await inputs.evaluateAll(nodes => Object.fromEntries(nodes.filter(node => {
    const style = window.getComputedStyle(node);
    return style.display !== "none" && style.visibility !== "hidden";
  }).map((node, index) => [`field${index}`, (node as HTMLInputElement).value || ""])));
  assertShekouConditionsCleared(remaining);
}

async function readShekouTables(frame: Frame) {
  return frame.evaluate(() => {
    const normalize = (value: string | null | undefined) => (value || "").replace(/\s+/g, " ").trim();
    const standard = Array.from(document.querySelectorAll("table")).map(table => ({ headers: Array.from(table.querySelectorAll("thead tr")).flatMap(row => Array.from(row.querySelectorAll("th,td")).map(cell => normalize(cell.textContent))), values: Array.from(table.querySelectorAll("tbody tr")).map(row => Array.from(row.querySelectorAll("td")).map(cell => normalize(cell.textContent))) }));
    const vxe = Array.from(document.querySelectorAll(".vxe-table")).map(table => ({ headers: Array.from(table.querySelectorAll(".vxe-header--column")).map(cell => normalize(cell.textContent)), values: Array.from(table.querySelectorAll(".vxe-body--row")).map(row => Array.from(row.querySelectorAll(".vxe-body--column")).map(cell => normalize(cell.textContent))) }));
    return [...standard, ...vxe].filter(table => table.headers.length && table.values.length);
  });
}

async function selectShekouVessel(frame: Frame, vesselName: string) {
  const vessel = frame.locator("input.ivu-input-with-suffix:not([readonly])").first();
  await vessel.waitFor({ state: "visible", timeout: 20_000 });
  await vessel.fill(vesselName);
  const options = frame.locator(".ivu-select-item:visible, .vxe-select--option:visible, .vxe-pulldown--content :is(li,div):visible");
  await options.first().waitFor({ state: "visible", timeout: 10_000 });
  const texts = (await options.allTextContents()).map(value => value.trim()).filter(Boolean);
  selectExactShekouVessel(texts, vesselName);
  const exactIndex = texts.findIndex(text => text === vesselName);
  await options.nth(exactIndex).click({ timeout: 10_000 });
}

async function queryShekouOne(frame: Frame, run: Run, sailing: Sailing, index: number): Promise<EtbQueryResult> {
  await clearShekouConditions(frame);
  const ready = {
    hasVessel: await frame.locator("input.ivu-input-with-suffix:not([readonly])").count().then(Boolean),
    hasQuery: await frame.getByRole("button", { name: "查询", exact: true }).count().then(Boolean),
    hasResultRegion: await frame.locator(".vxe-table, .vxe-table--body-wrapper, .vxe-grid, [role=grid], table").count().then(Boolean),
  };
  if (!ready.hasVessel || !ready.hasQuery || !ready.hasResultRegion) throw new EtbManualHandoffRequiredError("蛇口公共船期页面未完成业务初始化，禁止提交查询。", "MANUAL_HANDOFF_REQUIRED");
  const relevant = (tables: Awaited<ReturnType<typeof readShekouTables>>) => tables.filter(table => table.headers.some(header => /船名|出口航次|ETB|预计靠泊/.test(header)));
  const beforeTables = relevant(await readShekouTables(frame));
  const before = resultFingerprint(beforeTables.flatMap(table => parseShekouScheduleTable(table.headers, table.values)));
  await selectShekouVessel(frame, sailing.vesselName);
  await frame.getByRole("button", { name: "查询", exact: true }).click({ timeout: 10_000 });
  let rows = [] as ReturnType<typeof parseShekouScheduleTable>;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    await frame.waitForTimeout(250);
    const tables = relevant(await readShekouTables(frame));
    try {
      rows = tables.flatMap(table => parseShekouScheduleTable(table.headers, table.values));
      if (resultFingerprint(rows) !== before) break;
    } catch { /* Platform is still rendering; continue until the bounded deadline. */ }
  }
  assertShekouResultRefreshed(before, resultFingerprint(rows));
  const match = uniqueExactShekouScheduleMatch(rows, sailing);
  const evidence = frame.locator(".vxe-table, .vxe-grid, table").filter({ hasText: sailing.vesselName }).filter({ hasText: sailing.voyage }).first();
  await evidence.waitFor({ state: "visible", timeout: 8_000 });
  const root = resolve(process.env.FILE_STORAGE_ROOT || "./uploads");
  const key = `etb/shekou/${run.id}-${index}.png`;
  await mkdir(resolve(root, "etb", "shekou"), { recursive: true, mode: 0o700 });
  await evidence.screenshot({ path: resolve(root, key) });
  return { carrier: sailing.carrier, vesselName: sailing.vesselName, voyage: sailing.voyage, etbAt: parseShekouEtb(match.etb), sourceUrl: frame.url(), screenshotStorageKey: key };
}

async function processShekou(run: Run) {
  const throttle = getEtbSourceConfig("蛇口").throttle;
  const candidates = await prisma.sailing.findMany({ where: { terminal: "蛇口", ...(run.targetSailingId ? { id: run.targetSailingId } : { orders: { some: {} } }) }, select: { id: true, carrier: true, vesselName: true, voyage: true }, orderBy: [{ carrier: "asc" }, { vesselName: "asc" }, { voyage: "asc" }], ...(run.targetSailingId ? {} : { skip: run.batchOffset, take: throttle.batchMaxSailings + 1 }) });
  const hasMore = !run.targetSailingId && candidates.length > throttle.batchMaxSailings;
  const sailings = hasMore ? candidates.slice(0, throttle.batchMaxSailings) : candidates;
  if (!sailings.length) throw new EtbManualHandoffRequiredError("没有可查询的蛇口船期，未向平台提交空查询。", "MANUAL_HANDOFF_REQUIRED");
  const profile = resolve(process.env.ETB_BROWSER_PROFILE_ROOT || ".runtime/etb-browser-profiles", "蛇口");
  const release = await acquireProfileLock(profile);
  let context: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | undefined;
  try {
    await disableYantianBrowserPasswordSaving(profile);
    context = await chromium.launchPersistentContext(profile, { executablePath: process.env.ETB_CHROME_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: false, viewport: { width: 1440, height: 960 }, args: ["--disable-save-password-bubble", "--disable-features=PasswordManagerOnboarding"] });
    const page = context.pages()[0] || await context.newPage();
    const config = getEtbSourceConfig("蛇口");
    // ePort renders its authenticated workbench after navigation commits.  Do
    // not classify that intermediate blank/loading document as an expired
    // session; wait for a concrete login or business-page feature first.
    await navigateShekou(page, () => context?.browser()?.isConnected() ?? false, config.queryLandingUrl || config.homeUrl, 30_000);
    await awaitManualCaptcha(page, run, "蛇口");
    const verifiedText = await page.locator("body").innerText().catch(() => "");
    if (!isShekouLoggedInPage(verifiedText)) throw new EtbManualHandoffRequiredError("蛇口受控浏览器会话失效，请人工重新登录。", "EXPIRED");
    const frame = await openShekouQuery(page);
    const results: EtbQueryResult[] = [];
    for (const [index, sailing] of sailings.entries()) {
      if (index) await pause(throttle.queryIntervalMs);
      results.push(await queryWithRetry(run, sailing, () => queryShekouOne(frame, run, sailing, index)));
    }
    await submit(run, results);
    await queueContinuation(run, sailings.length, hasMore);
  } finally { await context?.close().catch(() => undefined); await release(); }
}

async function main() {
  await recoverStaleRunningRuns();
  const run = await claim(arg("--terminal"));
  if (!run) return console.log(JSON.stringify({ event: "no_pending_etb_run" }));
  try {
    if (run.terminal === "盐田") await processYantian(run);
    else if (run.terminal === "蛇口") await processShekou(run);
    else throw new EtbManualHandoffRequiredError(`不支持 ${run.terminal} 的 ETB 查询。`, "MANUAL_HANDOFF_REQUIRED");
    console.log(JSON.stringify({ event: "etb_completed", runId: run.id }));
  } catch (error) {
    const handled = run.terminal === "蛇口" && requiresShekouManualHandoff(error)
      ? new EtbManualHandoffRequiredError("蛇口公共船期子应用初始化失败（iframe 主动中断）。未提交查询或保存 ETB，请人工在受控浏览器完成查询，或等待平台修复后重试。", "MANUAL_HANDOFF_REQUIRED")
      : error;
    const failure = etbQueryFailureState(handled);
    await prisma.$transaction(async tx => {
      await tx.etbQueryRun.update({ where: { id: run.id }, data: { ...failure, finishedAt: new Date() } });
      await notifyActiveUsers(tx, etbRunAlert({ terminal: run.terminal, runId: run.id, status: failure.status, reason: failure.handoffReason || failure.errorMessage }));
    });
    console.error(handled);
    process.exitCode = 1;
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
