"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { chinaLocalDateTimeToDate } from "@/lib/time";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { CheckboxField, SelectField, TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { FormActions } from "@/components/ui/form-feedback";
import { StatusBadge } from "@/components/ui/status-badge";
import styles from "./plan-form.module.css";

type Option = { id: string; label: string };
type Confirmation = Option & { orderId: string; quantity: number };
type Container = Option & { orderId: string };

export function PlanForm({ orders, factories, containers, confirmations }: { orders: Option[]; factories: Option[]; containers: Container[]; confirmations: Confirmation[] }) {
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const confirmation = confirmations.find(item => item.id === confirmationId);
  const capacity = confirmation?.quantity || 0;
  const availableContainers = containers.filter(item => item.orderId === orderId);

  function chooseOrder(nextOrderId: string) { setOrderId(nextOrderId); setConfirmationId(""); setSelectedIds([]); setMessage(""); }
  function chooseConfirmation(nextConfirmationId: string) { setConfirmationId(nextConfirmationId); setSelectedIds([]); setMessage(""); }
  function toggleContainer(id: string) { setSelectedIds(current => current.includes(id) ? current.filter(value => value !== id) : current.length < capacity ? [...current, id] : current); }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = new FormData(event.currentTarget);
    const scheduledAt = chinaLocalDateTimeToDate(String(form.get("scheduledAt") || ""));
    if (!selectedIds.length) { setMessage("请至少选择一个内部柜子。"); return; }
    if (selectedIds.length > capacity) { setMessage("所选柜子超过本次客户确认的柜量，请减少选择后重试。"); return; }
    if (!scheduledAt) { setMessage("请选择计划装柜时间。"); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/plans", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ soOrderId: orderId, factoryId: form.get("factoryId"), scheduledAt: scheduledAt.toISOString(), containerUnitIds: selectedIds, customerConfirmationId: confirmationId }) });
      if (response.ok) { setMessage("装柜计划已创建。"); setSelectedIds([]); router.refresh(); } else setMessage(userFeedback.retry("创建装柜计划"));
    } catch { setMessage(userFeedback.network); } finally { setBusy(false); }
  }

  return (
    <section>
      <h3>新建装柜计划</h3>
      <p className={businessStyles["muted"]}>依次选择 SO、客户确认批次、工厂和柜子。柜子数量不能超过该确认批次。</p>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.fields}>
          <SelectField label="SO" value={orderId} onChange={event => chooseOrder(event.target.value)} required disabled={busy}>
            <option value="">选择 SO</option>
            {orders.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}
          </SelectField>
          <SelectField label="客户确认批次" value={confirmationId} onChange={event => chooseConfirmation(event.target.value)} required disabled={!orderId || busy}>
            <option value="">选择确认批次</option>
            {confirmations.filter(item => item.orderId === orderId).map(item => <option value={item.id} key={item.id}>{item.label}</option>)}
          </SelectField>
          <SelectField label="装柜工厂" name="factoryId" required disabled={busy}>
            <option value="">选择工厂</option>
            {factories.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}
          </SelectField>
          <TextField label="计划装柜时间" name="scheduledAt" type="datetime-local" required disabled={busy}/>
        </div>
        <div className={styles.picker}>
          <div>
            <b>选择内部柜子</b>
            {confirmationId ? <StatusBadge tone={selectedIds.length === capacity ? "warning" : undefined}>已选 {selectedIds.length} / 可安排 {capacity} 柜</StatusBadge> : <span className={businessStyles["muted"]}>请先选择确认批次</span>}
          </div>
          {availableContainers.length ? <div className={styles.grid}>{availableContainers.map(item => {
            const checked = selectedIds.includes(item.id);
            const disabled = busy || !confirmationId || (!checked && selectedIds.length >= capacity);
            return <CheckboxField key={item.id} className={checked ? styles.selected : undefined} checked={checked} onChange={() => toggleContainer(item.id)} disabled={disabled}>{item.label}</CheckboxField>;
          })}</div> : <p className={businessStyles["muted"]}>请先选择有内部柜子的 SO。</p>}
        </div>
        <FormActions>
          <Button type="submit" wide="mobile" disabled={busy || !confirmationId || !selectedIds.length}>{busy ? "创建中…" : `创建计划${selectedIds.length ? `（${selectedIds.length} 柜）` : ""}`}</Button>
        </FormActions>
        {message && <FeedbackMessage>{message}</FeedbackMessage>}
      </form>
    </section>
  );
}
