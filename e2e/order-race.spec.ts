import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { testDatabaseUrl } from "./test-db";

const db = new PrismaClient({ datasources: { db: { url: testDatabaseUrl } } });

function id(label: string) {
  return `e2e_${label}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function removeOrder(orderId: string) {
  await db.operationLog.deleteMany({ where: { entityId: orderId } });
  await db.soVersionChange.deleteMany({ where: { soOrderId: orderId } });
  await db.soFileVersion.deleteMany({ where: { soOrderId: orderId } });
  await db.customerConfirmation.deleteMany({ where: { soOrderId: orderId } });
  await db.containerUnit.deleteMany({ where: { soOrderId: orderId } });
  await db.soOrder.delete({ where: { id: orderId } });
}

test.afterAll(async () => { await db.$disconnect(); });

test("版本差异 API 并发应用时只允许一个请求成功", async ({ request }) => {
  const token = id("version");
  const order = await db.soOrder.create({ data: { soNumber: token, carrier: "OLD", parseStatus: "VERIFIED" } });
  try {
    const file = await db.soFileVersion.create({
      data: { soOrderId: order.id, storageKey: `${token}_storage`, originalName: "test.pdf", sha256: `${token}_sha`, version: 1 },
    });
    const change = await db.soVersionChange.create({
      data: { soOrderId: order.id, soFileVersionId: file.id, changes: { carrier: { from: "OLD", to: "NEW" } } },
    });
    const responses = await Promise.all([
      request.post(`/api/orders/${order.id}/version-changes/${change.id}/apply`),
      request.post(`/api/orders/${order.id}/version-changes/${change.id}/apply`),
    ]);
    expect(responses.map(response => response.status()).sort()).toEqual([200, 409]);
    expect((await db.soOrder.findUniqueOrThrow({ where: { id: order.id } })).carrier).toBe("NEW");
  } finally {
    await removeOrder(order.id);
  }
});

test("客户确认与撤销 API 在并发请求下保持数量一致", async ({ request }) => {
  const token = id("confirmation");
  const order = await db.soOrder.create({ data: { soNumber: token, carrier: "TEST" } });
  try {
    await db.containerUnit.create({ data: { soOrderId: order.id, internalCode: `${token}_container`, containerType: "40HC" } });
    const responses = await Promise.all([
      request.post(`/api/orders/${order.id}/confirmations`, { data: { quantity: 1 } }),
      request.post(`/api/orders/${order.id}/confirmations`, { data: { quantity: 1 } }),
    ]);
    expect(responses.map(response => response.status()).sort()).toEqual([201, 409]);

    const confirmation = await db.customerConfirmation.findFirstOrThrow({ where: { soOrderId: order.id } });
    const cancellations = await Promise.all([
      request.post(`/api/orders/${order.id}/confirmations/${confirmation.id}`),
      request.post(`/api/orders/${order.id}/confirmations/${confirmation.id}`),
    ]);
    expect(cancellations.map(response => response.status()).sort()).toEqual([200, 409]);
    expect((await db.customerConfirmation.findUniqueOrThrow({ where: { id: confirmation.id } })).status).toBe("CANCELLED");
  } finally {
    await removeOrder(order.id);
  }
});
