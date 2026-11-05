# 字体、按钮与专用控件基线

基线日期：2026-11-05（Asia/Shanghai）。通过 `node --import tsx scripts/audit-design-system.ts` 重建。本文为源码静态盘点；默认解析值不代表所有媒体条件下的最终计算样式。

## 扫描结论

- 扫描51个CSS文件，共255条font-size声明。
- 非Token数字字号：0处。
- 业务及组件CSS中的!important：0处。
- 核心字阶12、13、14、16、18px；展示档24、30px。
- 移动端输入文字16px；单行外壳桌面36px、移动端44px。

## 按钮规范

| size | 桌面高度 | 移动端高度 | 字号/行高 | 水平padding |
|---|---|---|---|---|
| default | 40px | 44px | 14px/20px | 16px |
| toolbar | 36px | 44px | 14px/20px | 14px |
| small | 32px | 36px | 13px/20px | 10px |
| compact | 24px | 32px | 12px/18px | 8px |

Button与ButtonLink由公共组件管理；上传入口复用同一class生成函数。业务容器只管理布局。弹窗footer通过唯一form ID关联原生提交与校验。

## 专用控件边界

日历共享CalendarGrid私有网格，标题14px/20px/600，星期和日期12px/18px/400，今天和选中500。状态顺序为disabled > selected > hover/active > default，无!important。支持方向键、Home/End、Enter/Space、Escape与Tab循环；支持年/月切换。视口<768px采用居中模态弹层。首页任务导航标题16px/24px/600，辅助说明14px/22px，计数12px/18px。

## 字号按文件汇总

| 文件 | 声明数 | 默认解析字号 |
|---|---|---|
| src/app/auth-page.module.css | 4 | 18px、14px、13px |
| src/app/contact-tasks/page.module.css | 5 | 16px、13px、14px |
| src/app/containers/page.module.css | 4 | 16px、13px、14px、12px |
| src/app/customers/page.module.css | 6 | 12px、13px、14px、16px |
| src/app/etb-runs/page.module.css | 3 | 16px、14px、12px |
| src/app/finance/routes/routes.module.css | 6 | 14px、12px、13px、16px |
| src/app/layout.module.css | 3 | 16px、14px |
| src/app/logs/page.module.css | 10 | 13px、14px、12px |
| src/app/notifications/page.module.css | 4 | 12px、16px、14px |
| src/app/orders/[id]/page.module.css | 5 | 13px、14px、16px、12px |
| src/app/orders/orders-toolbar.module.css | 1 | 13px |
| src/app/orders/orders.module.css | 9 | 14px、13px、12px |
| src/app/page.module.css | 20 | 14px、16px、12px、13px、30px、24px |
| src/app/plans/page.module.css | 6 | 16px、13px、12px、14px |
| src/app/profile/page.module.css | 9 | 24px、14px、12px、13px、16px |
| src/app/sailings/[id]/page.module.css | 6 | 16px、13px、14px、12px |
| src/app/sailings/page.module.css | 11 | 14px、16px、13px、12px |
| src/app/settings/page.module.css | 12 | 14px、16px、12px、13px、inherit |
| src/app/styles.css | 3 | 18px、16px、14px |
| src/app/transport/page.module.css | 6 | 13px、16px、14px、12px |
| src/components/action-button.module.css | 4 | 14px、13px、12px |
| src/components/admin-settings-forms.module.css | 6 | 12px、13px、14px |
| src/components/business.module.css | 44 | 14px、18px、12px、13px、16px |
| src/components/change-password-form.module.css | 3 | 13px、14px、12px |
| src/components/inline-order-value.module.css | 1 | 14px |
| src/components/ui/archive.module.css | 4 | 16px、12px、18px |
| src/components/ui/calendar-grid.module.css | 2 | 14px、12px |
| src/components/ui/compact-select.module.css | 2 | 12px |
| src/components/ui/confirmation-panel.module.css | 2 | 16px、14px |
| src/components/ui/data-table.module.css | 3 | 13px、14px |
| src/components/ui/date-time-field.module.css | 6 | 14px、12px |
| src/components/ui/date-time-picker.module.css | 3 | 14px、12px |
| src/components/ui/dialog.module.css | 5 | 18px、14px、12px、13px |
| src/components/ui/disclosure.module.css | 1 | 14px |
| src/components/ui/feedback-message.module.css | 1 | 12px |
| src/components/ui/form-field.module.css | 5 | 13px、12px、14px |
| src/components/ui/key-value-grid.module.css | 3 | 13px、14px、12px |
| src/components/ui/list.module.css | 16 | 13px、14px、12px |
| src/components/ui/nav-tabs.module.css | 2 | 14px、12px |
| src/components/ui/page-header.module.css | 1 | 18px |
| src/components/ui/record-card.module.css | 5 | 16px、13px、14px |
| src/components/ui/status-badge.module.css | 3 | 12px |

