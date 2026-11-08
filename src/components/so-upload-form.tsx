"use client";

import { FileText, LoaderCircle, UploadCloud, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog } from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { userFeedback } from "@/lib/user-feedback";

type ParseState = "PENDING" | "PROCESSING" | "PARSED" | "FAILED" | "VERIFIED";
type Entry = { key: string; source: File; id?: string; status?: ParseState; error?: string };
const parseLabel: Record<ParseState, string> = {
  PENDING: "待识别", PROCESSING: "识别中", PARSED: "识别完成", FAILED: "识别失败", VERIFIED: "已核对",
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function SoUploadForm({ open, onClose, orderId }: { open: boolean; onClose: () => void; orderId?: string }) {
  const versionUpload = Boolean(orderId);
  const maxFiles = versionUpload ? 1 : 10;
  const input = useRef<HTMLInputElement>(null);
  const running = useRef(false);
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [phase, setPhase] = useState("");
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState<Entry | null>(null);
  const [removing, setRemoving] = useState(false);
  const busy = Boolean(phase);
  const selected = entries.filter(entry => !entry.id);
  const ready = entries.filter(entry => !entry.id || entry.status === "PENDING" || entry.status === "FAILED" || entry.status === "PROCESSING");
  const completed = entries.length - ready.length;

  function select(files: File[]) {
    if (running.current || !files.length) return;
    if (versionUpload && (files.length > 1 || entries.length > 0)) {
      setError("重新上传每次只能选择 1 份 SO PDF。");
      return;
    }
    if (files.some(file => !/\.pdf$/i.test(file.name))) {
      setError("请选择 PDF 文件。");
      return;
    }
    const known = new Set(entries.map(entry => entry.key));
    const additions: Entry[] = [];
    for (const source of files) {
      const key = JSON.stringify([source.name, source.size, source.lastModified]);
      if (known.has(key)) continue;
      known.add(key);
      additions.push({ key, source });
    }
    if (ready.length + additions.length > maxFiles) {
      setError("单次最多选择 10 份 PDF。");
      return;
    }
    setError("");
    setEntries(current => [...current, ...additions]);
  }

  function update(key: string, patch: Partial<Entry>) {
    setEntries(current => current.map(entry => entry.key === key ? { ...entry, ...patch } : entry));
  }

  async function start() {
    if (running.current || !ready.length) return;
    running.current = true;
    setError("");
    setPhase("正在准备文件…");
    const ids = new Set<string>();
    try {
      for (const entry of ready) {
        if (entry.id) {
          ids.add(entry.id);
          continue;
        }
        setPhase(`正在上传：${entry.source.name}`);
        update(entry.key, { error: undefined });
        try {
          const data = new FormData();
          data.set("file", entry.source);
          if (orderId) data.set("soOrderId", orderId);
          const response = await fetch("/api/orders/upload", { method: "POST", body: data });
          const result = await response.json().catch(() => null) as { id?: string; parseStatus?: ParseState; error?: string } | null;
          if (!response.ok || !result?.id) throw new Error(result?.error || "上传失败，请重试。");
          const { id, parseStatus = "PENDING" } = result;
          update(entry.key, { id, status: parseStatus });
          if (parseStatus !== "PARSED" && parseStatus !== "VERIFIED") ids.add(id);
        } catch (cause) {
          update(entry.key, { error: cause instanceof Error ? cause.message : userFeedback.network });
        }
      }
      if (!ids.size) return;
      setPhase("正在识别订单信息…");
      const fileIds = [...ids];
      const response = await fetch("/api/orders/parse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fileIds }),
      });
      const result = await response.json().catch(() => null) as { failedCount?: number; error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "识别暂未完成，请重试。");

      const progress = await fetch(`/api/orders/parse/progress?fileIds=${encodeURIComponent(fileIds.join(","))}`);
      if (!progress.ok) throw new Error("暂时无法读取识别结果，请重试。");
      const { files } = await progress.json() as { files: { id: string; parseStatus: ParseState }[] };
      const statuses = new Map(files.map(file => [file.id, file.parseStatus]));
      setEntries(current => current.map(entry => {
        const status = entry.id && statuses.get(entry.id);
        return status ? { ...entry, status } : entry;
      }));
      if (result?.failedCount) setError("部分文件识别失败，可点击「开始识别」重试。");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : userFeedback.network);
    } finally {
      if (ids.size) router.refresh();
      running.current = false;
      setPhase("");
    }
  }

  async function removeUploaded() {
    if (!confirming?.id || removing) return;
    setRemoving(true);
    try {
      const response = await fetch(`/api/orders/upload/${confirming.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error || "删除失败，请重试。");
      }
      setEntries(current => current.filter(entry => entry.id !== confirming.id));
      setConfirming(null);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : userFeedback.network);
      setConfirming(null);
    } finally {
      setRemoving(false);
    }
  }

  function close() {
    setEntries(current => current.filter(entry => entry.id));
    setError("");
    onClose();
  }

  if (!open) return null;
  const closeDisabled = busy || confirming !== null;

  return (
    <Dialog
      title={versionUpload ? "上传 SO 新版本" : "导入 SO 单据"}
      subtitle={versionUpload ? "每次上传一份 PDF，原有文件和版本记录会保留。" : "支持批量上传 PDF 订舱单，导入后系统将自动识别并核对字段"}
      onClose={close}
      closeDisabled={closeDisabled}
      actions={
        <>
          <Button size="toolbar" variant="secondary" disabled={closeDisabled} onClick={close}>
            取消
          </Button>
          <Button size="toolbar" disabled={closeDisabled || !ready.length} onClick={() => void start()}>
            {busy && <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />}
            {busy ? "处理中…" : `开始识别 (${ready.length})`}
          </Button>
        </>
      }
    >
      <input ref={input} type="file" hidden accept=".pdf,application/pdf" multiple={!versionUpload} disabled={closeDisabled} onChange={event => {
        select(Array.from(event.currentTarget.files ?? []));
        event.currentTarget.value = "";
      }} />
      <button
        type="button"
        disabled={closeDisabled}
        onClick={() => input.current?.click()}
        onDragOver={event => event.preventDefault()}
        onDrop={event => {
          event.preventDefault();
          select(Array.from(event.dataTransfer.files));
        }}
        className="flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 transition-colors hover:border-blue-400 hover:bg-blue-50/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UploadCloud size={18} className="text-slate-400" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-700">点击或将 SO 文件拖拽至此处</span>
        <span className="mt-0.5 text-[11px] text-slate-400">支持 PDF，单次最多 {maxFiles} 份</span>
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1">已选 {selected.length} 份</span>
        {completed > 0 && <span>已完成 {completed} 份</span>}
        {selected.length > 0 && (
          <button type="button" disabled={closeDisabled} onClick={() => {
            setEntries(current => current.filter(entry => entry.id));
            setError("");
          }} className="ml-auto cursor-pointer border-0 bg-transparent text-xs text-slate-400 transition-colors hover:text-rose-500 disabled:opacity-50">清空</button>
        )}
      </div>
      {phase && <div role="status" className="mt-2 break-all text-xs text-slate-600">{phase}</div>}
      {error && <div role="alert" className="mt-2 text-xs text-red-700">{error}</div>}
      {entries.length > 0 && (
        <ul className="m-0 mt-2 box-border max-h-[160px] list-none overflow-y-auto p-0 pr-1 [scrollbar-color:var(--color-slate-300)_transparent] [scrollbar-width:thin]">
          {entries.map(entry => (
            <li key={entry.key} className="flex items-center justify-between rounded-md border-0 border-b border-solid border-slate-100 p-2 transition-colors last:border-0 hover:bg-slate-50">
              <div className="mr-3 flex min-w-0 flex-1 items-center">
                <FileText size={16} className="mr-2 shrink-0 text-rose-500" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-xs text-slate-700" title={entry.source.name}>{entry.source.name}</span>
              </div>
              <span className="mr-3 w-16 shrink-0 text-right font-mono text-[11px] whitespace-nowrap text-slate-400">
                {formatFileSize(entry.source.size)}
              </span>
              <div className="grid shrink-0 grid-cols-[84px_24px] items-center justify-items-end gap-2">
                <StatusBadge className={!entry.error && !entry.status ? "font-normal" : undefined} title={entry.error} tone={entry.error || entry.status === "FAILED" ? "critical" : entry.status === "PARSED" ? "success" : "muted"}>
                  {entry.error ? "上传失败" : entry.status ? parseLabel[entry.status] : "待上传"}
                </StatusBadge>
                {(!entry.id || (!versionUpload && entry.status === "PENDING")) && (
                  <button type="button" disabled={closeDisabled} aria-label={`移除 ${entry.source.name}`} onClick={() => {
                    if (entry.id) setConfirming(entry);
                    else setEntries(current => current.filter(file => file.key !== entry.key));
                  }} className="inline-flex size-6 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0 text-slate-400 transition-colors hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50">
                    <XIcon size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {confirming && (
        <DeleteConfirmDialog title="确认删除此上传？" busy={removing} onClose={() => setConfirming(null)} onConfirm={removeUploaded}>
          <p>将删除「{confirming.source.name}」及其待识别 SO，且无法恢复。</p>
        </DeleteConfirmDialog>
      )}
    </Dialog>
  );
}
