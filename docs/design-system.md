# 字体和按钮规范

基础变量定义在 `src/app/tokens.css`，业务语义 `--type-*` 在 `styles.css` 中引用基础变量。

| 字阶 | 字号 | 行高 |
| --- | --- | --- |
| caption | 12px | 18px |
| body-sm | 13px | 20px |
| body | 14px | 22px，控件内20px |
| title-sm | 16px | 24px |
| title-lg | 18px | 26px |
| display-sm / display-lg | 24px / 30px | 按展示场景设置 |

正文400、名称500、小标题600。移动端输入控件使用16px / 24px。

单行输入框、下拉框、密码框和日期输入外壳统一引用 `--control-height`：桌面36px、移动端44px。日期选择器内部网格不使用此高度。紧凑状态选择器使用compact高度（24px / 32px），文字12px / 18px；小状态标签行高同为18px。

## 按钮

| size | 桌面最小高度 | 移动端最小高度 | 字号 | 水平padding |
| --- | --- | --- | --- | --- |
| default | 40px | 44px | 14px | 16px |
| toolbar | 36px | 44px | 14px | 14px |
| small | 32px | 36px | 13px | 10px |
| compact | 24px | 32px | 12px | 8px |

`size` 只负责空间度量，`variant` 只负责颜色、背景、边框、阴影及状态。
`iconOnly` 提供对应尺寸的方形按钮；调用者必须提供可访问名称。
业务容器只管排列、间距和伸缩，不覆盖按钮字号、行高、高度、padding、gap或内部图标尺寸。
使用 `variant="secondary"` 明确表达次级操作，不依赖相邻按钮或父容器推断视觉。

## 弹窗

所有操作放进 `Dialog.actions`，使用 `Button size="toolbar"`。
表单通过 `useId()` 生成唯一 ID；footer 的提交按钮使用 `type="submit" form={formId}`。
表单必须保留原生 `required`、类型及长度校验；忙碌状态同时禁用提交、取消与关闭。
不再使用表单内部的私有操作栏。

## 验证

- `npm test`：包含表单外部提交关联、唯一 ID、按钮语义测试。
- `npm run build`、`npx tsc --noEmit`、`git diff --check`。
- 启动本地生产服务后，运行：
  `DESIGN_QA_URL=http://localhost:3011 node --env-file=.env --import tsx scripts/verify-design-system.ts`
- 浏览器脚本在1440px与390px下验证尺寸、表单校验、模拟错误、焦点返回与Escape；创建的临时登录会话会在结束时清理，业务提交被模拟，不创建成员或修改凭证。

删除样式前检查模块导入、驼峰/中划线类名、模板及条件引用、测试和Storybook。动态模板类名应保留整个可达前缀，不能仅依赖静态字符串匹配。

## 专用日期与时间控件

两套日期输入保留各自的输入、提交与时间编辑流程，内部复用 `CalendarGrid` 私有日历网格。

- 年月标题及切换区：14px / 20px，600；星期和日期：12px / 18px，400；今天和选中日期500。
- 状态优先级：disabled > data-selected > hover/active > 默认。禁用与hover选择器互斥，不使用!important。
- 方向键移动1天或1周，Home/End移动到周首/周末；Enter/Space选择；Escape关闭并返回触发器；Tab在弹层内循环。
- 月份和年份切换使用专用紧凑操作；不套用通用业务Button。
- <768px使用居中模态遮罩与最大视口高度，日期格子至少36px；桌面保持私有28px网格。
- 日期与时间弹层互斥打开，内部时间编辑不会被外部点击逻辑提前关闭。

首页任务导航是专用导航项：标题16px / 24px / 600，说明14px / 22px，计数12px / 18px。选中态使用深蓝文字、浅蓝背景与侧边标识；窄屏允许换行。

专用控件验收：`node --import tsx scripts/verify-special-controls.ts`。使用独立组件样例，不连接数据库；覆盖1440、375、320px、键盘选择、时间联动、状态优先级、焦点及弹层边界。

最终静态基线：`docs/design-system-baseline.md`；使用 `node --import tsx scripts/audit-design-system.ts` 更新。业务与组件CSS不得使用数字字号或!important。
