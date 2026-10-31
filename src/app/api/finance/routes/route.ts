import { businessCode } from "@/lib/business-code";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireFinancialAccess } from "@/lib/auth";

const optionalMoney = z.string().regex(/^\d+(?:\.\d{1,2})?$/).optional().nullable();
const schema = z.object({ code: z.string().trim().min(1).max(40).optional(), name: z.string().trim().min(1).max(160), origin: z.string().trim().min(1).max(120), destination: z.string().trim().min(1).max(120), viaPoints: z.string().trim().max(500).optional().nullable(), routeType: z.enum(["ONE_WAY", "ROUND_TRIP", "MULTI_LEG"]), standardKilometers: optionalMoney, standardToll: optionalMoney, standardFuel: optionalMoney, applicableVehicleTypes: z.array(z.string().trim().min(1).max(40)).default([]), applicableContainerTypes: z.array(z.string().trim().min(1).max(40)).default([]), note: z.string().trim().max(1000).optional().nullable() });

export async function GET(request: Request) {
  try { await requireFinancialAccess(); } catch (error) { return authErrorResponse(error); }
  const q = new URL(request.url).searchParams.get("q")?.trim();
  return NextResponse.json(await prisma.route.findMany({ where: q ? { OR: [{ code: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }, { origin: { contains: q, mode: "insensitive" } }, { destination: { contains: q, mode: "insensitive" } }] } : {}, orderBy: { code: "asc" }, include: { aliases: { where: { status: "CONFIRMED" } }, prices: { where: { status: "CONFIRMED" }, select: { id: true, billType: true, scope: true, effectiveFrom: true, effectiveTo: true } } } }));
}

export async function POST(request: Request) {
  const input = schema.safeParse(await request.json()); if (!input.success) return NextResponse.json({ error: "路线资料无效" }, { status: 400 });
  try { await requireFinancialAccess(); } catch (error) { return authErrorResponse(error); }
  try { return NextResponse.json(await prisma.route.create({ data: { ...input.data, code: businessCode("ROUTE") } }), { status: 201 }); } catch { return NextResponse.json({ error: "路线资料无法保存" }, { status: 409 }); }
}
