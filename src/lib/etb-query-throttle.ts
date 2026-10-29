export type EtbQueryThrottle = { batchMaxSailings: number; queryIntervalMs: number; maxAttempts: number; retryBaseDelayMs: number };

export function retryDelayMs(throttle: EtbQueryThrottle, failedAttempt: number) {
  return throttle.retryBaseDelayMs * 2 ** Math.max(0, failedAttempt - 1);
}

export function isRetryableEtbError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /timeout|timed out|net::|ECONN|EAI_AGAIN|未刷新|still rendering|临时|网络/i.test(message);
}
