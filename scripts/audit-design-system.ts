import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
const paths: string[] = [];
function walk(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (path.endsWith(".css")) paths.push(path);
  }
}
walk("src");
paths.sort();
const vars: Record<string, string> = {};
for (const path of ["src/app/tokens.css", "src/app/styles.css"])
  postcss.parse(readFileSync(path, "utf8")).walkDecls((d) => {
    if (
      d.prop.startsWith("--") &&
      d.parent?.type === "rule" &&
      d.parent.parent?.type === "root"
    )
      vars[d.prop] = d.value;
  });
function resolve(value: string) {
  for (let n = 0; n < 10; n++) {
    const next = value.replace(
      /var\((--[^),]+)(?:,[^)]+)?\)/g,
      (all, name) => vars[name] || all,
    );
    if (next === value) break;
    value = next;
  }
  return value;
}
let count = 0,
  important = 0;
const hardcoded: string[] = [];
const summaries: string[] = [],
  details: string[] = [];
for (const file of paths) {
  const root = postcss.parse(readFileSync(file, "utf8"));
  const rows: string[] = [],
    sizes = new Set<string>();
  root.walkDecls((d) => {
    if (d.important) important++;
    if (d.prop !== "font-size") return;
    count++;
    sizes.add(resolve(d.value));
    if (/\d(?:px|rem|em|%)/.test(d.value) && !d.value.includes("var("))
      hardcoded.push(`${file}:${d.source?.start?.line}`);
    let context = "默认";
    let parent = d.parent;
    while (parent && parent.type !== "root") {
      if (parent.type === "atrule")
        context = `@${parent.name} ${parent.params}`;
      parent = parent.parent;
    }
    const selector = d.parent?.type === "rule" ? d.parent.selector : "";
    rows.push(
      `| ${d.source?.start?.line} | \`${selector.replaceAll("|", "\\|")}\` | \`${d.value}\` | ${resolve(d.value)} | ${context} |`,
    );
  });
  if (rows.length) {
    summaries.push(`| ${file} | ${rows.length} | ${[...sizes].join("、")} |`);
    details.push(
      `## ${file}\n\n| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |\n|---|---|---|---|---|\n${rows.join("\n")}`,
    );
  }
}
const report = `# 字体、按钮与专用控件基线\n\n基线日期：2026-11-05（Asia/Shanghai）。通过 \`node --import tsx scripts/audit-design-system.ts\` 重建。本文为源码静态盘点；默认解析值不代表所有媒体条件下的最终计算样式。\n\n## 扫描结论\n\n- 扫描${paths.length}个CSS文件，共${count}条font-size声明。\n- 非Token数字字号：${hardcoded.length}处。\n- 业务及组件CSS中的!important：${important}处。\n- 核心字阶12、13、14、16、18px；展示档24、30px。\n- 移动端输入文字16px；单行外壳桌面36px、移动端44px。\n\n## 按钮规范\n\n| size | 桌面高度 | 移动端高度 | 字号/行高 | 水平padding |\n|---|---|---|---|---|\n| default | 40px | 44px | 14px/20px | 16px |\n| toolbar | 36px | 44px | 14px/20px | 14px |\n| small | 32px | 36px | 13px/20px | 10px |\n| compact | 24px | 32px | 12px/18px | 8px |\n\nButton与ButtonLink由公共组件管理；上传入口复用同一class生成函数。业务容器只管理布局。弹窗footer通过唯一form ID关联原生提交与校验。\n\n## 专用控件边界\n\n日历共享CalendarGrid私有网格，标题14px/20px/600，星期和日期12px/18px/400，今天和选中500。状态顺序为disabled > selected > hover/active > default，无!important。支持方向键、Home/End、Enter/Space、Escape与Tab循环；支持年/月切换。视口<768px采用居中模态弹层。首页任务导航标题16px/24px/600，辅助说明14px/22px，计数12px/18px。\n\n## 字号按文件汇总\n\n| 文件 | 声明数 | 默认解析字号 |\n|---|---|---|\n${summaries.join("\n")}\n\n${details.join("\n\n")}\n`;
writeFileSync("docs/design-system-baseline.md", report);
console.log(
  JSON.stringify({
    cssFiles: paths.length,
    fontDeclarations: count,
    hardcoded,
    important,
  }),
);
if (hardcoded.length || important) process.exitCode = 1;
