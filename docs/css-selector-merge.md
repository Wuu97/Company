# 重复选择器合并对比

日期：2026-11-05。仅整理以下11个样式文件中的重复规则，不调整设计值。按媒体条件、选择器空白及逗号规范化后，当前原始源码实际为44组，较此前粗略统计的40组多4组。

## 合并统计

| 文件 | 原重复组 | 剩余重复组 |
|---|---:|---:|
| src/components/business.module.css | 5 | 0 |
| src/components/ui/date-time-picker.module.css | 1 | 0 |
| src/components/ui/feedback-message.module.css | 1 | 0 |
| src/components/ui/record-card.module.css | 1 | 0 |
| src/components/ui/date-time-field.module.css | 1 | 0 |
| src/components/ui/list.module.css | 1 | 0 |
| src/components/ui/confirmation-panel.module.css | 2 | 0 |
| src/app/page.module.css | 16 | 0 |
| src/app/customers/page.module.css | 8 | 0 |
| src/app/styles.css | 2 | 0 |
| src/app/transport/page.module.css | 6 | 0 |

合并涉及的规则块：558 → 513。各重复组保留最后出现的规则位置；同名属性采用后声明值，被后续缩写重置的旧展开声明删除，其余展开声明保留在缩写之后。

## 保持层叠关系的额外整理

- 全局：将body移动端display覆盖跟随合并后的body规则，保留移动端block。
- 侧栏：移动端分组隐藏及链接padding跟随合并后的基础规则，桌面媒体条件仍在后面。
- 公共卡片：紧凑padding和移动端卡片padding按原优先顺序放在基础card之后。
- 首页：保留:last-child边框覆盖和移动端taskContent padding18px；合并后的移动端taskNav显式保留原border-right-color，避免border-right:0重置颜色。
- 客户：900px以下的单列布局、gap12px及footer左对齐跟随基础规则。
- 运输：独立resolution规则放在合并后的分组规则之后，保留margin12px 0，不被分组中的margin4px 0 0改写。

## 验证

- PostCSS解析通过，重复选择器剩余0组。
- 浏览器对比覆盖375、760、761、900、1050、1200、1440px；11文件共77组样式快照，无计算属性差异。
- 快照DOM按各文件选择器生成，并增加紧凑卡片等组合；比较全部浏览器计算属性。动画和transition仅在验收页面禁用，排除时间采样误差；业务CSS未添加!important。
- 补充66组hover、focus、active交互状态对比，包含选中项与禁用项，未发现差异。
- TypeScript、生产构建、差异检查通过；136项测试通过，1项数据库集成测试按配置跳过。
- 此为已覆盖DOM/断点的验证结果，并非对所有可能DOM与交互状态的形式化证明。
- 复用工具：修改前运行 `node --import tsx scripts/verify-css-merge.ts --capture`，修改后运行 `node --import tsx scripts/verify-css-merge.ts`。可用CSS_MERGE_SNAPSHOT指定备份目录；不要在修改后覆盖修改前快照。

## 逐组源码对比

### src/components/business.module.css —  / .sidebar-nav

合并前：2处，原行号74、202。

```css
.sidebar-nav {
  display: grid;
  gap: 8px;
}

.sidebar-nav {
  display: grid;
  gap: 2px;
}
```

合并后：

```css
.sidebar-nav {
  display: grid;
  gap: 2px;
}
```

### src/components/business.module.css —  / .sidebar-nav__group-label

合并前：2处，原行号82、1194。

```css
.sidebar-nav__group-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 8px;
  color: #d5e1f8;
  font-size: var(--font-body);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.01em;
  cursor: pointer;
  list-style: none;
  border-radius: 6px;
}

.sidebar-nav__group-label {
  color: #a4b1c4;
}
```

合并后：

```css
.sidebar-nav__group-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 8px;
  font-size: var(--font-body);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.01em;
  cursor: pointer;
  list-style: none;
  border-radius: 6px;
  color: #a4b1c4;
}
```

### src/components/business.module.css —  / .sidebar-nav a

