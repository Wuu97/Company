import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "./passwords";

export { hashPassword, verifyPassword } from "./passwords";

export const SESSION_COOKIE = "tms_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith("replace-")) throw new Error("SESSION_SECRET 未配置为至少 32 位随机值");
  return secret;
}
function sha256(value: string) { return createHash("sha256").update(value).digest("hex"); }
function sign(value: string) { return createHmac("sha256", sessionSecret()).update(value).digest("base64url"); }

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await prisma.appSession.create({ data: { userId, tokenHash: sha256(token), expiresAt } });
  const payload = `${token}.${expiresAt.getTime()}`;
  return { value: `${payload}.${sign(payload)}`, expiresAt };
}

export function parseSessionCookie(value?: string) {
  if (!value) return null;
  const [token, expiresText, signature] = value.split(".");
  if (!token || !expiresText || !signature) return null;
  const payload = `${token}.${expiresText}`;
  const expected = sign(payload);
  if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  const expiresAt = new Date(Number(expiresText));
  if (Number.isNaN(expiresAt.valueOf()) || expiresAt <= new Date()) return null;
  return { token, expiresAt };
}

export function sessionCookieOptions(expiresAt: Date) {
  return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", expires: expiresAt };
}

export async function currentUser() {
  const session = parseSessionCookie((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const record = await prisma.appSession.findUnique({ where: { tokenHash: sha256(session.token) }, include: { user: true } });
  if (!record || record.revokedAt || record.expiresAt <= new Date() || !record.user.active) return null;
  return record.user;
}

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) throw new Error("请先登录");
  return user;
}
