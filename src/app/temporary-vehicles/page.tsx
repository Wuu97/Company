import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { ResourceRecords } from "@/components/resource-records";
export default async function TemporaryVehiclesPage() { const rows = await prisma.vehicle.findMany({ where: { fleetOwnerId: null }, orderBy: { plateNumber: "asc" } }); return <><PageHeader title="临时车资料" description="维护临时现金车资料；不会默认纳入合作车月结。" /><ResourceRecords kind="temporary-vehicles" rows={rows}/></>; }
