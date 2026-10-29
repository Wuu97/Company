"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import businessStyles from "@/components/business.module.css";
import { CompactSelect } from "@/components/ui/compact-select";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { userFeedback } from "@/lib/user-feedback";

const labels = { WAITING: "待更新", PENDING: "待确认", CONFIRMED: "已确认" } as const;
type Value = keyof typeof labels;

/** Confirms a pending ETB through the same adoption path used on the sailing detail page. */
export function EtbConfirmationTag({ sailingId, pendingObservationId, status }: { sailingId: string; pendingObservationId?: string; status: Value }) {
  const [value, setValue] = useState<Value>(status);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function change(next: Value) {
    if (busy || next === value) return;
    if (next === "WAITING" || next === "PENDING" || !pendingObservationId) { setMessage("没有可确认的靠港时间。请先查询或录入新的 ETB。"); return; }
    const previous = value;
    setValue(next); setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/sailings/${sailingId}/observations/${pendingObservationId}/adopt`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({}) });
      if (response.ok) router.refresh(); else { setValue(previous); setMessage("状态未更新"); }
    } catch { setValue(previous); setMessage(userFeedback.network); } finally { setBusy(false); }
  }

  const options: Value[] = value === "PENDING" && pendingObservationId ? ["PENDING", "CONFIRMED"] : [value];
  return <span className={businessStyles["order-status-tag"]}><CompactSelect aria-label="修改靠港时间确认状态" value={value} disabled={busy || options.length === 1} onChange={event => change(event.target.value as Value)}>{options.map(key => <option key={key} value={key}>{labels[key]}</option>)}</CompactSelect>{message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}</span>;
}
