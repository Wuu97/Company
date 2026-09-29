import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/passwords";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";

const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(200), password: z.string().min(8).max(200), role: z.enum(["ADMIN", "OPERATOR"]).default("OPERATOR") });
export async function POST(request: Request) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "用户资料无效；初始密码至少 8 位" }, { status: 400 });
  try {
    const passwordHash = await hashPassword(input.data.password);
    const user = await prisma.$transaction(async tx => {
      const created = await tx.appUser.create({ data: { name: input.data.name, email: input.data.email.toLowerCase(), passwordHash, role: input.data.role } });
      await tx.operationLog.create({ data: { action: "USER_CREATED", entityType: "AppUser", entityId: created.id, ...actorFields(admin), after: { name: created.name, email: created.email, role: created.role } } });
      return created;
    });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "该邮箱已存在", code: "EMAIL_IN_USE" }, { status: 409 });
    console.error("admin_user_create_failed", { errorName: error instanceof Error ? error.name : "UnknownError" });
    return NextResponse.json({ error: "创建用户失败，请稍后重试", code: "USER_CREATE_FAILED" }, { status: 500 });
  }
}
