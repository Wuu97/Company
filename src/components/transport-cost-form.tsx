"use client";
import { useState } from "react";
import businessStyles from "@/components/business.module.css";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { Disclosure } from "@/components/ui/disclosure";
import { FeedbackMessage } from "@/components/ui/feedback-message";
type Cost = {
  id: string;
  category: string;
  amount: { toString(): string };
  currency: string;
  vendorName?: string | null;
  note?: string | null;
};
function payload(form: FormData) {
  const text = (key: string) => String(form.get(key) || "") || null;
  return {
    category: form.get("category"),
    amount: form.get("amount"),
    currency: form.get("currency") || "CNY",
    vendorName: text("vendorName"),
    note: text("note"),
  };
}
function Fields({ cost, disabled }: { cost?: Cost; disabled: boolean }) {
  return (
    <div className={businessStyles["cost-fields"]}>
      <TextField label="费用类型" name="category" required defaultValue={cost?.category || ""} placeholder="例如：主运" disabled={disabled} />
      <TextField label="金额" name="amount" required inputMode="decimal" defaultValue={cost?.amount.toString() || ""} disabled={disabled} />
      <TextField label="币种" name="currency" required maxLength={3} defaultValue={cost?.currency || "CNY"} disabled={disabled} />
      <TextField label="供应商（可选）" name="vendorName" defaultValue={cost?.vendorName || ""} disabled={disabled} />
      <TextField className={businessStyles["cost-fields__note"]} label="费用说明（可选）" name="note" defaultValue={cost?.note || ""} disabled={disabled} />
    </div>
  );
}
export function TransportCostForm({
  taskId,
  costs,
  canManage = false,
}: {
  taskId: string;
  costs: Cost[];
  canManage?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const totals =
    Object.entries(
      costs.reduce<Record<string, number>>(
        (all, cost) => ({
          ...all,
          [cost.currency]:
            (all[cost.currency] || 0) + Number(cost.amount.toString()),
        }),
        {},
      ),
    )
      .map(([currency, amount]) => `${amount.toFixed(2)} ${currency}`)
      .join("；") || "0.00 CNY";
  async function request(
    url: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: object,
  ) {
    if (busy) return false;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        setMessage(
          userFeedback.retry(
            method === "DELETE" ? "删除费用记录" : "保存费用记录",
          ),
        );
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setMessage(userFeedback.network);
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (
      await request(
        `/api/transport-tasks/${taskId}/costs`,
        "POST",
        payload(new FormData(form)),
      )
    ) {
      form.reset();
      setMessage("费用记录已新增。");
    }
  }
  async function update(
    event: React.FormEvent<HTMLFormElement>,
    costId: string,
  ) {
    event.preventDefault();
    if (
      await request(
        `/api/transport-tasks/${taskId}/costs/${costId}`,
        "PATCH",
        payload(new FormData(event.currentTarget)),
      )
    ) {
      setEditingId(null);
      setMessage("费用记录已更新。");
    }
  }
  async function remove(costId: string) {
    if (
      await request(`/api/transport-tasks/${taskId}/costs/${costId}`, "DELETE")
    ) {
      setDeletingId(null);
      setMessage("费用记录已删除。");
    }
  }
  return (
    <Disclosure className={businessStyles["transport-cost-editor"]} title={`费用明细（按币种合计：${totals}）`}>
      {canManage ? (
        <form className={businessStyles["cost-form"]} onSubmit={create}>
          <Fields disabled={busy} />
          <Button type="submit" size="small" disabled={busy}>
            {busy ? "正在保存…" : "新增费用"}
          </Button>
        </form>
      ) : (
        <p className={businessStyles["muted"]}>费用仅管理员可维护。</p>
      )}
      {costs.length ? (
        <div className={businessStyles["cost-records"]}>
          {costs.map((cost) => (
            <div className={businessStyles["cost-record"]} key={cost.id}>
              {canManage && editingId === cost.id ? (
                <form
                  className={businessStyles["cost-form"]}
                  onSubmit={(event) => update(event, cost.id)}
                >
                  <Fields cost={cost} disabled={busy} />
                  <div>
                    <Button type="submit" size="small" disabled={busy}>
                      {busy ? "正在保存…" : "保存费用"}
                    </Button>
                    <Button variant="neutral" size="small"
                      disabled={busy}
                      onClick={() => setEditingId(null)}
                    >
                      返回
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <p>
                    <b>{cost.category}</b> · {cost.amount.toString()}{" "}
                    {cost.currency} · {cost.vendorName || "未填供应商"}
                    {cost.note ? ` · ${cost.note}` : ""}
                  </p>
                  {canManage && (
                    <div className={businessStyles["cost-record__actions"]}>
                      {deletingId === cost.id ? (
                        <span className={businessStyles["cost-delete-confirm"]}>
                          <b>确认删除这条费用？</b>
                          <Button variant="danger" size="small"
                            disabled={busy}
                            onClick={() => remove(cost.id)}
                          >
                            确认删除
                          </Button>
                          <Button variant="neutral" size="small"
                            disabled={busy}
                            onClick={() => setDeletingId(null)}
                          >
                            返回
                          </Button>
                        </span>
                      ) : (
                        <>
                          <Button size="small"
                            disabled={busy}
                            onClick={() => setEditingId(cost.id)}
                          >
                            编辑
                          </Button>
                          <Button variant="danger" size="small"
                            disabled={busy}
                            onClick={() => setDeletingId(cost.id)}
                          >
                            删除
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>暂无费用明细。</p>
      )}
      {message && <FeedbackMessage>{message}</FeedbackMessage>}
    </Disclosure>
  );
}
