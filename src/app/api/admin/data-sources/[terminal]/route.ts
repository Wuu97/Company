import { NextResponse } from "next/server";
import { z } from "zod";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { encryptCredential } from "@/lib/credential-crypto";
import { getEtbSourceConfig } from "@/lib/etb-source-config";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";

const schema = z.object({ username: z.string().trim().min(1).max(200), password: z.string().min(1).max(500) });
export async function POST(request: Request, { params }: { params: Promise<{ terminal: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "账号或密码无效" }, { status: 400 });
  const terminal = decodeURIComponent((await params).terminal);
  try { getEtbSourceConfig(terminal); } catch { return NextResponse.json({ error: "不支持的 ETB 平台" }, { status: 400 }); }
  try {
    const encrypted = encryptCredential(input.data.password);
    const credential = await prisma.dataSourceCredential.upsert({ where: { terminal }, create: { terminal, username: input.data.username, changedById: admin.id, ...encrypted }, update: { username: input.data.username, changedById: admin.id, ...encrypted } });
    await prisma.operationLog.create({ data: { action: "ETB_SOURCE_CREDENTIAL_UPDATED", entityType: "DataSourceCredential", entityId: credential.id, ...actorFields(admin), after: { terminal, username: input.data.username } } });
    return NextResponse.json({ terminal: credential.terminal, username: credential.username, updatedAt: credential.updatedAt });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "保存失败" }, { status: 503 }); }
}
