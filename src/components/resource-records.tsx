"use client";

import { ArchiveFilterBar } from "@/app/archives/archive-filter-bar";

import { ArchivePageContainer as PageContainer } from "@/app/archives/archive-page-container";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckboxField, TextField } from "@/components/ui/form-controls";
import { Dialog } from "@/components/ui/dialog";
import { PageHeader } from "@/components/ui/page-header";
import styles from "@/components/ui/archive.module.css";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadgeSwitch } from "@/components/ui/status-badge-switch";
import { useListPagination } from "@/components/ui/use-list-pagination";
import { AppPagination } from "@/components/ui/app-pagination";
import { type ArchiveTab } from "@/app/archives/archive-tabs";

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
  archiveTab,
}: {
  kind: Kind;
  archiveTab?: ArchiveTab;
  rows: Row[];
  q?: string;
  status?: string;
  archiveTotal?: number;
}) {
  const label = labels[kind];
  const pagination = useListPagination(rows, JSON.stringify([kind, q, status]));
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
  const columns: DataTableColumn<Row>[] = [
    ...(isVehicle
      ? [{ key: "plateNumber", title: "车牌号", dataIndex: "plateNumber" as const, width: 180 }]
      : [{ key: "name", title: label.name, dataIndex: "name" as const, width: 200 }]),
    ...(kind === "drivers" ? [{ key: "plateNumber", title: "车牌号", dataIndex: "plateNumber" as const, width: 160 }] : []),
    { key: "phone", title: "联系电话", dataIndex: "phone", width: 180 },
    { key: "active", title: "状态", width: 120, render: (_, item) => (
      <StatusBadgeSwitch active={item.active} label={`${label.singular}状态`} onChange={async active => {
        await call(`/api/resources/${kind}/${item.id}`, "PATCH", isVehicle
          ? { plateNumber: item.plateNumber, phone: item.phone, active }
          : { name: item.name, phone: item.phone, ...(kind === "drivers" ? { plateNumber: item.plateNumber } : {}), active });
        router.refresh();
      }} />
    ) },
    { key: "actions", title: "操作", width: 120, render: (_, item) => (
      <Button variant="text" size="small" onClick={() => open(item)}>编辑</Button>
    ) },
  ];
  const row = editing;
  return (
    <>
      <PageHeader
        title={
          archiveTab ? "业务档案" : kind === "drivers"
            ? "司机档案"
            : kind === "fleet-owners"
              ? "合作车资料"
              : "临时车资料"
        }
        description={label.description}

      />
<PageContainer activeTab={archiveTab} tabsLabel="业务档案分类" pagination={<AppPagination {...pagination.props} />} actions={
          <Button create size="toolbar" onClick={() => open(null)}>新增{label.singular}</Button>
        }  filter={<ArchiveFilterBar tab={archiveTab} q={q} status={status} placeholder={isVehicle ? "车牌号或手机号" : kind === "drivers" ? "姓名、车牌或联系电话" : "名称或联系电话"} />}>

      {message && <FeedbackMessage tone="success">{message}</FeedbackMessage>}


        <DataTable
          fitContainer
          mobileHint={null}
          columns={columns}
          dataSource={pagination.items}
          rowKey="id"
          empty={{
            title: archiveTotal ? "没有匹配的档案" : `暂无${label.singular}档案`,
            description: archiveTotal
              ? "请调整关键词或档案状态，或清除筛选后重试。"
              : "点击右上角新增按钮建立档案。",
          }}
        />

      {editing !== undefined && (
        <Dialog
          title={`${row ? "编辑" : "新增"}${label.singular}`}
          closeDisabled={busy}
          onClose={() => setEditing(undefined)}
          actions={
            <>
              <Button size="toolbar"
                variant="secondary"
                disabled={busy}
                onClick={() => setEditing(undefined)}
              >
                取消
              </Button>
              <Button size="toolbar" type="submit" form={formId} disabled={busy}>
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

</PageContainer>
</>
  );
}
