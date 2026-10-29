"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { ConfirmationPanel } from "@/components/ui/confirmation-panel";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function ResolveEtbImpactButton({ taskId }: { taskId: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function resolve() {
    if (!note.trim() || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/transport-tasks/${taskId}/etb-impact`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ note: note.trim() }),
      });
      if (response.ok) {
        setOpen(false);
        router.refresh();
      } else setMessage(userFeedback.retry("保存运输确认结果"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }

  if (!open) return <Button size="small" onClick={() => setOpen(true)}>确认运输安排</Button>;
  return <ConfirmationPanel className={businessStyles["transport-impact-confirm"]} title="确认靠港时间对运输的影响" actions={<><Button size="small" wide="mobile" disabled={!note.trim() || busy} onClick={resolve}>{busy ? "正在保存…" : "保存确认"}</Button><Button variant="neutral" size="small" wide="mobile" disabled={busy} onClick={() => setOpen(false)}>返回</Button></>}><p>请记录维持原计划或已调整的安排。费用记录不会改变。</p><TextField label="处理说明" autoFocus value={note} onChange={event => setNote(event.target.value)} placeholder="例如：维持原派车时间，已通知车队" disabled={busy} />{message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}</ConfirmationPanel>;
}
