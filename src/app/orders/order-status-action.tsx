"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { StatusRadioGroup } from "@/components/ui/status-radio-group";
import { allowedOrderStatusTransitions, type OrderStatus } from "@/lib/business";
import { statusLabel } from "@/lib/status-labels";

const parseOptions = ["PARSED", "VERIFIED"].map(value => ({ value, label: statusLabel(value) }));

export function OrderStatusAction({ orderId, soNumber, status, parseStatus }: {
  orderId: string;
  soNumber: string;
  status: OrderStatus;
  parseStatus: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedStatus, setSavedStatus] = useState(status);
  const [savedParseStatus, setSavedParseStatus] = useState(parseStatus);
  const formId = useId();
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const nextStatus = data.get("status") as OrderStatus;
    const nextParseStatus = data.get("parseStatus");
    setBusy(true);
    setError("");
    let savedBusiness = false;
    try {
      const patch = async (route: string, value: string) => {
        const response = await fetch(`/api/orders/${orderId}/${route}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status: value }),
        });
        if (!response.ok) {
          const result = await response.json().catch(() => null) as { error?: string } | null;
          throw new Error(result?.error || "状态保存失败，请重试。");
        }
      };
      if (nextStatus !== savedStatus) {
        await patch("status", nextStatus);
        setSavedStatus(nextStatus);
        savedBusiness = true;
      }
      if (typeof nextParseStatus === "string" && nextParseStatus !== savedParseStatus) {
        await patch("parse-status", nextParseStatus);
        setSavedParseStatus(nextParseStatus);
      }
      setOpen(false);
      router.refresh();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "状态保存失败，请重试。";
      setError(savedBusiness ? `业务状态已保存，解析状态更新失败。${message}` : message);
      if (savedBusiness) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="text" size="small" onClick={() => {
        setSavedStatus(status);
        setSavedParseStatus(parseStatus);
        setError("");
        setOpen(true);
      }}>修改状态</Button>
      {open && (
        <Dialog
          title="修改订单状态"
          subtitle={`SO 编号：${soNumber}`}
          onClose={() => setOpen(false)}
          closeDisabled={busy}
          actions={<>
            <Button variant="secondary" size="toolbar" disabled={busy} onClick={() => setOpen(false)}>取消</Button>
            <Button type="submit" form={formId} size="toolbar" disabled={busy}>{busy ? "正在保存…" : "保存状态"}</Button>
          </>}
        >
          <form id={formId} onSubmit={submit} className="grid grid-cols-[minmax(0,1fr)]">
            <StatusRadioGroup
              key={savedStatus}
              label="业务状态"
              name="status"
              selected={savedStatus}
              options={allowedOrderStatusTransitions(savedStatus).map(value => ({ value, label: statusLabel(value) }))}
              disabled={busy}
            />
            {parseOptions.some(option => option.value === savedParseStatus) && (
              <StatusRadioGroup label="解析状态" name="parseStatus" selected={savedParseStatus} options={parseOptions} disabled={busy} />
            )}
            {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
          </form>
        </Dialog>
      )}
    </>
  );
}
