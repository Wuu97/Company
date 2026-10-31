"use client";

import styles from "./orders-filter.module.css";
import businessStyles from "@/components/business.module.css";
import { useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { statusLabel } from "@/lib/status-labels";
import { FilterActionLink, FilterActions, FilterClearLink, FilterField, FilterSelectField, FilterTextField, ListFilter } from "@/components/ui/list";

const orderStatuses = ["PENDING_REVIEW", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
const parseStatuses = ["PARSED", "VERIFIED"] as const;

type Props = { q: string; status?: string; parseStatus?: string; customerId?: string; customers: { id: string; name: string }[]; reviewOnly?: boolean; exportHref: string; className?: string };

export function OrdersFilter({ q, status, parseStatus, customerId, customers, reviewOnly = false, exportHref, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const apply = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams();
    for (const [key, raw] of new FormData(form).entries()) {
      const value = String(raw).trim();
      if (value) params.set(key, value);
    }
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }, [pathname, router]);
  const scheduleSearch = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(apply, 220);
  };
  const clearHref = reviewOnly ? "/orders?review=1" : "/orders";

  return <ListFilter ref={formRef} className={[businessStyles["orders-filter"], className].filter(Boolean).join(" ")} onSubmit={event => event.preventDefault()}>
    <FilterField label="搜索" search><FilterTextField compact name="q" defaultValue={q} placeholder="SO、船公司、船名或航次" onChange={scheduleSearch}/></FilterField>
    <FilterField label="业务状态"><FilterSelectField compact name="status" defaultValue={status || ""} onChange={apply}><option value="">全部业务状态</option>{orderStatuses.map(value => <option key={value} value={value}>{statusLabel(value)}</option>)}</FilterSelectField></FilterField>
    <FilterField label="解析状态"><FilterSelectField compact name="parseStatus" defaultValue={parseStatus || ""} onChange={apply}><option value="">全部解析状态</option>{parseStatuses.map(value => <option key={value} value={value}>{statusLabel(value)}</option>)}</FilterSelectField></FilterField>
    <FilterField label="客户"><FilterSelectField compact name="customerId" defaultValue={customerId || ""} onChange={apply}><option value="">全部客户</option>{customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</FilterSelectField></FilterField>
    {reviewOnly && <FilterTextField type="hidden" name="review" value="1"/>}
    <FilterActions className={businessStyles["orders-filter__actions"]}><FilterClearLink size="toolbar" href={clearHref}/><FilterActionLink className={styles.exportCsv} size="toolbar" href={exportHref}>导出 CSV</FilterActionLink></FilterActions>
  </ListFilter>;
}
