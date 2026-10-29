export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
/** Refresh a frequently used session at most once per day. */
export const SESSION_RENEWAL_THRESHOLD_MS = 6 * 24 * 60 * 60 * 1000;

export function assertSessionConfigured(secret = process.env.SESSION_SECRET) {
  if (!secret || secret.length < 32 || secret.startsWith("replace-")) throw new Error("SESSION_SECRET 未配置为至少 32 位随机值");
  return secret;
}
