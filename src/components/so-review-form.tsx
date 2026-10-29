"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-controls";
import { Disclosure } from "@/components/ui/disclosure";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { FormActions } from "@/components/ui/form-feedback";
import styles from "./so-review-form.module.css";

type ContainerDraft = { containerType: string; quantity: number };

export function SoReviewForm({ orderId, soNumber, carrier, customerId, customers, siCutoffText = "", initialContainers = [] }: { orderId: string; soNumber: string; carrier: string; customerId?: string | null; customers: { id: string; name: string }[]; siCutoffText?: string; initialContainers?: ContainerDraft[] }) {
  const [message, setMessage] = useState("");
  const [containers, setContainers] = useState<ContainerDraft[]>(initialContainers.length ? initialContainers : [{ containerType: "", quantity: 1 }]);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/orders/${orderId}/review`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ customerId: form.get("customerId") || undefined, soNumber: form.get("soNumber"), carrier: form.get("carrier"), siCutoffText: form.get("siCutoffText") || undefined, containers: containers.filter(item => item.containerType.trim()).map(item => ({ ...item, quantity: Math.max(1, Number(item.quantity) || 1) })) }) });
      if (response.ok) { setMessage("核对结果已保存，订单可继续进入后续安排。"); router.refresh(); } else setMessage(userFeedback.retry("保存核对结果"));
    } catch { setMessage(userFeedback.network); } finally { setBusy(false); }
  }

  function updateContainer(index: number, next: Partial<ContainerDraft>) { setContainers(items => items.map((item, position) => position === index ? { ...item, ...next } : item)); }

  return (
    <section>
      <h3>人工核对并确认</h3>
      <p className={businessStyles["muted"]}>先核对基础订舱信息和柜量；补料截止时间可按需展开确认。Shipper 不会自动作为系统客户。</p>
      <form className={styles.form} onSubmit={submit}>
        <fieldset className={styles.basic}>
          <legend>基础订舱信息</legend>
          <SelectField label="所属客户" name="customerId" defaultValue={customerId || ""} disabled={busy}>
            <option value="">暂不匹配客户</option>
            {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
          </SelectField>
          <TextField label="SO 编号" name="soNumber" defaultValue={soNumber} required disabled={busy}/>
          <TextField label="船公司" name="carrier" defaultValue={carrier} required disabled={busy}/>
        </fieldset>
        <fieldset className={styles.containers}>
          <legend>柜型与柜量</legend>
          {containers.map((item, index) => (
            <div className={styles.container} key={index}>
              <TextField label="柜型" value={item.containerType} disabled={busy} onChange={event => updateContainer(index, { containerType: event.target.value })} placeholder="如 40HC"/>
              <TextField label="柜量" type="number" min="1" value={item.quantity} disabled={busy} onChange={event => updateContainer(index, { quantity: Number(event.target.value) })}/>
              {containers.length > 1 && <Button variant="neutral" size="small" type="button" disabled={busy} onClick={() => setContainers(items => items.filter((_, position) => position !== index))}>移除</Button>}
            </div>
          ))}
          <Button size="small" type="button" disabled={busy} onClick={() => setContainers(items => [...items, { containerType: "", quantity: 1 }])}>增加柜型</Button>
        </fieldset>
        <Disclosure className={styles.optional} title="补充截止时间（可选）">
          <TextField label="补料（SI）截止" name="siCutoffText" defaultValue="" disabled={busy} placeholder={siCutoffText ? `当前：${siCutoffText}；填写后改为人工确认` : "填写人工确认的截止时间"}/>
        </Disclosure>
        <FormActions className={styles.footer}>
          <Button type="submit" wide="mobile" disabled={busy}>{busy ? "保存中…" : "确认 SO"}</Button>
        </FormActions>
        {message && <FeedbackMessage>{message}</FeedbackMessage>}
      </form>
    </section>
  );
}
