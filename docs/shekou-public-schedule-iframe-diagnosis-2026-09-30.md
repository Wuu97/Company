# 蛇口公共船期查询 iframe 专项诊断

日期：2026-09-30（Asia/Shanghai）  
范围：仅蛇口公共船期查询；未修改盐田、未提交查询、未写入 ETB。

## 结论

故障分类为 **已导航但公共船期子应用初始化失败**。已登录会话、菜单入口、Playwright 控制链路及关键资源 HTTP 连通性均正常；子应用在 mounted 阶段抛出 `TypeError: this.initDefault is not a function`，结果区域未稳定初始化。

这不是查询无结果，也不能以 iframe 已 attached、`body` 存在或 HTTP 200 视为页面可用。

## 证据

| 场景 | 登录 | 路由/HTTP | 页面初始化结果 |
| --- | --- | --- | --- |
| 平台菜单、有界面 | 已验证 | `scct-query/VesselSchedule` 及 JS/CSS、动态字段接口均为 200 | 抛出 `this.initDefault is not a function`，结果区域缺失 |
| 平台菜单、无头 | 已验证 | 同上 | 同一异常与缺失结果区域 |
| 菜单产生地址的直接访问 | 已验证 | 文档 200 | 无船名、查询按钮、结果区域；不能替代菜单入口 |

同时观察到微前端框架提示 iframe 主动中断，并取消部分资源请求。这是子应用失败后的框架行为；不是浏览器断连或验证码。

## 可复现步骤

1. 使用已登录的蛇口持久化会话启动独立 Chrome。
2. 进入“我的主页”。
3. 点击“公共船期查询”。
4. 监听 frame 的创建、导航、销毁、控制台、pageerror、requestfailed 和 `scct-query` 响应。
5. 观察子应用 mounted 阶段的 `initDefault` 异常，以及缺失的结果区域。

执行命令：

```bash
npx tsx scripts/diagnose-shekou-public-schedule.ts --mode menu
npx tsx scripts/diagnose-shekou-public-schedule.ts --mode menu --headless
npx tsx scripts/diagnose-shekou-public-schedule.ts --mode direct --direct-url 'https://wk-eport.cmp1872.com/scct-query/VesselSchedule?menuId=1648946751089455104'
```

直接地址仅用于与菜单路径对比，不能用于业务查询入口。

## 已实施的最小修复

Worker 仅在同时存在可输入船名、查询按钮和结果区域时才进入查询流程。缺任一项即记录人工接管状态，禁止清空条件、输入船名、点击查询、截图或保存 ETB。

## 后续建议

1. 向招商 ePort/蛇口公共船期页面维护方提交异常栈、菜单 ID `1648946751089455104` 与发生时间，请其修复子应用初始化或账号菜单配置。
2. 平台恢复后，先连续三次从菜单打开并确认三项业务就绪特征。
3. 再以授权 SO 的原始大小写船名、航次执行只读验收；仅在唯一精确匹配、结果刷新且截图合格时创建待审核 ETB 观测。
