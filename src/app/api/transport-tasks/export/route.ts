import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireFinancialAccess } from "@/lib/auth";

const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const format = (value?: Date | null) => value ? value.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false }) : "";

export async function GET() {
  try { await requireFinancialAccess(); } catch (error) { return authErrorResponse(error); }
  const tasks = await prisma.transportTask.findMany({
    include: {
      loadingPlan: { include: { soOrder: { include: { customer: true } }, factory: true } },
      legs: { orderBy: { sequence: "asc" } },
      costs: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { scheduledAt: "asc" },
    take: 10_000,
  });
  const header = ["SO编号", "客户", "工厂", "任务状态", "计划时间", "运输段", "段状态", "车牌", "司机", "司机电话", "提柜码头", "工厂地点", "还柜码头", "实际还柜时间", "费用合计（按币种）", "费用明细", "任务备注"];
  const lines = [header.map(escape).join(",")];
  for (const task of tasks) {
    const total = Object.entries(task.costs.reduce<Record<string, number>>((all, cost) => ({ ...all, [cost.currency]: (all[cost.currency] || 0) + Number(cost.amount.toString()) }), {})).map(([currency, amount]) => `${amount.toFixed(2)} ${currency}`).join("；");
    const costDetails = task.costs.map(cost => `${cost.category}:${cost.amount.toString()} ${cost.currency}${cost.vendorName ? `(${cost.vendorName})` : ""}`).join("；");
    const legs = task.legs.length ? task.legs : [null];
    for (const leg of legs) lines.push([
      task.loadingPlan.soOrder.soNumber, task.loadingPlan.soOrder.customer?.name, task.loadingPlan.factory.name, task.status, format(task.scheduledAt),
      leg?.sequence ?? "", leg?.status ?? "", leg?.vehicleNo, leg?.driverName, leg?.driverPhone, leg?.pickupTerminal, leg?.factoryLocation, leg?.returnTerminal, format(leg?.actualReturnAt), total, costDetails, task.note,
    ].map(escape).join(","));
  }
  const filename = `transport-tasks-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(`\uFEFF${lines.join("\r\n")}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${filename}"` } });
}
