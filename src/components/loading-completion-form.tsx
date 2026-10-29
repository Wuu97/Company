"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { chinaDateTimeLocalValue, chinaLocalDateTimeToDate } from "@/lib/time";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

type Container = { id: string; internalCode: string; containerType: string; containerNo: string | null; loadedAt: Date | null };

export function LoadingCompletionForm({ planId, containers }: { planId: string; containers: Container[] }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const loadedAt = chinaLocalDateTimeToDate(String(form.get("loadedAt") || ""));
    if (!loadedAt) return setMessage("请填写实际装柜完成时间。");
    const values = containers.map(container => ({ containerUnitId: container.id, containerNo: String(form.get(`containerNo-${container.id}`) || "").trim() }));
    if (values.some(item => !item.containerNo)) return setMessage("请填写全部实际柜号。");
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/plans/${planId}/loading-completion`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ loadedAt: loadedAt.toISOString(), containers: values }) });
      if (response.ok) { setMessage("装柜完成及实际柜号已登记。"); router.refresh(); }
      else { const body = await response.json().catch(() => ({})); setMessage(body.error || userFeedback.retry("登记装柜结果")); }
    } catch { setMessage(userFeedback.network); } finally { setBusy(false); }
  }
  const complete = containers.every(container => container.containerNo && container.loadedAt);
  return <form className={businessStyles["loading-completion-form"]} onSubmit={submit}><h4>装柜完成与实际柜号</h4><p className={businessStyles["muted"]}>装柜完成后再登记实际柜号；未完成装柜时无需填写。</p><TextField label="实际装柜完成时间" name="loadedAt" type="datetime-local" defaultValue={containers[0]?.loadedAt ? chinaDateTimeLocalValue(containers[0].loadedAt) : ""} required disabled={busy} />{containers.map(container => <TextField key={container.id} label={`${container.internalCode} · ${container.containerType}`} name={`containerNo-${container.id}`} defaultValue={container.containerNo || ""} placeholder="例如 ABCD1234567" required disabled={busy} />)}<Button type="submit" disabled={busy}>{busy ? "正在保存…" : complete ? "更新装柜结果" : "确认装柜完成"}</Button>{message && <FeedbackMessage>{message}</FeedbackMessage>}</form>;
}
