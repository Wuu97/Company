# UI 冗余与补丁堆叠审计

日期：2026-11-07。只读审计，未删除或修改业务代码。

## 范围与方法

扫描 src 下 376 个 TS、TSX、CSS 文件；解析静态 import/export 引用，运行 TypeScript noUnusedLocals/noUnusedParameters，并检索整个仓库的候选文件名及关键样式。排除 Next.js 约定入口及测试文件作为删除候选。静态零引用不等于可以直接删除；动态加载、脚本、文档及 CSS @import 需要单独核查。没有进行浏览器视觉验证、资源使用率采样或数据库检查。

## 统计

- 编译器确认的未使用声明：10 处。
- 无静态引用的 UI 文件候选：8 个，共 459 行（含空行、注释，不代表可直接删除的净代码量）。
- 含 !important 的样式文件：9 个，共 54 处。
- 存在重复选择器的 CSS 文件：47 个。重复包含合法媒体查询，不能按次数机械删除。

## 1. 未使用声明：优先小范围清理

```text
src/app/archives/ContractTruckList.tsx(1,1): error TS6133: 'archiveNavigation' is declared but its value is never read.
src/app/archives/DriverList.tsx(1,1): error TS6133: 'archiveNavigation' is declared but its value is never read.
src/app/archives/TemporaryTruckList.tsx(1,1): error TS6133: 'archiveNavigation' is declared but its value is never read.
src/app/finance/bills/[id]/bill-lines-table.tsx(5,35): error TS6133: 'partnerMoneyColumns' is declared but its value is never read.
src/app/finance/routes/rate-form-fields.tsx(4,1): error TS6133: 'Button' is declared but its value is never read.
src/app/finance/routes/route-management-client.tsx(139,11): error TS6133: 'routeParts' is declared but its value is never read.
src/app/orders/page.tsx(4,1): error TS6133: 'businessStyles' is declared but its value is never read.
src/app/transport/page.tsx(17,1): error TS6133: 'NavTabs' is declared but its value is never read.
src/components/ui/list.tsx(16,10): error TS6133: 'Button' is declared but its value is never read.
src/components/ui/status-badge.tsx(8,58): error TS6133: 'size' is declared but its value is never read.
```

其中 StatusBadge 的 size 是对外公开属性，不能只删除参数就声称规格已统一：需决定恢复实现还是同步迁移调用方。

## 2. 零引用 UI 文件候选

| 文件 | 行数 | 判断 |
| --- | ---: | --- |
| `src/components/container-number-form.tsx` | 60 | 未发现生产静态引用；删除前复核外部脚本及动态入口 |
| `src/components/customer-form.tsx` | 53 | 未发现生产静态引用；删除前复核外部脚本及动态入口 |
| `src/components/factory-form.tsx` | 73 | 未发现生产静态引用；删除前复核外部脚本及动态入口 |
| `src/components/order-actions.tsx` | 115 | 未发现生产静态引用；删除前复核外部脚本及动态入口 |
| `src/components/order-sailing-link-form.tsx` | 67 | 未发现生产静态引用；删除前复核外部脚本及动态入口 |
| `src/components/ui/list-workspace.module.css` | 72 | 未发现生产静态引用；删除前复核外部脚本及动态入口 |
| `src/components/ui/list-workspace.tsx` | 6 | 未发现生产静态引用；删除前复核外部脚本及动态入口 |
| `src/components/ui/page-size-select.tsx` | 13 | 未发现生产静态引用；删除前复核外部脚本及动态入口 |

`list-workspace.tsx` 已明确标记 deprecated，且没有调用方；其 CSS 也没有 import，是优先候选。其他表单文件可能是被新弹窗替代的旧实现，建议以当前表单功能逐项核对后删除。

## 3. 已可定位的冗余或重复职责

