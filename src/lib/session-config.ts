export function assertSessionConfigured(secret = process.env.SESSION_SECRET) {
  if (!secret || secret.length < 32 || secret.startsWith("replace-")) throw new Error("SESSION_SECRET 未配置为至少 32 位随机值");
  return secret;
}
