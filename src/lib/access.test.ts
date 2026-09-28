import { describe, expect, it } from "vitest";
import { canWrite, roleFromHeaders } from "./access";

describe("基础权限",()=>{
  it("只允许操作员和管理员写入",()=>{expect(canWrite("VIEWER")).toBe(false);expect(canWrite("OPERATOR")).toBe(true);expect(canWrite("ADMIN")).toBe(true);});
  it("读取代理传入的角色",()=>{expect(roleFromHeaders(new Headers({"x-tms-role":"viewer"}))).toBe("VIEWER");});
});
