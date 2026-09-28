import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const prefix = `e2e_plan_${Date.now()}_${Math.random().toString(36).slice(2)}`;

test.afterAll(async () => {
  const order = await db.soOrder.findFirst({ where: { soNumber: prefix } });
  if (order) {
    await db.loadingPlanItem.deleteMany({ where: { loadingPlan: { soOrderId: order.id } } });
    await db.loadingPlan.deleteMany({ where: { soOrderId: order.id } });
    await db.containerUnit.deleteMany({ where: { soOrderId: order.id } });
    await db.soOrder.delete({ where: { id: order.id } });
  }
  await db.factory.deleteMany({ where: { name: prefix } });
  await db.customer.deleteMany({ where: { code: prefix } });
  await db.$disconnect();
});

test("创建计划 API 并发时只允许一个计划占用同一内部柜", async ({ request }) => {
  const customer = await db.customer.create({ data: { code: prefix, name: prefix } });
  const factory = await db.factory.create({ data: { customerId: customer.id, name: prefix, address: "test" } });
  const order = await db.soOrder.create({ data: { customerId: customer.id, soNumber: prefix, carrier: "TEST" } });
  const container = await db.containerUnit.create({ data: { soOrderId: order.id, containerType: "40HC", internalCode: `${prefix}_container` } });
  const body = { soOrderId: order.id, factoryId: factory.id, scheduledAt: "2026-10-01T08:00:00.000Z", containerUnitIds: [container.id] };

  const responses = await Promise.all([
    request.post("/api/plans", { data: body }),
    request.post("/api/plans", { data: body }),
  ]);
  const statuses = responses.map(response => response.status()).sort();
  expect(statuses).toEqual([201, 409]);
});

test("柜量调整与创建计划并发时不会为停用柜创建计划", async ({ request }) => {
  const token = `${prefix}_adjust`;
  const customer = await db.customer.create({ data: { code: token, name: token } });
  const factory = await db.factory.create({ data: { customerId: customer.id, name: token, address: "test" } });
  const order = await db.soOrder.create({ data: { customerId: customer.id, soNumber: token, carrier: "TEST" } });
  const container = await db.containerUnit.create({ data: { soOrderId: order.id, containerType: "40HC", internalCode: `${token}_container` } });
  try {
    const [plan, adjust] = await Promise.all([
      request.post("/api/plans", { data: { soOrderId: order.id, factoryId: factory.id, scheduledAt: "2026-10-01T08:00:00.000Z", containerUnitIds: [container.id] } }),
      request.post(`/api/orders/${order.id}/containers/adjust`, { data: { reason: "change type", containers: [{ containerType: "40HQ", quantity: 1 }] } }),
    ]);
    expect([plan.status(), adjust.status()].sort()).toEqual([201, 409]);
  } finally {
    await db.loadingPlanItem.deleteMany({ where: { loadingPlan: { soOrderId: order.id } } });
    await db.loadingPlan.deleteMany({ where: { soOrderId: order.id } });
    await db.containerUnit.deleteMany({ where: { soOrderId: order.id } });
    await db.soOrder.delete({ where: { id: order.id } });
    await db.factory.delete({ where: { id: factory.id } });
    await db.customer.delete({ where: { id: customer.id } });
  }
});
