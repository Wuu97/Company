import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";

const execFileAsync = promisify(execFile);

export async function POST() {
  let actor; try { actor = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  try {
    const { stdout, stderr } = await execFileAsync(
      join(process.cwd(), "node_modules/.bin/tsx"),
      [join(process.cwd(), "scripts/parse-so-files.ts")],
      { cwd: process.cwd(), timeout: 120_000 },
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
