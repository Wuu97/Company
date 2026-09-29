export const LOGIN_FAILURE_WINDOW_MS = 15 * 60 * 1000;
export const MAX_LOGIN_FAILURES = 5;
export const MAX_SOURCE_LOGIN_FAILURES = 20;
export function isLoginBlocked(failureCount: number) { return failureCount >= MAX_LOGIN_FAILURES; }
export function mayDeactivateAdmin(activeAdminCount: number) { return activeAdminCount > 1; }
export function loginSourceKey(headers: Headers) {
  // Proxy headers are attacker-controlled unless an operator explicitly configures a trusted proxy.
  if (process.env.TRUST_LOGIN_PROXY !== "true") return "unverified-client";
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 128) || "trusted-proxy-unknown";
}
