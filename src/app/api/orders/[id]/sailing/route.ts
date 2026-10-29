import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { actorFields } from "@/lib/audit";

const schema = z.object({ sailingId: z.string().cuid().nullable() });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = schema.safeParse(await request.json());
  if (!input.success) return NextResponse.json({ error: "船期关联资料无效" }, { status: 400 });
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  const { id } = await params;
  try {
    const order = await prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM "SoOrder" WHERE id=${id} FOR UPDATE`;
      const current = await tx.soOrder.findUnique({ where: { id }, select: { id: true, sailingId: true, carrier: true, vesselName: true, voyage: true } });
      if (!current) throw new Error("SO 不存在");
      if (input.data.sailingId) {
        const sailing = await tx.sailing.findUnique({ where: { id: input.data.sailingId }, select: { id: true, carrier: true, vesselName: true, voyage: true } });
        if (!sailing) throw new Error("船期不存在");
        if (!current.vesselName || !current.voyage || sailing.carrier !== current.carrier || sailing.vesselName !== current.vesselName || sailing.voyage !== current.voyage) throw new Error("只能关联与当前 SO 船名、航次一致的船期");
      }
      if (current.sailingId === input.data.sailingId) return current;
      const updated = await tx.soOrder.update({
        where: { id },
        data: {
          sailingId: input.data.sailingId,
          etbText: null,
          etbSource: null,
          etbObservedAt: null,
          etbNeedsReview: false,
        },
      });
      await tx.operationLog.create({ data: {
        action: input.data.sailingId ? "SO_SAILING_LINKED_MANUALLY" : "SO_SAILING_UNLINKED",
        entityType: "SoOrder", entityId: id, ...actorFields(actor),
        before: { sailingId: current.sailingId }, after: { sailingId: input.data.sailingId },
      } });
      return updated;
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "更新船期关联失败" }, { status: 409 });
  }
}
