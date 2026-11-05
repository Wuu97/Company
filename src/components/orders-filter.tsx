"use client";

import businessStyles from "@/components/business.module.css";
import { useRef } from "react";
import { statusLabel } from "@/lib/status-labels";
import { FilterActionLink, FilterActions, FilterClearLink, FilterField, FilterSelectField, FilterTextField, ListFilter } from "@/components/ui/list";

const orderStatuses = ["PENDING_REVIEW", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
const parseStatuses = ["PARSED", "VERIFIED"] as const;

type Props = { q: string; status?: string; parseStatus?: string; customerId?: string; customers: { id: string; name: string }[]; reviewOnly?: boolean; exportHref: string; className?: string };

export function OrdersFilter({ q, status, parseStatus, customerId, customers, reviewOnly = false, exportHref, className }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const clearHref = reviewOnly ? "/orders?review=1" : "/orders";

  return <ListFilter ref={formRef} className={[businessStyles["orders-filter"], className].filter(Boolean).join(" ")}>
    <FilterField label="搜索" search><FilterTextField compact name="q" defaultValue={q} placeholder="SO、船公司、船名或航次"/></FilterField>
    <FilterField label="业务状态"><FilterSelectField compact name="status" defaultValue={status || ""}><option value="">全部业务状态</option>{orderStatuses.map(value => <option key={value} value={value}>{statusLabel(value)}</option>)}</FilterSelectField></FilterField>
    <FilterField label="解析状态"><FilterSelectField compact name="parseStatus" defaultValue={parseStatus || ""}><option value="">全部解析状态</option>{parseStatuses.map(value => <option key={value} value={value}>{statusLabel(value)}</option>)}</FilterSelectField></FilterField>
    <FilterField label="客户"><FilterSelectField compact name="customerId" defaultValue={customerId || ""}><option value="">全部客户</option>{customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</FilterSelectField></FilterField>
    {reviewOnly && <FilterTextField type="hidden" name="review" value="1"/>}
    <FilterActions className={businessStyles["orders-filter__actions"]}><FilterClearLink size="toolbar" href={clearHref}/><FilterActionLink size="toolbar" href={exportHref}>导出 CSV</FilterActionLink></FilterActions>
  </ListFilter>;
}
