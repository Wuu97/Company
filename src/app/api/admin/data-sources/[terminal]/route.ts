import { NextResponse } from "next/server";
import { z } from "zod";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { decryptCredential, encryptCredential } from "@/lib/credential-crypto";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";

const schema = z.object({ username: z.string().trim().min(1).max(200), password: z.string().min(1).max(500) });
export async function GET(_request: Request, { params }: { params: Promise<{ terminal: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const terminal = decodeURIComponent((await params).terminal);
  if (!terminal.trim() || terminal.length > 100) return NextResponse.json({ error: "平台名称无效" }, { status: 400 });
  const credential = await prisma.dataSourceCredential.findUnique({ where: { terminal } });
  if (!credential) return NextResponse.json({ error: "该平台尚未配置账号" }, { status: 404 });
  try {
    const password = decryptCredential(credential);
    await prisma.operationLog.create({ data: { action: "ETB_SOURCE_CREDENTIAL_VIEWED", entityType: "DataSourceCredential", entityId: credential.id, ...actorFields(admin), after: { terminal } } });
    return NextResponse.json({ password }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "读取密码失败" }, { status: 503 }); }
}
export async function POST(request: Request, { params }: { params: Promise<{ terminal: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "账号或密码无效" }, { status: 400 });
  const terminal = decodeURIComponent((await params).terminal);
  if (!terminal.trim() || terminal.length > 100) return NextResponse.json({ error: "平台名称无效" }, { status: 400 });
  try {
    const encrypted = encryptCredential(input.data.password);
    const credential = await prisma.dataSourceCredential.upsert({ where: { terminal }, create: { terminal, username: input.data.username, changedById: admin.id, ...encrypted }, update: { username: input.data.username, changedById: admin.id, ...encrypted } });
    await prisma.operationLog.create({ data: { action: "ETB_SOURCE_CREDENTIAL_UPDATED", entityType: "DataSourceCredential", entityId: credential.id, ...actorFields(admin), after: { terminal, username: input.data.username } } });
    return NextResponse.json({ terminal: credential.terminal, username: credential.username, updatedAt: credential.updatedAt });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "保存失败" }, { status: 503 }); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ terminal: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const input = z.object({ active: z.boolean() }).safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "启停状态无效" }, { status: 400 });
  const terminal = decodeURIComponent((await params).terminal);
  const existing = await prisma.dataSourceCredential.findUnique({ where: { terminal } });
  if (!existing) return NextResponse.json({ error: "请先配置平台账号" }, { status: 404 });
  const changed = await prisma.$transaction(async tx => {
    const item = await tx.dataSourceCredential.update({ where: { terminal }, data: { active: input.data.active, changedById: admin.id } });
    await tx.operationLog.create({ data: { action: item.active ? "PLATFORM_ENABLED" : "PLATFORM_DISABLED", entityType: "DataSourceCredential", entityId: item.id, ...actorFields(admin), before: { active: existing.active }, after: { terminal, active: item.active } } });
    return item;
  });
  return NextResponse.json({ active: changed.active });
}
