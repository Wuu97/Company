import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import postcss from "postcss";
const directory = process.env.CSS_MERGE_SNAPSHOT || "/private/tmp";
const source = `${directory}/css-merge-targets.json`;
const targets = [
  "src/components/business.module.css",
  "src/components/ui/date-time-picker.module.css",
  "src/components/ui/feedback-message.module.css",
  "src/components/ui/record-card.module.css",
  "src/components/ui/date-time-field.module.css",
  "src/components/ui/list.module.css",
  "src/components/ui/confirmation-panel.module.css",
  "src/app/page.module.css",
  "src/app/customers/page.module.css",
  "src/app/styles.css",
  "src/app/transport/page.module.css",
];

async function main() {
  if (process.argv.includes("--capture")) {
    await mkdir(directory, { recursive: true });
    await writeFile(source, JSON.stringify(targets));
    for (const [index, file] of targets.entries())
      await copyFile(file, `${directory}/css-merge-before-${index}.css`);
    console.log(`Captured ${targets.length} stylesheets in ${directory}`);
    return;
  }
  const files: string[] = JSON.parse(await readFile(source, "utf8"));
  const tokens = await readFile("src/app/tokens.css", "utf8");
  const originalGlobal = await readFile(
    `${directory}/css-merge-before-${files.indexOf("src/app/styles.css")}.css`,
    "utf8",
  );
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  let cases = 0,
    nodes = 0;
  try {
    const page = await browser.newPage();
    for (let index = 0; index < files.length; index++) {
      if (index < Number(process.env.CSS_MERGE_FROM || 0)) continue;
      const before = await readFile(
          `${directory}/css-merge-before-${index}.css`,
          "utf8",
        ),
        after = await readFile(files[index], "utf8");
      let selectors: string[] = [];
      postcss.parse(before).walkRules((r) => {
        selectors.push(...r.selectors);
      });
      selectors = [...new Set(selectors)];
      for (const width of [375, 760, 761, 900, 1050, 1200, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.setContent(
          '<html><head></head><body><div id="fixture"></div></body></html>',
        );
        const clean = (s: string) =>
          s.replace(/@import[^;]+;/g, "").replace(/:global\(([^)]+)\)/g, "$1");
        await page.addStyleTag({
          content: tokens + "\n" + clean(originalGlobal),
        });
        const sheet = await page.addStyleTag({ content: clean(before) });
        await page.addStyleTag({
          content:
            "*, *::before, *::after { animation: none !important; transition: none !important; }",
        });
        await page.evaluate((selectors) => {
          const container = document.getElementById("fixture")!;
          let id = 0;
          for (const selector of selectors) {
            let clean = selector.replace(/:global\(([^)]+)\)/g, "$1");
            for (let n = 0; n < 3; n++)
              clean = clean.replace(/:(?:not|has|is|where)\([^()]*\)/g, "");
            clean = clean.replace(/::?[\w-]+(?:\([^)]*\))?/g, "");
            const parts = clean.split(/\s*[>+~]\s*|\s+/).filter(Boolean);
            for (const compact of [false, true]) {
              let parent: HTMLElement = container;
              const outer = document.createElement("div");
              outer.style.width = "300px";
              container.append(outer);
              parent = outer;
              for (const part of parts) {
                const tag = part.match(/^[a-z][\w-]*/i)?.[0] || "div";
                if (["html", "body"].includes(tag)) continue;
                const el = document.createElement(tag);
                const classes = [...part.matchAll(/\.([\w-]+)/g)].map(
                  (m) => m[1],
                );
                if (compact)
                  for (const cls of [...classes])
                    if (
                      [
                        "card",
                        "header",
                        "field",
                        "fields",
                        "actions",
                        "list",
                      ].includes(cls)
                    )
                      classes.push(cls + "compact");
                el.className = classes.join(" ");
                el.dataset.audit = String(id++);
                for (const attr of part.matchAll(
                  /\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\]/g,
                ))
                  el.setAttribute(attr[1], attr[2] || "");
                if (tag === "a") el.setAttribute("href", "#");
                if (tag === "button") el.setAttribute("type", "button");
                el.append(document.createTextNode("样式 Text 123"));
                parent.append(el);
                parent = el;
              }
              for (const tag of [
                "div",
                "b",
                "a",
                "span",
                "small",
                "button",
                "p",
                "h3",
              ]) {
                const child = document.createElement(tag);
                child.textContent = "内容 Content";
                child.dataset.audit = String(id++);
                parent.append(child);
              }
            }
          }
        }, selectors);
        const snapshot = () =>
          page.evaluate(() =>
            Array.from(
              document.querySelectorAll<HTMLElement>("[data-audit]"),
            ).map((el) => {
              const s = getComputedStyle(el);
              const values: Record<string, string> = {};
              for (const key of Array.from(s))
                if (!key.startsWith("--"))
                  values[key] = s.getPropertyValue(key);
              return {
                id: el.dataset.audit,
                tag: el.tagName,
                cls: el.className,
                values,
              };
            }),
          );
        const old = await snapshot();
        await sheet.evaluate((el, css) => {
          el.textContent = css;
        }, clean(after));
        const next = await snapshot();
        const differences = [];
        for (let i = 0; i < old.length; i++) {
          for (const key of Object.keys(old[i].values))
            if (old[i].values[key] !== next[i].values[key])
              differences.push({
                id: old[i].id,
                tag: old[i].tag,
                cls: old[i].cls,
                property: key,
                before: old[i].values[key],
                after: next[i].values[key],
              });
        }
        if (differences.length) {
          console.log(
            JSON.stringify(
              {
                file: files[index],
                width,
                differences: differences.slice(0, 35),
              },
              null,
              2,
            ),
          );
          throw new Error(`${differences.length} computed style differences`);
        }
        cases++;
        nodes += old.length;
      }
      console.log(
        `${files[index]}: 7 viewport computed-style snapshots identical`,
      );
    }
    console.log(
      JSON.stringify({
        cases,
        nodes,
        properties: "all browser computed properties",
        differences: 0,
      }),
    );
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
