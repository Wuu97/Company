import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";
import { authErrorResponse, requireFinancialAccess } from "@/lib/auth";

const money = z.string().regex(/^\d+(?:\.\d{1,2})?$/).nullable().optional();
const schema = z.object({ name: z.string().trim().min(1).max(160), origin: z.string().trim().min(1).max(120), destination: z.string().trim().min(1).max(120), viaPoints: z.string().trim().max(500).nullable().optional(), routeType: z.enum(["ONE_WAY", "ROUND_TRIP", "MULTI_LEG"]), standardKilometers: money, standardToll: money, standardFuel: money, applicableVehicleTypes: z.array(z.string()).default([]), applicableContainerTypes: z.array(z.string()).default([]), note: z.string().trim().max(1000).nullable().optional(), active: z.boolean() });
const include = { aliases: { orderBy: { createdAt: "desc" as const } }, prices: { include: { fees: { orderBy: { sortOrder: "asc" as const } }, driver: { select: { id: true, name: true } }, fleetOwner: { select: { id: true, name: true } }, customer: { select: { id: true, name: true } }, factory: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" as const } } };
function sameValue(before: unknown, after: unknown) {
  if (before === null || before === undefined || before === "") return after === null || after === undefined || after === "";
  if (Array.isArray(before) || Array.isArray(after)) return JSON.stringify(before || []) === JSON.stringify(after || []);
  return String(before) === String(after);
}
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { try { await requireFinancialAccess(); const item = await prisma.route.findUnique({ where: { id: (await params).id }, include }); return item ? NextResponse.json(item) : NextResponse.json({ error: "路线不存在" }, { status: 404 }); } catch (e) { return authErrorResponse(e); } }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "路线资料无效" }, { status: 400 }); try { const actor = await requireFinancialAccess(); const id = (await params).id; const value = await prisma.$transaction(async tx => { const before = await tx.route.findUnique({ where: { id } }); if (!before) throw new Error("路线不存在"); const changes = Object.entries(parsed.data).filter(([key, after]) => !sameValue((before as unknown as Record<string, unknown>)[key], after)); const updated = await tx.route.update({ where: { id }, data: parsed.data }); if (changes.length) { const auditBefore = JSON.parse(JSON.stringify(Object.fromEntries(changes.map(([key]) => [key, (before as unknown as Record<string, unknown>)[key]])))) as Prisma.InputJsonValue; const auditAfter = Object.fromEntries(changes) as Prisma.InputJsonValue; await tx.operationLog.create({ data: { action: "ROUTE_UPDATED", entityType: "Route", entityId: id, ...actorFields(actor), before: auditBefore, after: auditAfter } }); } return updated; }); return NextResponse.json(value); } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "更新失败" }, { status: 409 }); } }
