"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { chinaLocalDateTimeToDate } from "@/lib/time";
import { userFeedback } from "@/lib/user-feedback";
import { FormActions, FormMessage } from "@/components/ui/form-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { Disclosure } from "@/components/ui/disclosure";

export function TransportTaskForm({ planId }: { planId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const scheduledAt = chinaLocalDateTimeToDate(String(form.get("scheduledAt") || ""));
    if (!scheduledAt) { setMessage("请选择计划提柜时间。"); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/plans/${planId}/transport`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scheduledAt: scheduledAt.toISOString(), primaryCostText: form.get("primaryCostText") || undefined, note: form.get("note") || undefined }) });
      if (response.ok) { setMessage("派车任务已创建，可在运输任务中继续补充司机和路线。"); router.refresh(); }
      else setMessage(userFeedback.retry("创建派车任务"));
    } catch { setMessage(userFeedback.network); } finally { setBusy(false); }
  }
  return <Disclosure className={businessStyles["plan-action-form"]} title="创建派车任务"><form onSubmit={submit}><TextField label="计划提柜时间" name="scheduledAt" type="datetime-local" required disabled={busy} /><TextField label="预估主运费用（可选）" name="primaryCostText" placeholder="例如：1,800 CNY" disabled={busy} /><TextField label="派车说明（可选）" name="note" placeholder="例如：优先安排早班车" disabled={busy} /><FormActions><Button type="submit" wide="mobile" disabled={busy}>{busy ? "正在创建…" : "创建派车任务"}</Button>{message && <FormMessage as="span">{message}</FormMessage>}</FormActions></form></Disclosure>;
}
