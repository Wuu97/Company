"use client";

import { ArrowUpRight, Container } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { userFeedback } from "@/lib/user-feedback";
import { Button, ButtonLink } from "@/components/ui/button";
import { TablePlaceholder } from "@/components/ui/table-placeholder";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { StatusTone } from "@/lib/status-labels";
import { TextField } from "@/components/ui/form-controls";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { Dialog } from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

type ContainerDraft = { id?: string; internalCode?: string; containerType: string; note?: string | null; containerNo?: string | null; workStatus?: { label: string; tone: StatusTone } };

export function ContainerAdjustmentForm({
  orderId,
  soNumber,
  initialContainers,
}: {
  orderId: string;
  soNumber: string;
  initialContainers: ContainerDraft[];
}) {
  const containers = initialContainers;
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const committing = useRef(false);
  const busy = saving || refreshing;
  const [editor, setEditor] = useState<"new" | number | null>(null);
  const [editorError, setEditorError] = useState("");
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const router = useRouter();
  const editorFormId = `edit-container-${orderId}`;
  const editingContainer = typeof editor === "number" ? containers[editor] : undefined;
  const typeListId = `container-types-${orderId}`;
  const planUrl = `/plans?${new URLSearchParams({ orderId, q: soNumber })}`;
  function openEditor(target: "new" | number) {
    setEditorError("");
    setEditor(target);
  }
  async function save(nextContainers: ContainerDraft[]) {
    if (busy || committing.current) return;
    const next = nextContainers.map(({ id, containerType, note }) => ({ id, containerType: containerType.trim(), note: note?.trim() || undefined }));
    if (!next.length || next.some((item) => !item.containerType)) {
      setMessage("请为每个柜位填写柜型。");
      return;
    }
    committing.current = true;
    setSaving(true);
    setMessage("");
    setEditorError("");
    try {
      const response = await fetch(`/api/orders/${orderId}/containers/adjust`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          containers: next,
          expectedContainers: containers.flatMap(({ id, containerType, note }) => id ? [{ id, containerType, note: note ?? null }] : []),
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || userFeedback.retry("保存柜位"));
      }
      setEditor(null);
      setRemovingIndex(null);
      setMessage("柜位已更新。");
      startTransition(() => router.refresh());
    } catch (error) {
      const feedback = error instanceof Error ? error.message : userFeedback.network;
      if (editor !== null) setEditorError(feedback);
      else setMessage(feedback);
    } finally {
      committing.current = false;
      setSaving(false);
    }
  }
  const rows = containers.map((item, index) => ({ ...item, index }));
  const columns: DataTableColumn<(typeof rows)[number]>[] = [
    { key: "index", title: "序号", minWidth: 112, align: "center", render: (_, __, index) => index + 1 },
    { key: "containerType", title: "柜型", dataIndex: "containerType", minWidth: 112 },
    {
      key: "containerNo", title: "箱号", minWidth: 112,
      render: (_, item) => <div className="grid gap-1">
        <span className="font-medium text-slate-900">{item.containerNo || "待填写"}</span>
        {item.internalCode && <small className="text-xs text-slate-500">{item.internalCode}</small>}
      </div>,
    },
    { key: "sealNo", title: "封条号", minWidth: 112, render: () => <TablePlaceholder heading="封条号" className="text-slate-500" /> },
    {
      key: "workStatus", title: "装柜与派车状态", minWidth: 144, align: "center",
      render: (_, item) => <ButtonLink href={planUrl} variant="text" size="small" aria-label={`查看第 ${item.index + 1} 柜的装柜排车计划`}>
        <StatusBadge tone={item.workStatus?.tone ?? "unread"}>{item.workStatus?.label ?? "未排车"}</StatusBadge>
      </ButtonLink>,
    },
    {
      key: "note", title: "备注", dataIndex: "note", minWidth: 112,
    },
    {
      key: "actions", title: "操作", minWidth: 144, align: "center",
      render: (_, item) => (
        <div className="flex justify-center gap-1">
          <Button variant="text" size="small" type="button" disabled={busy} onClick={() => openEditor(item.index)}>编辑</Button>
          {containers.length > 1 && <Button variant="danger" size="small" type="button" disabled={busy} onClick={() => { setMessage(""); setRemovingIndex(item.index); }}>删除</Button>}
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="grid gap-2" aria-busy={busy}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="m-0 flex items-center gap-2 text-base font-semibold text-slate-900">
            <Container size={18} aria-hidden="true" className="text-blue-600" />
            集装箱明细与作业
          </h2>
          <div data-page-toolbar className="flex flex-wrap items-center gap-2">
            <Button create size="toolbar" variant="secondary" disabled={busy} type="button" onClick={() => openEditor("new")}>添加柜型</Button>
            <ButtonLink size="toolbar" variant="secondary" href={planUrl}>前往装柜排车计划 <ArrowUpRight size={14} aria-hidden="true" /></ButtonLink>
          </div>
        </div>
        <datalist id={typeListId}>
          {["20GP", "40GP", "40HQ", "40HC", "45GP", "45HQ"].map(type => <option key={type} value={type} />)}
        </datalist>
        <DataTable
          aria-label="集装箱明细与作业"
          columns={columns}
          dataSource={rows}
          rowKey={item => item.id ?? item.index}
          fitContainer
          maxHeight="min(32dvh, 300px)"
          empty={{ title: "暂无柜位", description: "可使用上方按钮添加柜位。" }}
        />
        {message && <FeedbackMessage>{message}</FeedbackMessage>}
      </div>
      {editor !== null && (
        <Dialog
          title={editor === "new" ? "添加柜型" : "编辑柜位"}
          subtitle="确认后立即保存。"
          onClose={() => setEditor(null)}
          closeDisabled={busy}
          message={editorError || undefined}
          actions={<>
            <Button type="button" size="toolbar" variant="secondary" disabled={busy} onClick={() => setEditor(null)}>取消</Button>
            <Button type="submit" size="toolbar" form={editorFormId} disabled={busy}>{busy ? "正在保存…" : editor === "new" ? "确认添加" : "确认修改"}</Button>
          </>}
        >
          <form id={editorFormId} className="m-0 grid gap-3" onSubmit={event => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const containerType = String(data.get("containerType") ?? "").trim();
            if (!containerType) {
              setEditorError("请填写柜型。");
              return;
            }
            const note = String(data.get("note") ?? "").trim();
            void save(editor === "new"
              ? [...containers, { containerType, note }]
              : containers.map((item, index) => index === editor ? { ...item, containerType, note } : item));
          }}>
            <TextField label="柜型" name="containerType" defaultValue={editingContainer?.containerType} required list={typeListId} maxLength={30} placeholder="例如：40HQ" disabled={busy} onChange={() => setEditorError("")} />
            <TextField label="备注" name="note" defaultValue={editingContainer?.note ?? ""} maxLength={300} disabled={busy} placeholder="选填" />
          </form>
        </Dialog>
      )}
      {removingIndex !== null && <DeleteConfirmDialog title="确认删除此柜位？" busy={busy} onClose={() => setRemovingIndex(null)} message={message} onConfirm={() => void save(containers.filter((_, index) => index !== removingIndex))}><p>确认后立即删除该柜位。</p></DeleteConfirmDialog>}
    </section>
  );
}
