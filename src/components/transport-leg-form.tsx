"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { chinaDateTimeLocalValue, chinaLocalDateTimeToDate } from "@/lib/time";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-controls";
import { Disclosure } from "@/components/ui/disclosure";
import { FeedbackMessage } from "@/components/ui/feedback-message";

export type TransportLeg = {
  id: string;
  sequence: number;
  vehicleNo: string | null;
  settlementCarrierType: "OWN_FLEET" | "PARTNER_MONTHLY" | "TEMP_CASH" | "UNRESOLVED";
  fleetOwnerName: string | null;
  driverName: string | null;
  driverPhone: string | null;
  pickupTerminal: string | null;
  factoryLocation: string | null;
  returnTerminal: string | null;
  plannedPickupAt: Date | null;
  actualPickupAt: Date | null;
  actualFactoryArrivedAt: Date | null;
  actualReturnAt: Date | null;
  trailerSwapNote: string | null;
  overnightNote: string | null;
  exceptionNote: string | null;
  note: string | null;
};
const localInput = (value: Date | null) =>
  value ? chinaDateTimeLocalValue(value) : "";
const dateFields = [
  "plannedPickupAt",
  "actualPickupAt",
  "actualFactoryArrivedAt",
  "actualReturnAt",
];

function fields(form: FormData) {
  return Object.fromEntries(
    [...form.entries()].map(([key, value]) => [
      key,
      String(value) || undefined,
    ]),
  );
}
function CoreFields({
  disabled,
  leg,
}: {
  disabled: boolean;
  leg?: TransportLeg;
}) {
  return (
    <>
      <div className={businessStyles["transport-form__grid"]}>
        <SelectField label="结算承运类型" name="settlementCarrierType" defaultValue={leg?.settlementCarrierType || "UNRESOLVED"} disabled={disabled}>
          <option value="UNRESOLVED">待确认（不可自动结算）</option>
          <option value="OWN_FLEET">公司自有车辆</option>
          <option value="PARTNER_MONTHLY">合作车月结</option>
          <option value="TEMP_CASH">临时现金车</option>
        </SelectField>
        <TextField label="车队/司机老板" name="fleetOwnerName" defaultValue={leg?.fleetOwnerName || ""} placeholder="车队或联系人" disabled={disabled} />
        <TextField label="实际司机" name="driverName" defaultValue={leg?.driverName || ""} placeholder="司机姓名" disabled={disabled} />
        <TextField label="司机电话" name="driverPhone" defaultValue={leg?.driverPhone || ""} placeholder="联系电话" disabled={disabled} />
        <TextField label="车牌" name="vehicleNo" defaultValue={leg?.vehicleNo || ""} placeholder="车牌号码" disabled={disabled} />
      </div>
      <div className={businessStyles["transport-form__grid"]}>
        <TextField label="提柜码头" name="pickupTerminal" defaultValue={leg?.pickupTerminal || ""} placeholder="提柜地点" disabled={disabled} />
        <TextField label="工厂" name="factoryLocation" defaultValue={leg?.factoryLocation || ""} placeholder="装柜工厂" disabled={disabled} />
        <TextField label="还柜码头" name="returnTerminal" defaultValue={leg?.returnTerminal || ""} placeholder="还柜地点" disabled={disabled} />
      </div>
    </>
  );
}

