"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import styles from "./order-milestone-form.module.css";

type Milestone = {
  type: string;
  status: "PENDING" | "COMPLETED" | "NOT_REQUIRED";
  note?: string | null;
  completedAt?: Date | null;
};
export function OrderMilestoneForm({
  orderId,
  type,
  label,
  milestone,
}: {
  orderId: string;
  type: string;
  label: string;
  milestone?: Milestone;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/orders/${orderId}/milestones/${type}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            status: form.get("status"),
            note: String(form.get("note") || "") || null,
          }),
        },
      );
      if (response.ok) {
        setMessage("节点状态已保存。");
        router.refresh();
      } else setMessage(userFeedback.retry("保存节点状态"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <span>执行节点</span>
          <b>{label}</b>
        </div>
        <small>
          完成时间：
          {milestone?.completedAt
            ? new Date(milestone.completedAt).toLocaleString("zh-CN")
            : "尚未完成"}
        </small>
      </div>
      <form className={styles.form} onSubmit={submit}>
        <SelectField label="处理状态" name="status" defaultValue={milestone?.status || "PENDING"} disabled={busy}>
            <option value="PENDING">待处理</option>
            <option value="COMPLETED">已完成</option>
            <option value="NOT_REQUIRED">本单不适用</option>
        </SelectField>
        <TextField label="说明或单证号（可选）" name="note" defaultValue={milestone?.note || ""} disabled={busy} />
        <Button type="submit" size="small" wide="mobile" disabled={busy}>
          {busy ? "正在保存…" : "保存"}
        </Button>
        {message && (
          <FeedbackMessage as="small">{message}</FeedbackMessage>
        )}
      </form>
    </article>
  );
}
