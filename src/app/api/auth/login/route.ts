import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSessionConfigured, createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { verifyPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { isLoginBlocked, LOGIN_FAILURE_WINDOW_MS, loginSourceKey, MAX_SOURCE_LOGIN_FAILURES } from "@/lib/login-security";
import { Prisma } from "@prisma/client";

const schema = z.object({ email: z.string().trim().email().max(200), password: z.string().min(1).max(200) });
export async function POST(request: Request) {
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "邮箱或密码格式不正确" }, { status: 400 });
  const email = input.data.email.toLowerCase();
  const sourceKey = loginSourceKey(request.headers);
  const since = new Date(Date.now() - LOGIN_FAILURE_WINDOW_MS);
  try {
    assertSessionConfigured();
    const result = await prisma.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${email}))`;
      const [failures, sourceFailures, user] = await Promise.all([
        tx.loginAttempt.count({ where: { email, failedAt: { gte: since } } }),
        tx.loginAttempt.count({ where: { sourceKey, failedAt: { gte: since } } }),
        tx.appUser.findUnique({ where: { email } }),
      ]);
      if (isLoginBlocked(failures) || sourceFailures >= MAX_SOURCE_LOGIN_FAILURES) return { blocked: true as const };
      if (!user || !user.active || !await verifyPassword(input.data.password, user.passwordHash)) { await tx.loginAttempt.create({ data: { email, sourceKey } }); return { invalid: true as const }; }
      const session = await createSession(user.id, tx);
      await tx.loginAttempt.deleteMany({ where: { email } });
      return { user, session };
    });
    if ("blocked" in result) return NextResponse.json({ error: "登录失败次数过多，请 15 分钟后重试", code: "LOGIN_RATE_LIMITED" }, { status: 429 });
    if ("invalid" in result) return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
    const { user, session } = result;
    const response = NextResponse.json({ id: user.id, name: user.name, role: user.role });
    response.cookies.set(SESSION_COOKIE, session.value, sessionCookieOptions(session.expiresAt));
    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes("SESSION_SECRET")) return NextResponse.json({ error: "系统会话密钥尚未配置，请联系管理员完成部署配置后重试", code: "SESSION_SECRET_INVALID" }, { status: 503 });
    if (error instanceof Prisma.PrismaClientInitializationError) return NextResponse.json({ error: "数据库服务暂不可用，请稍后重试", code: "DATABASE_UNAVAILABLE" }, { status: 503 });
    console.error("login_failed", { errorName: error instanceof Error ? error.name : "UnknownError", prismaCode: error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined });
    return NextResponse.json({ error: "登录服务暂时不可用，请稍后重试", code: "LOGIN_INTERNAL_ERROR" }, { status: 500 });
  }
}
