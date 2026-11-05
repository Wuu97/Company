import { build } from "esbuild";
import { chromium, expect } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
const output = "/private/tmp/company-special-controls-qa";
async function main() {
  await mkdir(output, { recursive: true });
  await build({
    stdin: {
      contents: `import React,{useState} from 'react';import{createRoot}from'react-dom/client';import{DateTimeField}from'./src/components/ui/date-time-field';import{DateTimePicker}from'./src/components/ui/date-time-picker';import{DashboardTasks}from'./src/app/dashboard-tasks';import './src/app/styles.css';function App(){const[v,set]=useState('2026-11-05T13:20');return <main style={{padding:16,width:'100%'}}><h1>专用控件验收</h1><DateTimeField aria-label="日期输入" value={v} onChange={e=>set(e.target.value)}/><DateTimePicker value={v} onConfirm={set} onCancel={()=>{}}/><output>{v}</output><button id="after">后续控件</button><DashboardTasks tasks={[{id:'a',title:'订单待核对',count:0,content:<p>订单内容</p>,hint:'订单说明',empty:'没有订单'},{id:'b',title:'船期需确认',count:0,content:<p>船期内容</p>,hint:'船期说明',empty:'没有船期'}]}/></main>};createRoot(document.getElementById('app')).render(<App/>);`,
      resolveDir: process.cwd(),
      loader: "tsx",
    },
    bundle: true,
    jsx: "automatic",
    outdir: output,
    entryNames: "fixture",
    write: true,
  });
  const js = await readFile(`${output}/fixture.js`, "utf8"),
    css = await readFile(`${output}/fixture.css`, "utf8");
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    const page = await browser.newPage();
    for (const width of [1440, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.setContent(
        `<html lang="zh-CN"><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body><div id="app" style="width:100%"></div></body></html>`,
      );
      await page.addScriptTag({ content: js });
      await page.getByRole("button", { name: "打开日历", exact: true }).click();
      let dialog = page.getByRole("dialog", { name: "选择日期", exact: true });
      await expect(dialog).toBeVisible();
      let date = dialog.getByRole("gridcell", {
        name: "2026-11-05",
        exact: true,
      });
      await expect(date).toBeFocused();
      await page.keyboard.press("ArrowRight");
      await expect(
        dialog.getByRole("gridcell", { name: "2026-11-06", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(dialog).toHaveCount(0);
      await expect(page.locator("output")).toHaveText("2026-11-06T13:20");
      await expect(
        page.getByRole("button", { name: "打开日历", exact: true }),
      ).toBeFocused();
      await page.getByRole("button", { name: "打开日历", exact: true }).click();
      dialog = page.getByRole("dialog", { name: "选择日期", exact: true });
      await dialog.getByRole("button", { name: "下个月", exact: true }).click();
      await expect(
        dialog.getByText("2026年12月", { exact: true }),
      ).toBeVisible();
      await dialog.getByRole("button", { name: "上一年", exact: true }).click();
      await expect(
        dialog.getByText("2025年12月", { exact: true }),
      ).toBeVisible();
      await dialog.getByRole("button", { name: "下一年", exact: true }).click();
      await dialog.getByRole("button", { name: "上个月", exact: true }).click();
      const selected = dialog.getByRole("gridcell", {
        name: "2026-11-06",
        exact: true,
      });
      await selected.hover();
      expect(
        await selected.evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe("rgb(37, 99, 235)");
      await selected.evaluate((el: HTMLButtonElement) => (el.disabled = true));
      expect(
        await selected.evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe("rgb(241, 245, 249)");
      await selected.evaluate((el: HTMLButtonElement) => (el.disabled = false));
      const box = await dialog.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      if (width < 768)
        expect(await dialog.getAttribute("aria-modal")).toBe("true");
      await page.screenshot({ path: `${output}/${width}-calendar.png` });
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await page.getByRole("button", { name: "选择时间", exact: true }).click();
      const time = page.getByRole("dialog", { name: "选择时间", exact: true });
      await time.getByLabel("小时", { exact: true }).fill("15");
      await time.getByLabel("分钟", { exact: true }).fill("45");
      await time.getByRole("button", { name: "确认", exact: true }).click();
      await expect(page.locator("output")).toHaveText("2026-11-06T15:45");
      await page
        .getByRole("button", { name: "打开日期时间选择器", exact: true })
        .click();
      const picker = page.getByRole("dialog", {
        name: "选择日期时间",
        exact: true,
      });
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Space");
      await picker.getByLabel("小时", { exact: true }).selectOption("16");
      await picker.getByLabel("分钟", { exact: true }).selectOption("30");
      await expect(picker).toBeVisible();
      await picker.getByRole("button", { name: "确定", exact: true }).click();
      await expect(page.locator("output")).toHaveText("2026-11-13T16:30");
      await page
        .getByRole("button", { name: "打开日期时间选择器", exact: true })
        .click();
      const last = page
        .getByRole("dialog", { name: "选择日期时间", exact: true })
        .getByRole("button", { name: "确定", exact: true });
      await last.focus();
      await page.keyboard.press("Tab");
      await expect(
        page
          .getByRole("dialog", { name: "选择日期时间", exact: true })
          .getByRole("button", { name: "上一年", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      const nav = page.getByRole("navigation", { name: "待办分类" });
      const task = nav.getByRole("button").last();
      await task.focus();
      await page.keyboard.press("Enter");
      await expect(task).toHaveAttribute("aria-pressed", "true");
      expect(await task.evaluate((el) => getComputedStyle(el).fontSize)).toBe(
        "16px",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({ path: `${output}/${width}-navigation.png` });
      console.log(
        `${width}px: calendars, keyboard, state precedence, time selection, modal bounds and navigation passed`,
      );
    }
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
