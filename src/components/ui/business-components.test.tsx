import React from "react";
import { afterAll, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DataTable, formatTableMoney, type DataTableColumn } from "./data-table";
import { CommonFilterBar, emptyFilterValues, type FilterItem } from "./common-filter-bar";
vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());
type Row = { id: string; amount: string; status: string; nested: { name: string } };
const columns: DataTableColumn<Row>[] = [
  { key: "name", title: "名称", dataIndex: ["nested", "name"], fixed: "left", width: 180 },
  { key: "amount", title: "金额", dataIndex: "amount", type: "money" },
  { key: "status", title: "状态", dataIndex: "status", type: "status", statusMap: { OK: { label: "已确认", tone: "success" } } },
  { key: "actions", title: "操作", fixed: "right", width: 100, render: (_, row) => <button>{row.id}</button> }
];
describe("shared business components", () => {
  it("formats money and preserves missing values", () => { expect(formatTableMoney("12345.6")).toMatch(/[¥￥]12,345\.60/); expect(formatTableMoney(0)).toMatch(/[¥￥]0\.00/); expect(formatTableMoney(null)).toBe("—"); expect(formatTableMoney("invalid")).toBe("—"); });
  it("renders nested data, semantic labels and frozen offsets", () => {
    const html = renderToStaticMarkup(<DataTable columns={columns} dataSource={[{ id: "bill-1", amount: "1234.5", status: "OK", nested: { name: "测试客户" } }]} rowKey="id"/>);
    expect(html).toContain("测试客户"); expect(html).toContain("已确认"); expect(html).toContain("1,234.50"); expect(html).toContain("left:0"); expect(html).toContain("right:0"); expect(html).toContain("text-align:right");
  });
  it("separates loading from empty and supports empty actions", () => {
    const html = renderToStaticMarkup(<DataTable columns={columns} dataSource={[]} rowKey="id" loading/>);
    expect(html).toContain('aria-busy="true"'); expect(html).not.toContain("暂无数据");
    expect(renderToStaticMarkup(<DataTable columns={columns} dataSource={[]} rowKey="id" empty={{ title: "暂无账单", description: "请使用右上角新增入口" }}/>)).toContain("暂无账单");
  });
  it("preserves legacy children", () => { expect(renderToStaticMarkup(<DataTable><tbody><tr><td>旧表格</td></tr></tbody></DataTable>)).toContain("旧表格"); });
  it("builds clear values and renders accessible filter controls", () => {
    const items: FilterItem[] = [{ key: "q", label: "搜索", type: "input" }, { key: "types", label: "类型", type: "select", multiple: true, options: [{ label: "司机", value: "driver" }] }, { key: "range", label: "日期区间", type: "dateRange" }];
    expect(emptyFilterValues(items)).toEqual({ q: "", types: [], range: ["", ""] });
    const html = renderToStaticMarkup(<CommonFilterBar items={items} onSearch={() => {}} actions={<button type="button">新增</button>}/>);
    expect(html).toContain('aria-label="搜索"'); expect(html).toContain('type="checkbox"'); expect(html).toContain("日期区间开始"); expect(html).toContain("重置"); expect(html).toContain('data-variant="reset"'); expect(html).toContain("M3 10a9"); expect(html).toContain('width="16"'); expect(html).toContain("新增");
  });
});
