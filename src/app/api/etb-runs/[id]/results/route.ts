import { NextResponse } from "next/server";
import { z } from "zod";
import { completeEtbQueryRun } from "@/lib/etb-query";
import { EtbManualHandoffRequiredError, etbQueryFailureState } from "@/lib/etb-query";
import { prisma } from "@/lib/prisma";

const resultSchema = z.object({
  carrier: z.string().trim().min(1).max(120),
  vesselName: z.string().trim().min(1).max(160),
  voyage: z.string().trim().min(1).max(100),
  etbAt: z.coerce.date(),
  sourceUrl: z.string().url().max(2000).optional(),
  screenshotStorageKey: z.string().trim().min(1).max(500).optional(),
});
const schema = z.object({ source: z.string().trim().min(1).max(100), results: z.array(resultSchema).max(500) });

function workerAuthorized(request: Request) {
  const token = process.env.ETB_WORKER_TOKEN;
  if (!token) return null;
  return request.headers.get("authorization") === `Bearer ${token}`;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorized = workerAuthorized(request);
  if (authorized === null) return NextResponse.json({ error: "未配置 ETB_WORKER_TOKEN，拒绝接收采集器结果" }, { status: 503 });
  if (!authorized) return NextResponse.json({ error: "ETB 采集器身份验证失败" }, { status: 401 });
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "ETB 查询结果格式无效" }, { status: 400 });
  try {
    return NextResponse.json(await completeEtbQueryRun({ runId: (await params).id, ...input.data }));
  } catch (error) {
    if (error instanceof EtbManualHandoffRequiredError) {
      return NextResponse.json(await prisma.etbQueryRun.update({ where: { id: (await params).id }, data: { ...etbQueryFailureState(error), finishedAt: new Date() } }));
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "ETB 结果入库失败" }, { status: 409 });
  }
}
