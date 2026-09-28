import {expect,test} from "@playwright/test";
test("第一阶段核心页面可访问",async({page})=>{for(const [path,title] of [["/","业务工作台"],["/customers","客户与工厂"],["/orders","SO 订单"],["/plans","装柜计划"],["/logs","操作日志"]] as const){await page.goto(path);await expect(page.getByRole("heading",{name:title})).toBeVisible()}});
