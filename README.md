# Logistics TMS V1

## Local setup
1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install`
4. `npm run db:generate && npm run db:migrate`
5. `npm run db:seed`（导入已确认的历史路线、报价模板和司机账单工厂名称）
6. `npm run dev`

历史初始化资料保存在项目的 `scripts/import-confirmed-settlement-templates.ts` 和 `scripts/import-driver-excel-factories.ts`，新环境迁移数据库后运行上述导入命令。系统运行期间新增或修改的资料保存在 PostgreSQL，换电脑时需要连接同一个数据库，或从数据库备份恢复；初始化脚本不能替代业务数据备份。

Original SO files are stored behind a storage interface; local development uses `FILE_STORAGE_ROOT`. Back up PostgreSQL plus this directory together. Never commit `.env` or production files.

The project database is exposed at `127.0.0.1:5433` to avoid colliding with a locally installed PostgreSQL on port 5432.

## ETB query jobs

Run a single terminal query with `tsx scripts/run-etb-query.ts --terminal 盐田`. Set `ETB_QUERY_JSON_PATH` to a JSON file containing rows with `terminal`, `carrier`, `vesselName`, `voyage`, `etbAt` (ISO 8601), and optional `sourceUrl`. The scheduled script is intended for a system scheduler at China time 10:00 and 16:00: `tsx scripts/run-scheduled-etb-query.ts`. Unmatched rows and query failures never overwrite an adopted ETB.

### Production ETB source policy

Do not run scheduled production ETB queries through an employee's Chrome session. A production adapter must use an approved source/API or a company-owned, isolated browser worker with encrypted credentials. If the worker sees an expired session or robot verification, it must throw `EtbManualHandoffRequiredError`; the system records an `AWAITING_MANUAL` query run, its reason, optional screenshot storage key and retry time. Operations then completes the verification in the controlled worker and records the handoff on `/etb-runs`. It must not try to bypass verification, clear the prior ETB, or automatically change the adopted ETB or transport plan.

The controlled worker returns normalized results to `POST /api/etb-runs/:id/results`, authenticated with `Authorization: Bearer $ETB_WORKER_TOKEN`. Each result contains `carrier`, `vesselName`, `voyage`, `etbAt`, and optional `sourceUrl` and `screenshotStorageKey`. The endpoint only records observations for matching sailing records; it never adopts a new ETB automatically.

Use `tsx scripts/open-etb-browser-worker.ts --terminal 盐田` (or `蛇口`) to open the company-owned, headed Worker and create/renew its isolated session. With `--login`, it reads the encrypted source credential saved by an administrator in the website, decrypts it only in the Worker process, fills the verified login form and submits it. The worker uses `.runtime/etb-browser-profiles` by default, which must be mounted on persistent encrypted storage in deployment. It never persists a password; QR code, CAPTCHA and robot verification remain an explicit human handoff. The actual result-extraction adapter remains disabled until a real ship/voyage query has been verified repeatedly for each source.

An administrator can create a login-test task in `/settings`. A Worker consumes it with `tsx scripts/process-etb-credential-test.ts --run <id>`. It writes the result and a screenshot key back to the task; CAPTCHA or robot verification changes the task to `AWAITING_MANUAL` and leaves the headed Worker page for staff to complete. Do not run this process inside a serverless function.

For deployment, schedule `npm run etb:credential-test-worker` every minute on the dedicated Worker host. It claims at most one pending task atomically, so multiple Worker instances do not process the same test. Because a robot verification can require a visible browser, use a persistent VM or desktop-capable Worker host rather than a serverless platform.

Schedule `npm run notifications:risk` every 15 minutes to turn the existing 48-hour deadline, ETB-review, and 24-hour loading-plan rules into deduplicated in-app notifications. Schedule `npm run notifications:etb` on the same cadence to notify staff about overdue ETB manual handoffs. Run `tsx scripts/generate-customer-contact-tasks.ts` every 15 minutes to create customer-contact work after opening time.
