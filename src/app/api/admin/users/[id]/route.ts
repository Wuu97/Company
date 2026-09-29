import { NextResponse } from "next/server";
import { z } from "zod";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";
import { mayDeactivateAdmin } from "@/lib/login-security";

const statusSchema = z.object({ action: z.literal("set-active"), active: z.boolean() });
const passwordSchema = z.object({ action: z.literal("reset-password"), password: z.string().min(8).max(200) });
const schema = z.discriminatedUnion("action", [statusSchema, passwordSchema]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "操作资料无效" }, { status: 400 });
  const id = (await params).id;
  if (input.data.action === "set-active") {
    const active = input.data.active;
    try { const updated = await prisma.$transaction(async tx => {
      const user = await tx.appUser.findUnique({ where: { id } }); if (!user) throw new Error("USER_NOT_FOUND");
      if (id === admin.id && !active) throw new Error("SELF_DEACTIVATION");
      if (!active && user.role === "ADMIN" && !mayDeactivateAdmin(await tx.appUser.count({ where: { role: "ADMIN", active: true } }))) throw new Error("LAST_ADMIN");
      const changed = await tx.appUser.update({ where: { id }, data: { active } });
      if (!active) await tx.appSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
      await tx.operationLog.create({ data: { action: active ? "USER_ENABLED" : "USER_DISABLED", entityType: "AppUser", entityId: id, ...actorFields(admin), after: { active } } }); return changed;
    }); return NextResponse.json({ id: updated.id, active: updated.active }); } catch (error) { const code = error instanceof Error ? error.message : ""; return NextResponse.json({ error: code === "USER_NOT_FOUND" ? "用户不存在" : code === "SELF_DEACTIVATION" ? "不能停用当前登录账号" : code === "LAST_ADMIN" ? "不能停用最后一位负责人" : "更新用户状态失败" }, { status: code === "USER_NOT_FOUND" ? 404 : code ? 409 : 500 }); }
  }
  const passwordHash = await hashPassword(input.data.password);
  try { const updated = await prisma.$transaction(async tx => { const user = await tx.appUser.findUnique({ where: { id } }); if (!user) throw new Error("USER_NOT_FOUND"); const changed = await tx.appUser.update({ where: { id }, data: { passwordHash } }); await tx.appSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } }); await tx.operationLog.create({ data: { action: "USER_PASSWORD_RESET", entityType: "AppUser", entityId: id, ...actorFields(admin) } }); return changed; }); return NextResponse.json({ id: updated.id, ok: true }); } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === "USER_NOT_FOUND" ? "用户不存在" : "重置密码失败" }, { status: error instanceof Error && error.message === "USER_NOT_FOUND" ? 404 : 500 }); }
}
