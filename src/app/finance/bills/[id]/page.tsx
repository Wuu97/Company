import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireFinancialAccess } from "@/lib/auth";
import { SettlementBillDetailClient } from "./settlement-bill-detail-client";
export default async function SettlementBillDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireFinancialAccess(); const id = (await params).id;
  const bill = await prisma.settlementBill.findUnique({ where: { id }, include: { driver: true, fleetOwner: true, vehicle: true, customer: true, lines: { include: { route: true, transportTask: { include: { loadingPlan: { include: { soOrder: true, factory: true } } } }, transportLeg: { include: { driver: true, fleetOwner: true, vehicle: true } }, containerUnit: true }, orderBy: { businessDate: "asc" } } } });
  if (!bill) notFound();
  const taskWhere = bill.billType === "DRIVER" ? { status: "COMPLETED" as const, legs: { some: { status: "COMPLETED" as const, driverId: bill.driverId, routeId: { not: null } } } } : bill.billType === "PARTNER" ? { status: "COMPLETED" as const, legs: { some: { status: "COMPLETED" as const, fleetOwnerId: bill.fleetOwnerId, settlementCarrierType: "PARTNER_MONTHLY" as const, routeId: { not: null } } } } : bill.billType === "TEMP_VEHICLE" ? { status: "COMPLETED" as const, legs: { some: { status: "COMPLETED" as const, vehicleId: bill.vehicleId, settlementCarrierType: "TEMP_CASH" as const, routeId: { not: null } } } } : { status: "COMPLETED" as const, loadingPlan: { soOrder: { customerId: bill.customerId } }, legs: { some: { status: "COMPLETED" as const, routeId: { not: null } } } };
  const tasks = await prisma.transportTask.findMany({ where: taskWhere, include: { loadingPlan: { include: { soOrder: true, items: { where: { active: true }, include: { containerUnit: true } } } }, legs: { where: { status: "COMPLETED", routeId: { not: null } }, include: { route: true, vehicle: true } } }, orderBy: { completedAt: "desc" }, take: 300 });
  return <SettlementBillDetailClient bill={JSON.parse(JSON.stringify(bill))} candidates={JSON.parse(JSON.stringify(tasks))} />;
}
