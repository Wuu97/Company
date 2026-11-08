import type { FilterItem } from "@/components/ui/common-filter-bar";
import { UrlFilterBar } from "@/components/ui/url-filter-bar";
import { statusLabel } from "@/lib/status-labels";

const orderStatuses = ["PENDING_REVIEW", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

type Props = {
  q: string;
  status?: string;
  parseStatus?: string;
  customerId?: string;
  customers: { id: string; name: string }[];
  reviewOnly?: boolean;
};

export function OrdersFilter({
  q,
  status = "",
  parseStatus = "",
  customerId = "",
  customers,
  reviewOnly = false,
}: Props) {
  const items: FilterItem[] = [
    {
      type: "input",
      key: "q",
      label: "搜索",
      placeholder: "搜索 SO 编号、船公司、柜号...",
      applyOnBlur: true,
    },
    {
      type: "select",
      key: "status",
      label: "业务状态",
      placeholder: "全部业务状态",
      options: orderStatuses.map(value => ({ value, label: statusLabel(value) })),
    },
    {
      type: "select",
      key: "parseStatus",
      label: "解析状态",
      placeholder: "全部解析状态",
      options: (reviewOnly ? ["PARSED"] : ["PARSED", "VERIFIED"]).map(value => ({
        value,
        label: statusLabel(value),
      })),
    },
    {
      type: "select",
      key: "customerId",
      label: "客户",
      placeholder: "全部客户",
      options: customers.map(({ id, name }) => ({ value: id, label: name })),
    },
  ];

  return (
    <UrlFilterBar
      items={items}
      initialValues={{ q, status, parseStatus, customerId }}
      fixedParams={reviewOnly ? { review: "1" } : undefined}
    />
  );
}
