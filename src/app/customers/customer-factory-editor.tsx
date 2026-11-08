"use client";
import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/form-controls";
import styles from "./page.module.css";
type Customer = { id: string; name: string };
type Factory = {
  id: string;
  name: string;
  address: string;
  contactName: string | null;
  contactPhone: string | null;
};
export function CustomerFactoryEditor({
  customer,
  factory,
}: {
  customer: Customer;
  factory: Factory | null;
}) {
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const id = useId(),
    router = useRouter();
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    const text = (key: string) => String(form.get(key) || "").trim();
    try {
      const response = await fetch(`/api/customers/${customer.id}/record`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: text("customerName"),
          ...(factory
            ? {
                factory: {
                  id: factory.id,
                  name: text("factoryName"),
                  address: text("address"),
                  contactName: text("contactName") || null,
                  contactPhone: text("contactPhone") || null,
                },
              }
            : {}),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "保存失败");
      setOpen(false);
      router.refresh();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "保存失败，请重试");
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
          setError("");
          setOpen(true);
        }}
      >
        编辑
      </Button>
      {open && (
        <Dialog
          title={factory ? "编辑客户与工厂" : "编辑客户"}
          onClose={() => setOpen(false)}
          closeDisabled={busy}
          message={error || undefined}
          actions={
            <>
              <Button
                variant="secondary"
                size="toolbar"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                取消
              </Button>
              <Button type="submit" form={id} size="toolbar" disabled={busy}>
                {busy ? "保存中…" : "保存"}
              </Button>
            </>
          }
        >
          <form id={id} onSubmit={save}>
            <fieldset
              disabled={busy}
              className={styles.editorGrid}
              style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
            >
              <TextField
                label="客户名称"
                name="customerName"
                required
                maxLength={200}
                defaultValue={customer.name}
              />
              {factory && (
                <>
                  <TextField
                    label="工厂名称"
                    name="factoryName"
                    required
                    maxLength={200}
                    defaultValue={factory.name}
                  />
                  <TextField
                    label="工厂地址"
                    name="address"
                    required
                    maxLength={500}
                    defaultValue={factory.address}
                  />
                  <TextField
                    label="联系人"
                    name="contactName"
                    maxLength={200}
                    defaultValue={factory.contactName || ""}
                  />
                  <TextField
                    label="联系电话"
                    name="contactPhone"
                    maxLength={200}
                    defaultValue={factory.contactPhone || ""}
                  />
                </>
              )}
            </fieldset>
          </form>
        </Dialog>
      )}
    </>
  );
}
