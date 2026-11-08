import { expect, type Page } from "@playwright/test";

export async function acceptEtbLoginAgreement(page: Page, required: boolean) {
  const wording = /阅读条款\s*并?\s*同意/;
  const agreement = page.locator("label", { hasText: wording }).filter({ visible: true }).first();
  if (!required && !await page.getByText(wording).filter({ visible: true }).first().isVisible()) return;

  const message = "无法确认登录协议已勾选，已停止提交登录";
  await expect(agreement, message).toBeVisible({ timeout: 10_000 });
  const checkbox = agreement.locator('input[type="checkbox"], [role="checkbox"]').first();
  await expect(checkbox, message).toBeAttached();
  const nativeInput = agreement.locator('input[type="checkbox"]').first();
  const hasNativeInput = Boolean(await nativeInput.count());
  const control = hasNativeInput ? nativeInput : checkbox;
  const checked = hasNativeInput
    ? await control.isChecked()
    : await control.getAttribute("aria-checked") === "true";

  if (!checked) {
    // Target the agreement text or control so a click cannot land on the agreement link.
    const caption = agreement.getByText(/^阅读条款\s*并?\s*同意\s*$/).filter({ visible: true }).first();
    if (await caption.count()) await caption.click();
    else if (await control.isVisible()) await control.click();
    else await agreement.click({ position: { x: 8, y: 8 } });
  }
  await expect(control, message).toBeChecked({ timeout: 5_000 });
}
