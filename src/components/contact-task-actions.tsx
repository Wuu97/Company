"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { ConfirmationPanel } from "@/components/ui/confirmation-panel";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

type Action = "COMPLETED" | "CANCELLED";

export function ContactTaskActions({ taskId }: { taskId: string }) {
  const [action, setAction] = useState<Action | null>(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function resolve() {
    if (!action || !note.trim() || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/contact-tasks/${taskId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: action, note: note.trim() }),
      });
      if (response.ok) router.refresh();
      else setMessage(userFeedback.retry("保存联系结果"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }

  if (!action) {
    return <div className={businessStyles["contact-actions"]}><Button size="small" wide="mobile" onClick={() => setAction("COMPLETED")}>记录已联系</Button><Button variant="text" wide="mobile" onClick={() => setAction("CANCELLED")}>不再跟进</Button></div>;
  }

  const isComplete = action === "COMPLETED";
  return <ConfirmationPanel className={businessStyles["contact-actions__confirm"]} title={isComplete ? "记录联系结果" : "确认不再跟进"} actions={<><Button size="small" wide="mobile" disabled={!note.trim() || busy} onClick={resolve}>{busy ? "正在保存…" : "确认保存"}</Button><Button variant="neutral" size="small" wide="mobile" disabled={busy} onClick={() => { setAction(null); setNote(""); }}>返回</Button></>}><TextField label={isComplete ? "客户回复或确认情况" : "不再跟进的原因"} autoFocus value={note} onChange={event => setNote(event.target.value)} placeholder={isComplete ? "例如：客户确认周五可装柜" : "例如：客户取消本次出货"} disabled={busy} />{message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}</ConfirmationPanel>;
}
