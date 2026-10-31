import { prisma } from "@/lib/prisma";
import { ResourceRecords } from "@/components/resource-records";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const input = await searchParams;
  const q = input.q?.trim() || "";
  const status =
    input.status === "ACTIVE" || input.status === "INACTIVE"
      ? input.status
      : "";
  const [rows, archiveTotal] = await Promise.all([
    prisma.vehicle.findMany({
      where: {
        fleetOwnerId: null,
        ...(status ? { active: status === "ACTIVE" } : {}),
        ...(q
          ? {
              OR: [
                { plateNumber: { contains: q, mode: "insensitive" as const } },
                { phone: { contains: q, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { plateNumber: "asc" },
    }),
    prisma.vehicle.count({ where: { fleetOwnerId: null } }),
  ]);
  return (
    <ResourceRecords
      kind="temporary-vehicles"
      rows={rows}
      q={q}
      status={status}
      archiveTotal={archiveTotal}
    />
  );
}
