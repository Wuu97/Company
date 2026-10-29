"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { chinaLocalDateTimeToDate } from "@/lib/time";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function OrderActions({ orderId }: { orderId: string }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function request(
    url: string,
    method: "POST" | "DELETE",
    body?: object,
  ) {
    setBusy(true);
    setMsg("");
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        setMsg(userFeedback.retry("完成本次操作"));
        return false;
      }
      return true;
    } catch {
      setMsg(userFeedback.network);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function container(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    if (
      await request(`/api/orders/${orderId}/containers`, "POST", {
        containerType: values.get("containerType"),
      })
    ) {
      form.reset();
      setMsg("计划柜量已登记，可在后续补充实际柜号。");
      router.refresh();
    }
  }

  async function confirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const expected = String(values.get("expectedLoadingAt") || "");
    const expectedLoadingAt = expected
      ? chinaLocalDateTimeToDate(expected)
      : undefined;
    if (expected && !expectedLoadingAt) {
      setMsg("请填写正确的预计装柜时间。");
      return;
    }
    if (
      await request(`/api/orders/${orderId}/confirmations`, "POST", {
        quantity: Number(values.get("quantity")),
        expectedLoadingAt: expectedLoadingAt?.toISOString(),
        note: values.get("note") || undefined,
      })
    ) {
      form.reset();
      setMsg("客户确认已记录，可继续安排装柜计划。");
      router.refresh();
    }
  }

  return (
    <section>
      <h3>业务操作</h3>
      <div className={businessStyles["order-action-grid"]}>
        <form className={businessStyles["order-action-card"]} onSubmit={container}>
          <div>
            <h4>新增内部柜子</h4>
            <p>先登记计划柜量；实际柜号可在后续补充。</p>
          </div>
          <TextField label="柜型" name="containerType" placeholder="例如 40HQ" required disabled={busy} />
          <Button type="submit" disabled={busy}>{busy ? "处理中…" : "新增内部柜子"}</Button>
        </form>

        <form className={businessStyles["order-action-card"]} onSubmit={confirm}>
          <div>
            <h4>记录客户确认</h4>
            <p>用于跟踪本次确认柜量及预计装柜安排。</p>
          </div>
          <TextField label="本次确认柜量" name="quantity" type="number" min="1" required disabled={busy} />
          <TextField label="预计装柜时间" name="expectedLoadingAt" type="datetime-local" disabled={busy} />
          <TextField label="客户沟通备注（可选）" name="note" placeholder="例如客户确认周五可装柜" disabled={busy} />
          <Button type="submit" disabled={busy}>{busy ? "处理中…" : "记录客户确认"}</Button>
        </form>
      </div>

      {msg && (
        <FeedbackMessage>{msg}</FeedbackMessage>
      )}
    </section>
  );
}