合并前：2处，原行号116、1197。

```css
.sidebar-nav a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #dbeafe;
  text-decoration: none;
  padding: 9px 10px;
  border-radius: 6px;
  font-size: var(--font-body);
  font-weight: var(--font-weight-medium);
}

.sidebar-nav a {
  color: #edf2fa;
}
```

合并后：

```css
.sidebar-nav a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-decoration: none;
  padding: 9px 10px;
  border-radius: 6px;
  font-size: var(--font-body);
  font-weight: var(--font-weight-medium);
  color: #edf2fa;
}
```

### src/components/business.module.css —  / .sidebar-nav__link-active .nav-count

合并前：2处，原行号148、1208。

```css
.sidebar-nav__link-active .nav-count {
  background: #fff;
  color: #1d4ed8;
}

.sidebar-nav__link-active .nav-count {
  background: #354052;
  color: #88acff;
}
```

合并后：

```css
.sidebar-nav__link-active .nav-count {
  background: #354052;
  color: #88acff;
}
```

### src/components/business.module.css —  / .signed-in

合并前：2处，原行号207、1212。

```css
.signed-in {
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.78);
  font-size: var(--font-body-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
}

.signed-in {
  color: #a4b1c4;
  border-bottom-color: #354052;
}
```

合并后：

```css
.signed-in {
  margin: 0 0 16px;
  font-size: var(--font-body-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  color: #a4b1c4;
  border-bottom-color: #354052;
}
```

### src/components/ui/date-time-picker.module.css —  / .actions button

合并前：2处，原行号115、136。

```css
.actions button {
  min-height: 26px;
  padding: 0 8px;
  border: 0;
  border-radius: 5px;
  background: #dbeafe;
  color: #1d4ed8;
  font: inherit;
  font-size: var(--font-caption);
  font-weight: var(--type-button-weight);
  cursor: pointer;
}

.actions button {
  background: #1677ff;
  color: #fff;
  box-shadow: 0 2px 5px rgb(22 119 255 / 22%);
}
```

合并后：

```css
.actions button {
  min-height: 26px;
  padding: 0 8px;
  border: 0;
  border-radius: 5px;
  font: inherit;
  font-size: var(--font-caption);
  font-weight: var(--type-button-weight);
  cursor: pointer;
  background: #1677ff;
  color: #fff;
  box-shadow: 0 2px 5px rgb(22 119 255 / 22%);
}
```

### src/components/ui/feedback-message.module.css —  / .message

合并前：2处，原行号1、2。

```css
.message{display:flex;align-items:flex-start;gap:7px;margin:10px 0 0;padding:8px 10px;border-radius:7px;font-size:var(--font-body-sm);line-height:1.5}

.message{font-size:var(--type-caption-size);font-weight:var(--type-caption-weight);line-height:var(--type-caption-line-height)}
```

合并后：

```css
.message {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin: 10px 0 0;
  padding: 8px 10px;
  border-radius: 7px;
  font-size: var(--type-caption-size);
  font-weight: var(--type-caption-weight);
  line-height: var(--type-caption-line-height);
}
```

### src/components/ui/record-card.module.css —  / .card

合并前：2处，原行号8、135。

```css
.card {
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
}

.card {
  font-weight: var(--type-body-weight);
  font-size: var(--type-body-size);
  line-height: var(--type-body-line-height);
}
```

合并后：

```css
.card {
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  font-weight: var(--type-body-weight);
  font-size: var(--type-body-size);
  line-height: var(--type-body-line-height);
}
```

### src/components/ui/date-time-field.module.css —  / .timeActions button

合并前：2处，原行号149、185。

```css
.timeActions button {
  min-height: 28px;
  padding: 0 7px;
  border: 0;
  border-radius: 5px;
  background: #dbeafe;
  color: #1d4ed8;
  font: inherit;
  font-size: var(--type-caption-size);
  font-weight: var(--type-button-weight);
  cursor: pointer;
}

.timeActions button {
  background: #1677ff;
  color: #fff;
  box-shadow: 0 2px 5px rgb(22 119 255 / 22%);
}
```

