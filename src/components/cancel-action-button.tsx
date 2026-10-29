"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function CancelActionButton({ url, label }: { url: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function cancel() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(url, { method: "POST" });
      if (response.ok) {
        router.refresh();
        return;
      }
      setMessage(userFeedback.retry(label));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }

  if (!confirming) return <Button variant="danger" size="small" onClick={() => setConfirming(true)} disabled={busy}>{label}</Button>;
  return <span className={businessStyles["inline-delete-confirm"]}><b>确认{label}？</b><span>该操作会保留业务历史记录。</span><Button variant="danger" size="small" wide="mobile" onClick={cancel} disabled={busy}>{busy ? "正在处理…" : `确认${label}`}</Button><Button variant="neutral" size="small" wide="mobile" onClick={() => setConfirming(false)} disabled={busy}>返回</Button>{message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}</span>;
}
