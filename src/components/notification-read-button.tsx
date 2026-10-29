"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/ui/feedback-message";
export function NotificationReadButton({ id }: { id: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function read() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });
      if (response.ok) router.refresh();
      else setMessage(userFeedback.retry("更新消息状态"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        size="small"
        onClick={read}
        disabled={busy}
      >
        {busy ? "正在更新…" : "标记已读"}
      </Button>
      {message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}
    </>
  );
}