合并后：

```css
.timeActions button {
  min-height: 28px;
  padding: 0 7px;
  border: 0;
  border-radius: 5px;
  font: inherit;
  font-size: var(--type-caption-size);
  font-weight: var(--type-button-weight);
  cursor: pointer;
  background: #1677ff;
  color: #fff;
  box-shadow: 0 2px 5px rgb(22 119 255 / 22%);
}
```

### src/components/ui/list.module.css —  / .selectOptions

合并前：2处，原行号85、213。

```css
.selectOptions {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  display: grid;
  gap: 3px;
  padding: 4px;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.14);
}

.selectOptions {
  max-height: 260px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

合并后：

```css
.selectOptions {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  display: grid;
  gap: 3px;
  padding: 4px;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.14);
  max-height: 260px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

### src/components/ui/confirmation-panel.module.css —  / .title

合并前：2处，原行号1、2。

```css
.title{margin:0 0 8px}

.title{font-size:var(--type-card-title-size);font-weight:var(--type-card-title-weight);line-height:var(--type-card-title-line-height)}
```

合并后：

```css
.title {
  margin: 0 0 8px;
  font-size: var(--type-card-title-size);
  font-weight: var(--type-card-title-weight);
  line-height: var(--type-card-title-line-height);
}
```

### src/components/ui/confirmation-panel.module.css —  / .body

合并前：2处，原行号1、2。

```css
.body{display:grid;gap:10px}

.body{font-size:var(--type-body-size);font-weight:var(--type-body-weight);line-height:var(--type-body-line-height)}
```

合并后：

```css
.body {
  display: grid;
  gap: 10px;
  font-size: var(--type-body-size);
  font-weight: var(--type-body-weight);
  line-height: var(--type-body-line-height);
}
```

### src/app/page.module.css —  / .cards

合并前：3处，原行号1、85、361。

```css
.cards {
  display: grid;
}

.cards {
  gap: 0;
  margin-bottom: 22px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.cards {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 20px 0;
}
```

合并后：

```css
.cards {
  display: grid;
  gap: 0;
  margin-bottom: 22px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 20px 0;
}
```

### src/app/page.module.css —  / .card,.quiet

合并前：2处，原行号92、365。

```css
.card,
.quiet {
  padding: 0 22px;
  border: 0;
  border-right: 1px solid #e2e8f0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.card,
.quiet {
  min-height: 78px;
  justify-content: center;
  gap: 10px;
}
```

合并后：

```css
.card,
.quiet {
  padding: 0 22px;
  border: 0;
  border-right: 1px solid #e2e8f0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  min-height: 78px;
  justify-content: center;
  gap: 10px;
}
```

### src/app/page.module.css —  / .card:hover

合并前：2处，原行号104、495。

```css
.card:hover {
  transform: none;
  box-shadow: none;
}

.card:hover {
  background: #f8fafc;
}
```

合并后：

```css
.card:hover {
  transform: none;
  box-shadow: none;
  background: #f8fafc;
}
```

### src/app/page.module.css —  / .cardTitle

合并前：2处，原行号108、371。

```css
.cardTitle {
  color: #64748b;
  font-size: var(--type-field-label-size);
  font-weight: var(--type-field-label-weight);
  line-height: var(--type-field-label-line-height);
}

.cardTitle {
  font-size: var(--type-field-label-size);
  font-weight: var(--type-field-label-weight);
  line-height: var(--type-field-label-line-height);
}
```

合并后：

```css
.cardTitle {
  color: #64748b;
  font-size: var(--type-field-label-size);
  font-weight: var(--type-field-label-weight);
  line-height: var(--type-field-label-line-height);
}
```

### src/app/page.module.css —  / .workspace

合并前：2处，原行号160、391。

```css
.workspace {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  border-top: 1px solid #e2e8f0;
}

.workspace {
  min-height: 390px;
}
```

合并后：

```css
.workspace {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  border-top: 1px solid #e2e8f0;
  min-height: 390px;
}
```

