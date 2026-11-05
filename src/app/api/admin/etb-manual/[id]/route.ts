import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
export const runtime = "nodejs";
async function proxy(request: Request, params: Promise<{ id: string }>) {
  let admin;
  try { admin = await requireAdmin(); } catch (error) { return authErrorResponse(error); }
  if (request.method === "POST" && request.headers.get("origin") !== new URL(request.url).origin) return new Response(null, { status: 403 });
  const { id } = await params;
  let run = await prisma.etbCredentialTestRun.findUnique({ where: { id }, select: { status: true } });
  if (!run) run = await prisma.etbQueryRun.findUnique({ where: { id }, select: { status: true } });
  if (run?.status !== "AWAITING_MANUAL") return Response.json({ error: "人工验证已结束或尚未开始" }, { status: 409 });
  if (!process.env.ETB_WORKER_INTERNAL_URL || !process.env.ETB_WORKER_TOKEN) return Response.json({ error: "尚未配置云端验证服务" }, { status: 503 });
  let body: string | undefined;
  if (request.method === "POST") {
    const input = z.object({ points: z.array(z.object({ x: z.number().min(0).max(1200), y: z.number().min(0).max(800) })).min(1).max(60) }).safeParse(await request.json().catch(() => null));
    if (!input.success) return new Response(null, { status: 400 });
    body = JSON.stringify(input.data);
  }
  try {
    const response = await fetch(new URL("/sessions/" + encodeURIComponent(id), process.env.ETB_WORKER_INTERNAL_URL), { method: request.method, headers: { authorization: "Bearer " + process.env.ETB_WORKER_TOKEN, "content-type": "application/json" }, body, cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) return Response.json({ error: "验证窗口暂不可用，请刷新重试" }, { status: response.status });
    if (request.method === "POST") await prisma.operationLog.create({ data: { action: "ETB_MANUAL_INPUT", entityType: "EtbCredentialTestRun", entityId: id, actorUserId: admin.id, actorName: admin.name, actorRole: admin.role } });
    return new Response(await response.arrayBuffer(), { headers: { "content-type": response.headers.get("content-type") || "text/plain", "cache-control": "no-store" } });
  } catch { return Response.json({ error: "云端验证服务暂不可用" }, { status: 503 }); }
}
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) { return proxy(request, params); }
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) { return proxy(request, params); }
