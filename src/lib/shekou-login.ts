import type { Page } from "@playwright/test";

/** Confirm the platform agreement before submitting either login flow. */
export async function acceptShekouAgreement(page: Page) {
  const agreement = page.locator("label", { hasText: /阅读条款.*同意/ }).first();
  await agreement.waitFor({ state: "visible", timeout: 10_000 });
  const input = agreement.locator('input[type="checkbox"]').first();
  if (await input.count()) {
    if (!await input.isChecked()) {
      // Click the visible label, rather than a hidden native input that Vue may reset.
      await agreement.click();
    }
    await page.waitForFunction(() => {
      const label = Array.from(document.querySelectorAll("label")).find(node => /阅读条款.*同意/.test(node.textContent || ""));
      return Boolean(label?.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked);
    }, undefined, { timeout: 5_000 });
    if (!await input.isChecked()) throw new Error("未能勾选蛇口登录协议，已停止提交登录");
    return;
  }
  const checkbox = agreement.locator('[role="checkbox"]').first();
  if (await checkbox.count()) {
    if (await checkbox.getAttribute("aria-checked") !== "true") await checkbox.click();
    if (await checkbox.getAttribute("aria-checked") === "true") return;
  }
  throw new Error("无法确认蛇口登录协议已勾选，已停止提交登录");
}
