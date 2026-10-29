import { NextResponse } from "next/server";
import { z } from "zod";
import { requireFinancialAccess, authErrorResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { matchRoutePriceFromDatabase } from "@/lib/settlement/route-price-repository";
const schema = z.object({ billType: z.enum(["DRIVER", "PARTNER", "CUSTOMER"]), routeCode: z.string().min(1), businessDate: z.string().date(), settlementObjectId: z.string().optional(), factoryId: z.string().optional(), billingBasis: z.enum(["CONTAINER", "TRIP", "LEG", "COMBINATION", "ADHOC"]), combination: z.enum(["SINGLE", "DOUBLE_TRAILER", "SHARED_TRAILER"]), containerType: z.string().optional(), vehicleType: z.string().optional() });
export async function POST(request: Request) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "匹配条件无效" }, { status: 400 }); try { await requireFinancialAccess(); return NextResponse.json(await matchRoutePriceFromDatabase(prisma, parsed.data)); } catch (e) { return authErrorResponse(e); } }
