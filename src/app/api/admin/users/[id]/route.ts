import { NextResponse } from "next/server";
import { z } from "zod";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { hashPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";
import { mayDeactivateAdmin } from "@/lib/login-security";

const statusSchema = z.object({ action: z.literal("set-active"), active: z.boolean() });
const passwordSchema = z.object({ action: z.literal("reset-password"), password: z.string().min(8).max(200) });
const editSchema = z.object({ action: z.literal("edit"), name: z.string().trim().min(1).max(100), email: z.string().trim().email().max(200).transform(value => value.toLowerCase()), role: z.enum(["ADMIN", "OPERATOR"]) });
const schema = z.discriminatedUnion("action", [statusSchema, passwordSchema, editSchema]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "操作资料无效" }, { status: 400 });
  const id = (await params).id;
  if (input.data.action === "edit") {
    const { name, email, role } = input.data;
    try {
      await prisma.$transaction(async tx => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(2026092902)`;
        const user = await tx.appUser.findUnique({ where: { id } });
        if (!user) throw new Error("用户不存在");
        if (user.role === "ADMIN" && role !== "ADMIN") {
          if (id === admin.id) throw new Error("不能降低当前登录账号的管理员权限");
          if (user.active && !mayDeactivateAdmin(await tx.appUser.count({ where: { role: "ADMIN", active: true } }))) throw new Error("不能降低最后一位管理员的权限");
        }
        await tx.appUser.update({ where: { id }, data: { name, email, role } });
        if (user.role !== role || user.email !== email) await tx.appSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
        await tx.operationLog.create({ data: { action: "USER_UPDATED", entityType: "AppUser", entityId: id, ...actorFields(admin), before: { name: user.name, email: user.email, role: user.role }, after: { name, email, role } } });
      });
      return NextResponse.json({ ok: true });
    } catch (error) {
      const duplicate = (error as { code?: string }).code === "P2002";
      return NextResponse.json({ error: duplicate ? "该邮箱已被使用" : error instanceof Error ? error.message : "修改成员失败" }, { status: 409 });
    }
  }
  if (input.data.action === "set-active") {
    const active = input.data.active;
    try { const updated = await prisma.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(2026092902)`;
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
