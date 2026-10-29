"use client";

import businessStyles from "@/components/business.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ParsePendingButton } from "@/components/parse-pending-button";
import { userFeedback } from "@/lib/user-feedback";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { FileUploadTrigger } from "@/components/ui/file-upload-trigger";

type ParseState = "PENDING" | "PROCESSING" | "PARSED" | "FAILED" | "VERIFIED";
type BatchFile = { key: string; id?: string; name: string; source: File; upload: "uploading" | "success" | "error"; parseStatus?: ParseState; error?: string };
const parseLabel: Record<ParseState, string> = { PENDING: "待识别", PROCESSING: "识别中", PARSED: "识别完成", FAILED: "识别失败", VERIFIED: "已核对" };

export function SoUploadForm({ className }: { className?: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const [batchFiles, setBatchFiles] = useState<BatchFile[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmingRemoval, setConfirmingRemoval] = useState<BatchFile | null>(null);
  const [parseStatus, setParseStatus] = useState<{ state: "running" | "success" | "error"; message: string } | null>(null);
  const [parseProgress, setParseProgress] = useState<{ completed: number; total: number } | null>(null);
  const router = useRouter();
  const successfulFiles = batchFiles.filter(file => file.upload === "success" && file.id);
  const uploadFailures = batchFiles.filter(file => file.upload === "error");
  const parseFailures = successfulFiles.filter(file => file.parseStatus === "FAILED");
  const recognizableFiles = successfulFiles.filter(file => file.parseStatus === "PENDING" || file.parseStatus === "FAILED");

  useEffect(() => { if (!message) return; const timeout = window.setTimeout(() => setMessage(""), 3500); return () => window.clearTimeout(timeout); }, [message]);
  useEffect(() => { if (!batchFiles.length) setExpanded(false); }, [batchFiles.length]);
  const patchFile = (key: string, patch: Partial<BatchFile>) => setBatchFiles(current => current.map(file => file.key === key ? { ...file, ...patch } : file));
  const dismissFailedUpload = (key: string) => setBatchFiles(current => current.filter(file => file.key !== key));

  async function upload(files: File[], retryKey?: string) {
    if (busy) return;
    setBusy(true); setMessage(""); setParseStatus(null); setParseProgress(null);
    const entries = retryKey ? batchFiles.filter(file => file.key === retryKey) : files.map((file, index) => ({ key: `${Date.now()}-${index}-${file.name}`, name: file.name, source: file, upload: "uploading" as const }));
    if (retryKey) patchFile(retryKey, { upload: "uploading", error: undefined }); else setBatchFiles(current => [...current, ...entries]);
    try { for (const entry of entries) {
      setFileName(entry.name); const data = new FormData(); data.set("file", entry.source);
      try {
        const response = await fetch("/api/orders/upload", { method: "POST", body: data });
        const result = await response.json().catch(() => null) as { id?: string; error?: string; parseStatus?: ParseState; reused?: boolean } | null;
        if (!response.ok) { patchFile(entry.key, { upload: "error", error: result?.error || `上传请求失败（HTTP ${response.status}）` }); continue; }
        if (!result?.id) throw new Error("上传服务返回的数据不完整，请稍后重试。");
        setBatchFiles(current => {
          const duplicate = current.some(file => file.key !== entry.key && file.id === result.id);
          if (duplicate) return current.filter(file => file.key !== entry.key);
          return current.map(file => file.key === entry.key ? { ...file, id: result.id, upload: "success" as const, parseStatus: result.parseStatus || "PENDING", error: undefined } : file);
        });
      } catch (error) { patchFile(entry.key, { upload: "error", error: error instanceof Error ? error.message : userFeedback.network }); }
    }} finally { setFileName(""); setBusy(false); }
  }

  async function removeUploaded() {
    if (!confirmingRemoval?.id || removingId) return;
    setRemovingId(confirmingRemoval.id);
    try {
      const response = await fetch(`/api/orders/upload/${confirmingRemoval.id}`, { method: "DELETE" });
      if (response.ok) { setMessage(`“${confirmingRemoval.name}”已删除。`); setBatchFiles(current => current.filter(file => file.key !== confirmingRemoval.key)); setConfirmingRemoval(null); router.refresh(); }
      else { const result = await response.json().catch(() => null) as { error?: string } | null; setMessage(result?.error || `删除失败（HTTP ${response.status}）。`); }
    } catch { setMessage(userFeedback.network); } finally { setRemovingId(null); }
  }

  function updateParseProgress(progress: { completed: number; total: number; files?: Array<{ id: string; parseStatus: string }> }) {
    setParseProgress({ completed: progress.completed, total: progress.total });
    if (!progress.files) return;
    const statusById = new Map(progress.files.map(file => [file.id, file.parseStatus as ParseState]));
    setBatchFiles(current => current.map(file => file.id && statusById.has(file.id) ? { ...file, parseStatus: statusById.get(file.id) } : file));
  }

  function handleParseStatus(status: { state: "running" | "success" | "error"; message: string }) {
    setParseStatus(status);
    if (status.state === "success") setExpanded(false);
  }

  async function retryRecognition(file: BatchFile) {
    if (!file.id) return;
    setParseStatus({ state: "running", message: "正在识别订单信息…" }); setParseProgress({ completed: 0, total: 1 }); patchFile(file.key, { parseStatus: "PROCESSING" });
    try {
      const response = await fetch("/api/orders/parse", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fileIds: [file.id] }) });
      const result = await response.json().catch(() => null) as { failedCount?: number; error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "订单信息暂未识别完成，请稍后重试。");
      patchFile(file.key, { parseStatus: result?.failedCount ? "FAILED" : "PARSED" }); setParseStatus(result?.failedCount ? { state: "error", message: "识别失败，请重试或检查文件内容。" } : { state: "success", message: "订单信息识别完成。" }); setParseProgress({ completed: 1, total: 1 }); router.refresh();
    } catch (error) { patchFile(file.key, { parseStatus: "FAILED" }); setParseStatus({ state: "error", message: error instanceof Error ? error.message : "订单信息暂未识别完成，请稍后重试。" }); }
  }

  return <section className={[businessStyles["so-upload"], className].filter(Boolean).join(" ")}>
    <h3>导入 SO</h3>
    <div className={businessStyles["so-upload__actions"]}>
      <div className={businessStyles["so-upload__controls"]}>
        <FileUploadTrigger variant="secondary" size="toolbar" className={businessStyles["so-upload__trigger"]} name="file" accept=".pdf,application/pdf" multiple busy={busy} onChange={event => { const files = Array.from(event.target.files || []); event.target.value = ""; if (files.length) void upload(files); }}>{busy ? "正在上传…" : "上传 SO 文件"}</FileUploadTrigger>
        <ParsePendingButton variant="primary" size="toolbar" fileIds={recognizableFiles.map(file => file.id!)} requireFiles reloadOnComplete={false} onStatusChange={handleParseStatus} onProgressChange={updateParseProgress} />
      </div>
      <div className={businessStyles["so-upload__status"]}>
        {busy && fileName ? <StatusMessage tone="loading" text={`正在上传：${fileName}`} /> : <StatusMessage tone={uploadFailures.length || parseFailures.length ? "error" : "info"} text={`文件 ${batchFiles.length} · 上传成功 ${successfulFiles.length} · 上传失败 ${uploadFailures.length}${parseFailures.length ? ` · 识别失败 ${parseFailures.length}` : ""}`} />}
        {batchFiles.length > 0 && <Button type="button" variant="text" className={businessStyles["so-upload__toggle"]} onClick={() => setExpanded(value => !value)}>{expanded ? "收起列表 ▲" : "查看文件 ▼"}</Button>}
      </div>
    </div>
    {parseStatus?.state === "running" && parseProgress && <div className={businessStyles["so-upload__progress"]} role="progressbar" aria-valuemin={0} aria-valuemax={parseProgress.total} aria-valuenow={parseProgress.completed}><span>正在识别：{parseProgress.completed} / {parseProgress.total}</span><i><b style={{ width: `${parseProgress.total ? parseProgress.completed / parseProgress.total * 100 : 0}%` }} /></i></div>}
    {expanded && batchFiles.length > 0 && <div className={businessStyles["so-upload__files"]}><ul>{batchFiles.map(file => <li key={file.key}><span title={file.name}>{file.name}</span><em className={file.upload === "error" || file.parseStatus === "FAILED" ? businessStyles["so-upload__file-error"] : undefined}>{file.upload === "uploading" ? "上传中" : file.upload === "error" ? `上传失败：${file.error}` : parseLabel[file.parseStatus || "PENDING"]}</em>{file.upload === "error" ? <><Button type="button" size="small" variant="secondary" onClick={() => void upload([file.source], file.key)}>重试</Button><Button type="button" size="small" variant="danger" className={businessStyles["so-upload__remove"]} onClick={() => dismissFailedUpload(file.key)}>删除</Button></> : file.parseStatus === "FAILED" ? <Button type="button" size="small" variant="text" onClick={() => void retryRecognition(file)}>重试识别</Button> : file.parseStatus === "PENDING" ? <Button type="button" size="small" variant="danger" className={businessStyles["so-upload__remove"]} disabled={removingId !== null} onClick={() => setConfirmingRemoval(file)}>删除</Button> : null}</li>)}</ul></div>}
    {confirmingRemoval && <DeleteConfirmDialog title="确认删除此上传？" busy={removingId === confirmingRemoval.id} onClose={() => setConfirmingRemoval(null)} onConfirm={removeUploaded}><p>将删除“{confirmingRemoval.name}”及其待识别 SO，且无法恢复。</p></DeleteConfirmDialog>}
  </section>;
}

function StatusMessage({ tone, text }: { tone: "loading" | "success" | "error" | "info"; text: string }) {
  return <span className={[businessStyles["so-upload__status-message"], businessStyles[`so-upload__status-message--${tone}`]].join(" ")} title={text} role={tone === "error" ? "alert" : "status"}>
    {tone === "loading" && <span className={businessStyles["so-upload__status-icon"]} aria-hidden="true" />}
    <span className={businessStyles["so-upload__status-text"]}>{text}</span>
  </span>;
}
