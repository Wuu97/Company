import React from "react";
import { describe, expect, it, vi, afterAll } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ArchiveSection, ArchiveEmptyState } from "./archive";

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("archive sections", () => {
  it("shows a zero result count without hiding its content", () => {
    const html = renderToStaticMarkup(<ArchiveSection title="客户档案" count={0}><p>列表内容</p></ArchiveSection>);
    expect(html).toContain("共 0 条");
    expect(html).toContain("列表内容");
  });
  it("leaves filter sections without an invented count", () => {
    const html = renderToStaticMarkup(<ArchiveSection title="筛选条件"><input name="q" /></ArchiveSection>);
    expect(html).not.toContain("<span>");
  });
  it("keeps the empty state explanation", () => {
    const html = renderToStaticMarkup(<ArchiveEmptyState title="没有匹配结果">清除筛选后重试</ArchiveEmptyState>);
    expect(html).toContain("没有匹配结果");
    expect(html).toContain("清除筛选后重试");
  });
});
