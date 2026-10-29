"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { chinaLocalDateTimeToDate } from "@/lib/time";
import { userFeedback } from "@/lib/user-feedback";
import { FormActions, FormMessage } from "@/components/ui/form-feedback";
import { ConfirmationPanel } from "@/components/ui/confirmation-panel";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-controls";
import { Disclosure } from "@/components/ui/disclosure";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export function EtbObservationForm({ sailingId }: { sailingId: string }) {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (busy) return; const form = event.currentTarget; const data = new FormData(form); const date = chinaLocalDateTimeToDate(String(data.get("etbAt") || "")); if (!date) { setMessage("请选择有效的预计靠港时间。"); return; } data.set("etbAt", date.toISOString()); setBusy(true); setMessage(""); try { const response = await fetch(`/api/sailings/${sailingId}/observations`, { method: "POST", body: data }); if (response.ok) { setMessage("预计靠港时间已保存，等待人工确认；不会自动改变当前业务安排。"); form.reset(); router.refresh(); } else setMessage(userFeedback.retry("保存预计靠港时间")); } catch { setMessage(userFeedback.network); } finally { setBusy(false); } }
  return <section><h3>录入预计靠港时间</h3><p className={businessStyles["muted"]}>先填写时间与核对依据；链接、截图和备注仅在需要留档时补充。保存后不会自动改变当前业务安排。</p><form className={businessStyles["etb-observation-form"]} onSubmit={submit}><div className={businessStyles["etb-observation-form__core"]}><TextField label="预计靠港时间" name="etbAt" type="datetime-local" required disabled={busy}/><TextField label="时间依据" name="source" placeholder="例如：船公司电话确认" required disabled={busy}/></div><Disclosure className={businessStyles["etb-observation-form__optional"]} title="补充核对材料（可选）"><div><TextField label="来源网址" name="sourceUrl" type="url" disabled={busy}/><TextField label="依据截图" name="evidence" type="file" accept="image/png,image/jpeg,image/webp" hint="PNG、JPG、WebP，最大 5MB" disabled={busy}/><TextField label="备注" name="note" disabled={busy}/></div></Disclosure><FormActions><Button type="submit" wide="mobile" disabled={busy}>{busy ? "正在保存…" : "保存待确认时间"}</Button></FormActions></form>{message && <FormMessage>{message}</FormMessage>}</section>;
}

export function AdoptEtbButton({ url }: { url: string }) {
  const [open, setOpen] = useState(false); const [note, setNote] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const router = useRouter();
  async function adopt() { if (busy) return; setBusy(true); setMessage(""); try { const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ note: note.trim() || undefined }) }); if (response.ok) { setOpen(false); router.refresh(); } else setMessage(userFeedback.retry("确认此预计靠港时间")); } catch { setMessage(userFeedback.network); } finally { setBusy(false); } }
  return <div className={businessStyles["etb-adopt"]}>{!open ? <Button onClick={() => setOpen(true)}>确认采用此时间</Button> : <ConfirmationPanel title="确认采用此预计靠港时间？" actions={<><Button wide="mobile" disabled={busy} onClick={adopt}>{busy ? "正在确认…" : "确认采用"}</Button><Button variant="neutral" wide="mobile" disabled={busy} onClick={() => setOpen(false)}>返回</Button></>}><p>采用后将用于当前业务安排，后续新时间仍需人工确认。</p><TextField label="确认说明（可选）" value={note} onChange={event => setNote(event.target.value)} disabled={busy} placeholder="例如：已与船公司核实"/></ConfirmationPanel>}{message && <FeedbackMessage tone="error" as="small">{message}</FeedbackMessage>}</div>;
}
