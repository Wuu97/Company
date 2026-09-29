import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "./passwords";
import { assertSessionConfigured } from "./session-config";

export { hashPassword, verifyPassword } from "./passwords";

export const SESSION_COOKIE = "tms_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export class AuthError extends Error {
  constructor(readonly status: 401 | 403, readonly code: "UNAUTHENTICATED" | "FORBIDDEN") { super(code); }
}
export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) return Response.json({ error: error.code === "UNAUTHENTICATED" ? "请先登录" : "无管理员权限", code: error.code }, { status: error.status });
  return Response.json({ error: "身份验证失败", code: "AUTH_ERROR" }, { status: 500 });
}

export { assertSessionConfigured } from "./session-config";
function sessionSecret() { return assertSessionConfigured(); }
function sha256(value: string) { return createHash("sha256").update(value).digest("hex"); }
function sign(value: string) { return createHmac("sha256", sessionSecret()).update(value).digest("base64url"); }

/** The transaction client is accepted so account and session creation can commit atomically. */
export async function createSession(userId: string, db: Pick<typeof prisma, "appSession"> = prisma) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.appSession.create({ data: { userId, tokenHash: sha256(token), expiresAt } });
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
  if (!user) throw new AuthError(401, "UNAUTHENTICATED");
  if (user.role !== "ADMIN") throw new AuthError(403, "FORBIDDEN");
  return user;
}

/** Reserved policy hook for future finance APIs; no finance API is enabled in this release. */
export async function requireFinancialAccess() { return requireAdmin(); }
