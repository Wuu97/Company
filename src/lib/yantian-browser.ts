import { chmod, mkdir, open, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Page, Response } from "@playwright/test";

export type YantianPageState = "LOGIN_REQUIRED" | "ROBOT_VERIFICATION_REQUIRED" | "QUERY_READY" | "EXCEPTION" | "UNKNOWN";
export type YantianDiagnostic = { startedAt: string; elapsedMs: number; httpStatus: number | null; finalUrl: string; title: string; requestFailures: Array<{ url: string; error: string }>; disconnected: boolean; pageState: YantianPageState };

const robotPattern = /机器人|人机验证|验证码|安全验证/i;
const loginPattern = /需登录后使用|立即登录|请登录/i;
const queryPattern = /船期公众查询|预计停靠\s*\(?ETB\)?|查询结果/i;
const exceptionPattern = /访问受限|拒绝访问|系统异常|服务不可用|HTTP\s*(403|500)/i;

// Verified on 盐田's real "船期公众查询(船名航次)" page on 2026-09-29.
export const yantianVesselQuerySelectors = {
  date: "#etb_time",
  vessel: "#ship_name",
  voyage: "#voyage_code",
  submit: 'input[name="Submit1"]',
  resultRows: "table tr",
} as const;

export function classifyYantianPageText(text: string): YantianPageState {
  if (robotPattern.test(text)) return "ROBOT_VERIFICATION_REQUIRED";
  if (exceptionPattern.test(text)) return "EXCEPTION";
  if (loginPattern.test(text)) return "LOGIN_REQUIRED";
  if (queryPattern.test(text)) return "QUERY_READY";
  return "UNKNOWN";
}

export function isYantianLoggedInPage(text: string) {
  return /退出登录|安全退出|欢迎您|我的账户/i.test(text) && !loginPattern.test(text) && !robotPattern.test(text);
}

export function safeYantianUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.searchParams.has("loginVerifyCode")) parsed.searchParams.set("loginVerifyCode", "[redacted]");
    return parsed.toString();
  } catch {
    return url.replace(/([?&]loginVerifyCode=)[^&]*/i, "$1[redacted]");
  }
}

/** Carries the short-lived platform verification parameter inside one browser session. */
export function yantianQueryUrlForAuthenticatedPage(queryUrl: string, authenticatedPageUrl: string) {
  const source = new URL(authenticatedPageUrl);
  const verification = source.searchParams.get("loginVerifyCode");
  if (!verification) throw new Error("盐田登录页面未提供查询所需的会话验证参数；请人工接管。");
  const target = new URL(queryUrl);
  target.searchParams.set("loginVerifyCode", verification);
  return target.toString();
}

export function formatYantianQueryDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const value = (type: string) => parts.find(part => part.type === type)?.value;
  return `${value("year")}${value("month")}${value("day")}`;
}

export function shouldRetryYantianFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /Timeout|net::ERR_|Target page, context or browser has been closed|ECONNRESET/i.test(message);
}

export async function acquireProfileLock(profilePath: string) {
  await mkdir(profilePath, { recursive: true, mode: 0o700 });
  await chmod(profilePath, 0o700);
  const lockPath = resolve(profilePath, ".worker.lock");
  try {
    const handle = await open(lockPath, "wx", 0o600);
    await handle.writeFile(`${process.pid}\n${new Date().toISOString()}\n`);
    return async () => { await handle.close(); await unlink(lockPath).catch(() => undefined); };
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new Error(`盐田浏览器配置目录正被其他 Worker 使用：${profilePath}`);
    throw error;
  }
}

/** Disable Chrome's own password manager for the isolated ETB Worker profile. */
export async function disableYantianBrowserPasswordSaving(profilePath: string) {
  const defaultProfile = resolve(profilePath, "Default");
  const preferencePath = resolve(defaultProfile, "Preferences");
  await mkdir(defaultProfile, { recursive: true, mode: 0o700 });
  let preferences: Record<string, unknown> = {};
  try { preferences = JSON.parse(await readFile(preferencePath, "utf8")) as Record<string, unknown>; } catch { /* first Worker launch */ }
  const profile = (preferences.profile && typeof preferences.profile === "object") ? preferences.profile as Record<string, unknown> : {};
  preferences.credentials_enable_service = false;
  preferences.profile = { ...profile, password_manager_enabled: false, password_manager_leak_detection: false };
  await writeFile(preferencePath, JSON.stringify(preferences), { mode: 0o600 });
  await chmod(preferencePath, 0o600);
}

export async function navigateYantian(page: Page, browserConnected: () => boolean, url: string, timeoutMs = 15_000): Promise<YantianDiagnostic> {
  const started = Date.now();
  const requestFailures: YantianDiagnostic["requestFailures"] = [];
  page.on("requestfailed", request => requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "unknown" }));
  const response: Response | null = await page.goto(url, { waitUntil: "commit", timeout: timeoutMs });
  // A committed document is not rendered yet. Wait for an actual page-state
  // feature instead of treating body attachment or network idleness as ready.
  await page.waitForFunction(
    () => /需登录后使用|立即登录|船期公众查询|预计停靠\s*\(?ETB\)?|访问受限|系统异常/i.test(document.body?.innerText || ""),
    undefined,
    { timeout: timeoutMs },
  );
  const text = await page.locator("body").innerText({ timeout: timeoutMs });
  return { startedAt: new Date(started).toISOString(), elapsedMs: Date.now() - started, httpStatus: response?.status() ?? null, finalUrl: page.url(), title: await page.title(), requestFailures, disconnected: !browserConnected(), pageState: classifyYantianPageText(text) };
}

export function protectedProfilePath(root: string) {
  return resolve(root, "盐田");
}

export function yantianEvidencePath(storageRoot: string, runId: string) {
  return resolve(storageRoot, "etb", "yantian", `${runId}.png`);
}

export async function ensureEvidenceDirectory(path: string) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
}
