import type { FilterItem } from "@/components/ui/common-filter-bar";
import { UrlFilterBar } from "@/components/ui/url-filter-bar";
import { cutoffOptions } from "@/lib/so-order-filters";
import { statusLabel } from "@/lib/status-labels";

const orderStatuses = ["PENDING_REVIEW", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

type Props = {
  q: string;
  status?: string;
  cutoff?: string;
  customerId?: string;
  customers: { id: string; name: string }[];
  reviewOnly?: boolean;
};

export function OrdersFilter({
  q,
  status = "",
  cutoff = "",
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
      key: "cutoff",
      label: "截柜状态",
      placeholder: "全部截柜状态",
      options: cutoffOptions,
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
      className="[--filter-control-height:36px] [--filter-input-width:260px] [&_button[data-variant=reset]]:ml-auto [&_button[data-variant=reset]]:border-0 [&_button[data-variant=reset]]:bg-transparent [&_button[data-variant=reset]]:text-slate-500 [&_button[data-variant=reset]]:hover:bg-slate-50 [&_button[data-variant=reset]_svg]:hidden"
      initialValues={{ q, status, cutoff, customerId }}
      fixedParams={reviewOnly ? { review: "1" } : undefined}
    />
  );
}