### src/app/page.module.css —  / .taskNav

合并前：2处，原行号165、509。

```css
.taskNav {
  padding: 12px;
  border-right: 1px solid #e2e8f0;
}

.taskNav {
  background: #ffffff;
  border-right-color: #e2e8f0;
}
```

合并后：

```css
.taskNav {
  padding: 12px;
  border-right: 1px solid #e2e8f0;
  background: #ffffff;
  border-right-color: #e2e8f0;
}
```

### src/app/page.module.css —  / .taskNav button

合并前：2处，原行号176、516。

```css
.taskNav button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 11px 12px;
  margin: 3px 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  font-size: var(--font-title-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-title-sm);
}

.taskNav button {
  color: #64748b;
  font-size: var(--font-title-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-title-sm);
}
```

合并后：

```css
.taskNav button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 11px 12px;
  margin: 3px 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  color: #64748b;
  font-size: var(--font-title-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-title-sm);
}
```

### src/app/page.module.css —  / .taskContent

合并前：2处，原行号200、394。

```css
.taskContent {
  padding: 24px;
  min-width: 0;
}

.taskContent {
  display: flex;
  flex-direction: column;
}
```

合并后：

```css
.taskContent {
  padding: 24px;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
```

### src/app/page.module.css —  / .taskContent section

合并前：2处，原行号204、398。

```css
.taskContent section {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.taskContent section {
  flex: 1;
}
```

合并后：

```css
.taskContent section {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  flex: 1;
}
```

### src/app/page.module.css —  / .alertHeading

合并前：2处，原行号259、439。

```css
.alertHeading {
  padding: 18px 22px;
  cursor: pointer;
}

.alertHeading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  list-style: none;
}
```

合并后：

```css
.alertHeading {
  padding: 18px 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  list-style: none;
}
```

### src/app/page.module.css —  / .alertHeading>div

合并前：2处，原行号263、449。

```css
.alertHeading > div {
  display: inline-block;
  vertical-align: middle;
  margin-right: 20px;
}

.alertHeading > div {
  margin: 0;
}
```

合并后：

```css
.alertHeading > div {
  display: inline-block;
  vertical-align: middle;
  margin: 0;
}
```

### src/app/page.module.css — @media (max-width: 760px) / .cards

合并前：2处，原行号295、467。

```css
.cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

.cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px 0;
  }
```

合并后：

```css
.cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px 0;
  }
```

### src/app/page.module.css — @media (max-width: 760px) / .workspace

合并前：2处，原行号304、476。

```css
.workspace {
    grid-template-columns: 1fr;
  }

.workspace {
    min-height: 0;
  }
```

合并后：

```css
.workspace {
    grid-template-columns: 1fr;
    min-height: 0;
  }
```

### src/app/page.module.css — @media (max-width: 760px) / .taskNav

合并前：2处，原行号307、531。

```css
.taskNav {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    border-right: 0;
    border-bottom: 1px solid #e2e8f0;
  }

.taskNav {
    border-bottom-color: #e2e8f0;
  }
```

合并后：

```css
.taskNav {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    border-right: 0;
    border-bottom: 1px solid #e2e8f0;
    border-bottom-color: #e2e8f0;
    border-right-color: #e2e8f0;
  }
```

### src/app/page.module.css — @media (max-width: 760px) / .panelHeading

合并前：2处，原行号323、482。

```css
.panelHeading {
    align-items: flex-start;
    padding: 18px;
  }

.panelHeading {
    flex-wrap: wrap;
  }
```

合并后：

```css
.panelHeading {
    align-items: flex-start;
    padding: 18px;
    flex-wrap: wrap;
  }
```

### src/app/page.module.css —  / .emptyIcon

合并前：2处，原行号419、503。

```css
.emptyIcon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 4px;
  border-radius: 50%;
  font-size: var(--font-display-sm);
}

.emptyIcon {
  background: #edf1f6;
  color: #607b9e;
}
```

合并后：

```css
.emptyIcon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 4px;
  border-radius: 50%;
  font-size: var(--font-display-sm);
  background: #edf1f6;
  color: #607b9e;
}
```

