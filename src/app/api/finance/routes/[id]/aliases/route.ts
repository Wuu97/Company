import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireFinancialAccess } from "@/lib/auth";
const schema = z.object({ rawText: z.string().trim().min(1).max(300), normalizedText: z.string().trim().min(1).max(300), source: z.string().trim().max(120).optional().nullable(), note: z.string().trim().max(500).optional().nullable() });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "别名资料无效" }, { status: 400 }); try { await requireFinancialAccess(); return NextResponse.json(await prisma.routeAlias.create({ data: { ...parsed.data, routeId: (await params).id, status: "PENDING" } }), { status: 201 }); } catch (e) { return NextResponse.json({ error: e instanceof Error && /Unique/.test(e.message) ? "该路线已存在相同原始文本" : "别名无法保存" }, { status: 409 }); } }
