import { chmod, mkdir, open, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Page, Response } from "@playwright/test";

export type YantianPageState = "LOGIN_REQUIRED" | "ROBOT_VERIFICATION_REQUIRED" | "QUERY_READY" | "EXCEPTION" | "UNKNOWN";
export type YantianDiagnostic = { startedAt: string; elapsedMs: number; httpStatus: number | null; finalUrl: string; title: string; requestFailures: Array<{ url: string; error: string }>; disconnected: boolean; pageState: YantianPageState };

const robotPattern = /机器人|人机验证|验证码|安全验证/i;
const loginPattern = /需登录后使用|立即登录|请登录/i;
const queryPattern = /船期公众查询|预计停靠\s*\(?ETB\)?|查询结果/i;
const exceptionPattern = /访问受限|拒绝访问|系统异常|服务不可用|HTTP\s*(403|500)/i;

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

export async function navigateYantian(page: Page, browserConnected: () => boolean, url: string, timeoutMs = 15_000): Promise<YantianDiagnostic> {
  const started = Date.now();
  const requestFailures: YantianDiagnostic["requestFailures"] = [];
  page.on("requestfailed", request => requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "unknown" }));
  const response: Response | null = await page.goto(url, { waitUntil: "commit", timeout: timeoutMs });
  // A committed document is not rendered yet. Wait for an actual page-state
  // feature instead of treating body attachment or network idleness as ready.
  await page.getByText(/需登录后使用|立即登录|船期公众查询|预计停靠\s*\(?ETB\)?|访问受限|系统异常/i).first().waitFor({ state: "visible", timeout: timeoutMs });
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
