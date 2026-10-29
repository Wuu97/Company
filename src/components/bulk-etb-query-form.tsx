"use client";

import businessStyles from "@/components/business.module.css";
import { useMemo, useState } from "react";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

type OrderOption = { id: string; label: string };

export function BulkEtbQueryForm({ orders }: { orders: OrderOption[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const allSelected = orders.length > 0 && selected.length === orders.length;

  function toggle(id: string) {
    setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  }

  function toggleAll() {
    setSelected(allSelected ? [] : orders.map(order => order.id));
  }

  async function submit() {
    if (!selected.length || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/orders/etb-query/bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderIds: selected }),
      });
      const body = await response.json().catch(() => ({}));
      if (response.ok) {
        const skipped = body.skipped?.length ? `，其中 ${body.skipped.length} 单已有相同船期的更新安排` : "";
        setMessage(`已安排更新 ${body.queuedOrderCount || 0} 单的预计靠港时间${skipped}。`);
        setSelected([]);
      } else {
        setMessage(userFeedback.retry("安排船期更新"));
      }
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }

  if (!orders.length) return null;

  return (
    <section className={businessStyles["schedule-update"]}>
      <h3>更新预计靠港时间</h3>
      <p className={businessStyles["muted"]}>选择需要更新船期的 SO。相同船期只会更新一次，更新结果仍需人工确认后才会影响业务安排。</p>
      <div className={businessStyles["schedule-update__toolbar"]}>
        <CheckboxField checked={allSelected} disabled={busy} onChange={toggleAll}>全选本页</CheckboxField>
        <span>已选 {selected.length} 单</span>
      </div>
      <div className={businessStyles["schedule-update__options"]}>
        {orders.map(order => <CheckboxField key={order.id} checked={selectedSet.has(order.id)} disabled={busy} onChange={() => toggle(order.id)}>{order.label}</CheckboxField>)}
      </div>
      <div className={businessStyles["schedule-update__actions"]}>
        <Button type="button" wide="mobile" disabled={!selected.length || busy} onClick={submit}>{busy ? "正在安排…" : `更新所选 SO（${selected.length}）`}</Button>
        {selected.length ? <Button type="button" variant="neutral" wide="mobile" disabled={busy} onClick={() => setSelected([])}>取消多选</Button> : null}
        {message && <FeedbackMessage as="span">{message}</FeedbackMessage>}
      </div>
    </section>
  );
}
