import { expect, request as playwrightRequest, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { resetAuthState, testDatabaseUrl } from "./test-db";

const db = new PrismaClient({ datasources: { db: { url: testDatabaseUrl } } });
const admin = { name: "Security Admin", email: "security-admin@example.test", password: "security-test-password" };
const operator = { name: "Security Operator", email: "security-operator@example.test", password: "security-test-password" };

async function clean() { await resetAuthState(db); }

test.beforeEach(clean);
test.afterAll(async () => { await clean(); await db.$disconnect(); });

test("管理员、成员权限与会话撤销均由服务端数据库状态决定", async ({ request, baseURL }) => {
  expect((await request.post("/api/auth/setup", { data: admin })).status()).toBe(201);
  expect((await request.post("/api/admin/users", { data: { ...operator, role: "OPERATOR" } })).status()).toBe(201);

  const member = await playwrightRequest.newContext({ baseURL });
  expect((await member.post("/api/auth/login", { data: { email: operator.email, password: operator.password } })).status()).toBe(200);
  expect((await member.post("/api/admin/users", { data: { ...operator, email: "forbidden@example.test" } })).status()).toBe(403);
  expect((await member.post("/api/orders/parse")).status()).toBe(200);
  expect((await member.get("/api/files/not-a-real-file")).status()).toBe(404);
  expect((await (await playwrightRequest.newContext({ baseURL })).get("/api/files/not-a-real-file")).status()).toBe(401);

  const user = await db.appUser.findUniqueOrThrow({ where: { email: operator.email } });
  expect((await request.patch(`/api/admin/users/${user.id}`, { data: { action: "set-active", active: false } })).status()).toBe(200);
  expect((await member.get("/api/files/not-a-real-file")).status()).toBe(401);
  await member.dispose();
});

test("并发登录限流与并发停用最后管理员保持一致", async ({ request, baseURL }) => {
  expect((await request.post("/api/auth/setup", { data: admin })).status()).toBe(201);
  const secondAdmin = { name: "Second Admin", email: "second-admin@example.test", password: "security-test-password", role: "ADMIN" };
  expect((await request.post("/api/admin/users", { data: secondAdmin })).status()).toBe(201);
  const attempts = await Promise.all(Array.from({ length: 6 }, () => request.post("/api/auth/login", { data: { email: operator.email, password: "wrong-password" } })));
  expect(attempts.filter(response => response.status() === 401)).toHaveLength(5);
  expect(attempts.filter(response => response.status() === 429)).toHaveLength(1);

  const second = await playwrightRequest.newContext({ baseURL });
  expect((await second.post("/api/auth/login", { data: { email: secondAdmin.email, password: secondAdmin.password } })).status()).toBe(200);
  const firstUser = await db.appUser.findUniqueOrThrow({ where: { email: admin.email } });
  const secondUser = await db.appUser.findUniqueOrThrow({ where: { email: secondAdmin.email } });
  const results = await Promise.all([
    request.patch(`/api/admin/users/${secondUser.id}`, { data: { action: "set-active", active: false } }),
    second.patch(`/api/admin/users/${firstUser.id}`, { data: { action: "set-active", active: false } }),
  ]);
  expect(results.map(response => response.status()).sort()).toEqual([200, 409]);
  expect(await db.appUser.count({ where: { role: "ADMIN", active: true } })).toBe(1);
  await second.dispose();
});
