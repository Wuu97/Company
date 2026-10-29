"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

type ContainerDraft = { id?: string; internalCode?: string; containerType: string; note?: string | null; containerNo?: string | null };

export function ContainerAdjustmentForm({
  orderId,
  initialContainers,
}: {
  orderId: string;
  initialContainers: ContainerDraft[];
}) {
  const [containers, setContainers] = useState(initialContainers);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const router = useRouter();
  function update(index: number, field: "containerType" | "note", value: string) {
    setContainers((current) =>
      current.map((item, position) =>
        position === index ? { ...item, [field]: value } : item,
      ),
    );
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const next = containers.map(({ id, containerType, note }) => ({ id, containerType: containerType.trim(), note: note?.trim() || undefined }));
    if (!next.length || next.some((item) => !item.containerType)) {
      setMessage("请为每个柜位填写柜型。");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/orders/${orderId}/containers/adjust`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ containers: next }),
      });
      if (response.ok) {
        setMessage("柜位与柜型已保存。");
        router.refresh();
      } else setMessage(userFeedback.retry("保存柜量调整"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={businessStyles["container-adjustment-section"]}>
      <h3>柜位与柜型</h3>
      <form className={businessStyles["container-adjustment-form"]} onSubmit={submit}>
        <div className={businessStyles["container-adjustment-form__actions"]}>
          <Button
            variant="secondary"
            disabled={busy}
            type="button"
            onClick={() =>
              setContainers((current) => [
                ...current,
                { containerType: "" },
              ])
            }
          >
            新增
          </Button>
          <Button type="submit" disabled={busy}>{busy ? "正在保存…" : "保存"}</Button>
        </div>
        <div className={businessStyles["container-adjustment-form__rows"]}>
          {containers.map((item, index) => (
            <div className={businessStyles["container-adjustment-form__row"]} key={index}>
              <div className={businessStyles["container-adjustment-form__code"]}>
                <span>内部柜号</span>
                <b>{item.internalCode || "新增柜位（保存后生成）"}</b>
                {item.containerNo && <small>实际柜号：{item.containerNo}</small>}
              </div>
              <TextField className={businessStyles["container-adjustment-form__type"]} label="柜型" value={item.containerType} placeholder="例如：40HQ" disabled={busy} onChange={(event) => update(index, "containerType", event.target.value)} />
              <TextField className={businessStyles["container-adjustment-form__note"]} label="备注" value={item.note ?? ""} placeholder="填写该柜位备注（选填）" disabled={busy} onChange={(event) => update(index, "note", event.target.value)} />
              {containers.length > 1 && (
                <Button
                  variant="danger"
                  size="small"
                  disabled={busy}
                  type="button"
                  onClick={() => setRemovingIndex(index)}
                >
                  删除
                </Button>
              )}
            </div>
          ))}
        </div>
        {message && (
          <FeedbackMessage>{message}</FeedbackMessage>
        )}
      </form>
      {removingIndex !== null && <DeleteConfirmDialog title="确认删除此柜位？" busy={busy} onClose={() => setRemovingIndex(null)} onConfirm={() => { setContainers(current => current.filter((_, index) => index !== removingIndex)); setRemovingIndex(null); }}><p>删除后，该柜位不会随本次保存保留。</p></DeleteConfirmDialog>}
    </section>
  );
}
