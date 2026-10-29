import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";
import { etbAutoLinkEligibility } from "@/lib/etb-sailing-link";
import { normalizeCarrierName } from "@/lib/carrier-name";

const schema = z.object({
  customerId: z.string().min(1).optional(),
  soNumber: z.string().min(1),
  carrier: z.string().min(1),
  siCutoffText: z.string().optional(),
  containers: z.array(z.object({
    containerType: z.string().min(1),
    quantity: z.number().int().min(1).default(1),
  })),
});

function summarizeContainers(items: Array<{ containerType: string; quantity: number }>) {
  return Object.fromEntries(Object.entries(items.reduce<Record<string, number>>(
    (total, item) => ({ ...total, [item.containerType]: (total[item.containerType] || 0) + item.quantity }),
    {},
  )).sort());
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "核对资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  try {
    const order = await prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${id} FOR UPDATE`;
      const before = await tx.soOrder.findUniqueOrThrow({ where: { id } });
      if (input.data.customerId) {
        const customer = await tx.customer.findUnique({ where: { id: input.data.customerId }, select: { id: true } });
        if (!customer) throw new Error("客户不存在");
      }

      const current = await tx.containerUnit.findMany({
        where: { soOrderId: id, active: true },
        select: { containerType: true },
      });
      const requested = summarizeContainers(input.data.containers);
      const existing = summarizeContainers(current.map(item => ({ containerType: item.containerType, quantity: 1 })));
      if (current.length && JSON.stringify(requested) !== JSON.stringify(existing)) {
        throw new Error("柜型或柜量与已创建内部柜子不一致；请使用柜量调整流程。");
      }

      const manualSiCutoff = input.data.siCutoffText?.trim();
      const updated = await tx.soOrder.update({
        where: { id },
        data: {
          customerId: input.data.customerId || before.customerId,
          soNumber: input.data.soNumber,
          carrier: normalizeCarrierName(input.data.carrier),
          siCutoffText: manualSiCutoff || before.siCutoffText,
          siCutoffSource: manualSiCutoff ? "MANUAL" : before.siCutoffSource,
          siCutoffEstimatedFromText: manualSiCutoff ? null : before.siCutoffEstimatedFromText,
          parseStatus: "VERIFIED",
        },
      });

      if (!current.length) {
        const historicalCount = await tx.containerUnit.count({ where: { soOrderId: id } });
        const rows = input.data.containers.flatMap(item => Array.from(
          { length: item.quantity },
          () => ({ soOrderId: id, containerType: item.containerType }),
        ));
        await tx.containerUnit.createMany({
          data: rows.map((row, index) => ({
            ...row,
            internalCode: `IC-${id.slice(-6).toUpperCase()}-${String(historicalCount + index + 1).padStart(3, "0")}`,
          })),
        });
      }

      let result = updated;
      // Human review is the business confirmation. A parser's earlier uncertainty
      // must not prevent a complete, reviewed SO from being included in its sailing.
      const eligibility = etbAutoLinkEligibility({ ...updated, parseReview: { needsReview: false } });
      if (eligibility.eligible) {
        const sailing = await tx.sailing.upsert({
          where: { terminal_carrier_vesselName_voyage: { terminal: eligibility.terminal, carrier: updated.carrier, vesselName: updated.vesselName!, voyage: updated.voyage! } },
          create: { terminal: eligibility.terminal, carrier: updated.carrier, vesselName: updated.vesselName!, voyage: updated.voyage!, loadPort: updated.loadPort! },
          update: { loadPort: updated.loadPort! },
        });
        if (before.sailingId !== sailing.id) {
          result = await tx.soOrder.update({ where: { id }, data: { sailingId: sailing.id, etbText: null, etbSource: null, etbObservedAt: null, etbNeedsReview: false } });
          await tx.operationLog.create({ data: { action: "SO_ETB_SAILING_AUTO_LINKED", entityType: "SoOrder", entityId: id, ...actorFields(actor), before: { sailingId: before.sailingId }, after: { sailingId: sailing.id, terminal: eligibility.terminal, source: "VERIFIED_SO" } } });
        }
      } else if (before.sailingId) {
        result = await tx.soOrder.update({ where: { id }, data: { sailingId: null, etbText: null, etbSource: null, etbObservedAt: null, etbNeedsReview: false } });
        await tx.operationLog.create({ data: { action: "SO_SAILING_UNLINKED", entityType: "SoOrder", entityId: id, ...actorFields(actor), before: { sailingId: before.sailingId }, after: { source: "VERIFIED_SO_MISSING_SAILING_DATA" } } });
      }

      await tx.operationLog.create({
        data: {
          action: "SO_REVIEWED",
          entityType: "SoOrder",
          entityId: id,
          ...actorFields(actor),
          before: { soNumber: before.soNumber, carrier: before.carrier, siCutoffText: before.siCutoffText },
          after: input.data,
        },
      });
      return result;
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SO 核对失败" },
      { status: 409 },
    );
  }
}
