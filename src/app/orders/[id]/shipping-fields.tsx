"use client";

import { Anchor, Clock3, FileText, Flag, MapPin, PackageOpen, Pencil, Route, Ship } from "lucide-react";
import { useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/form-controls";
import { StatusTag } from "@/components/ui/status-tag";
import { orderCutoffStatus } from "@/lib/so-order-filters";
import { chinaLocalDateTimeToDate, resolveOpeningTime, validOperationalDateInput } from "@/lib/time";

const steps = [
  { key: "openingText", icon: PackageOpen, priority: true },
  { key: "siCutoffText", icon: FileText, deadline: true },
  { key: "portCutoffText", icon: Clock3, deadline: true },
  { key: "cutoffText", icon: Flag, deadline: true },
  { key: "etbText", icon: Anchor },
  { key: "etdText", icon: Ship },
  { key: "etaText", icon: Anchor },
] as const;

const fieldGroups = [
  { title: "口岸截止时限", columns: "sm:grid-cols-2", keys: ["openingText", "siCutoffText", "portCutoffText", "cutoffText"] },
  { title: "大船船期节点", columns: "sm:grid-cols-3", keys: ["etbText", "etdText", "etaText"] },
  { title: "船舶与集装箱地点", columns: "sm:grid-cols-6", keys: ["carrier", "vesselName", "voyage", "emptyPickupLocation", "fullReturnLocation"] },
];

function laterThan(left?: string, right?: string) {
  if (!left || !right || !validOperationalDateInput(left) || !validOperationalDateInput(right)) return false;
  // A date without a clock time can establish day order only.
  return left.length === 10 || right.length === 10 ? left.slice(0, 10) > right.slice(0, 10) : left > right;
}

function deadlineStatus(value: string, now: Date) {
  const status = orderCutoffStatus(value, now);
  if (status === "CLOSED") return { label: "已过截止", tone: "danger" } as const;
  if (status !== "OPEN") return undefined;
  const timestamp = chinaLocalDateTimeToDate(value);
  if (!timestamp) return { label: "截止日未过", tone: "info" } as const;
  const minutes = Math.ceil((timestamp.valueOf() - now.valueOf()) / 60_000);
  if (minutes <= 60) return { label: `剩余 ${minutes} 分钟`, tone: "warning" } as const;
  const hours = Math.ceil(minutes / 60);
  return hours < 48
    ? { label: `剩余 ${hours} 小时`, tone: hours <= 24 ? "warning" : "info" } as const
    : { label: `剩余 ${Math.ceil(hours / 24)} 天`, tone: "info" } as const;
}

export type ShippingField = {
  key: string;
  label: string;
  value: string;
  estimated?: string;
  time?: boolean;
  needsReview?: boolean;
};

export function ShippingFields({ orderId, formId, fields, referenceTime, voyageDetails }: {
  orderId: string;
  formId: string;
  fields: ShippingField[];
  referenceTime: number;
  voyageDetails: ReactNode;
}) {
  const router = useRouter();
  const [refreshing, startTransition] = useTransition();
  const [saving, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [times, setTimes] = useState<Record<string, string>>({});
  const committing = useRef(false);
  const [failed, setFailed] = useState(false);
  const busy = saving || refreshing;
  const [now, setNow] = useState(referenceTime);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const cyDraft = times.portCutoffText?.trim() ?? "";
  // Keep computed values out of the submitted changes so they follow the cutoff.
  const openingEstimate = times.openingText === undefined
    ? resolveOpeningTime(undefined, cyDraft, times.cutoffText)?.value
    : undefined;
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (!field.time) continue;
    const value = times[field.key]?.trim();
    if (value && !validOperationalDateInput(value)) errors[field.key] = "请输入有效的日期时间。";
  }
  if (laterThan(times.portCutoffText?.trim(), times.etdText?.trim())) errors.portCutoffText = "截重柜时间不能晚于预计开航时间。";
  if (laterThan(times.etdText?.trim(), times.etaText?.trim())) errors.etdText = "预计开航时间不能晚于预计到港时间。";
  const hasErrors = Object.keys(errors).length > 0;

  function updateTime(key: string, value: string) {
    setTimes(current => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || committing.current || hasErrors) return;
    const data = new FormData(event.currentTarget);
    const changes = fields.flatMap(field => {
      const value = (field.time ? times[field.key] ?? "" : String(data.get(field.key) ?? "")).trim();
      return value === field.value.trim() ? [] : [{ field, value }];
    });
    if (!changes.length) {
      setEditing(false);
      return;
    }
    const invalid = changes.find(({ field, value }) => !value || (field.time && !validOperationalDateInput(value)));
    if (invalid) {
      setFailed(true);
      setMessage(invalid.field.time ? `${invalid.field.label}请输入 YYYY-MM-DD，可加 HH:mm。` : `请填写${invalid.field.label}。`);
      return;
    }
    committing.current = true;
    setFailed(false);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/orders/${orderId}/fields`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ changes: changes.map(({ field, value }) => ({ field: field.key, value })) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "保存失败，请重试。");
      setEditing(false);
      setMessage("装运信息已保存。");
      startTransition(() => router.refresh());
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "保存失败，请重试。");
    } finally {
      committing.current = false;
      setBusy(false);
    }
  }

  function renderField(field: ShippingField, deadline = false) {
    const value = field.value;
    const estimated = field.estimated;
    const labelId = `${formId}-${field.key}`;
    const status = deadline && !field.needsReview ? deadlineStatus(value, new Date(now)) : undefined;
    return (
      <div className="grid min-w-0 content-start gap-1">
        <span id={labelId} className="flex flex-wrap items-baseline gap-x-1.5 text-xs text-slate-500">
          {field.label}
          {estimated && <span className="text-slate-400">系统推算</span>}
          {field.needsReview && <span className="text-amber-700">需核对</span>}
        </span>
        <span className={`flex min-h-6 min-w-0 items-center text-sm [overflow-wrap:anywhere] ${field.time ? "tabular-nums" : ""} ${value || estimated ? "font-semibold text-slate-900" : "text-slate-400"}`}>
          {value || estimated || "待填写"}
        </span>
        {status && <div className="mt-1"><StatusTag type={status.tone}>{status.label}</StatusTag></div>}
      </div>
    );
  }

  return (
    <div aria-busy={busy}>
      <div data-page-toolbar className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 id="execution-timeline" className="m-0 flex items-center gap-2 text-base font-semibold text-slate-900">
          <Route size={18} aria-hidden="true" className="text-blue-600" />
          口岸与执行时间线
        </h2>
        <Button type="button" variant="secondary" size="toolbar" disabled={busy} onClick={() => {
          setMessage("");
          setFailed(false);
          setTimes(Object.fromEntries(fields.filter(field => field.time && (field.key !== "openingText" || field.value)).map(field => [field.key, field.value])));
          setEditing(true);
        }}><Pencil size={14} aria-hidden="true" />编辑</Button>
      </div>
      <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
        {steps.map((step, index) => {
          const field = fields.find(item => item.key === step.key);
          if (!field) return null;
          const Icon = step.icon;
          const deadline = "deadline" in step;
          const priority = deadline || "priority" in step;
          return (
            <li key={step.key} className={`relative grid min-w-0 content-start gap-2 rounded-lg border border-solid p-2.5 ${priority ? "border-blue-200 bg-blue-50/60" : "border-slate-100 bg-slate-50"}`}>
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${priority ? "bg-blue-100 text-blue-700" : "bg-white text-slate-600"}`}>
                  <Icon size={16} />
                </span>
                <span className="font-mono text-xs font-medium text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                {index < steps.length - 1 && <span className="hidden h-px flex-1 bg-slate-200 xl:block" />}
              </div>
              {renderField(field, deadline)}
            </li>
          );
        })}
      </ol>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_2fr_2fr_2fr]">
        {voyageDetails}
        {fields.filter(field => field.key === "emptyPickupLocation" || field.key === "fullReturnLocation").map(field => (
          <div key={field.key} className="flex min-w-0 items-start gap-2">
            {!field.time && <MapPin size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-slate-400" />}
            {renderField(field)}
          </div>
        ))}
      </div>
      {!editing && !failed && message && <p role="status" className="mb-0 mt-3 text-xs text-slate-600">{message}</p>}
      {editing && (
        <Dialog
          title="编辑口岸与执行时间线"
          width={720}
          closeDisabled={busy}
          onClose={() => setEditing(false)}
          actions={<>
            <Button type="button" size="toolbar" variant="secondary" disabled={busy} onClick={() => setEditing(false)}>取消</Button>
            <Button type="submit" size="toolbar" form={formId} disabled={busy || hasErrors}>{busy ? "正在保存…" : "确认修改"}</Button>
          </>}
        >
          <form id={formId} className="m-0 grid gap-4" onSubmit={save}>
            {fieldGroups.map((group, index) => (
              <section key={group.title} className={index > 0 ? "border-0 border-t border-solid border-slate-200 pt-3" : undefined}>
                <h3 className="m-0 mb-2 text-sm font-semibold text-slate-900">{group.title}</h3>
                <div className={`grid items-start gap-3 ${group.columns}`}>
                  {group.keys.map(key => {
                    const field = fields.find(item => item.key === key);
                    if (!field) return null;
                    if (!field.time) return (
                      <TextField
                        key={key}
                        label={field.label}
                        name={key}
                        defaultValue={field.value}
                        placeholder="请输入"
                        disabled={busy}
                        className={key.endsWith("Location") ? "sm:col-span-3" : "sm:col-span-2"}
                      />
                    );
                    const estimate = key === "openingText" ? openingEstimate : undefined;
                    return (
                      <div key={key} className="grid min-w-0 gap-1.5">
                        <div className="flex min-h-6 items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-slate-600">{field.label}</span>
                          {estimate && <span className="text-xs text-slate-500">系统推算</span>}
                        </div>
                        <DateTimePicker
                          value={times[key] ?? estimate ?? ""}
                          inputLabel={field.label}
                          invalid={Boolean(errors[key])}
                          disabled={busy}
                          allowDateOnly
                          referenceDate={times.etdText}
                          onInputChange={value => updateTime(key, value)}
                          onConfirm={value => updateTime(key, value.replace("T", " "))}
                          onCancel={() => {}}
                        />
                        {errors[key] && <p role="alert" className="m-0 text-xs text-rose-700">{errors[key]}</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
            {failed && message && <p role="alert" className="m-0 text-xs text-rose-700">{message}</p>}
          </form>
        </Dialog>
      )}
    </div>
  );
}
