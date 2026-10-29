"use client";

import businessStyles from "@/components/business.module.css";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

type SoFilePreviewProps = {
  fileId: string;
  fileName: string;
};

export function SoFilePreview({
  fileId,
  fileName,
}: SoFilePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const url = `/api/files/${fileId}`;

  function togglePreview() {
    setIsOpen((open) => {
      const next = !open;
      if (next) setLoading(true);
      return next;
    });
  }

  return (
    <div className={businessStyles["so-file-preview"]}>
      <div className={businessStyles["so-file-preview__header"]}>
        <div>
          <b>{fileName}</b>
        </div>
        <div className={businessStyles["so-file-preview__actions"]}>
          <Button variant="secondary" onClick={togglePreview} aria-expanded={isOpen}>
            {isOpen ? "收起预览" : "预览"}
          </Button>
          <ButtonLink href={url} target="_blank" rel="noreferrer">
            新窗口预览
          </ButtonLink>
        </div>
      </div>
      {isOpen && (
        <div className={businessStyles["so-file-preview__viewer"]}>
          {loading && (
            <p className={businessStyles["so-file-preview__loading"]}>正在载入 PDF 预览…</p>
          )}
          <iframe
            title={fileName}
            src={url}
            className={businessStyles["so-file-preview__document"]}
            onLoad={() => setLoading(false)}
          />
        </div>
      )}
    </div>
  );
}
