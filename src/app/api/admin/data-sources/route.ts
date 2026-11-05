import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { encryptCredential } from "@/lib/credential-crypto";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";
const schema = z.object({ terminal: z.string().trim().min(1).max(100), loginUrl: z.string().url().max(2000).refine(value => ["https:", "http:"].includes(new URL(value).protocol)), username: z.string().trim().min(1).max(200), password: z.string().min(1).max(500) });
export async function POST(request: Request) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const input = schema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "请填写平台名称、有效的登录网址及账号密码" }, { status: 400 });
  const { terminal, loginUrl, username, password } = input.data;
  if (["盐田", "蛇口", "盐田港", "蛇口港"].includes(terminal)) return NextResponse.json({ error: "该平台已存在，请编辑现有账号" }, { status: 409 });
  try {
    await prisma.$transaction(async tx => {
      const item = await tx.dataSourceCredential.create({ data: { terminal, loginUrl, username, changedById: admin.id, ...encryptCredential(password) } });
      await tx.operationLog.create({ data: { action: "PLATFORM_CREATED", entityType: "DataSourceCredential", entityId: item.id, ...actorFields(admin), after: { terminal, loginUrl, username } } });
    });
    return NextResponse.json({ terminal }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return NextResponse.json({ error: "该平台名称已存在" }, { status: 409 });
    return NextResponse.json({ error: "保存平台失败，请稍后重试" }, { status: 503 });
  }
}
