import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { verifyPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().trim().email().max(200), password: z.string().min(1).max(200) });
export async function POST(request: Request) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "邮箱或密码格式不正确" }, { status: 400 });
  const user = await prisma.appUser.findUnique({ where: { email: input.data.email.toLowerCase() } });
  if (!user || !user.active || !await verifyPassword(input.data.password, user.passwordHash)) return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
  const session = await createSession(user.id);
  const response = NextResponse.json({ id: user.id, name: user.name, role: user.role });
  response.cookies.set(SESSION_COOKIE, session.value, sessionCookieOptions(session.expiresAt));
  return response;
}