- `src/app/customers/page.module.css` 的 `.filter.filter`、`.filterActions`：客户列表已迁到 ArchiveFilterBar，未找到这些类的调用，属于旧筛选栏遗留。
- `src/components/ui/archive.module.css` 的 `.filter.filter`：ResourceRecords 已迁到公共筛选栏；需要结合其余类分别审查，不能删除整个仍被使用的样式文件。
- 客户编辑器的 `.editorFull`：表单改为单列后，跨全部列的声明已无实际差异；可删除类和对应 JSX className。
- `archiveNavigation()` 为列表构造 href Tabs，但 `ArchivePageContainer` 在 activeTab 存在时重新生成带 onClick 的 Tabs，覆盖传入配置：存在两套配置职责和无效数据构造，建议集中到一个地方。
- 四个旧档案 page.tsx 的重定向代码几乎相同：它们承担旧链接兼容，不能当作无用路由删除；可以提取 query 转换函数。
- DriverList / ContractTruckList / TemporaryTruckList 的关键词、状态处理及数据查询结构高度相似：属于待抽象的重复结构，不是可直接删除的业务逻辑。

## 4. 补丁堆叠：建议按影响排序整合

| 位置 | 证据 / 问题 | 建议 |
| --- | --- | --- |
| `src/components/ui/page-container.module.css` | `.card`、`.content`、`.pagination` 多次重新定义；min-height 从视口计算改为 0；筛选尺寸多层 `.card.card` 覆盖 | 按最终布局重写单一基础规则，媒体查询集中管理 |
| `src/app/logs/page.module.css` | 表格网格定义、padding、末列对齐多次覆盖；现在又叠加公共 TableHeader / table-body | 保留列布局，将密度规则归公共组件，删除已被覆盖的声明 |
| `src/components/ui/data-table.module.css` | 旧 `.table th/td` 与 `.schemaTable`、响应式 padding、公共 TableHeader/TableBody 同时规定尺寸 | 明确基础、列布局、密度三类职责，移除被公共样式覆盖的高度字号内边距 |
| `src/app/customers/page.module.css` | 本地 td height:56px、padding:10px 12px 与公共 48px / 6px 冲突 | 保留横向 padding，移除旧纵向密度声明 |
| `src/components/ui/table-header.module.css` / `table-body.module.css` | 新公共规格通过 14 个 !important 压过旧规则 | 迁移旧 CSS 后降低优先级，不靠持续增加 !important |
| `src/app/finance/routes/routes.module.css` | 27 个 !important，重复选择器及局部规则较多 | 优先整合筛选栏、表格和工具栏规则，逐条验证媒体条件 |
| `src/app/finance/bills/settlement-bills.module.css` | 表格宽度由 columns 与 CSS col:nth-child !important 同时控制 | 选择一个列宽来源，避免两套配置漂移 |
| 状态与空状态组件 | StatusBadge → StatusTag、ArchiveEmptyState → TableEmptyState 是兼容包装 | 有调用方则保留，是否合并取决于 API 含义，不能仅凭薄包装删除 |

## 5. 清理时应一并修复的风险

- `ArchiveFilterBar` 的 CommonFilterBar key 包含 q/status；自动筛选触发 URL 更新后，key 改变会重挂载输入框，存在连续输入丢焦点风险。需要浏览器验证并改为稳定身份及受控值同步。
- 公共 TableBody 只设置 td 和日志行容器的基础字号；嵌套的 small、span、按钮、徽章仍可能有自己的字号。不能据此认定所有可见文本已完全一致，应保留语义层级并明确哪些文字受统一规则控制。
- 公共 48px 是基础行高；多行内容、控件和客户 rowSpan 会撑高行。不要为了像素一致强制裁切业务信息。
- 先前只排除 print 媒体并不能排除屏幕中的打印预览；本次打印预览和 DriverStatementTable 已退出公共表头组件，这个边界需要保留。

## 6. 不应纳入删除

