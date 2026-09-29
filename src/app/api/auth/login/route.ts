import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSessionConfigured, createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { verifyPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { isLoginBlocked, LOGIN_FAILURE_WINDOW_MS } from "@/lib/login-security";

const schema = z.object({ email: z.string().trim().email().max(200), password: z.string().min(1).max(200) });
export async function POST(request: Request) {
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "邮箱或密码格式不正确" }, { status: 400 });
  const email = input.data.email.toLowerCase();
  const since = new Date(Date.now() - LOGIN_FAILURE_WINDOW_MS);
  const failures = await prisma.loginAttempt.count({ where: { email, failedAt: { gte: since } } });
  if (isLoginBlocked(failures)) return NextResponse.json({ error: "登录失败次数过多，请 15 分钟后重试" }, { status: 429 });
  const user = await prisma.appUser.findUnique({ where: { email } });
  if (!user || !user.active || !await verifyPassword(input.data.password, user.passwordHash)) {
    await prisma.loginAttempt.create({ data: { email } });
    return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
  }
  try {
    assertSessionConfigured();
    const session = await createSession(user.id);
    await prisma.loginAttempt.deleteMany({ where: { email } });
    const response = NextResponse.json({ id: user.id, name: user.name, role: user.role });
    response.cookies.set(SESSION_COOKIE, session.value, sessionCookieOptions(session.expiresAt));
    return response;
  } catch {
    return NextResponse.json({ error: "系统会话密钥尚未配置，请联系管理员完成部署配置后重试" }, { status: 503 });
  }
}
