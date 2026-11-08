"use client";
import { useId, useState } from "react";
import businessStyles from "@/components/business.module.css";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { StatusBadgeSwitch } from "@/components/ui/status-badge-switch";
import { Button } from "@/components/ui/button";
import { CheckboxField, TextField } from "@/components/ui/form-controls";
import { Dialog } from "@/components/ui/dialog";
import styles from "@/components/ui/archive.module.css";
import { FeedbackMessage } from "@/components/ui/feedback-message";
type Customer = { id: string; code: string; name: string; active: boolean };
type Factory = {
  id: string;
  name: string;
  address: string;
  contactName?: string | null;
  contactPhone?: string | null;
};

export function CustomerRecordForm({ customer }: { customer: Customer }) {
  const [open, setOpen] = useState(false);
  const formId = useId();
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
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          active: form.get("active") === "on",
        }),
      });
      if (response.ok) {
        setOpen(false);
        setMessage("客户档案已保存。");
        router.refresh();
      } else setMessage(userFeedback.retry("保存客户档案"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant="text"
        size="small"
        onClick={() => {
          setMessage("");
          setOpen(true);
        }}
      >
        编辑客户
      </Button>
      {!open && message && (
        <FeedbackMessage tone="success">{message}</FeedbackMessage>
      )}
      {open && (
        <Dialog
          title="编辑客户档案"
          closeDisabled={busy}
          onClose={() => setOpen(false)}
          actions={
            <>
              <Button size="toolbar"
                variant="secondary"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                取消
              </Button>
              <Button size="toolbar" type="submit" form={formId} disabled={busy}>
                {busy ? "保存中…" : "保存修改"}
              </Button>
            </>
          }
        >
          <form id={formId} className={styles.form} onSubmit={submit}>
            <TextField
              label="客户名称"
              name="name"
              defaultValue={customer.name}
              required
              disabled={busy}
            />
            <CheckboxField
              className={businessStyles["record-editor__check"]}
              name="active"
              defaultChecked={customer.active}
              disabled={busy}
            >
              启用此客户
            </CheckboxField>

            {message && (
              <FeedbackMessage tone="error" as="small">
                {message}
              </FeedbackMessage>
            )}
          </form>
        </Dialog>
      )}
    </>
  );
}

export function FactoryRecordForm({
  customerId,
  factory,
}: {
  customerId: string;
  factory: Factory;
}) {
  const [open, setOpen] = useState(false);
  const formId = useId();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) || "") || null;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/customers/${customerId}/factories/${factory.id}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: form.get("name"),
            address: form.get("address"),
            contactName: text("contactName"),
            contactPhone: text("contactPhone"),
          }),
        },
      );
      if (response.ok) {
        setOpen(false);
        setMessage("工厂档案已保存。");
        router.refresh();
      } else setMessage(userFeedback.retry("保存工厂档案"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant="text"
        size="small"
        onClick={() => {
          setMessage("");
          setOpen(true);
        }}
      >
        编辑工厂
      </Button>
      {!open && message && (
        <FeedbackMessage tone="success">{message}</FeedbackMessage>
      )}
      {open && (
        <Dialog
          title="编辑工厂信息"
          closeDisabled={busy}
          onClose={() => setOpen(false)}
          actions={
            <>
              <Button size="toolbar"
                variant="secondary"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                取消
              </Button>
              <Button size="toolbar" type="submit" form={formId} disabled={busy}>
                {busy ? "保存中…" : "保存修改"}
              </Button>
            </>
          }
        >
          <form id={formId} className={styles.form} onSubmit={submit}>
            <TextField
              label="工厂名称"
              name="name"
              defaultValue={factory.name}
              required
              disabled={busy}
            />
            <TextField
              label="装柜地址"
              name="address"
              defaultValue={factory.address}
              required
              disabled={busy}
            />
            <TextField
              label="联系人（可选）"
              name="contactName"
              defaultValue={factory.contactName || ""}
              disabled={busy}
            />
            <TextField
              label="联系电话（可选）"
              name="contactPhone"
              defaultValue={factory.contactPhone || ""}
              disabled={busy}
            />

            {message && (
              <FeedbackMessage tone="error" as="small">
                {message}
              </FeedbackMessage>
            )}
          </form>
        </Dialog>
      )}
    </>
  );
}

export function CustomerStatusSwitch({ customer }: { customer: Customer }) {
  const router = useRouter();
  async function update(active: boolean) {
    if (active === customer.active) return;
    const response = await fetch(`/api/customers/${customer.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ active }),
    });
    if (!response.ok) throw new Error(userFeedback.retry("更新客户状态"));
    router.refresh();
  }
  return <StatusBadgeSwitch
    active={customer.active}
    label={`${customer.name}的状态`}
    confirmation="both"
    description={next => next ? "启用后，该客户可重新参与业务选择。" : "停用后，该客户将不再用于新的业务选择，已有记录保留。"}
    onChange={update}
  />;
}
