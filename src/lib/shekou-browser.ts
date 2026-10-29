import type { Page, Response } from "@playwright/test";

export type ShekouPageState = "PUBLIC_HOME" | "LOGIN_REQUIRED" | "ROBOT_VERIFICATION_REQUIRED" | "TARGET_SELECTION_REQUIRED" | "EXCEPTION" | "UNKNOWN";
export type ShekouDiagnostic = { startedAt: string; elapsedMs: number; httpStatus: number | null; finalUrl: string; title: string; requestFailures: Array<{ url: string; error: string }>; disconnected: boolean; pageState: ShekouPageState };

const robotPattern = /机器人|人机验证|验证码|安全验证/i;
const loginPattern = /登录\/注册|请登录|账号登录|用户名|密码/i;
const publicHomePattern = /招商ePort|一站式港口综合服务平台|港区码头/i;
const authenticatedPattern = /我的主页|常用功能|开舱\/截关时间查询|退出登录|个人中心/i;
const selectionPattern = /蛇口集装箱码头|赤湾集装箱码头|选择.*码头|选择.*系统/i;
const exceptionPattern = /访问出现错误|页面不存在|访问受限|拒绝访问|系统异常|服务不可用|HTTP\s*(403|404|500)/i;

export function classifyShekouPageText(text: string): ShekouPageState {
  if (robotPattern.test(text)) return "ROBOT_VERIFICATION_REQUIRED";
  if (exceptionPattern.test(text)) return "EXCEPTION";
  if (authenticatedPattern.test(text) || selectionPattern.test(text)) return "TARGET_SELECTION_REQUIRED";
  if (loginPattern.test(text)) return "LOGIN_REQUIRED";
  if (publicHomePattern.test(text)) return "PUBLIC_HOME";
  return "UNKNOWN";
}

export function isShekouLoggedInPage(text: string) {
  return authenticatedPattern.test(text) && !robotPattern.test(text) && !loginPattern.test(text);
}

/** A loaded iframe with no document is a platform-loading failure, never a zero-result query. */
export function isShekouScheduleFrameBlank(bodyHtml: string) {
  return bodyHtml.replace(/<!--[^]*?-->/g, "").trim().length === 0;
}

export function isShekouPublicScheduleInitialized(parts: { hasVessel: boolean; hasQuery: boolean; hasResultRegion: boolean }) {
  return parts.hasVessel && parts.hasQuery && parts.hasResultRegion;
}

export function safeShekouUrl(url: string) {
  try {
    const parsed = new URL(url);
    for (const key of ["token", "access_token", "loginVerifyCode", "ticket"]) if (parsed.searchParams.has(key)) parsed.searchParams.set(key, "[redacted]");
    return parsed.toString();
  } catch { return url.replace(/([?&](?:token|access_token|loginVerifyCode|ticket)=)[^&]*/gi, "$1[redacted]"); }
}

export function shouldRetryShekouFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /Timeout|net::ERR_|Target page, context or browser has been closed|ECONNRESET/i.test(message);
}

/** Known ePort micro-frontend failures are a platform handoff, not a retryable ETB miss. */
export function requiresShekouManualHandoff(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /iframe主动中断主应用代码|initDefault is not a function|公共船期 iframe 未加载|公共船期页面未完成业务初始化/i.test(message);
}

export async function navigateShekou(page: Page, browserConnected: () => boolean, url: string, timeoutMs = 15_000): Promise<ShekouDiagnostic> {
  const started = Date.now();
  const requestFailures: ShekouDiagnostic["requestFailures"] = [];
  page.on("requestfailed", request => requestFailures.push({ url: safeShekouUrl(request.url()), error: request.failure()?.errorText || "unknown" }));
  const response: Response | null = await page.goto(url, { waitUntil: "commit", timeout: timeoutMs });
  await page.waitForFunction(() => /招商ePort|登录\/注册|请登录|账号登录|验证码|访问出现错误|页面不存在|蛇口集装箱码头|我的主页|常用功能/.test(document.body?.innerText || ""), undefined, { timeout: timeoutMs });
  const text = await page.locator("body").innerText({ timeout: timeoutMs });
  return { startedAt: new Date(started).toISOString(), elapsedMs: Date.now() - started, httpStatus: response?.status() ?? null, finalUrl: safeShekouUrl(page.url()), title: await page.title(), requestFailures, disconnected: !browserConnected(), pageState: classifyShekouPageText(text) };
}
