import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { currentUser, parseSessionCookie, SESSION_COOKIE } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";
import { createHash } from "node:crypto";

const schema = z.object({ currentPassword: z.string().min(1).max(200), newPassword: z.string().min(8).max(200) });
export async function POST(request: Request) {
  const user = await currentUser(); if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const input = schema.safeParse(await request.json()); if (!input.success) return NextResponse.json({ error: "新密码至少需要 8 位" }, { status: 400 });
  if (!await verifyPassword(input.data.currentPassword, user.passwordHash)) return NextResponse.json({ error: "当前密码不正确" }, { status: 401 });
  const session = parseSessionCookie((await cookies()).get(SESSION_COOKIE)?.value);
  await prisma.$transaction(async tx => {
    await tx.appUser.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(input.data.newPassword) } });
    await tx.appSession.updateMany({ where: { userId: user.id, revokedAt: null, ...(session ? { tokenHash: { not: createHash("sha256").update(session.token).digest("hex") } } : {}) }, data: { revokedAt: new Date() } });
    await tx.operationLog.create({ data: { action: "USER_CHANGED_OWN_PASSWORD", entityType: "AppUser", entityId: user.id, ...actorFields(user) } });
  });
  return NextResponse.json({ ok: true });
}