export function TransportLegForm({
  taskId,
  status,
  leg,
}: {
  taskId: string;
  status: string;
  leg: TransportLeg;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const payload = fields(new FormData(event.currentTarget));
    for (const key of dateFields)
      if (payload[key]) {
        const date = chinaLocalDateTimeToDate(String(payload[key]));
        if (!date) {
          setMessage("请填写正确的时间。");
          return;
        }
        payload[key] = date.toISOString();
      }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/transport-tasks/${taskId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setMessage("运输安排已保存。");
        router.refresh();
      } else setMessage(userFeedback.retry("保存运输安排"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Disclosure className={businessStyles["transport-editor"]} title={`编辑第 ${leg.sequence} 段`}>
      <form className={businessStyles["transport-form"]} onSubmit={submit}>
        <input type="hidden" name="legId" value={leg.id} />
        <SelectField label="运输状态" name="status" defaultValue={status} disabled={busy}>
            <option value="PLANNED">待派车</option>
            <option value="DISPATCHED">已派车</option>
            <option value="IN_TRANSIT">运输中</option>
            <option value="COMPLETED">已完成</option>
            <option value="CANCELLED">已取消</option>
        </SelectField>
        <fieldset>
          <legend>车辆与路线</legend>
          <CoreFields disabled={busy} leg={leg} />
        </fieldset>
        <fieldset>
          <legend>执行时间</legend>
          <div className={businessStyles["transport-form__grid"]}>
            <TextField label="计划提柜" name="plannedPickupAt" type="datetime-local" defaultValue={localInput(leg.plannedPickupAt)} disabled={busy} />
            <TextField label="实际提柜" name="actualPickupAt" type="datetime-local" defaultValue={localInput(leg.actualPickupAt)} disabled={busy} />
            <TextField label="到厂" name="actualFactoryArrivedAt" type="datetime-local" defaultValue={localInput(leg.actualFactoryArrivedAt)} disabled={busy} />
            <TextField label="实际还柜" name="actualReturnAt" type="datetime-local" defaultValue={localInput(leg.actualReturnAt)} disabled={busy} />
          </div>
        </fieldset>
        <fieldset>
          <legend>异常与备注</legend>
          <div className={businessStyles["transport-form__grid"]}>
            <TextField label="换车/甩挂说明" name="trailerSwapNote" defaultValue={leg.trailerSwapNote || ""} disabled={busy} />
            <TextField label="压夜说明" name="overnightNote" defaultValue={leg.overnightNote || ""} disabled={busy} />
            <TextField label="运输异常" name="exceptionNote" defaultValue={leg.exceptionNote || ""} disabled={busy} />
            <TextField label="运输段备注" name="note" defaultValue={leg.note || ""} disabled={busy} />
          </div>
        </fieldset>
        <div className={businessStyles["transport-form__footer"]}>
          <Button type="submit" disabled={busy}>{busy ? "保存中…" : "保存运输段"}</Button>
          {message && <FeedbackMessage as="span">{message}</FeedbackMessage>}
        </div>
      </form>
    </Disclosure>
  );
}

export function TransportLegAddForm({ taskId }: { taskId: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const payload = fields(new FormData(event.currentTarget));
    if (payload.plannedPickupAt) {
      const date = chinaLocalDateTimeToDate(String(payload.plannedPickupAt));
      if (!date) {
        setMessage("请填写正确的计划提柜时间。");
        return;
      }
      payload.plannedPickupAt = date.toISOString();
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/transport-tasks/${taskId}/legs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setMessage("运输段已新增，可继续补充车辆和路线。");
        router.refresh();
      } else setMessage(userFeedback.retry("新增运输段"));
    } catch {
      setMessage(userFeedback.network);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Disclosure className={businessStyles["transport-editor"]} title="新增运输段（换车/甩挂）">
      <form className={businessStyles["transport-form"]} onSubmit={submit}>
        <fieldset>
          <legend>车辆与路线</legend>
          <CoreFields disabled={busy} />
        </fieldset>
        <TextField label="计划提柜" name="plannedPickupAt" type="datetime-local" disabled={busy} />
        <TextField label="运输段备注" name="note" placeholder="补充说明" disabled={busy} />
        <div className={businessStyles["transport-form__footer"]}>
          <Button type="submit" disabled={busy}>{busy ? "新增中…" : "新增运输段"}</Button>
          {message && <FeedbackMessage as="span">{message}</FeedbackMessage>}
        </div>
      </form>
    </Disclosure>
  );
}
