"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function CustomerForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: data.get("code"),
          name: data.get("name"),
        }),
      });
      if (response.ok) {
        form.reset();
        setMessage("客户已创建。");
        router.refresh();
      } else setMessage(userFeedback.retry("创建客户"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h3>新增客户</h3>
      <form className={businessStyles["master-data-form"]} onSubmit={submit}>
        <TextField label="客户编码" name="code" placeholder="如：CUST-001" required disabled={busy} />
        <TextField label="客户名称" name="name" placeholder="公司全称" required disabled={busy} />
        <Button type="submit" disabled={busy}>{busy ? "保存中…" : "创建客户"}</Button>
      </form>
      {message && (
        <FeedbackMessage>{message}</FeedbackMessage>
      )}
    </section>
  );
}
