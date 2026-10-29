import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const record = z.object({ code: z.string().trim().min(1).max(40), name: z.string().trim().min(1).max(120), phone: z.string().trim().max(40).nullable().optional(), active: z.boolean().default(true) });
const vehicle = z.object({ plateNumber: z.string().trim().min(1).max(40), vehicleType: z.string().trim().max(80).nullable().optional(), active: z.boolean().default(true) });
const valid = (kind: string) => kind === "drivers" || kind === "fleet-owners" || kind === "temporary-vehicles";
export async function POST(request: Request, { params }: { params: Promise<{ kind: string }> }) { const { kind } = await params; if (!valid(kind)) return NextResponse.json({ error: "档案类型无效" }, { status: 404 }); const parsed = (kind === "temporary-vehicles" ? vehicle : record).safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "档案资料无效" }, { status: 400 }); const actor = await currentUser(); if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 }); try { const created = await prisma.$transaction(async tx => { const value = kind === "drivers" ? await tx.driver.create({ data: parsed.data as z.infer<typeof record> }) : kind === "fleet-owners" ? await tx.fleetOwner.create({ data: parsed.data as z.infer<typeof record> }) : await tx.vehicle.create({ data: { ...(parsed.data as z.infer<typeof vehicle>), fleetOwnerId: null } }); await tx.operationLog.create({ data: { action: "RESOURCE_CREATED", entityType: kind, entityId: value.id, ...actorFields(actor), after: parsed.data } }); return value; }); return NextResponse.json(created, { status: 201 }); } catch { return NextResponse.json({ error: kind === "temporary-vehicles" ? "车牌号已存在" : "编码已存在" }, { status: 409 }); } }
