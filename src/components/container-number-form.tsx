"use client";
import { useState } from "react";
import businessStyles from "@/components/business.module.css";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function ContainerNumberForm({
  orderId,
  containerId,
  containerNo,
}: {
  orderId: string;
  containerId: string;
  containerNo?: string | null;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(
        `/api/orders/${orderId}/containers/${containerId}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            containerNo: String(form.get("containerNo") || "") || null,
          }),
        },
      );
      if (response.ok) {
        setMessage("实际柜号已保存。");
        router.refresh();
      } else setMessage(userFeedback.retry("保存实际柜号"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={businessStyles["container-number-form"]} onSubmit={submit}>
      <TextField label="实际柜号" name="containerNo" defaultValue={containerNo || ""} placeholder="例如：ABCD1234567" maxLength={30} disabled={busy} />
      <Button type="submit" size="small" wide="mobile" disabled={busy}>
        {busy ? "正在保存…" : "保存柜号"}
      </Button>
      {message && (
        <FeedbackMessage as="small">{message}</FeedbackMessage>
      )}
    </form>
  );
}
