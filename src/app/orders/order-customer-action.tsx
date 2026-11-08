"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { SelectField } from "@/components/ui/form-controls";

export function OrderCustomerAction({ orderId, customerId, customerName, customers }: {
  orderId: string;
  customerId: string | null;
  customerName?: string;
  customers: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const formId = useId();
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const value = String(new FormData(event.currentTarget).get("customerId") || "");
    if (!value) {
      setError("请选择合作客户。");
      return;
    }
    if (value === customerId) {
      setOpen(false);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/orders/${orderId}/fields`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ field: "customerId", value }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error || "合作客户保存失败，请重试。");
      }
      setOpen(false);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "合作客户保存失败，请重试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="small" variant="text" className="px-0 text-left" title={customerName ? "更换合作客户" : undefined} onClick={() => {
        setError("");
        setOpen(true);
      }}>{customerName || "选择客户"}</Button>
      {open && (
        <Dialog
          title="选择合作客户"
          onClose={() => setOpen(false)}
          closeDisabled={busy}
          actions={<>
            <Button size="toolbar" variant="secondary" disabled={busy} onClick={() => setOpen(false)}>取消</Button>
            <Button size="toolbar" form={formId} type="submit" disabled={busy || !customers.length}>{busy ? "正在保存…" : "保存客户"}</Button>
          </>}
        >
          <form id={formId} onSubmit={submit}>
            <SelectField label="合作客户" aria-label="合作客户" name="customerId" defaultValue={customerId ?? ""} required disabled={busy}>
              <option value="">请选择客户</option>
              {customerId && !customers.some(customer => customer.id === customerId) && (
                <option value={customerId}>{customerName || "当前客户"}</option>
              )}
              {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </SelectField>
            {!customers.length && <FeedbackMessage>暂无可选的在用客户。</FeedbackMessage>}
            {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
          </form>
        </Dialog>
      )}
    </>
  );
}
