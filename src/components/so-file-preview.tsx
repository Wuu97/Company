"use client";

import { useState } from "react";

type SoFilePreviewProps = {
  fileId: string;
  fileName: string;
  version: number;
};

export function SoFilePreview({ fileId, fileName, version }: SoFilePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const url = `/api/files/${fileId}`;

  return (
    <div className="so-file-preview">
      <div className="so-file-preview__header">
        <span>{fileName} · 版本 {version}</span>
        <div className="so-file-preview__actions">
          <button type="button" onClick={() => setIsOpen((open) => !open)}>
            {isOpen ? "收起预览" : "预览 SO 文件"}
          </button>
          <a href={url} target="_blank" rel="noreferrer">在新窗口打开</a>
        </div>
      </div>
      {isOpen && <iframe title={fileName} src={url} className="so-file-preview__document" />}
    </div>
  );
}
