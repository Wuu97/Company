# 云端浏览器验证与人工接管

Web 服务设置 ETB_EXECUTION_MODE=cloud，接口只创建数据库任务，不启动本机进程。
独立 Worker 轮询数据库任务，浏览器运行于 Worker 中，用户无需安装软件。
首版按单 Worker 部署，串行执行验证，禁止扩容多个 Worker。
Worker 优先执行账号验证，再领取 ETB 查询任务；两者共用人工接管接口和蛇口持久会话。

配置：
- ETB_APP_BASE_URL：Worker 可访问的 Web 内网地址，用于回传查询结果。
- DATABASE_URL：Web 与 Worker 使用同一数据库；容器中不可使用 127.0.0.1 指向宿主数据库。
- ETB_CREDENTIAL_ENCRYPTION_KEY：与现有 Web 服务一致。
- ETB_WORKER_TOKEN：至少 32 位随机密钥，Web 和 Worker 一致。
- ETB_WORKER_INTERNAL_URL：Web 访问 Worker 的私有地址，例如同机 http://127.0.0.1:3100。
- ETB_EXECUTION_MODE=cloud：Web 与 Worker 都设置。
- ETB_BROWSER_PROFILE_ROOT：持久化磁盘路径。
- FILE_STORAGE_ROOT：Web 与 Worker 挂载同一证据目录。
- 容器使用内置 Chromium，不设置宿主机 Chrome 路径。

启动：docker compose -f deploy/compose.etb-worker.yml up -d --build。
先将 .env 中数据库地址改为容器可访问的私网地址，并使用正式数据库及会话密钥。
Web 在独立容器时，通过私网服务名连接 Worker，移除端口映射并加入共同网络。
只能经由 Web 的管理员鉴权接口访问人工画面，禁止将 Worker 端口公开到互联网。
正式 Web 入口必须启用 HTTPS。

在系统设置点测试连接，出现“待人工验证”后点“去完成验证”。
网页显示同一个无头浏览器的实时画面，支持鼠标点击与拖动；不提供键盘输入。
人工操作有管理员鉴权、同源检查及审计记录，5 分钟后自动结束。
成功后会话持久保存，下次任务恢复；失效后重新人工验证。
当前人工接管仅面向管理员；有权限的管理员可接管该任务。
验证入口在任务完成后立即失效，不将 Worker 密钥或平台 Cookie 下发客户端。

验收：
1. 启动 Worker 和 cloud 模式 Web，确认新任务被领取。
2. 蛇口触发验证码后，在不同电脑的浏览器中打开“去完成验证”。
3. 人工完成验证码，确认状态成功。
4. 重启 Worker，再次验证确认会话复用。
5. 未登录及非管理员访问 /api/admin/etb-manual/:id 应拒绝；已结束任务应返回 409。

本机尚未执行容器部署和跨电脑接管验收，不应视为生产验收完成。
