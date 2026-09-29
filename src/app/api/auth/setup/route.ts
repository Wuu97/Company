import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, hashPassword, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(200), password: z.string().min(12).max(200) });
export async function POST(request: Request) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "请填写姓名、有效邮箱，以及至少 12 位密码" }, { status: 400 });
  if (await prisma.appUser.count()) return NextResponse.json({ error: "系统已初始化，请使用登录页" }, { status: 409 });
  const user = await prisma.appUser.create({ data: { ...input.data, email: input.data.email.toLowerCase(), passwordHash: await hashPassword(input.data.password), role: "ADMIN" } });
  const session = await createSession(user.id);
  const response = NextResponse.json({ id: user.id, name: user.name, role: user.role }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, session.value, sessionCookieOptions(session.expiresAt));
  return response;
}
