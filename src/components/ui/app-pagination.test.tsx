import React from "react";
import { afterAll, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AppPagination, paginationHref } from "./app-pagination";
vi.mock("next/navigation",()=>({useRouter:()=>({replace:vi.fn()})}));
vi.stubGlobal("React",React);
afterAll(()=>vi.unstubAllGlobals());
describe("AppPagination",()=>{
  it("preserves filters while changing pages and sizes",()=>{
    expect(paginationHref("/logs?q=SO123&showSystem=1&page=4",2,50)).toBe("/logs?q=SO123&showSystem=1&page=2&pageSize=50");
    expect(paginationHref("/logs?month=2026-11&page=4",1,20)).toBe("/logs?month=2026-11&page=1&pageSize=20");
  });
  it("keeps empty data at page one and disables both directions",()=>{
    const html=renderToStaticMarkup(<AppPagination total={0} currentPage={5}/>);
    expect(html).toBe("");
    expect(renderToStaticMarkup(<AppPagination total={10} currentPage={1} pageSize={10}/>)).toBe("");
  });
  it("calculates pages and keeps a custom size selectable",()=>{
    const html=renderToStaticMarkup(<AppPagination total={157} currentPage={7} pageSize={25} pageSizeOptions={[10,50]}/>);
    expect(html).toContain("第 7 / 7 页");
    expect(html).toContain('value="25" selected=""');
    expect(html.match(/disabled=""/g)).toHaveLength(1);
    expect(html).toContain('aria-label="跳转页码"');
  });
});
