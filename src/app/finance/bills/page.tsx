import { prisma } from "@/lib/prisma";
import { requireFinancialAccess } from "@/lib/auth";
import { SettlementBillsClient } from "./settlement-bills-client";

export default async function SettlementBillsPage() {
  await requireFinancialAccess();
  const [bills, drivers, owners, vehicles, customers] = await Promise.all([
    prisma.settlementBill.findMany({ include: { driver: { select: { name: true } }, fleetOwner: { select: { name: true } }, vehicle: { select: { plateNumber: true } }, customer: { select: { name: true } }, _count: { select: { lines: true } } }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.driver.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.fleetOwner.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.vehicle.findMany({ where: { active: true, fleetOwnerId: null }, select: { id: true, plateNumber: true, vehicleType: true }, orderBy: { plateNumber: "asc" } }),
    prisma.customer.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return <SettlementBillsClient initialBills={JSON.parse(JSON.stringify(bills))} options={{ DRIVER: drivers, PARTNER: owners, TEMP_VEHICLE: vehicles.map(vehicle => ({ id: vehicle.id, name: `${vehicle.plateNumber}${vehicle.vehicleType ? ` · ${vehicle.vehicleType}` : ""}` })), CUSTOMER: customers }} />;
}
