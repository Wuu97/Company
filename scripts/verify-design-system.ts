import { chromium, expect, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { prisma } from "../src/lib/prisma";
import {
  createSession,
  SESSION_COOKIE,
  parseSessionCookie,
} from "../src/lib/auth";

const baseURL = process.env.DESIGN_QA_URL || "http://localhost:3011";
const output =
  process.env.DESIGN_QA_OUTPUT || "/private/tmp/company-design-system-qa";
async function metrics(page: Page, name: string, font: number, height: number) {
  const button = page.getByRole("button", { name, exact: true }).first();
  await expect(button).toBeVisible();
  const actual = await button.evaluate((el) => ({
    font: parseFloat(getComputedStyle(el).fontSize),
    height: el.getBoundingClientRect().height,
  }));
  expect(actual.font, `${name}: font`).toBe(font);
  expect(actual.height, `${name}: height`).toBe(height);
}
async function main() {
  await mkdir(output, { recursive: true });
  const admin = await prisma.appUser.findFirstOrThrow({
    where: { role: "ADMIN", active: true },
    select: { id: true },
  });
  const session = await createSession(admin.id);
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  try {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
    const context = await browser.newContext();
    await context.addCookies([
      { name: SESSION_COOKIE, value: session.value, url: baseURL },
    ]);
    const page = await context.newPage();
    let creates = 0;
    // Validate form submission without creating any real member or changing credentials.
    await page.route("**/api/admin/users", async (route) => {
      if (route.request().method() === "POST") {
        creates++;
        await route.fulfill({ json: { error: "验收模拟错误" }, status: 400 });
      } else await route.continue();
    });
    for (const [label, width, small, toolbar] of [
      ["desktop", 1440, 32, 36],
      ["mobile", 375, 36, 44],
    ] as const) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${baseURL}/settings`);
      await metrics(page, "+ 新增成员", 14, toolbar);
      await metrics(page, "退出登录", 13, small);
      await metrics(page, "重置密码", 13, small);
      await metrics(page, "编辑", 13, small);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `${output}/${label}-settings.png`,
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "+ 新增成员", exact: true })
        .click();
      const dialog = page.getByRole("dialog");
      const submit = dialog.getByRole("button", {
        name: "确认新增",
        exact: true,
      });
      const before = creates;
      await submit.click();
      expect(creates).toBe(before);
      expect(
        await dialog
          .locator("form")
          .evaluate((form: HTMLFormElement) => form.checkValidity()),
      ).toBe(false);
      expect(
        await submit.evaluate(
          (button: HTMLButtonElement) =>
            !!button.form && !button.form.contains(button),
        ),
      ).toBe(true);
      await metrics(page, "确认新增", 14, toolbar);
      expect(
        await dialog
          .locator("h4")
          .evaluate((el) => getComputedStyle(el).fontSize),
      ).toBe("18px");
      expect(
        await dialog
          .getByLabel(/^姓名/)
          .evaluate((el) => getComputedStyle(el).fontSize),
      ).toBe(width < 761 ? "16px" : "14px");
      expect(
        await dialog
          .getByLabel(/^姓名/)
          .evaluate((el) => el.getBoundingClientRect().height),
      ).toBe(width < 761 ? 44 : 36);
      await dialog.getByLabel(/^姓名/).fill("样式验收");
      await dialog.getByLabel(/^登录邮箱/).fill("design-qa@example.invalid");
      await dialog.getByLabel(/^初始密码/).fill("DesignQaOnly123!");
      await submit.click();
      await expect(
        dialog.getByText("验收模拟错误", { exact: true }),
      ).toBeVisible();
      expect(creates).toBe(before + 1);
      await page.screenshot({
        path: `${output}/${label}-dialog.png`,
        fullPage: true,
      });
      await dialog.getByRole("button", { name: "取消", exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "+ 新增成员", exact: true }),
      ).toBeFocused();
      await page
        .getByRole("button", { name: "编辑", exact: true })
        .first()
        .click();
      await metrics(page, "保存", 14, toolbar);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await page
        .getByRole("button", { name: "重置密码", exact: true })
        .first()
        .click();
      await metrics(page, "确认重置", 14, toolbar);
      await page.keyboard.press("Escape");
      await page.goto(`${baseURL}/settings?tab=platforms`);
      await metrics(page, "+ 添加平台", 14, toolbar);
      const edit = page
        .getByRole("button", { name: /^(编辑账号|配置账号)$/ })
        .first();
      await expect(edit).toBeVisible();
      if (
        await page
          .getByRole("button", { name: "测试连接", exact: true })
          .count()
      )
        await metrics(page, "测试连接", 13, small);
      await edit.click();
      await metrics(page, "保存", 14, toolbar);
      await page.screenshot({
        path: `${output}/${label}-credential.png`,
        fullPage: true,
      });
      await page.keyboard.press("Tab");
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await page
        .getByRole("button", { name: "+ 添加平台", exact: true })
        .click();
      await metrics(page, "添加平台", 14, toolbar);
      expect(
        await page
          .getByRole("button", { name: "添加平台", exact: true })
          .evaluate((b: HTMLButtonElement) => !!b.form && !b.form.contains(b)),
      ).toBe(true);
      await page.keyboard.press("Escape");
      for (const route of [
        "/",
        "/orders",
        "/plans",
        "/customers",
        "/containers",
        "/sailings",
        "/finance/bills",
        "/finance/routes",
        "/profile",
        "/logs",
        "/notifications",
        "/etb-runs",
        "/contact-tasks",
      ]) {
        const response = await page.goto(`${baseURL}${route}`);
        expect(response?.status(), route).toBe(200);
        const title = page.getByRole("heading", { level: 1 }).last();
        await expect(title).toBeVisible();
        expect(
          await title.evaluate((el) => getComputedStyle(el).fontSize),
          `${route}: title`,
        ).toBe("18px");
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${route}: overflow`,
        ).toBe(true);
        if (route === "/orders") {
          await metrics(page, "按关键词查找", 14, toolbar);
          expect(
            await page
              .locator('input[name="q"]')
              .first()
              .evaluate((el) => el.getBoundingClientRect().height),
          ).toBe(width < 761 ? 44 : 36);
        }
        if (route === "/" || route === "/orders")
          await page.screenshot({
            path: `${output}/${label}-${route === "/" ? "home" : "orders"}.png`,
            fullPage: true,
          });
      }
      console.log(
        `${label}: button metrics, form association, validation, error state, focus return and Escape passed`,
      );
    }
    await context.close();
    console.log(`Screenshots: ${output}`);
  } finally {
    await browser?.close();
    const parsed = parseSessionCookie(session.value);
    if (parsed)
      await prisma.appSession.deleteMany({
        where: {
          tokenHash: createHash("sha256").update(parsed.token).digest("hex"),
        },
      });
    await prisma.$disconnect();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
