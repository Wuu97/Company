import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
function openingToDate(value: string) { const match = value.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})\s+(\d{1,2}):(\d{2})/); if (!match) return; const [, day, month, year, hour, minute] = match; const date = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute}+08:00`); return Number.isNaN(date.valueOf()) ? undefined : date; }
async function main() {
  let created = 0;
  try {
    const now = new Date();
    const orders = await db.soOrder.findMany({ where: { openingText: { not: null } }, select: { id: true, soNumber: true, openingText: true, containers: { where: { active: true }, select: { id: true } }, confirmations: { where: { status: { in: ["PARTIAL", "CONFIRMED"] } }, select: { quantity: true } } } });
    for (const order of orders) {
      const dueAt = order.openingText && openingToDate(order.openingText); if (!dueAt || dueAt > now) continue;
      const confirmed = order.confirmations.reduce((total, item) => total + item.quantity, 0); if (!order.containers.length || confirmed >= order.containers.length) continue;
      const exists = await db.customerContactTask.findUnique({ where: { soOrderId_dueAt: { soOrderId: order.id, dueAt } }, select: { id: true } });
      if (exists) continue;
      const task = await db.customerContactTask.create({ data: { soOrderId: order.id, dueAt } });
      const users = await db.appUser.findMany({ where: { active: true }, select: { id: true } });
      await db.appNotification.createMany({ data: users.map(user => ({ userId: user.id, kind: "CUSTOMER_CONTACT", title: `${order.soNumber}：需联系客户确认上柜`, body: `已到开仓时间，当前确认柜量 ${confirmed}/${order.containers.length}。`, href: "/contact-tasks", dedupeKey: `contact:${task.id}` })), skipDuplicates: true });
      created += 1;
    }
    console.log(JSON.stringify({ created }));
  } finally { await db.$disconnect(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