- `src/app/tokens.css`：被 styles.css 的 @import 使用，并有设计系统脚本依赖。
- 旧档案入口：用于兼容路由重定向。
- `src/lib` 中只被测试引用或无 src 引用的模块：部分可能由 scripts/worker 使用，本报告不把它们列作 UI 删除候选。
- 测试、文档、Next 入口不能因为没有 import 就认定无用。
- 账单详情、打印预览及 Excel 导出：继续按原模板规定保留，不参与普通列表密度整合。

## 7. CSS 覆盖统计明细

| 文件 | !important 次数 | 重复选择器组数 |
| --- | ---: | ---: |
| `src/app/finance/routes/routes.module.css` | 27 | 7 |
| `src/components/ui/table-body.module.css` | 8 | 0 |
| `src/components/ui/table-header.module.css` | 6 | 0 |
| `src/app/styles.css` | 5 | 5 |
| `src/app/finance/bills/settlement-bills.module.css` | 3 | 3 |
| `src/components/action-button.module.css` | 2 | 0 |
| `src/app/finance/bills/[id]/bill-print.module.css` | 1 | 7 |
| `src/app/settings/page.module.css` | 1 | 9 |
| `src/components/ui/avatar.module.css` | 1 | 0 |
| `src/app/auth-page.module.css` | 0 | 2 |
| `src/app/contact-tasks/page.module.css` | 0 | 1 |
| `src/app/containers/page.module.css` | 0 | 2 |
| `src/app/customers/page.module.css` | 0 | 3 |
| `src/app/finance/bills/[id]/bill-detail.module.css` | 0 | 14 |
| `src/app/finance/bills/[id]/bill-lines-table.module.css` | 0 | 4 |
| `src/app/layout.module.css` | 0 | 4 |
| `src/app/logs/page.module.css` | 0 | 10 |
| `src/app/notifications/page.module.css` | 0 | 2 |
| `src/app/orders/[id]/page.module.css` | 0 | 2 |
| `src/app/orders/orders-toolbar.module.css` | 0 | 3 |
| `src/app/orders/orders.module.css` | 0 | 6 |
| `src/app/page.module.css` | 0 | 14 |
| `src/app/plans/page.module.css` | 0 | 2 |
| `src/app/profile/page.module.css` | 0 | 1 |
| `src/app/sailings/[id]/page.module.css` | 0 | 2 |
| `src/app/sailings/page.module.css` | 0 | 1 |
| `src/app/tokens.css` | 0 | 1 |
| `src/app/transport/page.module.css` | 0 | 1 |
| `src/components/admin-settings-forms.module.css` | 0 | 2 |
| `src/components/business.module.css` | 0 | 37 |
| `src/components/change-password-form.module.css` | 0 | 2 |
| `src/components/plan-form.module.css` | 0 | 2 |
| `src/components/ui/app-pagination.module.css` | 0 | 2 |
| `src/components/ui/calendar-grid.module.css` | 0 | 1 |
| `src/components/ui/common-filter-bar.module.css` | 0 | 2 |
| `src/components/ui/compact-select.module.css` | 0 | 1 |
| `src/components/ui/confirmation-panel.module.css` | 0 | 1 |
| `src/components/ui/data-table.module.css` | 0 | 5 |
| `src/components/ui/date-time-field.module.css` | 0 | 2 |
| `src/components/ui/date-time-picker.module.css` | 0 | 2 |
| `src/components/ui/dialog.module.css` | 0 | 6 |
| `src/components/ui/disclosure.module.css` | 0 | 2 |
| `src/components/ui/form-feedback.module.css` | 0 | 1 |
| `src/components/ui/form-field.module.css` | 0 | 3 |
| `src/components/ui/key-value-grid.module.css` | 0 | 2 |
| `src/components/ui/list-workspace.module.css` | 0 | 2 |
| `src/components/ui/list.module.css` | 0 | 9 |
| `src/components/ui/page-container.module.css` | 0 | 11 |
| `src/components/ui/page-header.module.css` | 0 | 2 |
| `src/components/ui/record-card.module.css` | 0 | 5 |
| `src/components/ui/status-badge-switch.module.css` | 0 | 1 |

