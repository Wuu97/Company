import { prisma } from "@/lib/prisma";

type BindingInput = { driverId?: string | null; fleetOwnerId?: string | null; vehicleId?: string | null; settlementCarrierType: "OWN_FLEET" | "PARTNER_MONTHLY" | "TEMP_CASH" | "UNRESOLVED" };

/** Resolves submitted master IDs to immutable per-trip text snapshots. Omitted IDs are left to the caller as unchanged fields. */
export async function resolveTransportLegBinding(input: BindingInput) {
  const [driver, fleetOwner, vehicle] = await Promise.all([
    input.driverId ? prisma.driver.findUnique({ where: { id: input.driverId } }) : null,
    input.fleetOwnerId ? prisma.fleetOwner.findUnique({ where: { id: input.fleetOwnerId } }) : null,
    input.vehicleId ? prisma.vehicle.findUnique({ where: { id: input.vehicleId }, include: { fleetOwner: true } }) : null,
  ]);
  if (input.driverId && (!driver || !driver.active)) throw new Error("司机主档不存在或已停用");
  if (input.fleetOwnerId && (!fleetOwner || !fleetOwner.active)) throw new Error("合作车老板主档不存在或已停用");
  if (input.vehicleId && (!vehicle || !vehicle.active)) throw new Error("车辆主档不存在或已停用");
  if (input.settlementCarrierType === "PARTNER_MONTHLY" && !fleetOwner) throw new Error("合作车月结必须关联有效合作车老板主档");
  return { driverId: input.driverId ?? null, driverName: driver?.name ?? null, fleetOwnerId: input.fleetOwnerId ?? null, fleetOwnerName: fleetOwner?.name ?? null, vehicleId: input.vehicleId ?? null, vehicleNo: vehicle?.plateNumber ?? null, vehicleFleetOwnerHint: vehicle?.fleetOwner ? { id: vehicle.fleetOwner.id, name: vehicle.fleetOwner.name } : null };
}
