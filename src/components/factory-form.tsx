"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function FactoryForm({
  customers,
}: {
  customers: { id: string; name: string }[];
}) {
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
      const response = await fetch(
        `/api/customers/${String(data.get("customerId"))}/factories`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            address: data.get("address"),
          }),
        },
      );
      if (response.ok) {
        form.reset();
        setMessage("工厂已创建。");
        router.refresh();
      } else setMessage(userFeedback.retry("创建工厂"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h3>新增工厂</h3>
      <form
        className={[businessStyles["master-data-form"], businessStyles["master-data-form--factory"]].join(" ")}
        onSubmit={submit}
      >
        <SelectField label="所属客户" name="customerId" required disabled={busy}>
            <option value="">选择客户</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
        </SelectField>
        <TextField label="工厂名称" name="name" placeholder="工厂名称" required disabled={busy} />
        <TextField label="装柜地址" name="address" placeholder="详细地址" required disabled={busy} />
        <Button type="submit" disabled={busy}>{busy ? "保存中…" : "创建工厂"}</Button>
      </form>
      {message && (
        <FeedbackMessage>{message}</FeedbackMessage>
      )}
    </section>
  );
}
