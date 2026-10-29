import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { ResourceRecords } from "@/components/resource-records";
export default async function FleetOwnersPage() { const rows = await prisma.fleetOwner.findMany({ orderBy: { name: "asc" } }); return <><PageHeader title="合作车资料" description="维护合作车老板或车队资料，供派车及合作车月结选择。" /><ResourceRecords kind="fleet-owners" rows={rows}/></>; }
