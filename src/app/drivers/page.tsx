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
    prisma.driver.findMany({
      where: {
        ...(status ? { active: status === "ACTIVE" } : {}),
        ...(q
          ? {
              OR: [
                  { plateNumber: { contains: q, mode: "insensitive" as const } },
                { code: { contains: q, mode: "insensitive" as const } },
                { name: { contains: q, mode: "insensitive" as const } },
                { phone: { contains: q, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
    }),
    prisma.driver.count({ where: {} }),
  ]);
  return (
    <ResourceRecords
      kind="drivers"
      rows={rows}
      q={q}
      status={status}
      archiveTotal={archiveTotal}
    />
  );
}
