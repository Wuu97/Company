import { PrismaClient } from "@prisma/client";
import { actorFields } from "../src/lib/audit";
import { inferEtbTerminal } from "../src/lib/etb-terminal";

const db = new PrismaClient();

async function main() {
  const orderId = process.argv[2];
  if (!orderId) throw new Error("用法：tsx scripts/link-verified-so-sailing.ts <SO ID>");
  const actor = await db.appUser.findFirst({ where: { role: "ADMIN", active: true }, select: { id: true, name: true, role: true } });
  if (!actor) throw new Error("没有可归属审计记录的启用管理员账号");
  const result = await db.$transaction(async tx => {
    const order = await tx.soOrder.findUniqueOrThrow({ where: { id: orderId }, include: { containers: { where: { active: true } } } });
    if (!order.carrier || !order.vesselName || !order.voyage || !order.loadPort) throw new Error("SO 缺少船公司、船名、航次或装港，不能建立船期关联。");
    const terminal = inferEtbTerminal(order.fullReturnLocation) ?? inferEtbTerminal(order.loadPort);
    if (!terminal) throw new Error(`无法从装港识别 ETB 码头：${order.loadPort}`);
    const sailing = await tx.sailing.upsert({
      where: { terminal_carrier_vesselName_voyage: { terminal, carrier: order.carrier, vesselName: order.vesselName, voyage: order.voyage } },
      create: { terminal, carrier: order.carrier, vesselName: order.vesselName, voyage: order.voyage, loadPort: order.loadPort },
      update: { loadPort: order.loadPort },
    });
    if (!order.containers.length) {
      const extracted = (await tx.soFileVersion.findFirst({ where: { soOrderId: order.id }, orderBy: { version: "desc" }, select: { rawExtraction: true } }))?.rawExtraction as { containers?: { containerType: string; quantity: number }[] } | null;
      const units = (extracted?.containers || []).flatMap(item => Array.from({ length: item.quantity }, (_, index) => ({ soOrderId: order.id, containerType: item.containerType, internalCode: `IC-${order.id.slice(-6).toUpperCase()}-${String(index + 1).padStart(3, "0")}` })));
      if (!units.length) throw new Error("SO 未识别柜型和柜量，不能自动建立内部柜子。");
      await tx.containerUnit.createMany({ data: units });
    }
    const updated = await tx.soOrder.update({ where: { id: order.id }, data: { sailingId: sailing.id, parseStatus: "VERIFIED" } });
    await tx.operationLog.create({ data: { action: "SO_REVIEWED", entityType: "SoOrder", entityId: order.id, ...actorFields(actor), before: { parseStatus: order.parseStatus, sailingId: order.sailingId }, after: { soNumber: updated.soNumber, carrier: updated.carrier, vesselName: updated.vesselName, voyage: updated.voyage, sailingId: sailing.id, source: "PARSED_SO_VERIFIED_FOR_ETB" } } });
    return { orderId: updated.id, sailingId: sailing.id, terminal, vesselName: updated.vesselName, voyage: updated.voyage };
  });
  console.log(`LINK_SUMMARY=${JSON.stringify(result)}`);
}
main().finally(() => db.$disconnect());
