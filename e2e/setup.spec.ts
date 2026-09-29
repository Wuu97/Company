import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { resetAuthState, testDatabaseUrl } from "./test-db";

const db = new PrismaClient({ datasources: { db: { url: testDatabaseUrl } } });
const email = "setup-e2e@example.test";

async function resetSetupState() { await resetAuthState(db); }

test.beforeEach(resetSetupState);
test.afterAll(async () => { await resetSetupState(); await db.$disconnect(); });

test("首次设置通过浏览器建立会话，并拒绝重复提交", async ({ page }) => {
  const responses: { url: string; method: string; status: number }[] = [];
  page.on("response", response => {
    if (response.url().includes("/api/auth/setup")) responses.push({ url: response.url(), method: response.request().method(), status: response.status() });
  });
  await page.goto("/setup");
  await page.getByPlaceholder("姓名").fill("E2E Admin");
  await page.getByPlaceholder("邮箱").fill(email);
  await page.getByPlaceholder("设置至少 8 位密码").fill("e2e-only-password");
  await page.getByRole("button", { name: "创建账号并进入系统" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(responses).toEqual([{ url: expect.stringMatching(/\/api\/auth\/setup$/), method: "POST", status: 201 }]);
  const user = await db.appUser.findUnique({ where: { email }, include: { sessions: true } });
  expect(user?.sessions).toHaveLength(1);
  expect((await page.request.post("/api/auth/logout")).status()).toBe(200);
  await page.goto("/login");
  await page.getByPlaceholder("邮箱").fill(email);
  await page.getByPlaceholder("密码").fill("e2e-only-password");
  await page.getByRole("button", { name: "登录" }).click();
  await expect(page).toHaveURL(/\/$/);
  const duplicate = await page.request.post("/api/auth/setup", { data: { name: "E2E Admin", email, password: "e2e-only-password" } });
  expect(duplicate.status()).toBe(409);
  await expect(duplicate.json()).resolves.toMatchObject({ error: "ALREADY_INITIALIZED" });
});

test("并发首次设置只有一个请求成功且会话随账号原子建立", async ({ request }) => {
  const payload = { name: "E2E Admin", email, password: "e2e-only-password" };
  const [first, second] = await Promise.all([
    request.post("/api/auth/setup", { data: payload }),
    request.post("/api/auth/setup", { data: payload }),
  ]);
  expect([first.status(), second.status()].sort()).toEqual([201, 409]);
  const user = await db.appUser.findUnique({ where: { email }, include: { sessions: true } });
  expect(user?.sessions).toHaveLength(1);
});
