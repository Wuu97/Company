import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";

const execFileAsync = promisify(execFile);

export async function POST(request:Request) {
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  try {
    const body = await request.json().catch(() => ({})) as { orderId?: string; fileIds?: string[]; reparse?: boolean };
    const fileIds = Array.isArray(body.fileIds) ? body.fileIds.filter((id): id is string => typeof id === "string" && id.length > 0) : [];
    const file = body.orderId ? await prisma.soFileVersion.findFirst({ where: { soOrderId: body.orderId, parseStatus: body.reparse ? "PARSED" : { in: ["PENDING", "FAILED"] }, ...(body.reparse ? { soOrder: { parseStatus: { in: ["PARSED", "VERIFIED"] } } } : {}) }, orderBy: { version: "desc" } }) : null;
    if (body.orderId && !file) return NextResponse.json({ error: "该 SO 没有可识别的上传文件。" }, { status: 409 });
    const { stdout, stderr } = await execFileAsync(
      join(process.cwd(), "node_modules/.bin/tsx"),
      [join(process.cwd(), "scripts/parse-so-files.ts")],
      { cwd: process.cwd(), timeout: 120_000, env: { ...process.env, ...(fileIds.length ? { SO_FILE_VERSION_IDS: fileIds.join(",") } : file ? { SO_FILE_VERSION_ID: file.id, ...(file.parseStatus === "FAILED" ? { RETRY_FAILED: "1" } : {}), ...(body.reparse ? { REPARSE_PARSED: "1" } : {}) } : {}) } },
    );
    const summary = stdout.match(/PARSE_SUMMARY=(.+)$/m)?.[1];
    const result = summary ? JSON.parse(summary) : { processedCount: 0, failedCount: 0 };

    await prisma.operationLog.create({ data: { action: "SO_PARSE_JOB_COMPLETED", entityType: "System", entityId: "so-parser", ...actorFields(actor), after: result } });
    return NextResponse.json({ ok: true, ...result, output: stdout, errors: stderr });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "解析任务失败" },
      { status: 500 },
    );
  }
}
