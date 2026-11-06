import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { actorFields } from "@/lib/audit";
import { authErrorResponse, requireFinancialAccess } from "@/lib/auth";
import { addSettlementLine } from "@/lib/settlement/bill-service";
const fee = z.object({ code: z.string().min(1), amount: z.string().regex(/^\d+(?:\.\d{1,2})?$/), participatesInSettlement: z.boolean(), bearer: z.enum(["COMPANY", "DRIVER", "PARTNER", "CUSTOMER", "THIRD_PARTY"]), includedInBaseRate: z.boolean() });
const schema = z.object({ transportTaskId: z.string(), transportLegId: z.string(), billingBasis: z.enum(["CONTAINER", "TRIP", "LEG", "COMBINATION", "ADHOC"]), combination: z.enum(["SINGLE", "DOUBLE_TRAILER", "SHARED_TRAILER"]), quantity: z.string().regex(/^\d+(?:\.\d{1,2})?$/), containerUnitId: z.string().optional(), transportBillingGroupId: z.string().optional(), manualFees: z.array(fee).optional(), deductions: z.array(z.object({ code: z.string(), amount: z.string().regex(/^\d+(?:\.\d{1,2})?$/) })).optional() });
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "结算明细资料无效" }, { status: 400 }); try { await requireFinancialAccess(); const id = (await params).id; return NextResponse.json(await prisma.$transaction(tx => addSettlementLine(tx, { ...parsed.data, billId: id })), { status: 201 }); } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "新增明细失败" }, { status: 409 }); } }

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let actor;
  try { actor = await requireFinancialAccess(); } catch (error) { return authErrorResponse(error); }
  try {
    const { id } = await params;
    const lineId = new URL(request.url).searchParams.get("lineId");
    if (!lineId) return NextResponse.json({ error: "缺少明细编号" }, { status: 400 });
    await prisma.$transaction(async tx => {
      const bill = await tx.settlementBill.findUnique({ where: { id } });
      if (!bill || !["DRAFT", "ADJUSTED"].includes(bill.confirmationStatus) || bill.paymentStatus !== "UNPAID") throw new Error("仅未收付款的草稿或已调整账单可移除明细");
      const line = await tx.settlementLine.findFirst({ where: { id: lineId, billId: id }, include: { _count: { select: { adjustments: true, paymentAllocations: true } } } });
      if (!line) throw new Error("明细不存在或不属于当前账单");
      if (line._count.adjustments || line._count.paymentAllocations) throw new Error("已关联调整或付款记录的明细不能移除");
      await tx.settlementUnitClaim.deleteMany({ where: { lineId } });
      await tx.settlementLineContainer.deleteMany({ where: { settlementLineId: lineId } });
      await tx.settlementLine.delete({ where: { id: lineId } });
      const totals = await tx.settlementLine.aggregate({ where: { billId: id }, _sum: { amountSnapshot: true } });
      await tx.settlementBill.update({ where: { id }, data: { totalAmount: totals._sum.amountSnapshot || "0" } });
      await tx.operationLog.create({ data: { action: "SETTLEMENT_LINE_REMOVED", entityType: "SettlementBill", entityId: id, ...actorFields(actor), before: { lineId, amountSnapshot: line.amountSnapshot.toFixed(2), settlementUnitKey: line.settlementUnitKey }, after: { totalAmount: totals._sum.amountSnapshot?.toFixed(2) || "0.00" } } });
    }, { isolationLevel: "Serializable" });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "移除失败" }, { status: 409 }); }
}
