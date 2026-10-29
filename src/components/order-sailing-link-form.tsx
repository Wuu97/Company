"use client";
import { useState } from "react";
import businessStyles from "@/components/business.module.css";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

type Sailing = { id: string; label: string };

export function OrderSailingLinkForm({
  orderId,
  sailingId,
  sailings,
}: {
  orderId: string;
  sailingId?: string | null;
  sailings: Sailing[];
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch(`/api/orders/${orderId}/sailing`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sailingId: String(form.get("sailingId") || "") || null,
        }),
      });
      if (response.ok) {
        setMessage("船期关联已更新。");
        router.refresh();
      } else setMessage(userFeedback.retry("更新船期关联"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={businessStyles["sailing-link-form"]} onSubmit={submit}>
      <SelectField label="关联船期" name="sailingId" defaultValue={sailingId || ""} disabled={busy}>
          <option value="">不关联船期</option>
          {sailings.map((sailing) => (
            <option key={sailing.id} value={sailing.id}>
              {sailing.label}
            </option>
          ))}
      </SelectField>
      <Button type="submit" wide="mobile" disabled={busy}>{busy ? "正在保存…" : "保存关联"}</Button>
      {!sailings.length && (
        <small className={businessStyles["muted"]}>未找到与当前 SO 船名、航次一致的船期。</small>
      )}
      {message && (
        <FeedbackMessage as="small">{message}</FeedbackMessage>
      )}
    </form>
  );
}
