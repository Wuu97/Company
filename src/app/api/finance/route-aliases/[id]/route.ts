import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireFinancialAccess } from "@/lib/auth";
const schema = z.object({ status: z.enum(["PENDING", "CONFIRMED", "REJECTED"]), routeId: z.string().optional().nullable(), note: z.string().trim().max(500).optional().nullable() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "别名状态无效" }, { status: 400 }); try { await requireFinancialAccess(); const data = { ...parsed.data, confirmedAt: parsed.data.status === "CONFIRMED" ? new Date() : null }; return NextResponse.json(await prisma.routeAlias.update({ where: { id: (await params).id }, data })); } catch (e) { return authErrorResponse(e); } }
