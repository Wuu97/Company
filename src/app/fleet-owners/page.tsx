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
    prisma.fleetOwner.findMany({
      where: {
        ...(status ? { active: status === "ACTIVE" } : {}),
        ...(q
          ? {
              OR: [
                { code: { contains: q, mode: "insensitive" as const } },
                { name: { contains: q, mode: "insensitive" as const } },
                { phone: { contains: q, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
    }),
    prisma.fleetOwner.count({ where: {} }),
  ]);
  return (
    <ResourceRecords
      kind="fleet-owners"
      rows={rows}
      q={q}
      status={status}
      archiveTotal={archiveTotal}
    />
  );
}