## 建议清理顺序

1. 删除已确认的未使用导入、变量和失效样式；对公开 size 属性单独处理。
2. 复核并删除零引用旧 UI 文件，保留兼容路由。
3. 合并 PageContainer、DataTable、日志和档案的样式覆盖，逐步移除 !important。
4. 修复自动搜索重挂载问题，补充交互验证。
5. 运行类型检查、现有相关测试、完整构建，再验证列表空态、分页、切换 Tabs、弹窗以及打印/Excel 的模板边界。

本报告中的数量来自当前工作区静态扫描，未对全部 CSS class、公共资源、依赖包、动态代码或部署脚本作可删除性证明。

## 处理记录（2026-11-07）

### 本轮已完成

- 删除上述 8 个零引用 UI 文件（459 行）；删除前复核组件名与模块路径，src、scripts 中没有调用方。
- 清理 10 处未使用声明；严格 noUnusedLocals / noUnusedParameters 类型检查现已通过。
- StatusBadge 的 size 原本完全不参与渲染，本轮同步删除调用方的无效 size 属性与公开类型；清除旧 badge / selectTrigger 样式，仅保留仍在使用的 interactive 样式。
- 删除客户与档案旧筛选栏样式、单列弹窗的 editorFull。
- 删除 archiveNavigation 的重复构造；Tabs 配置由 ArchivePageContainer 统一生成。
- 提取 redirectLegacyArchive；保留四个旧路由和查询参数兼容。
- ArchiveFilterBar 改用受控乐观状态，不再以关键词和状态作为组件 key；在路由过渡期间保留输入值，并允许 URL 返回结果同步筛选状态。尚需浏览器验证连续输入、前进后退和重置。
- PageContainer 将顶层 card、content、pagination、filter 的重复规则收敛为单一定义；保留原响应式和兼容筛选规则，避免盲目改变层叠关系。
- 移除 DataTable schema 层与公共密度组件重复的字号、高度、纵向间距；客户表格移除本地 56px 行高及纵向 padding。
- 未改动打印模板、Excel 导出和账单详情的业务样式（账单详情仅删除一个未使用导入）。

### 验证

- `tsc --noEmit --noUnusedLocals --noUnusedParameters`：通过。
- `npm run build`：通过。
- `git diff --check`：通过。
- `npm test`：150 项通过、5 项失败、1 项跳过；共 41 个文件通过、1 个文件失败、1 个文件跳过。
- 失败均在 design-system.test.tsx：3 项依赖服务端静态输出中的 Dialog，但此前 Portal 实现仅在客户端挂载；1 项断言不包含 variant="text"，会命中已有 data-variant="text"；1 项按钮 CSS 架构断言禁止 !important，与现存全局禁用按钮光环规则冲突。本轮没有修改这些产品约束或通过删除断言掩盖失败。

### 仍需继续验证的整合项

- 路线管理 27 个 !important 主要控制内联列宽和对齐，不属于已证明无效的声明；需要浏览器对照后迁移 columns 配置，不能直接移除。
- 账单列表 col:nth-child 的列宽与固定操作列需整体迁移；本轮保留其视觉行为。
- PageContainer 遗留 ListFilter 兼容规则、日志网格布局的重复规则仍需基于所有页面的响应式截图继续收敛。
- 公共表头/表体的 !important 暂保留，待所有消费页面密度规则完成迁移后移除。
- DriverList 等服务端查询保留独立实现，避免为去重掩盖不同数据模型的业务筛选条件。
- 嵌套文本、徽章与按钮的字号继续保留语义差异；本轮不扩大到所有后代节点强制字号。

以上剩余项是有调用方或仍有视觉作用的代码，不应作为冗余直接删除。
