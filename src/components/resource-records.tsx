"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckboxField, TextField } from "@/components/ui/form-controls";
import { Disclosure } from "@/components/ui/disclosure";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { EmptyState } from "@/components/ui/empty-state";
import { RecordCard, RecordCardHeader, RecordCardList } from "@/components/ui/record-card";
import { StatusBadge } from "@/components/ui/status-badge";
import businessStyles from "@/components/business.module.css";

type Kind = "drivers" | "fleet-owners" | "temporary-vehicles";
type Row = { id: string; code?: string; name?: string; phone?: string | null; plateNumber?: string; vehicleType?: string | null; active: boolean };
const labels: Record<Kind, { singular: string; code: string; name: string; description: string }> = {
  drivers: { singular: "司机", code: "司机编码", name: "司机姓名", description: "维护自有司机资料，供派车、工资账单和路线工资标准直接选择。" },
  "fleet-owners": { singular: "合作车老板", code: "合作车编码", name: "合作车老板/车队名称", description: "维护合作车老板或车队资料，供派车和合作车月结账单直接选择。" },
  "temporary-vehicles": { singular: "临时车", code: "车牌号", name: "车型", description: "维护临时现金车资料；临时车不自动进入合作车月结。" },
};

async function call(url: string, method: string, body: unknown) { const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "保存失败"); return data; }

export function ResourceRecords({ kind, rows }: { kind: Kind; rows: Row[] }) {
  const label = labels[kind];
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isVehicle = kind === "temporary-vehicles";
  async function submit(event: React.FormEvent<HTMLFormElement>, id?: string) {
    event.preventDefault(); if (busy) return;
    const data = new FormData(event.currentTarget);
    const body = isVehicle ? { plateNumber: data.get("plateNumber"), vehicleType: String(data.get("vehicleType") || "") || null, active: data.get("active") === "on" } : { code: data.get("code"), name: data.get("name"), phone: String(data.get("phone") || "") || null, active: data.get("active") === "on" };
    setBusy(true); setMessage("");
    try { await call(`/api/resources/${kind}${id ? `/${id}` : ""}`, id ? "PATCH" : "POST", body); event.currentTarget.reset(); setMessage(`${label.singular}档案已保存。`); router.refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "保存失败，请重试。 "); }
    finally { setBusy(false); }
  }
  return <>
    <section><h3>新增{label.singular}</h3><form className={businessStyles["master-data-form"]} onSubmit={event => submit(event)}>
      {isVehicle ? <><TextField label="车牌号" name="plateNumber" placeholder="如：粤B12345" required disabled={busy}/><TextField label="车型（可选）" name="vehicleType" placeholder="如：集装箱拖车" disabled={busy}/></> : <><TextField label={label.code} name="code" placeholder={kind === "drivers" ? "如：DRV-001" : "如：FLEET-001"} required disabled={busy}/><TextField label={label.name} name="name" required disabled={busy}/><TextField label="联系电话（可选）" name="phone" disabled={busy}/></>}
      <Button type="submit" disabled={busy}>{busy ? "保存中…" : `创建${label.singular}`}</Button>
    </form>{message && <FeedbackMessage>{message}</FeedbackMessage>}</section>
    <RecordCardList density="compact">{rows.length ? rows.map(row => <RecordCard density="compact" key={row.id}><RecordCardHeader density="compact"><div><span className={businessStyles["muted"]}>{isVehicle ? "临时车" : label.singular}</span><b>{isVehicle ? row.plateNumber : row.name}</b><small>{isVehicle ? row.vehicleType || "车型未填写" : `${row.code}${row.phone ? ` · ${row.phone}` : ""}`}</small></div><StatusBadge tone={row.active ? "success" : "muted"}>{row.active ? "启用" : "停用"}</StatusBadge></RecordCardHeader><Disclosure className={businessStyles["record-editor"]} title="编辑档案"><form onSubmit={event => submit(event, row.id)}>{isVehicle ? <><TextField label="车牌号" name="plateNumber" defaultValue={row.plateNumber} required disabled={busy}/><TextField label="车型（可选）" name="vehicleType" defaultValue={row.vehicleType || ""} disabled={busy}/></> : <><TextField label={label.code} name="code" defaultValue={row.code} required disabled={busy}/><TextField label={label.name} name="name" defaultValue={row.name} required disabled={busy}/><TextField label="联系电话（可选）" name="phone" defaultValue={row.phone || ""} disabled={busy}/></>}<CheckboxField className={businessStyles["record-editor__check"]} name="active" defaultChecked={row.active} disabled={busy}>启用此档案</CheckboxField><Button type="submit" size="small" disabled={busy}>保存</Button></form></Disclosure></RecordCard>) : <EmptyState title={`暂无${label.singular}档案`}>可使用上方表单新增。</EmptyState>}</RecordCardList>
  </>;
}
