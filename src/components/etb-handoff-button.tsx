"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { ConfirmationPanel } from "@/components/ui/confirmation-panel";
import { Button } from "@/components/ui/button";
import { CheckboxField, TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function EtbHandoffButton({ runId }: { runId: string }) {
  const [resume, setResume] = useState(false);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function save() {
    if (!note.trim() || busy) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/etb-runs/${runId}/handoff`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ note: note.trim(), resume }) });
      if (response.ok) { setOpen(false); router.refresh(); }
      else setMessage(userFeedback.retry("保存处理结果"));
    } catch { setMessage(userFeedback.network); } finally { setBusy(false); }
  }
  if (!open) return <Button size="small" onClick={() => setOpen(true)}>记录人工处理</Button>;
  return <ConfirmationPanel className={businessStyles["handoff-confirm"]} title="记录船期更新的人工处理" actions={<><Button size="small" wide="mobile" disabled={!note.trim() || busy} onClick={save}>{busy ? "正在保存…" : "保存处理结果"}</Button><Button variant="neutral" size="small" wide="mobile" disabled={busy} onClick={() => setOpen(false)}>返回</Button></>}><TextField label="处理说明" autoFocus value={note} onChange={event => setNote(event.target.value)} placeholder="例如：已完成平台验证，可继续更新" disabled={busy} /><CheckboxField className={businessStyles["handoff-confirm__check"]} checked={resume} onChange={event => setResume(event.target.checked)} disabled={busy}>保存后再次尝试更新</CheckboxField>{message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}</ConfirmationPanel>;
}
