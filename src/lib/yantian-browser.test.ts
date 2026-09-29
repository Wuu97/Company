import { describe, expect, it } from "vitest";
import { acquireProfileLock, classifyYantianPageText, isYantianLoggedInPage, shouldRetryYantianFailure } from "./yantian-browser";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("Yantian page states", () => {
  it("identifies login, captcha, query and exception pages from visible features", () => {
    expect(classifyYantianPageText("易物流盐田平台需登录后使用 立即登录")).toBe("LOGIN_REQUIRED");
    expect(classifyYantianPageText("请完成验证码安全验证")).toBe("ROBOT_VERIFICATION_REQUIRED");
    expect(classifyYantianPageText("船期公众查询 预计停靠（ETB）")).toBe("QUERY_READY");
    expect(classifyYantianPageText("访问受限 403")).toBe("EXCEPTION");
    expect(classifyYantianPageText("平台热线：4001-856-568")).toBe("UNKNOWN");
  });
  it("does not infer login from cookies or a missing login prompt", () => {
    expect(isYantianLoggedInPage("船期公众查询")).toBe(false);
    expect(isYantianLoggedInPage("欢迎您 张三 安全退出 船期公众查询")).toBe(true);
  });
  it("retries only transient browser or network failures", () => {
    expect(shouldRetryYantianFailure(new Error("Timeout 15000ms exceeded"))).toBe(true);
    expect(shouldRetryYantianFailure(new Error("平台要求验证码"))).toBe(false);
  });
});

describe("Yantian profile isolation", () => {
  it("allows only one worker to claim a profile", async () => {
    const root = await mkdtemp(join(tmpdir(), "yantian-lock-"));
    const release = await acquireProfileLock(root);
    await expect(acquireProfileLock(root)).rejects.toThrow("正被其他 Worker 使用");
    await release();
    await rm(root, { recursive: true, force: true });
  });
});
