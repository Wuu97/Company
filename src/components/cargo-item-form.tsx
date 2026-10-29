"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import styles from "./cargo-item-form.module.css";
import { FeedbackMessage } from "@/components/ui/feedback-message";

type CargoItem = {
  id: string;
  description: string;
  packagesText?: string | null;
  weightText?: string | null;
  volumeText?: string | null;
};
type Draft = Omit<CargoItem, "id">;

function fields(form: HTMLFormElement): Draft {
  const data = new FormData(form);
  return {
    description: String(data.get("description") || ""),
    packagesText: String(data.get("packagesText") || "") || null,
    weightText: String(data.get("weightText") || "") || null,
    volumeText: String(data.get("volumeText") || "") || null,
  };
}
function CargoFields({
  item,
  disabled = false,
}: {
  item?: Partial<Draft>;
  disabled?: boolean;
}) {
  return (
    <div className={styles.fields}>
      <TextField className={styles.description} label="品名 / 货物描述" name="description" required defaultValue={item?.description || ""} placeholder="例如：家居用品" disabled={disabled} />
      <TextField label="件数（可选）" name="packagesText" defaultValue={item?.packagesText || ""} placeholder="例如：120 CTNS" disabled={disabled} />
      <TextField label="重量（可选）" name="weightText" defaultValue={item?.weightText || ""} placeholder="例如：2,400 KGS" disabled={disabled} />
      <TextField label="体积（可选）" name="volumeText" defaultValue={item?.volumeText || ""} placeholder="例如：18 CBM" disabled={disabled} />
    </div>
  );
}

export function CargoItemCreateForm({ orderId }: { orderId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/orders/${orderId}/cargo`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(fields(form)),
      });
      if (response.ok) {
        form.reset();
        setMessage("货物明细已新增。");
        router.refresh();
      } else setMessage(userFeedback.retry("新增货物明细"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={submit}>
      <CargoFields disabled={busy} />
      <Button type="submit" wide="mobile" disabled={busy}>{busy ? "正在新增…" : "新增货物"}</Button>
      {message && (
        <FeedbackMessage as="small">{message}</FeedbackMessage>
      )}
    </form>
  );
}

export function CargoItemEditForm({
  orderId,
  item,
}: {
  orderId: string;
  item: CargoItem;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();
  async function request(method: "PATCH" | "DELETE", form?: HTMLFormElement) {
    if (busy) return false;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/orders/${orderId}/cargo/${item.id}`, {
        method,
        headers: form ? { "content-type": "application/json" } : undefined,
        body: form ? JSON.stringify(fields(form)) : undefined,
      });
      if (response.ok) {
        router.refresh();
        return true;
      }
      setMessage(
        userFeedback.retry(
          method === "DELETE" ? "删除货物明细" : "保存货物明细",
        ),
      );
      return false;
    } catch {
      setMessage(userFeedback.network);
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await request("PATCH", event.currentTarget))
      setMessage("货物明细已保存。");
  }
  async function remove() {
    if (await request("DELETE")) setMessage("货物明细已删除。");
  }
  return (
    <form className={`${styles.form} ${styles.item}`} onSubmit={save}>
      <h4>货物项目</h4>
      <CargoFields item={item} disabled={busy} />
      <div className={styles.actions}>
        <Button type="submit" size="small" wide="mobile" disabled={busy}>
          {busy ? "正在保存…" : "保存货物"}
        </Button>
        {!confirmDelete ? (
          <Button
            type="button"
            variant="danger"
            size="small"
            wide="mobile"
            disabled={busy}
            onClick={() => setConfirmDelete(true)}
          >
            删除
          </Button>
        ) : (
          <span className={styles.confirm}>
            <b>确认删除这条货物明细？</b>
            <Button
              type="button"
              variant="danger"
              size="small"
              wide="mobile"
              disabled={busy}
              onClick={remove}
            >
              确认删除
            </Button>
            <Button
              type="button"
              variant="neutral"
              size="small"
              wide="mobile"
              disabled={busy}
              onClick={() => setConfirmDelete(false)}
            >
              返回
            </Button>
          </span>
        )}
      </div>
      {message && (
        <FeedbackMessage as="small">{message}</FeedbackMessage>
      )}
    </form>
  );
}
