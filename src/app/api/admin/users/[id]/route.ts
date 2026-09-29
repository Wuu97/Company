import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";

const statusSchema = z.object({ action: z.literal("set-active"), active: z.boolean() });
const passwordSchema = z.object({ action: z.literal("reset-password"), password: z.string().min(12).max(200) });
const schema = z.discriminatedUnion("action", [statusSchema, passwordSchema]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch { return NextResponse.json({ error: "请先登录" }, { status: 401 }); }
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "操作资料无效" }, { status: 400 });
  const id = (await params).id;
  const user = await prisma.appUser.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  if (input.data.action === "set-active") {
    if (id === admin.id && !input.data.active) return NextResponse.json({ error: "不能停用当前登录账号" }, { status: 409 });
    const updated = await prisma.appUser.update({ where: { id }, data: { active: input.data.active } });
    if (!input.data.active) await prisma.appSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    await prisma.operationLog.create({ data: { action: input.data.active ? "USER_ENABLED" : "USER_DISABLED", entityType: "AppUser", entityId: id, ...actorFields(admin), after: { by: admin.id } } });
    return NextResponse.json({ id: updated.id, active: updated.active });
  }
  const updated = await prisma.appUser.update({ where: { id }, data: { passwordHash: await hashPassword(input.data.password) } });
  await prisma.appSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
  await prisma.operationLog.create({ data: { action: "USER_PASSWORD_RESET", entityType: "AppUser", entityId: id, ...actorFields(admin), after: { by: admin.id } } });
  return NextResponse.json({ id: updated.id, ok: true });
}
