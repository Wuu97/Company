"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function ClearLogsButton({ total }: { total: number }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function clear() {
    if (
      busy ||
      !window.confirm(
        `确定永久清空全部操作日志吗？当前共有 ${total} 条记录，此操作无法恢复。`,
      )
    )
      return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/logs", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "清空操作日志失败");
      setMessage(`已清空 ${data.count} 条操作日志。`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "清空操作日志失败");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant="danger"
        type="button"
        size="toolbar"
        onClick={clear}
        disabled={busy || !total}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
        </svg>
        {busy ? "清空中…" : "清空日志"}
      </Button>
      {message && (
        <FeedbackMessage
          tone={message.startsWith("已清空") ? "success" : "error"}
          as="small"
        >
          {message}
        </FeedbackMessage>
      )}
    </>
  );
}
