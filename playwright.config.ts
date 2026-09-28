import { defineConfig } from "@playwright/test";
if (!process.env.E2E_DATABASE_URL) throw new Error("E2E_DATABASE_URL is required for Playwright tests.");
export default defineConfig({testDir:"./e2e",use:{baseURL:"http://127.0.0.1:3000",headless:true},webServer:{command:"npm run dev",env:{...process.env,DATABASE_URL:process.env.E2E_DATABASE_URL},url:"http://127.0.0.1:3000",reuseExistingServer:false,timeout:120000}});
