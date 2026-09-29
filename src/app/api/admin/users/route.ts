import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/passwords";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";

const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(200), password: z.string().min(12).max(200), role: z.enum(["ADMIN", "OPERATOR"]).default("OPERATOR") });
export async function POST(request: Request) {
  let admin; try { admin = await requireAdmin(); } catch { return NextResponse.json({ error: "请先登录" }, { status: 401 }); }
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "用户资料无效；初始密码至少 12 位" }, { status: 400 });
  try {
    const user = await prisma.appUser.create({ data: { ...input.data, email: input.data.email.toLowerCase(), passwordHash: await hashPassword(input.data.password) } });
    await prisma.operationLog.create({ data: { action: "USER_CREATED", entityType: "AppUser", entityId: user.id, ...actorFields(admin), after: { name: user.name, email: user.email, role: user.role } } });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
  } catch { return NextResponse.json({ error: "该邮箱已存在" }, { status: 409 }); }
}
