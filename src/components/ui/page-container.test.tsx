import React from "react";
import { afterAll, describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PageContainer } from "./page-container";

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("PageContainer", () => {
  it("orders tabs, actions, filters, content and pagination in one surface", () => {
    const html = renderToStaticMarkup(<PageContainer tabs={[{value:"bills",label:"账单",href:"/bills"}]} activeTab="bills" actions={<button>新增</button>} filter={<form>筛选</form>} pagination={<nav>分页</nav>}><table><tbody><tr><td>数据</td></tr></tbody></table></PageContainer>);
    expect(html).toContain('aria-current="page"');
    const positions = ["账单", "新增", "筛选", "数据", "分页"].map(text => html.indexOf(text));
    expect(positions).toEqual([...positions].sort((a,b) => a-b));
    expect(html).not.toContain('data-navigation-tab="true" variant=');
  });
  it("omits the header when no tabs or actions are supplied", () => {
    const html = renderToStaticMarkup(<PageContainer filter={<form>查询</form>}>日志</PageContainer>);
    expect(html).not.toContain("页面分类");
    expect(html).not.toContain('class="_header');
    expect(html.indexOf("查询")).toBeLessThan(html.indexOf("日志"));
  });
});