## src/app/auth-page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 19 | `.page h2` | `var(--type-page-title-size)` | 18px | 默认 |
| 26 | `.page section > p:not(.eyebrow)` | `var(--type-body-size)` | 14px | 默认 |
| 33 | `.eyebrow` | `var(--type-field-label-size)` | 13px | 默认 |
| 42 | `.link` | `var(--type-button-size)` | 14px | 默认 |

## src/app/contact-tasks/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 22 | `.header b` | `var(--type-card-title-size)` | 16px | 默认 |
| 29 | `.label` | `var(--type-field-label-size)` | 13px | 默认 |
| 44 | `.body b` | `var(--type-body-size)` | 14px | 默认 |
| 49 | `.body a` | `var(--type-button-size)` | 14px | 默认 |
| 59 | `.note p` | `var(--type-body-size)` | 14px | 默认 |

## src/app/containers/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 19 | `.header b` | `var(--type-card-title-size)` | 16px | 默认 |
| 26 | `.label` | `var(--type-field-label-size)` | 13px | 默认 |
| 34 | `.body a` | `var(--type-button-size)` | 14px | 默认 |
| 44 | `.plan > span:not(.label)` | `var(--type-caption-size)` | 12px | 默认 |

## src/app/customers/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 20 | `.header small,
.factory small` | `var(--type-caption-size)` | 12px | 默认 |
| 27 | `.label` | `var(--type-field-label-size)` | 13px | 默认 |
| 33 | `.factory span` | `var(--type-body-size)` | 14px | 默认 |
| 86 | `.header b` | `var(--type-card-title-size)` | 16px | 默认 |
| 114 | `.factory > b` | `var(--font-body)` | 14px | 默认 |
| 119 | `.factory .address,
.factory > small` | `var(--font-body-sm)` | 13px | 默认 |

## src/app/etb-runs/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 13 | `.header b` | `var(--type-card-title-size)` | 16px | 默认 |
| 45 | `.matches span,
.result` | `var(--type-body-size)` | 14px | 默认 |
| 51 | `.help small` | `var(--type-caption-size)` | 12px | 默认 |

## src/app/finance/routes/routes.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 14 | `.notice` | `var(--type-body-size)` | 14px | 默认 |
| 40 | `.price` | `var(--type-body-size)` | 14px | 默认 |
| 50 | `.price small` | `var(--type-caption-size)` | 12px | 默认 |
| 68 | `.billSummary` | `var(--type-body-size)` | 14px | 默认 |
| 79 | `.billSummary dt` | `var(--type-field-label-size)` | 13px | 默认 |
| 88 | `.billDetails h3` | `var(--type-section-title-size)` | 16px | 默认 |

## src/app/layout.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 42 | `.content > :global(h2)` | `var(--type-section-title-size)` | 16px | 默认 |
| 59 | `.content > :global(h2 + p)` | `var(--type-body-size)` | 14px | 默认 |
| 64 | `.content :global(:where(h3))` | `var(--type-section-title-size)` | 16px | 默认 |

## src/app/logs/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 25 | `.tableHeader` | `var(--type-table-header-size)` | 13px | 默认 |
| 37 | `.logRow` | `var(--type-body-size)` | 14px | 默认 |
| 51 | `.time` | `var(--type-caption-size)` | 12px | 默认 |
| 71 | `.actor b` | `var(--type-body-size)` | 14px | 默认 |
| 79 | `.actor small` | `var(--type-caption-size)` | 12px | 默认 |
| 100 | `.objectTags span` | `var(--type-status-size)` | 12px | 默认 |
| 125 | `.noDetail` | `var(--type-body-size)` | 14px | 默认 |
| 146 | `.diffHeader` | `var(--type-table-header-size)` | 13px | 默认 |
| 153 | `.diffRow` | `var(--type-body-size)` | 14px | 默认 |
| 204 | `.systemLogToggle` | `var(--type-control-size)` | 14px | 默认 |

## src/app/notifications/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 33 | `.meta time` | `var(--type-caption-size)` | 12px | 默认 |
| 39 | `.content b` | `var(--type-card-title-size)` | 16px | 默认 |
| 46 | `.content p` | `var(--type-body-size)` | 14px | 默认 |
| 58 | `.content span` | `var(--type-button-size)` | 14px | 默认 |

## src/app/orders/[id]/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 24 | `.fieldLabel` | `var(--type-field-label-size)` | 13px | 默认 |
| 38 | `.fieldValue > b` | `var(--type-body-size)` | 14px | 默认 |
| 50 | `.summary ~ section > h3` | `var(--type-section-title-size)` | 16px | 默认 |
| 82 | `.planItem > div > b` | `var(--type-body-size)` | 14px | 默认 |
| 88 | `.planItem > div > span` | `var(--type-caption-size)` | 12px | 默认 |

## src/app/orders/orders-toolbar.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 53 | `.filter label` | `var(--type-field-label-size)` | 13px | 默认 |

## src/app/orders/orders.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 3 | `.resultSummary` | `var(--type-body-size)` | 14px | 默认 |
| 21 | `.card` | `var(--type-body-size)` | 14px | 默认 |
| 44 | `.identity > span,
.details span` | `var(--type-field-label-size)` | 13px | 默认 |
| 50 | `.header a` | `var(--type-field-label-size)` | 13px | 默认 |
| 58 | `.header small` | `var(--type-caption-size)` | 12px | 默认 |
| 78 | `.tagAction` | `var(--type-status-size)` | 12px | 默认 |
| 102 | `.review` | `var(--type-body-size)` | 14px | 默认 |
| 121 | `.details b` | `var(--type-body-size)` | 14px | 默认 |
| 130 | `.details .estimated` | `var(--type-caption-size)` | 12px | 默认 |

## src/app/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 27 | `.taskHint` | `var(--font-body)` | 14px | 默认 |
| 59 | `.alertItem b` | `var(--type-card-title-size)` | 16px | 默认 |
| 67 | `.alertItem p` | `var(--type-body-size)` | 14px | 默认 |
| 77 | `.alertAction` | `var(--type-button-size)` | 14px | 默认 |
| 89 | `.cardAction,
.quiet .cardAction` | `var(--font-caption)` | 12px | 默认 |
| 107 | `.panelHeading h2` | `var(--type-section-title-size)` | 16px | 默认 |
| 115 | `.panelHeading p` | `var(--font-body)` | 14px | 默认 |
| 124 | `.summary` | `var(--type-caption-size)` | 12px | 默认 |
| 131 | `.groupLabel` | `var(--type-caption-size)` | 12px | 默认 |
| 137 | `.taskCount` | `var(--type-status-size)` | 12px | 默认 |
| 170 | `.taskContent li a` | `var(--type-button-size)` | 14px | 默认 |
| 180 | `.panelFoot` | `var(--font-body)` | 14px | 默认 |
| 192 | `.alertHeading h3` | `var(--type-section-title-size)` | 16px | 默认 |
| 203 | `.alertPanel[open] .alertHeading p` | `var(--type-caption-size)` | 12px | 默认 |
| 229 | `.panelHeading p` | `var(--font-body)` | 14px | @media (max-width: 760px) |
| 288 | `.cardTitle` | `var(--type-field-label-size)` | 13px | 默认 |
| 294 | `.number` | `var(--font-display-lg)` | 30px | 默认 |
| 358 | `.emptyState p` | `var(--font-body)` | 14px | 默认 |
| 441 | `.emptyIcon` | `var(--font-display-sm)` | 24px | 默认 |
| 471 | `.taskNav button` | `var(--font-title-sm)` | 16px | 默认 |

## src/app/plans/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 1 | `.header b` | `var(--type-card-title-size)` | 16px | 默认 |
| 1 | `.label` | `var(--type-field-label-size)` | 13px | 默认 |
| 1 | `.pending` | `var(--type-status-size)` | 12px | 默认 |
| 1 | `.actions h4` | `var(--type-card-title-size)` | 16px | 默认 |
| 1 | `.actions p` | `var(--type-body-size)` | 14px | 默认 |
| 1 | `.impact p` | `var(--type-body-size)` | 14px | 默认 |

## src/app/profile/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 37 | `.avatar` | `var(--font-display-sm)` | 24px | 默认 |
| 55 | `.identity strong` | `var(--type-body-size)` | 14px | 默认 |
| 65 | `.tag` | `var(--type-status-size)` | 12px | 默认 |
| 72 | `.email` | `var(--type-body-size)` | 14px | 默认 |
| 85 | `.accountMeta` | `var(--type-body-size)` | 14px | 默认 |
| 96 | `.accountMeta dt` | `var(--type-field-label-size)` | 13px | 默认 |
| 113 | `.passwordSection h2` | `var(--type-section-title-size)` | 16px | 默认 |
| 127 | `.alert` | `var(--type-caption-size)` | 12px | 默认 |
| 141 | `.avatar` | `var(--font-display-sm)` | 24px | @media (max-width: 760px) |

## src/app/sailings/[id]/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 2 | `.page > section > h3` | `var(--type-section-title-size)` | 16px | 默认 |
| 19 | `.summary > div > span,
.observationHeader > div > span,
.observationDetails > div > span` | `var(--type-field-label-size)` | 13px | 默认 |
| 26 | `.summary b,
.observationDetails b,
.observationDetails a` | `var(--type-body-size)` | 14px | 默认 |
| 33 | `.summary small` | `var(--type-caption-size)` | 12px | 默认 |
| 72 | `.observationHeader b` | `var(--type-body-size)` | 14px | 默认 |
| 89 | `.observationFooter` | `var(--type-body-size)` | 14px | 默认 |

## src/app/sailings/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 1 | `.resultSummary` | `var(--type-body-size)` | 14px | 默认 |
| 1 | `.card` | `var(--type-body-size)` | 14px | 默认 |
| 1 | `.header h3` | `var(--type-card-title-size)` | 16px | 默认 |
| 1 | `.label` | `var(--type-field-label-size)` | 13px | 默认 |
| 1 | `.footer` | `var(--type-body-size)` | 14px | 默认 |
| 1 | `.footer small` | `var(--type-caption-size)` | 12px | 默认 |
| 1 | `.footer a` | `var(--type-button-size)` | 14px | 默认 |
| 2 | `.orderIdentity span` | `var(--type-field-label-size)` | 13px | 默认 |
| 2 | `.orderIdentity a` | `var(--type-field-label-size)` | 13px | 默认 |
| 2 | `.orderMeta` | `var(--type-caption-size)` | 12px | 默认 |
| 2 | `.orderFields b` | `var(--type-body-size)` | 14px | 默认 |

## src/app/settings/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 23 | `.tabs a` | `var(--font-body)` | 14px | 默认 |
| 69 | `.portTitle h4` | `var(--font-title-sm)` | 16px | 默认 |
| 77 | `.portTitle small` | `var(--font-caption)` | 12px | 默认 |
| 90 | `.portIcon,
.memberAvatar` | `var(--font-title-sm)` | 16px | 默认 |
| 113 | `.roleTag` | `var(--font-caption)` | 12px | 默认 |
| 129 | `.credentials` | `var(--font-body)` | 14px | 默认 |
| 140 | `.credentials dt` | `var(--font-body-sm)` | 13px | 默认 |
| 153 | `.credentials .updatedAt` | `var(--font-caption)` | 12px | 默认 |
| 159 | `.updatedAt dt,
.updatedAt dd` | `inherit` | inherit | 默认 |
| 180 | `.sourceStatus` | `var(--font-caption)` | 12px | 默认 |
| 203 | `.activityHint` | `var(--font-caption)` | 12px | 默认 |
| 219 | `.platformHint` | `var(--font-body-sm)` | 13px | 默认 |

## src/app/styles.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 55 | `aside h1` | `var(--font-title-lg)` | 18px | 默认 |
| 100 | `aside h1` | `var(--font-title-sm)` | 16px | @media (max-width: 760px) |
| 109 | `body` | `var(--type-body-size)` | 14px | 默认 |

## src/app/transport/page.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 40 | `.label` | `var(--type-field-label-size)` | 13px | 默认 |
| 45 | `.header a` | `var(--type-card-title-size)` | 16px | 默认 |
| 51 | `.header b` | `var(--type-body-size)` | 14px | 默认 |
| 57 | `.attention` | `var(--type-status-size)` | 12px | 默认 |
| 65 | `.impact p,
.resolution` | `var(--type-body-size)` | 14px | 默认 |
| 78 | `.details h4` | `var(--type-section-title-size)` | 16px | 默认 |

## src/components/action-button.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 32 | `.default` | `var(--font-body)` | 14px | 默认 |
| 39 | `.toolbar` | `var(--font-body)` | 14px | 默认 |
| 46 | `.small` | `var(--font-body-sm)` | 13px | 默认 |
| 53 | `.compact` | `var(--font-caption)` | 12px | 默认 |

## src/components/admin-settings-forms.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 7 | `.form > small` | `var(--font-caption)` | 12px | 默认 |
| 40 | `.portBadge` | `var(--font-caption)` | 12px | 默认 |
| 50 | `.passwordField label` | `var(--type-field-label-size)` | 13px | 默认 |
| 69 | `.passwordInput input` | `var(--type-control-size)` | 14px | 默认 |
| 89 | `.passwordField small` | `var(--font-caption)` | 12px | 默认 |
| 112 | `.toast` | `var(--font-body)` | 14px | 默认 |

## src/components/business.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 19 | `.so-file-preview__header b` | `var(--type-body-size)` | 14px | 默认 |
| 42 | `.so-file-preview__loading` | `var(--type-body-size)` | 14px | 默认 |
| 72 | `.muted` | `var(--font-body)` | 14px | 默认 |
| 83 | `.sidebar-nav__group-label:after` | `var(--font-title-lg)` | 18px | 默认 |
| 116 | `.nav-count` | `var(--font-caption)` | 12px | 默认 |
| 145 | `.change-summary li b` | `var(--type-field-label-size)` | 13px | 默认 |
| 150 | `.change-summary li small` | `var(--type-caption-size)` | 12px | 默认 |
| 171 | `.order-status-tag small` | `var(--font-caption)` | 12px | 默认 |
| 210 | `.transport-form legend` | `var(--type-card-title-size)` | 16px | 默认 |
| 242 | `.etb-observation-form small` | `var(--type-caption-size)` | 12px | 默认 |
| 317 | `.order-action-card p` | `var(--font-body-sm)` | 13px | 默认 |
| 323 | `.order-action-card label` | `var(--font-body-sm)` | 13px | 默认 |
| 345 | `.orders-filter label` | `var(--type-field-label-size)` | 13px | 默认 |
| 408 | `.so-upload__status-message` | `var(--type-caption-size)` | 12px | 默认 |
| 484 | `.so-upload__progress` | `var(--type-caption-size)` | 12px | 默认 |
| 513 | `.so-upload__files` | `var(--type-caption-size)` | 12px | 默认 |
| 567 | `.schedule-update__toolbar` | `var(--font-body-sm)` | 13px | 默认 |
| 589 | `.schedule-update__options label` | `var(--font-body-sm)` | 13px | 默认 |
| 641 | `.contact-actions__confirm label` | `var(--font-body-sm)` | 13px | 默认 |
| 664 | `.transport-impact-confirm label` | `var(--type-field-label-size)` | 13px | 默认 |
| 674 | `.plan-action-form summary` | `var(--font-body)` | 14px | 默认 |
| 688 | `.plan-action-form label` | `var(--type-field-label-size)` | 13px | 默认 |
| 714 | `.schedule-request small` | `var(--font-body-sm)` | 13px | 默认 |
| 726 | `.handoff-confirm label` | `var(--font-body-sm)` | 13px | 默认 |
| 756 | `.container-number-form label` | `var(--font-body-sm)` | 13px | 默认 |
| 783 | `.order-status-section__controls label` | `var(--type-field-label-size)` | 13px | 默认 |
| 793 | `.order-status-section__hint` | `var(--type-caption-size)` | 12px | 默认 |
| 838 | `.container-adjustment-form__code` | `var(--type-body-size)` | 14px | 默认 |
| 849 | `.container-adjustment-form__code small` | `var(--type-caption-size)` | 12px | 默认 |
| 857 | `.container-adjustment-form label` | `var(--type-field-label-size)` | 13px | 默认 |
| 891 | `.container-adjustment-form__code` | `var(--type-body-size)` | 14px | @media (max-width: 760px) |
| 918 | `.cost-fields label` | `var(--font-caption)` | 12px | 默认 |
| 955 | `.cost-delete-confirm` | `var(--font-body-sm)` | 13px | 默认 |
| 981 | `.sailing-link-form label` | `var(--type-field-label-size)` | 13px | 默认 |
| 1006 | `.inline-delete-confirm` | `var(--font-body-sm)` | 13px | 默认 |
| 1040 | `.sailing-match-form label` | `var(--type-field-label-size)` | 13px | 默认 |
| 1076 | `.status-quick-filter > span` | `var(--font-body-sm)` | 13px | 默认 |
| 1088 | `.status-quick-filter a` | `var(--font-body-sm)` | 13px | 默认 |
| 1102 | `.status-quick-filter b` | `var(--font-caption)` | 12px | 默认 |
| 1148 | `.sidebar-nav__group-label` | `var(--font-body)` | 14px | 默认 |
| 1169 | `.sidebar-nav a` | `var(--font-body)` | 14px | 默认 |
| 1177 | `.sidebar-nav a` | `var(--font-body)` | 14px | @media (max-width: 760px) |
| 1194 | `.signed-in` | `var(--font-body-sm)` | 13px | 默认 |
| 1213 | `.sidebar-nav__group-label` | `var(--font-body)` | 14px | @media (min-width: 761px) |

## src/components/change-password-form.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 13 | `.field label` | `var(--type-field-label-size)` | 13px | 默认 |
| 32 | `.inputWrap input` | `var(--type-control-size)` | 14px | 默认 |
| 50 | `.field small,
.strength small` | `var(--type-caption-size)` | 12px | 默认 |

## src/components/inline-order-value.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 6 | `.select :global(button)` | `var(--type-control-size)` | 14px | 默认 |

## src/components/ui/archive.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 10 | `.title` | `var(--type-section-title-size)` | 16px | 默认 |
| 17 | `.title span` | `var(--type-caption-size)` | 12px | 默认 |
| 30 | `.empty > span` | `var(--type-page-title-size)` | 18px | 默认 |
| 50 | `.recordCopy small` | `var(--type-caption-size)` | 12px | 默认 |

## src/components/ui/calendar-grid.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 8 | `.header` | `var(--font-body)` | 14px | 默认 |
| 45 | `.row > span,
.row > button` | `var(--font-caption)` | 12px | 默认 |

## src/components/ui/compact-select.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 16 | `.root .select` | `var(--font-caption)` | 12px | 默认 |
| 43 | `.options .option` | `var(--font-caption)` | 12px | 默认 |

## src/components/ui/confirmation-panel.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 23 | `.title` | `var(--type-card-title-size)` | 16px | 默认 |
| 30 | `.body` | `var(--type-body-size)` | 14px | 默认 |

## src/components/ui/data-table.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 27 | `.hint` | `var(--font-body-sm)` | 13px | 默认 |
| 39 | `.table th` | `var(--type-table-header-size)` | 13px | 默认 |
| 44 | `.table td` | `var(--type-body-size)` | 14px | 默认 |

## src/components/ui/date-time-field.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 36 | `.dateInput` | `var(--type-control-size)` | 14px | 默认 |
| 76 | `.timeSelector` | `var(--type-control-size)` | 14px | 默认 |
| 82 | `.timeSelector i` | `var(--font-body)` | 14px | 默认 |
| 117 | `.timePopover h4` | `var(--font-body)` | 14px | 默认 |
| 165 | `.calendarFooter button` | `var(--font-caption)` | 12px | 默认 |
| 179 | `.timeActions button` | `var(--type-caption-size)` | 12px | 默认 |

## src/components/ui/date-time-picker.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 29 | `.control input` | `var(--type-control-size)` | 14px | 默认 |
| 90 | `.time` | `var(--font-caption)` | 12px | 默认 |
| 130 | `.actions button` | `var(--font-caption)` | 12px | 默认 |

## src/components/ui/dialog.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 27 | `.title` | `var(--type-page-title-size)` | 18px | 默认 |
| 35 | `.body` | `var(--type-body-size)` | 14px | 默认 |
| 63 | `.message` | `var(--type-caption-size)` | 12px | 默认 |
| 85 | `.body label` | `var(--type-field-label-size)` | 13px | 默认 |
| 94 | `.body input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),
.body select,
.body button[aria-haspopup="listbox"]` | `var(--type-control-size)` | 14px | 默认 |

## src/components/ui/disclosure.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 16 | `.summary` | `var(--type-button-size)` | 14px | 默认 |

## src/components/ui/feedback-message.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 24 | `.message` | `var(--type-caption-size)` | 12px | 默认 |

## src/components/ui/form-field.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 1 | `.field` | `var(--type-field-label-size)` | 13px | 默认 |
| 1 | `.field small` | `var(--type-caption-size)` | 12px | 默认 |
| 1 | `.control` | `var(--type-control-size)` | 14px | 默认 |
| 1 | `.checkbox` | `var(--type-field-label-size)` | 13px | 默认 |
| 1 | `.checkbox small` | `var(--type-caption-size)` | 12px | 默认 |

## src/components/ui/key-value-grid.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 19 | `.item span` | `var(--type-field-label-size)` | 13px | 默认 |
| 26 | `.item b` | `var(--type-body-size)` | 14px | 默认 |
| 32 | `.item small` | `var(--type-caption-size)` | 12px | 默认 |

## src/components/ui/list.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 18 | `.field` | `var(--type-field-label-size)` | 13px | 默认 |
| 30 | `.control` | `var(--type-control-size)` | 14px | 默认 |
| 58 | `.selectTrigger` | `var(--type-control-size)` | 14px | 默认 |
| 92 | `.selectOption` | `var(--type-control-size)` | 14px | 默认 |
| 125 | `.summary` | `var(--type-body-size)` | 14px | 默认 |
| 139 | `.pagination span` | `var(--type-body-size)` | 14px | 默认 |
| 172 | `.controlCompact` | `var(--type-control-compact-size)` | 14px | 默认 |
| 178 | `.selectTriggerCompact` | `var(--type-control-compact-size)` | 14px | 默认 |
| 184 | `.selectOptionCompact` | `var(--type-control-compact-size)` | 14px | 默认 |
| 193 | `.controlCompact,
  .selectTriggerCompact,
  .selectOptionCompact` | `var(--type-control-size)` | 14px | @media (max-width: 760px) |
| 228 | `.paginationStats select` | `var(--type-control-size)` | 14px | 默认 |
| 259 | `.paginationControls > span,
.paginationControls .pageJump label` | `var(--type-body-size)` | 14px | 默认 |
| 282 | `.pageJump label` | `var(--type-body-size)` | 14px | 默认 |
| 294 | `.pageJump input[type="number"]` | `var(--type-control-size)` | 14px | 默认 |
| 325 | `.selectEmpty` | `var(--type-caption-size)` | 12px | 默认 |
| 348 | `.loadingMask` | `var(--font-body-sm)` | 13px | 默认 |

## src/components/ui/nav-tabs.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 16 | `.label` | `var(--type-control-size)` | 14px | 默认 |
| 25 | `.count` | `var(--font-caption)` | 12px | 默认 |

## src/components/ui/page-header.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 1 | `.title` | `var(--type-page-title-size)` | 18px | 默认 |

## src/components/ui/record-card.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 17 | `.header > div > b,
.header > div > a,
.header > div > h3` | `var(--type-card-title-size)` | 16px | 默认 |
| 30 | `.headercompact > div > span:first-child` | `var(--type-field-label-size)` | 13px | 默认 |
| 37 | `.headercompact > div > b,
.headercompact > div > a,
.headercompact > div > h3` | `var(--type-card-title-size)` | 16px | 默认 |
| 71 | `.field > span:first-child` | `var(--type-field-label-size)` | 13px | 默认 |
| 126 | `.card` | `var(--type-body-size)` | 14px | 默认 |

## src/components/ui/status-badge.module.css

| 行号 | 选择器 | 声明 | 默认解析值 | 条件 |
|---|---|---|---|---|
| 1 | `.badge` | `var(--type-status-size)` | 12px | 默认 |
| 1 | `.small` | `var(--font-caption)` | 12px | 默认 |
| 13 | `.selectTrigger.selectTrigger` | `var(--type-status-size)` | 12px | 默认 |
