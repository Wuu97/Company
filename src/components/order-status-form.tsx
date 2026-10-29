"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form-controls";
import { CompactSelect } from "@/components/ui/compact-select";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { allowedOrderStatusTransitions, type OrderStatus } from "@/lib/business";

const labels: Record<string, string> = { PENDING_REVIEW: "待处理", CONFIRMED: "已确认", IN_PROGRESS: "执行中", COMPLETED: "已完成", CANCELLED: "已取消" };
const hints: Record<string, string> = { PENDING_REVIEW: "客户或柜量尚待处理；可从“已确认”退回至此状态。", CONFIRMED: "客户及柜量已确认，可安排后续计划。", IN_PROGRESS: "订单正在执行中。", COMPLETED: "该订单的业务流程已完成。", CANCELLED: "订单已取消，不再继续安排。" };

export function OrderStatusForm({ orderId, status }: { orderId: string; status: string }) {
  const [value, setValue] = useState(status);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit() {
    if (busy || value === status) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: value }) });
      if (response.ok) { setMessage("订单状态已更新。"); router.refresh(); }
      else setMessage(userFeedback.retry("更新订单状态"));
    } catch { setMessage(userFeedback.network); } finally { setBusy(false); }
  }
  return <section className={businessStyles["order-status-section"]}><h3>订单业务状态</h3><p className={businessStyles["muted"]}>仅在订单实际进入下一阶段时更新状态。</p><div className={businessStyles["order-status-section__controls"]}><SelectField label="当前或新的状态" value={value} disabled={busy} onChange={event => setValue(event.target.value)}>{Object.entries(labels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</SelectField><Button type="button" wide="mobile" onClick={submit} disabled={busy || value === status}>{busy ? "正在更新…" : "保存状态"}</Button></div><p className={businessStyles["order-status-section__hint"]}>{hints[value] || ""}</p>{message && <FeedbackMessage>{message}</FeedbackMessage>}</section>;
}

const tagLabels: Record<string, string> = { PENDING_REVIEW: "待处理", CONFIRMED: "已确认", IN_PROGRESS: "执行中", COMPLETED: "已完成", CANCELLED: "已取消" };
const parseStatusLabels = { PARSED: "已解析", VERIFIED: "已核对" } as const;

/** Compact status control for list rows and the SO header. */
export function OrderStatusTag({ orderId, status }: { orderId: string; status: string }) {
  const [value, setValue] = useState(status);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const availableStatuses = allowedOrderStatusTransitions(value as OrderStatus);
  async function change(next: string) {
    if (busy || next === value) return;
    const previous = value; setValue(next); setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: next }) });
      if (response.ok) router.refresh(); else { setValue(previous); setMessage("状态未更新"); }
    } catch { setValue(previous); setMessage(userFeedback.network); } finally { setBusy(false); }
  }
  return <span className={businessStyles["order-status-tag"]}><CompactSelect aria-label="修改订单业务状态" value={value} disabled={busy || availableStatuses.length === 1} onChange={event => change(event.target.value)}>{availableStatuses.map(key => <option key={key} value={key}>{tagLabels[key]}</option>)}</CompactSelect>{message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}</span>;
}

/** Manual verification only changes the review state; parsing itself remains system-driven. */
export function ParseStatusTag({ orderId, status }: { orderId: string; status: "PARSED" | "VERIFIED" }) {
  const [value, setValue] = useState(status);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function change(next: "PARSED" | "VERIFIED") {
    if (busy || next === value) return;
    const previous = value; setValue(next); setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/orders/${orderId}/parse-status`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: next }) });
      if (response.ok) router.refresh(); else { setValue(previous); setMessage("状态未更新"); }
    } catch { setValue(previous); setMessage(userFeedback.network); } finally { setBusy(false); }
  }
  return <span className={businessStyles["order-status-tag"]}><CompactSelect aria-label="修改解析状态" value={value} disabled={busy} onChange={event => change(event.target.value as "PARSED" | "VERIFIED")}>{Object.entries(parseStatusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</CompactSelect>{message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}</span>;
}
