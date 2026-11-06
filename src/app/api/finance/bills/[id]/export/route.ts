import { requireFinancialAccess, authErrorResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildBillWorkbook } from "@/lib/settlement/bill-excel";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireFinancialAccess();
    const bill = await prisma.settlementBill.findUnique({ where: { id: (await params).id }, include: { customer: true, driver: true, fleetOwner: true, vehicle: true, lines: { include: { route: true, containerUnit: true, transportLeg: { include: { vehicle: true } }, transportTask: { include: { loadingPlan: { include: { factory: true, soOrder: true } } } } }, orderBy: [{ businessDate: "asc" }, { id: "asc" }] } } });
    if (!bill) return Response.json({ error: "账单不存在" }, { status: 404 });
    const workbook = await buildBillWorkbook(bill); const buffer = await workbook.xlsx.writeBuffer();
    return new Response(new Uint8Array(buffer), { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(bill.billNo.replace(/-\d+$/, ""))}.xlsx`, "Cache-Control": "no-store" } });
  } catch (error) { return authErrorResponse(error); }
}
