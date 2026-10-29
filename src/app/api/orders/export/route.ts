import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { resolveOpeningTime } from "@/lib/time";

const orderStatuses = ["PENDING_REVIEW", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
const parseStatuses = ["PENDING", "PROCESSING", "PARSED", "FAILED", "VERIFIED"] as const;
const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export async function GET(request: Request) {
  if (!await currentUser()) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const url = new URL(request.url); const q = url.searchParams.get("q")?.trim() || "";
  const status = url.searchParams.get("status"); const parseStatus = url.searchParams.get("parseStatus"); const customerId = url.searchParams.get("customerId");
  const where: Prisma.SoOrderWhereInput = {
    ...(orderStatuses.includes(status as (typeof orderStatuses)[number]) ? { status: status as (typeof orderStatuses)[number] } : {}),
    ...(parseStatuses.includes(parseStatus as (typeof parseStatuses)[number]) ? { parseStatus: parseStatus as (typeof parseStatuses)[number] } : {}),
    ...(customerId ? { customerId } : {}),
    ...(q ? { OR: [{ soNumber: { contains: q, mode: "insensitive" } }, { carrier: { contains: q, mode: "insensitive" } }, { vesselName: { contains: q, mode: "insensitive" } }, { voyage: { contains: q, mode: "insensitive" } }] } : {}),
  };
  const orders = await prisma.soOrder.findMany({ where, include: { customer: true, containers: { where: { active: true } }, sailing: true }, orderBy: { createdAt: "desc" }, take: 10_000 });
  const lines = [["SO 编号", "客户", "船公司", "船名", "航次", "装货港", "卸货港", "柜量", "预计开船时间（ETD）", "预计到港时间（ETA）", "补料截止时间（SI）", "预计靠港时间", "业务状态", "解析状态"].map(escape).join(",")];
  lines[0] = lines[0].replace("预计靠泊时间", "预计靠泊时间（ETB）\",\"开仓时间");
  for (const order of orders) {
    const containers = Object.entries(order.containers.reduce<Record<string, number>>((total, item) => ({ ...total, [item.containerType]: (total[item.containerType] || 0) + 1 }), {})).map(([type, quantity]) => `${quantity} × ${type}`).join("；");
    lines.push([order.soNumber, order.customer?.name, order.carrier, order.vesselName, order.voyage, order.loadPort, order.dischargePort, containers, order.etdText, order.etaText, order.siCutoffText, order.etbText, resolveOpeningTime(order.openingText, order.portCutoffText)?.value, order.status, order.parseStatus].map(escape).join(","));
  }
  const filename = `so-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(`\uFEFF${lines.join("\r\n")}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${filename}"` } });
}
