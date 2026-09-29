import { defineConfig } from "@playwright/test";
if (!process.env.E2E_DATABASE_URL) throw new Error("E2E_DATABASE_URL is required for Playwright tests.");
const port = Number(process.env.E2E_PORT || 3001);
const baseURL = `http://127.0.0.1:${port}`;
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
export default defineConfig({testDir:"./e2e",workers:1,use:{baseURL,headless:true,...(executablePath ? { launchOptions: { executablePath } } : {})},webServer:{command:`npx next dev -p ${port}`,env:{...process.env,DATABASE_URL:process.env.E2E_DATABASE_URL},url:baseURL,reuseExistingServer:false,timeout:120000}});
