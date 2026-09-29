import { NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { getEtbSourceConfig } from "@/lib/etb-source-config";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ terminal: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const terminal = decodeURIComponent((await params).terminal);
  try { getEtbSourceConfig(terminal); } catch { return NextResponse.json({ error: "不支持的 ETB 平台" }, { status: 400 }); }
  const credential = await prisma.dataSourceCredential.findUnique({ where: { terminal }, select: { id: true } });
  if (!credential) return NextResponse.json({ error: "请先保存平台账号" }, { status: 409 });
  const existing = await prisma.etbCredentialTestRun.findFirst({ where: { terminal, status: { in: ["PENDING", "RUNNING", "AWAITING_MANUAL"] }, }, select: { id: true } });
  if (existing) return NextResponse.json({ error: "该平台已有进行中的登录测试" }, { status: 409 });
  const run = await prisma.etbCredentialTestRun.create({ data: { terminal, credentialId: credential.id } });
  await prisma.operationLog.create({ data: { action: "ETB_CREDENTIAL_TEST_QUEUED", entityType: "EtbCredentialTestRun", entityId: run.id, actorUserId: admin.id, actorName: admin.name, actorRole: admin.role, after: { terminal } } });
  return NextResponse.json(run, { status: 201 });
}
