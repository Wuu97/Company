"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { chinaLocalDateTimeToDate } from "@/lib/time";
import { userFeedback } from "@/lib/user-feedback";
import { FormActions, FormMessage } from "@/components/ui/form-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { Disclosure } from "@/components/ui/disclosure";
import styles from "./plan-adjust-form.module.css";

export function PlanAdjustForm({ planId }: { planId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const scheduledAt = chinaLocalDateTimeToDate(String(form.get("scheduledAt") || ""));
    if (!scheduledAt) { setMessage("请选择新的装柜时间。"); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/plans/${planId}/adjust`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scheduledAt: scheduledAt.toISOString(), reason: form.get("reason") }) });
      if (response.ok) { setMessage("新的装柜计划已保存，原计划已保留为历史记录。"); router.refresh(); }
      else setMessage(userFeedback.retry("调整装柜计划"));
    } catch { setMessage(userFeedback.network); } finally { setBusy(false); }
  }
  return <Disclosure className={styles.form} title="调整装柜时间"><form onSubmit={submit}><TextField label="新的装柜时间" name="scheduledAt" type="datetime-local" required disabled={busy} /><TextField label="调整原因" name="reason" placeholder="例如：工厂改约周五装柜" required disabled={busy} /><FormActions><Button type="submit" wide="mobile" disabled={busy}>{busy ? "正在保存…" : "保存新计划"}</Button>{message && <FormMessage as="span">{message}</FormMessage>}</FormActions></form></Disclosure>;
}
