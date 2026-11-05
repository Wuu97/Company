import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { getEtbSourceConfig } from "@/lib/etb-source-config";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function dispatch(id: string) {
  await new Promise<void>((done, reject) => {
    const child = spawn(process.execPath, ["--import", "tsx", resolve("scripts/process-etb-credential-test.ts"), "--run", id], { cwd: process.cwd(), env: process.env, detached: true, stdio: "ignore" });
    child.once("exit", (code) => {
      if (code !== 0) void prisma.etbCredentialTestRun.updateMany({ where: { id, status: { in: ["PENDING", "RUNNING"] } }, data: { status: "FAILED", errorMessage: "验证进程异常退出，请重新测试连接", finishedAt: new Date() } }).catch(console.error);
    });
    child.once("error", reject);
    child.once("spawn", () => { child.unref(); done(); });
  });
}

export async function POST(_: Request, { params }: { params: Promise<{ terminal: string }> }) {
  let admin; try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  const terminal = decodeURIComponent((await params).terminal);
  try { getEtbSourceConfig(terminal); } catch { return NextResponse.json({ error: "不支持的 ETB 平台" }, { status: 400 }); }
  const credential = await prisma.dataSourceCredential.findUnique({ where: { terminal }, select: { id: true } });
  if (!credential) return NextResponse.json({ error: "请先保存平台账号" }, { status: 409 });
  await prisma.etbCredentialTestRun.updateMany({ where: { terminal, status: { in: ["RUNNING", "AWAITING_MANUAL"] }, startedAt: { lt: new Date(Date.now() - 10 * 60_000) } }, data: { status: "FAILED", errorMessage: "验证超时，请重新测试连接", finishedAt: new Date() } });
  const existing = await prisma.etbCredentialTestRun.findFirst({ where: { terminal, status: { in: ["PENDING", "RUNNING", "AWAITING_MANUAL"] }, }, select: { id: true, status: true } });
  if (existing?.status === "PENDING") { await dispatch(existing.id); return NextResponse.json(existing, { status: 202 }); }
  if (existing) return NextResponse.json({ error: "该平台已有进行中的登录测试" }, { status: 409 });
  const run = await prisma.etbCredentialTestRun.create({ data: { terminal, credentialId: credential.id } });
  await prisma.operationLog.create({ data: { action: "ETB_CREDENTIAL_TEST_QUEUED", entityType: "EtbCredentialTestRun", entityId: run.id, actorUserId: admin.id, actorName: admin.name, actorRole: admin.role, after: { terminal } } });
  try { await dispatch(run.id); }
  catch {
    await prisma.etbCredentialTestRun.update({ where: { id: run.id }, data: { status: "FAILED", errorMessage: "验证进程启动失败", finishedAt: new Date() } });
    return NextResponse.json({ error: "验证进程启动失败，请稍后重试" }, { status: 503 });
  }
  return NextResponse.json(run, { status: 201 });
}