### src/app/customers/page.module.css —  / .header b

合并前：2处，原行号17、107。

```css
.header b {
  color: #1e3a8a;
  font-size: var(--type-card-title-size);
  font-weight: var(--type-card-title-weight);
  line-height: var(--type-card-title-line-height);
}

.header b { color: #1e293b; }
```

合并后：

```css
.header b {
  font-size: var(--type-card-title-size);
  font-weight: var(--type-card-title-weight);
  line-height: var(--type-card-title-line-height);
  color: #1e293b;
}
```

### src/app/customers/page.module.css —  / .body

合并前：2处，原行号37、108。

```css
.body {
  padding: 9px 0;
}

.body { padding: 0; min-width: 0; }
```

合并后：

```css
.body {
  padding: 0;
  min-width: 0;
}
```

### src/app/customers/page.module.css —  / .factories

合并前：2处，原行号40、110。

```css
.factories {
  display: grid;
  gap: 6px;
  margin-top: 5px;
}

.factories { margin: 0; gap: 12px; }
```

合并后：

```css
.factories {
  display: grid;
  margin: 0;
  gap: 12px;
}
```

### src/app/customers/page.module.css —  / .factory

合并前：2处，原行号45、111。

```css
.factory {
  display: grid;
  gap: 4px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.factory { grid-template-columns: minmax(0, 1fr) auto; align-items: center; padding: 0; border: 0; border-radius: 0; background: transparent; }
```

合并后：

```css
.factory {
  display: grid;
  gap: 4px;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}
```

### src/app/customers/page.module.css —  / .footer

合并前：2处，原行号59、91。

```css
.footer {
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
  flex-wrap: wrap;
}
```

合并后：

```css
.footer {
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
  flex-wrap: wrap;
}
```

### src/app/customers/page.module.css —  / .customerRow.customerRow

合并前：2处，原行号101、121。

```css
.customerRow.customerRow {
  grid-template-columns: minmax(180px, 1fr) minmax(240px, 2fr) auto;
  align-items: start; gap: 24px; padding: 18px 0;
  border: 0; border-bottom: 1px solid #e2e8f0; border-radius: 0; box-shadow: none;
}

.customerRow.customerRow { align-items: center; }
```

合并后：

```css
.customerRow.customerRow {
  grid-template-columns: minmax(180px, 1fr) minmax(240px, 2fr) auto;
  gap: 24px;
  padding: 18px 0;
  border: 0;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 0;
  box-shadow: none;
  align-items: center;
}
```

### src/app/customers/page.module.css —  / .factory>button

合并前：2处，原行号114、122。

```css
.factory > button { grid-column: 2; grid-row: 1 / span 3; }

.factory > button { grid-row: 1 / span 3; align-self: center; }
```

合并后：

```css
.factory > button {
  grid-column: 2;
  grid-row: 1 / span 3;
  align-self: center;
}
```

### src/app/customers/page.module.css —  / .footer.footer

合并前：2处，原行号115、123。

```css
.footer.footer { border: 0; padding: 0; justify-content: flex-end; align-items: center; gap: 8px; }

.footer.footer { align-self: center; align-items: center; flex-wrap: nowrap; }
```

合并后：

```css
.footer.footer {
  border: 0;
  padding: 0;
  justify-content: flex-end;
  gap: 8px;
  align-self: center;
  align-items: center;
  flex-wrap: nowrap;
}
```

### src/app/styles.css —  / body

合并前：2处，原行号45、133。

```css
body {
  min-height: 100vh;
  font-size: var(--type-body-size);
  font-weight: var(--type-body-weight);
  line-height: var(--type-body-line-height);
  margin: 0;
  font-family: Arial, "Microsoft YaHei", sans-serif;
  background: #f5f7fb;
  color: #182230;
  display: flex;
}

body {
  --content-sidebar-width: 0px;
}
```

合并后：

