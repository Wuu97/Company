"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckboxField, TextField } from "@/components/ui/form-controls";
import { Dialog } from "@/components/ui/dialog";
import { PageHeader } from "@/components/ui/page-header";
import { ArchiveSection, ArchiveEmptyState } from "@/components/ui/archive";
import styles from "@/components/ui/archive.module.css";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import {
  ListFilter,
  FilterField,
  FilterTextField,
  FilterSelectField,
  FilterActions,
  FilterClearLink,
} from "@/components/ui/list";
import {
  RecordCard,
  RecordCardHeader,
  RecordCardList,
} from "@/components/ui/record-card";
import { StatusBadge } from "@/components/ui/status-badge";
import businessStyles from "@/components/business.module.css";

type Kind = "drivers" | "fleet-owners" | "temporary-vehicles";
type Row = {
  id: string;
  code?: string;
  name?: string;
  phone?: string | null;
  plateNumber?: string | null;
  vehicleType?: string | null;
  active: boolean;
};
const labels: Record<
  Kind,
  { singular: string; code: string; name: string; description: string }
> = {
  drivers: {
    singular: "司机",
    code: "司机编码",
    name: "司机姓名",
    description: "维护自有司机资料，供派车、工资账单和路线工资标准直接选择。",
  },
  "fleet-owners": {
    singular: "合作车老板",
    code: "合作车编码",
    name: "合作车老板/车队名称",
    description: "维护合作车老板或车队资料，供派车和合作车月结账单直接选择。",
  },
  "temporary-vehicles": {
    singular: "临时车",
    code: "车牌号",
    name: "车型",
    description: "维护临时现金车资料；临时车不自动进入合作车月结。",
  },
};

async function call(url: string, method: string, body: unknown) {
  const response = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "保存失败");
  return data;
}

export function ResourceRecords({
  kind,
  rows,
  q = "",
  status = "",
  archiveTotal = rows.length,
}: {
  kind: Kind;
  rows: Row[];
  q?: string;
  status?: string;
  archiveTotal?: number;
}) {
  const label = labels[kind];
  const [editing, setEditing] = useState<Row | null | undefined>(undefined);
  const [error, setError] = useState("");
  const formId = useId();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isVehicle = kind === "temporary-vehicles";
  async function submit(event: React.FormEvent<HTMLFormElement>, id?: string) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const body = isVehicle
      ? {
          plateNumber: data.get("plateNumber"),
          phone: String(data.get("phone") || "") || null,
          active: id ? data.get("active") === "on" : true,
        }
      : {
          code: data.get("code"),
          ...(kind === "drivers" ? { plateNumber: String(data.get("plateNumber") || "") || null } : {}),
          name: data.get("name"),
          phone: String(data.get("phone") || "") || null,
          active: id ? data.get("active") === "on" : true,
        };
    setBusy(true);
    setError("");
    try {
      await call(
        `/api/resources/${kind}${id ? `/${id}` : ""}`,
        id ? "PATCH" : "POST",
        body,
      );
      setEditing(undefined);
      setMessage(`${label.singular}档案已保存。`);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "保存失败，请重试。 ");
    } finally {
      setBusy(false);
    }
  }
  function open(row: Row | null) {
    setEditing(row);
    setError("");
    setMessage("");
  }
  const row = editing;
  return (
    <>
      <PageHeader
        title={
          kind === "drivers"
            ? "司机档案"
            : kind === "fleet-owners"
              ? "合作车资料"
              : "临时车资料"
        }
        description={label.description}
        actions={
          <Button onClick={() => open(null)}>+ 新增{label.singular}</Button>
        }
      />
      {message && <FeedbackMessage tone="success">{message}</FeedbackMessage>}
      <ArchiveSection title="筛选条件">
        <ListFilter className={styles.filter} key={`${q}-${status}`}>
          <FilterField label="查找档案" search>
            <FilterTextField
              name="q"
              defaultValue={q}
              placeholder={isVehicle ? "车牌号或手机号" : kind === "drivers" ? "编码、姓名、车牌或联系电话" : "编码、名称或联系电话"}
            />
          </FilterField>
          <FilterField label="档案状态">
            <FilterSelectField name="status" defaultValue={status}>
              <option value="">全部</option>
              <option value="ACTIVE">启用</option>
              <option value="INACTIVE">停用</option>
            </FilterSelectField>
          </FilterField>
          <FilterActions>
            <FilterClearLink href={`/${kind}`} />
            <Button type="submit">搜索</Button>
          </FilterActions>
        </ListFilter>
      </ArchiveSection>
      <ArchiveSection title={`${label.singular}档案`} count={rows.length}>
        <RecordCardList className={styles.records} density="compact">
          {rows.length ? (
            rows.map((item) => (
              <RecordCard density="compact" key={item.id}>
                <RecordCardHeader density="compact">
                  <div className={styles.recordCopy}>
                    <b>{isVehicle ? item.plateNumber : item.name}</b>
                    <small>
                      {isVehicle
                        ? item.phone || "手机号未填写"
                        : `${item.code}${item.plateNumber ? ` · ${item.plateNumber}` : ""}${item.phone ? ` · ${item.phone}` : ""}`}
                    </small>
                  </div>
                  <StatusBadge tone={item.active ? "success" : "muted"}>
                    {item.active ? "启用" : "停用"}
                  </StatusBadge>
                </RecordCardHeader>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => open(item)}
                >
                  编辑档案
                </Button>
              </RecordCard>
            ))
          ) : (
            <ArchiveEmptyState
              title={
                archiveTotal ? "没有匹配的档案" : `暂无${label.singular}档案`
              }
            >
              {archiveTotal
                ? "请调整关键词或档案状态，或清除筛选后重试。"
                : "点击右上角新增按钮建立档案。"}
            </ArchiveEmptyState>
          )}
        </RecordCardList>
      </ArchiveSection>
      {editing !== undefined && (
        <Dialog
          title={`${row ? "编辑" : "新增"}${label.singular}`}
          closeDisabled={busy}
          onClose={() => setEditing(undefined)}
          actions={
            <>
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => setEditing(undefined)}
              >
                取消
              </Button>
              <Button type="submit" form={formId} disabled={busy}>
                {busy ? "保存中…" : row ? "保存修改" : "确认新增"}
              </Button>
            </>
          }
        >
          <form
            id={formId}
            className={styles.form}
            onSubmit={(event) => submit(event, row?.id)}
          >
            {isVehicle ? (
              <>
                <TextField
                  label="车牌号"
                  name="plateNumber"
                  defaultValue={row?.plateNumber || ""}
                  required
                  disabled={busy}
                />
                <TextField
                  label="手机号（可选）"
                  name="phone"
                  defaultValue={row?.phone || ""}
                  disabled={busy}
                />
              </>
            ) : (
              <>
                {row && (
                  <TextField
                    label={label.code}
                    name="code"
                    defaultValue={row.code}
                    required
                    disabled={busy}
                  />
                )}
                <TextField
                  label={label.name}
                  name="name"
                  defaultValue={row?.name}
                  required
                  disabled={busy}
                />
                {kind === "drivers" && <TextField label="车牌号（可选）" name="plateNumber" defaultValue={row?.plateNumber || ""} disabled={busy} />}
                <TextField
                  label="联系电话（可选）"
                  name="phone"
                  defaultValue={row?.phone || ""}
                  disabled={busy}
                />
              </>
            )}
            {row && (
              <CheckboxField
                name="active"
                defaultChecked={row.active}
                disabled={busy}
              >
                启用此档案
              </CheckboxField>
            )}
            {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
          </form>
        </Dialog>
      )}
    </>
  );
}
