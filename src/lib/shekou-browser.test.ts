import { describe, expect, it } from "vitest";
import { classifyShekouPageText, isShekouLoggedInPage, isShekouPublicScheduleInitialized, isShekouScheduleFrameBlank, requiresShekouManualHandoff, safeShekouUrl, shouldRetryShekouFailure } from "./shekou-browser";

describe("蛇口 ePort 页面状态", () => {
  it("区分公共入口、登录、人工验证、服务选择与异常", () => {
    expect(classifyShekouPageText("招商ePort 一站式港口综合服务平台")).toBe("PUBLIC_HOME");
    expect(classifyShekouPageText("登录/注册 用户名 密码")).toBe("LOGIN_REQUIRED");
    expect(classifyShekouPageText("请完成验证码安全验证")).toBe("ROBOT_VERIFICATION_REQUIRED");
    expect(classifyShekouPageText("请选择 蛇口集装箱码头")).toBe("TARGET_SELECTION_REQUIRED");
    expect(classifyShekouPageText("招商ePort访问出现错误 页面不存在")).toBe("EXCEPTION");
  });
  it("不以 Cookie 推断登录，并脱敏链接", () => {
    expect(isShekouLoggedInPage("招商ePort")).toBe(false);
    expect(isShekouLoggedInPage("欢迎您 张三 退出登录")).toBe(true);
    expect(safeShekouUrl("https://example.test/?token=secret&x=1")).toContain("token=%5Bredacted%5D");
  });
  it("只对瞬态浏览器和网络故障重试", () => {
    expect(shouldRetryShekouFailure(new Error("Timeout 15000ms exceeded"))).toBe(true);
    expect(shouldRetryShekouFailure(new Error("需要人工完成验证码"))).toBe(false);
  });
  it("将空公共船期 iframe 视为加载失败而非零结果", () => {
    expect(isShekouScheduleFrameBlank("")).toBe(true);
    expect(isShekouScheduleFrameBlank("<!-- loading -->")).toBe(true);
    expect(isShekouScheduleFrameBlank("<div class=\"vxe-form\"></div>")).toBe(false);
  });
  it("仅在查询表单和结果区域均存在时允许公共船期操作", () => {
    expect(isShekouPublicScheduleInitialized({ hasVessel: true, hasQuery: true, hasResultRegion: true })).toBe(true);
    expect(isShekouPublicScheduleInitialized({ hasVessel: true, hasQuery: true, hasResultRegion: false })).toBe(false);
  });
});

describe("蛇口平台故障处置",()=>{it("将已知 iframe 初始化错误交给人工处理",()=>{expect(requiresShekouManualHandoff(new Error("iframe主动中断主应用代码在子应用运行"))).toBe(true);expect(requiresShekouManualHandoff(new Error("网络超时"))).toBe(false)})});
