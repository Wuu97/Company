export const LOGIN_FAILURE_WINDOW_MS = 15 * 60 * 1000;
export const MAX_LOGIN_FAILURES = 5;
export function isLoginBlocked(failureCount: number) { return failureCount >= MAX_LOGIN_FAILURES; }
export function mayDeactivateAdmin(activeAdminCount: number) { return activeAdminCount > 1; }
