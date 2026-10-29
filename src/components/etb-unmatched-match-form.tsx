"use client";
import { useState } from "react";
import businessStyles from "@/components/business.module.css";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";
type Sailing = { id: string; label: string };
export function EtbUnmatchedMatchForm({
  runId,
  resultId,
  sailings,
}: {
  runId: string;
  resultId: string;
  sailings: Sailing[];
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const sailingId = String(new FormData(e.currentTarget).get("sailingId"));
      const response = await fetch(
        `/api/etb-runs/${runId}/unmatched/${resultId}/match`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sailingId }),
        },
      );
      if (response.ok) {
        setMessage("已关联到对应船期，可继续核对预计靠港时间。");
        router.refresh();
      } else setMessage(userFeedback.retry("关联船期"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={businessStyles["sailing-match-form"]} onSubmit={submit}>
      <SelectField label="选择关联船期" name="sailingId" required disabled={busy}>
          <option value="">请选择船期</option>
          {sailings.map((sailing) => (
            <option value={sailing.id} key={sailing.id}>
              {sailing.label}
            </option>
          ))}
      </SelectField>{" "}
      <Button type="submit" wide="mobile" disabled={!sailings.length || busy}>
        {busy ? "正在关联…" : "确认关联"}
      </Button>
      {message && (
        <FeedbackMessage as="small">{message}</FeedbackMessage>
      )}
    </form>
  );
}
