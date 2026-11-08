"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { statusLabel, statusTone } from "@/lib/status-labels";

type SoFilePreviewProps = {
  fileId: string;
  fileName: string;
  parseStatus: string;
  version: number;
  uploadedAt: string;
};

export function SoFilePreview({ fileId, fileName, version, parseStatus, uploadedAt }: SoFilePreviewProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const url = `/api/files/${fileId}`;
  const parsed = parseStatus === "PARSED";

  return (
    <>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <FileText size={16} className="shrink-0 text-rose-600" aria-hidden="true" />
          <span title={fileName} className="min-w-0 break-all text-sm font-semibold text-slate-900">{fileName}</span>
          <span className="text-xs font-medium text-slate-600">v{version}</span>
          <StatusBadge tone={parsed ? "success" : statusTone(parseStatus)}>{parsed ? "解析成功" : statusLabel(parseStatus)}</StatusBadge>
          <span className="text-xs tabular-nums text-slate-500">{uploadedAt}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Button type="button" size="small" variant="text" onClick={() => setPreviewOpen(true)} aria-label={`预览 ${fileName}`}>预览</Button>
          <ButtonLink size="small" variant="text" href={url} download={fileName}>下载</ButtonLink>
        </div>
      </div>
      {previewOpen && (
        <Dialog
          title={fileName}
          width={1040}
          onClose={() => setPreviewOpen(false)}
          actions={<Button type="button" size="toolbar" variant="secondary" onClick={() => setPreviewOpen(false)}>关闭预览</Button>}
        >
          <iframe title={`PDF 预览：${fileName}`} src={url} style={{ display: "block", width: "100%", height: "65dvh", border: 0 }} />
        </Dialog>
      )}
    </>
  );
}
