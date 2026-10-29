import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { ResourceRecords } from "@/components/resource-records";
export default async function DriversPage() { const rows = await prisma.driver.findMany({ orderBy: { name: "asc" } }); return <><PageHeader title="司机档案" description="维护司机基本资料，供派车、工资结算和路线工资模板选择。" /><ResourceRecords kind="drivers" rows={rows}/></>; }
