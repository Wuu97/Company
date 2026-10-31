"use client";
import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { userFeedback } from "@/lib/user-feedback";
import styles from "./page.module.css";
import archiveStyles from "@/components/ui/archive.module.css";
type Customer = { id: string; name: string };
export function CreateActions({
  customers,
  customerId,
}: {
  customers: Customer[];
  customerId?: string;
}) {
  const [mode, setMode] = useState<"customer" | "factory" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const id = useId();
  const router = useRouter();
  function open(value: "customer" | "factory") {
    setError("");
    setSuccess("");
    setMode(value);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        mode === "customer"
          ? "/api/customers"
          : `/api/customers/${data.get("customerId")}/factories`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(
            mode === "customer"
              ? { name: data.get("name") }
              : { name: data.get("name"), address: data.get("address") },
          ),
        },
      );
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || "保存失败，请检查资料后重试。");
        return;
      }
      setSuccess(mode === "customer" ? "客户新增成功。" : "工厂新增成功。");
      setMode(null);
      router.refresh();
    } catch {
      setError(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={styles.createActions}>
      {customerId ? (
        <Button
          variant="secondary"
          size="small"
          onClick={() => open("factory")}
        >
          + 新增工厂
        </Button>
      ) : (
        <>
          <Button
            className={styles.primaryAction}
            onClick={() => open("customer")}
          >
            + 新增客户
          </Button>
          <Button
            className={styles.secondaryAction}
            variant="secondary"
            onClick={() => open("factory")}
          >
            + 新增工厂
          </Button>
        </>
      )}
      {success && <FeedbackMessage tone="success">{success}</FeedbackMessage>}
      {mode && (
        <Dialog
          title={mode === "customer" ? "新增客户" : "新增工厂"}
          onClose={() => setMode(null)}
          closeDisabled={busy}
          actions={
            <>
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => setMode(null)}
              >
                取消
              </Button>
              <Button type="submit" form={id} disabled={busy}>
                {busy ? "保存中…" : "确认新增"}
              </Button>
            </>
          }
        >
          <form id={id} onSubmit={submit} className={archiveStyles.form}>
            {mode === "factory" && (
              <SelectField
                label="所属客户"
                name="customerId"
                defaultValue={customerId || ""}
                required
                disabled={busy}
              >
                <option value="">请选择所属客户</option>
                {customers.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </SelectField>
            )}
            <TextField
              label={mode === "customer" ? "客户名称" : "工厂名称"}
              name="name"
              required
              disabled={busy}
            />
            {mode === "factory" && (
              <TextField
                label="装柜地址"
                name="address"
                required
                disabled={busy}
              />
            )}
            {mode === "factory" && !customers.length && (
              <FeedbackMessage>
                请先新增并启用客户，再添加工厂。
              </FeedbackMessage>
            )}
            {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
          </form>
        </Dialog>
      )}
    </div>
  );
}
