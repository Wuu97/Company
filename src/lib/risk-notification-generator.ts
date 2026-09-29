import { prisma } from "@/lib/prisma";
import { evaluateRiskAlerts } from "@/lib/risk-alerts";
import { notifyActiveUsers } from "@/lib/notifications";

export async function generateRiskNotifications(now = new Date()) {
  const orders = await prisma.soOrder.findMany({ select: { id: true, soNumber: true, etbNeedsReview: true, openingText: true, siCutoffText: true, vgmCutoffText: true, portCutoffText: true, plans: { select: { scheduledAt: true, status: true } } } });
  const alerts = evaluateRiskAlerts(orders, now);
  let created = 0;
  await prisma.$transaction(async tx => {
    for (const alert of alerts) created += await notifyActiveUsers(tx, { kind: alert.type, title: alert.title, body: alert.detail, href: alert.href, dedupeKey: `risk:${alert.type}:${alert.orderId}:${alert.title}` });
  });
  return { alerts: alerts.length, notifications: created };
}
