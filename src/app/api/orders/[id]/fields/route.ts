import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
import { normalizeCarrierName } from "@/lib/carrier-name";
import { etbAutoLinkEligibility } from "@/lib/etb-sailing-link";

const fields = ["customerId", "carrier", "vesselName", "voyage", "etbText", "openingText", "siCutoffText", "portCutoffText", "etaText", "etdText", "emptyPickupLocation", "fullReturnLocation"] as const;
const schema = z.object({ field: z.enum(fields), value: z.string().trim().min(1) });
const sailingFields = new Set(["carrier", "vesselName", "voyage", "fullReturnLocation"]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "填写内容无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  try {
    const order = await prisma.$transaction(async tx => {
      const before = await tx.soOrder.findUniqueOrThrow({ where: { id } });
      const { field, value } = input.data;
      if (field === "customerId" && !await tx.customer.findUnique({ where: { id: value }, select: { id: true } })) throw new Error("客户不存在");
      const data: Prisma.SoOrderUpdateInput = field === "customerId" ? { customer: { connect: { id: value } } } : { [field]: field === "carrier" ? normalizeCarrierName(value) : value };
      if (field === "siCutoffText") Object.assign(data, { siCutoffSource: "MANUAL", siCutoffEstimatedFromText: null });
      if (field === "etbText") Object.assign(data, { etbSource: "MANUAL", etbObservedAt: new Date(), etbNeedsReview: false });
      let updated = await tx.soOrder.update({ where: { id }, data });
      let sailingSync = "UNCHANGED";
      if (sailingFields.has(field) && updated.parseStatus === "VERIFIED") {
        const eligibility = etbAutoLinkEligibility({ ...updated, parseReview: { needsReview: false } });
        if (eligibility.eligible) {
          const sailing = await tx.sailing.upsert({
            where: { terminal_carrier_vesselName_voyage: { terminal: eligibility.terminal, carrier: updated.carrier, vesselName: updated.vesselName!, voyage: updated.voyage! } },
            create: { terminal: eligibility.terminal, carrier: updated.carrier, vesselName: updated.vesselName!, voyage: updated.voyage!, loadPort: updated.loadPort! },
            update: { loadPort: updated.loadPort! },
          });
          if (before.sailingId !== sailing.id) {
            updated = await tx.soOrder.update({ where: { id }, data: { sailingId: sailing.id, etbText: null, etbSource: null, etbObservedAt: null, etbNeedsReview: false } });
            sailingSync = "RELINKED";
          }
        } else if (before.sailingId) {
          updated = await tx.soOrder.update({ where: { id }, data: { sailingId: null, etbText: null, etbSource: null, etbObservedAt: null, etbNeedsReview: false } });
          sailingSync = "CLEARED";
        }
      }
      await tx.operationLog.create({ data: { action: "SO_FIELD_UPDATED", entityType: "SoOrder", entityId: id, ...actorFields(actor), before: { [field]: field === "customerId" ? before.customerId : before[field], sailingId: before.sailingId }, after: { [field]: value, sailingId: updated.sailingId, sailingSync } } });
      return updated;
    });
    return NextResponse.json(order);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "保存失败" }, { status: 409 }); }
}
