"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function RetryButton({ runId }: { runId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function retry() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/etb-runs/${runId}/retry`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "重新触发失败");
      router.push(`/etb-runs?run=${encodeURIComponent(result.id)}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "重新触发失败");
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="toolbar" disabled={busy} onClick={() => void retry()}>
        {busy ? "正在安排…" : "重新触发更新"}
      </Button>
      {error && (
        <FeedbackMessage tone="error" as="span">
          {error}
        </FeedbackMessage>
      )}
    </>
  );
}
