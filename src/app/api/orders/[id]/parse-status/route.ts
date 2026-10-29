import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
import { etbAutoLinkEligibility } from "@/lib/etb-sailing-link";

const schema = z.object({ status: z.enum(["PARSED", "VERIFIED"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "解析状态无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  try {
    const order = await prisma.$transaction(async tx => {
      const before = await tx.soOrder.findUniqueOrThrow({ where: { id } });
      if (!["PARSED", "VERIFIED"].includes(before.parseStatus)) throw new Error("仅已解析的 SO 可以标记为已核对或恢复为已解析");
      let updated = await tx.soOrder.update({ where: { id }, data: { parseStatus: input.data.status } });
      let sailingSync = "UNCHANGED";
      if (input.data.status === "VERIFIED") {
        // The compact “已核对” control is a valid business confirmation too.
        // Keep its behavior consistent with the full SO review form.
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
        }
      } else if (before.sailingId) {
        updated = await tx.soOrder.update({ where: { id }, data: { sailingId: null, etbText: null, etbSource: null, etbObservedAt: null, etbNeedsReview: false } });
        sailingSync = "CLEARED";
      }
      await tx.operationLog.create({ data: { action: "SO_PARSE_STATUS_UPDATED", entityType: "SoOrder", entityId: id, ...actorFields(actor), before: { parseStatus: before.parseStatus, sailingId: before.sailingId }, after: { parseStatus: input.data.status, sailingId: updated.sailingId, sailingSync } } });
      return updated;
    });
    return NextResponse.json(order);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "解析状态更新失败" }, { status: 409 }); }
}