```css
body {
  min-height: 100vh;
  font-size: var(--type-body-size);
  font-weight: var(--type-body-weight);
  line-height: var(--type-body-line-height);
  margin: 0;
  font-family: Arial, "Microsoft YaHei", sans-serif;
  background: #f5f7fb;
  color: #182230;
  display: flex;
  --content-sidebar-width: 0px;
}
```

### src/app/styles.css — @media (min-width: 761px) / aside

合并前：2处，原行号86、151。

```css
aside {
    position: sticky;
    top: 0;
    align-self: flex-start;
    height: 100vh;
    overflow-y: auto;
  }

aside {
    padding: 20px 24px;
  }
```

合并后：

```css
aside {
    position: sticky;
    top: 0;
    align-self: flex-start;
    height: 100vh;
    overflow-y: auto;
    padding: 20px 24px;
  }
```

### src/app/transport/page.module.css —  / .label

合并前：2处，原行号14、72。

```css
.label {
  display: block;
  color: #64748b;
  font-size: var(--font-caption);
  font-weight: var(--font-weight-bold);
}

.label{font-size:var(--type-field-label-size);font-weight:var(--type-field-label-weight);line-height:var(--type-field-label-line-height)}
```

合并后：

```css
.label {
  display: block;
  color: #64748b;
  font-size: var(--type-field-label-size);
  font-weight: var(--type-field-label-weight);
  line-height: var(--type-field-label-line-height);
}
```

### src/app/transport/page.module.css —  / .header a

合并前：2处，原行号20、72。

```css
.header a {
  font-size: var(--font-title-lg);
  font-weight: var(--font-weight-bold);
}

.header a{font-size:var(--type-card-title-size);font-weight:var(--type-card-title-weight);line-height:var(--type-card-title-line-height)}
```

合并后：

```css
.header a {
  font-size: var(--type-card-title-size);
  font-weight: var(--type-card-title-weight);
  line-height: var(--type-card-title-line-height);
}
```

### src/app/transport/page.module.css —  / .header b

合并前：2处，原行号24、72。

```css
.header b {
  font-size: var(--font-title-sm);
  color: #334155;
}

.header b{font-size:var(--type-body-size);font-weight:var(--type-body-weight);line-height:var(--type-body-line-height)}
```

合并后：

```css
.header b {
  color: #334155;
  font-size: var(--type-body-size);
  font-weight: var(--type-body-weight);
  line-height: var(--type-body-line-height);
}
```

### src/app/transport/page.module.css —  / .attention

合并前：2处，原行号28、72。

```css
.attention {
  color: #b45309;
  font-weight: var(--font-weight-bold);
}

.attention{font-size:var(--type-status-size);font-weight:var(--type-status-weight);line-height:var(--type-status-line-height)}
```

合并后：

```css
.attention {
  color: #b45309;
  font-size: var(--type-status-size);
  font-weight: var(--type-status-weight);
  line-height: var(--type-status-line-height);
}
```

### src/app/transport/page.module.css —  / .impact p,.resolution

合并前：2处，原行号43、72。

```css
.impact p,
.resolution {
  margin: 4px 0 0;
  color: #475569;
  font-size: var(--font-body);
  line-height: 1.5;
}

.impact p,.resolution{font-size:var(--type-body-size);font-weight:var(--type-body-weight);line-height:var(--type-body-line-height)}
```

合并后：

```css
.impact p,
.resolution {
  margin: 4px 0 0;
  color: #475569;
  font-size: var(--type-body-size);
  line-height: var(--type-body-line-height);
  font-weight: var(--type-body-weight);
}
```

### src/app/transport/page.module.css —  / .details h4

合并前：2处，原行号59、72。

```css
.details h4 {
  margin: 12px 0 6px;
  color: #334155;
}

.details h4{font-size:var(--type-section-title-size);font-weight:var(--type-section-title-weight);line-height:var(--type-section-title-line-height)}
```

合并后：

```css
.details h4 {
  margin: 12px 0 6px;
  color: #334155;
  font-size: var(--type-section-title-size);
  font-weight: var(--type-section-title-weight);
  line-height: var(--type-section-title-line-height);
}
```
