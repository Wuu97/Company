import { expect, request as playwrightRequest, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { testDatabaseUrl } from "./test-db";

const db = new PrismaClient({ datasources: { db: { url: testDatabaseUrl } } });
const admin = { name: "Security Admin", email: "security-admin@example.test", password: "security-test-password" };
const operator = { name: "Security Operator", email: "security-operator@example.test", password: "security-test-password" };

async function clean() {
  await db.appSession.deleteMany({ where: { user: { email: { in: [admin.email, operator.email] } } } });
  await db.appUser.deleteMany({ where: { email: { in: [admin.email, operator.email] } } });
}

test.beforeEach(clean);
test.afterAll(async () => { await clean(); await db.$disconnect(); });

test("管理员、成员权限与会话撤销均由服务端数据库状态决定", async ({ request, baseURL }) => {
  expect((await request.post("/api/auth/setup", { data: admin })).status()).toBe(201);
  expect((await request.post("/api/admin/users", { data: { ...operator, role: "OPERATOR" } })).status()).toBe(201);

  const member = await playwrightRequest.newContext({ baseURL });
  expect((await member.post("/api/auth/login", { data: { email: operator.email, password: operator.password } })).status()).toBe(200);
  expect((await member.post("/api/admin/users", { data: { ...operator, email: "forbidden@example.test" } })).status()).toBe(403);
  expect((await member.post("/api/orders/parse")).status()).toBe(403);
  expect((await member.get("/api/files/not-a-real-file")).status()).toBe(404);
  expect((await (await playwrightRequest.newContext({ baseURL })).get("/api/files/not-a-real-file")).status()).toBe(401);

  const user = await db.appUser.findUniqueOrThrow({ where: { email: operator.email } });
  expect((await request.patch(`/api/admin/users/${user.id}`, { data: { action: "set-active", active: false } })).status()).toBe(200);
  expect((await member.get("/api/files/not-a-real-file")).status()).toBe(401);
  await member.dispose();
});
