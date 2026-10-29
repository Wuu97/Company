import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireFinancialAccess } from "@/lib/auth";
import { addSettlementLine } from "@/lib/settlement/bill-service";
const fee = z.object({ code: z.string().min(1), amount: z.string().regex(/^\d+(?:\.\d{1,2})?$/), participatesInSettlement: z.boolean(), bearer: z.enum(["COMPANY", "DRIVER", "PARTNER", "CUSTOMER", "THIRD_PARTY"]), includedInBaseRate: z.boolean() });
const schema = z.object({ transportTaskId: z.string(), transportLegId: z.string(), billingBasis: z.enum(["CONTAINER", "TRIP", "LEG", "COMBINATION", "ADHOC"]), combination: z.enum(["SINGLE", "DOUBLE_TRAILER", "SHARED_TRAILER"]), quantity: z.string().regex(/^\d+(?:\.\d{1,2})?$/), containerUnitId: z.string().optional(), transportBillingGroupId: z.string().optional(), manualFees: z.array(fee).optional(), deductions: z.array(z.object({ code: z.string(), amount: z.string().regex(/^\d+(?:\.\d{1,2})?$/) })).optional() });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "结算明细资料无效" }, { status: 400 }); try { await requireFinancialAccess(); const id = (await params).id; return NextResponse.json(await prisma.$transaction(tx => addSettlementLine(tx, { ...parsed.data, billId: id })), { status: 201 }); } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "新增明细失败" }, { status: 409 }); } }
