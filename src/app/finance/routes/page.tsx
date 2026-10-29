import { prisma } from "@/lib/prisma";
import { requireFinancialAccess } from "@/lib/auth";
import { RouteManagementClient } from "./route-management-client";

export default async function RouteManagement() {
  await requireFinancialAccess();
  const [routes, drivers, fleetOwners, customers, factories] = await Promise.all([
    prisma.route.findMany({ orderBy: { code: "asc" }, include: { aliases: true, prices: { select: { id: true, billType: true, status: true, scope: true, customerId: true, driverId: true, fleetOwnerId: true, factoryId: true, unitPrice: true, applicableContainerTypes: true, factory: { select: { name: true } }, customer: { select: { factories: { select: { name: true }, orderBy: { name: "asc" } } } } } } } }),
    prisma.driver.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.fleetOwner.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.customer.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.factory.findMany({ select: { id: true, name: true, customer: { select: { name: true } } }, orderBy: { name: "asc" } }),
  ]);
  return <RouteManagementClient initialRoutes={JSON.parse(JSON.stringify(routes))} settlementOptions={{ drivers, fleetOwners, customers, factories: factories.map(factory => ({ id: factory.id, name: `${factory.customer.name} · ${factory.name}` })) }} />;
}
