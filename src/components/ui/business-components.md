# 通用业务组件

`CommonFilterBar` 与 Schema 模式 `DataTable` 使用独立样式，不依赖页面 CSS 或 `data-list-filter`。可放入 `PageContainer.filter`；不要再套一层 `<form>`。旧的 `<DataTable><thead />…</DataTable>` 用法继续有效。

```tsx
"use client";
import { useState } from "react";
import { CommonFilterBar, type FilterItem, type FilterValues } from "@/components/ui/common-filter-bar";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

type Row = { id: string; billNo: string; amount: string; status: string };
const items: FilterItem[] = [
  { key: "q", type: "input", label: "搜索账单", placeholder: "账单编号 / 结算对象", width: 200 },
  { key: "status", type: "select", label: "对账状态", options: [
    { value: "CONFIRMED", label: "已确认" }, { value: "PENDING", label: "待确认" }
  ] },
  { key: "carriers", type: "select", multiple: true, label: "承运方", options: [
    { value: "driver", label: "司机" }, { value: "partner", label: "合作车" }
  ] },
  { key: "month", type: "month", label: "结算月份" },
  { key: "dates", type: "dateRange", label: "业务日期" }
];
const columns: DataTableColumn<Row>[] = [
  { key: "billNo", title: "账单编号", dataIndex: "billNo", fixed: "left", width: 200 },
  { key: "amount", title: "金额", dataIndex: "amount", type: "money", width: 160 },
  { key: "status", title: "对账状态", dataIndex: "status", type: "status", statusMap: {
    CONFIRMED: { label: "已确认", tone: "success" },
    PENDING: { label: "待确认", tone: "warning" }
  } },
  { key: "actions", title: "操作", fixed: "right", width: 120,
    render: (_, row) => <a href={`/finance/bills/${row.id}`}>查看明细</a> }
];
export function Example({ rows, loading, onCreate }: {
  rows: Row[]; loading: boolean; onCreate: () => void;
}) {
  const [values, setValues] = useState<FilterValues>({});
  const filtered = rows.filter(row => !values.q || row.billNo.includes(String(values.q)));
  return <>
    <CommonFilterBar items={items} values={values} onSearch={setValues}
      onReset={() => { /* 可同步清除分页或 URL 参数 */ }}
      actions={<button type="button" onClick={onCreate}>新增账单</button>}/>
    <DataTable columns={columns} dataSource={filtered} rowKey="id" loading={loading}
      empty={{ description: "调整条件或创建账单", action: <button onClick={onCreate}>立即创建</button> }}/>
  </>;
}
```

- 默认 `searchMode="change"`：每次修改触发 `onChange`、`onSearch`。远程查询可使用 `searchMode="submit"`，由查询按钮或 Enter 提交；受控模式配合 `onChange={setValues}` 保存编辑值。
- 重置清空所有配置字段，依次调用 `onChange(空值)`、`onReset()`、`onSearch(空值)`；不会恢复 `defaultValues`。通过 `showReset={false}` 隐藏。
- 单值是字符串；多选是字符串数组；日期区间是 `[开始日期, 结束日期]`，日期格式为 `YYYY-MM-DD`，月份为 `YYYY-MM`。
- `align` 显式配置优先；文本默认左对齐，日期/月/状态居中，数值/金额/百分比右对齐。百分比输入 `0.15` 显示为 `15%`。
- `dataIndex` 支持对象键或嵌套路径数组；`render(value, record, index)` 优先于内置渲染。金额展示格式化不用于账务运算。
- 冻结列按 left / 普通 / right 分组，组内保留顺序。建议明确填写像素 `width`；未填写时为 160px。
- 组件展示 `dataSource` 中的记录；分页与服务器请求由页面管理。长列表传入当前页，避免一次渲染全部数据。
- `TableStatusTag` 可独立使用，支持 `success | warning | danger | default`。
- 实际完整迁移示例：`src/app/finance/bills/settlement-bills-client.tsx`。
